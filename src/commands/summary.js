// commands/summary.js
// 处理手动触发摘要的Discord命令

// 导入API函数
const { getWeather, getNews } = require('../utils/api');
// 导入嵌入消息创建函数
const { createWeatherEmbed, createNewsEmbed } = require('../utils/embeds');
// 导入用户配置模型
const { getUserDefaultLocation } = require('../models/UserConfig');
// 导入错误处理函数
const { handleError, detectUserLanguage } = require('../utils/errorHandler');

/**
 * 处理摘要命令
 * @param {Object} messageOrInteraction - Discord消息对象或交互对象
 * @param {Array<string>} args - 命令参数（仅用于消息命令）
 * @param {Object} client - Discord客户端实例
 */
async function handleSummaryCommand(messageOrInteraction, args, client) {
  try {
    // 获取用户ID
    const userId = messageOrInteraction.author?.id || messageOrInteraction.user?.id;
    
    // 为Slash Commands交互延迟回复
    if (messageOrInteraction.reply && !messageOrInteraction.replied && !messageOrInteraction.deferred) {
      await messageOrInteraction.deferReply();
    }

    // 获取用户默认位置
    let cityName = '北京'; // 默认城市
    let isDefaultLocation = true;
    
    if (userId) {
      const userDefaultLocation = getUserDefaultLocation(userId);
      if (userDefaultLocation) {
        cityName = userDefaultLocation;
        isDefaultLocation = true;
      }
    }
    
    // 获取天气信息
    const weather = await getWeather(cityName);
    
    // 检测用户语言偏好
    const userLanguage = detectUserLanguage(messageOrInteraction);
    
    // 获取新闻信息，根据用户语言进行翻译
    const news = await getNews('general', userLanguage);
    
    // 创建天气信息的嵌入消息
    const weatherEmbed = createWeatherEmbed(weather, isDefaultLocation);
    
    // 创建新闻信息的嵌入消息
    const newsEmbed = createNewsEmbed(news, userLanguage);
    
    // 发送天气信息
    if (messageOrInteraction.reply) {
      // Slash Command交互
      if (messageOrInteraction.replied || messageOrInteraction.deferred) {
        await messageOrInteraction.followUp({ embeds: [weatherEmbed] });
      } else {
        await messageOrInteraction.reply({ embeds: [weatherEmbed] });
      }
    } else {
      // 消息命令
      await messageOrInteraction.channel.send({ embeds: [weatherEmbed] });
    }
    
    // 发送新闻信息
    if (messageOrInteraction.reply) {
      // Slash Command交互
      if (messageOrInteraction.replied || messageOrInteraction.deferred) {
        await messageOrInteraction.followUp({ embeds: [newsEmbed] });
      } else {
        await messageOrInteraction.reply({ embeds: [newsEmbed] });
      }
    } else {
      // 消息命令
      await messageOrInteraction.channel.send({ embeds: [newsEmbed] });
    }
  
  } catch (error) {
    // 使用统一错误处理
    await handleError(error, messageOrInteraction, 'summary');
  }
}

module.exports = {
  handleSummaryCommand
};