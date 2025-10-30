// utils/scheduler.js
// 处理定时任务的工具文件

// 导入node-cron库
const cron = require('node-cron');

// 导入API工具函数
const { getWeather, getNews } = require('./api');
// 导入嵌入消息创建函数
const { createDailyWeatherEmbed, createDailyNewsEmbed } = require('./embeds');
// 导入错误处理函数
const { handleError } = require('./errorHandler');

// 存储已安排的任务
const scheduledTasks = new Map();

/**
 * 发送每日天气和新闻摘要
 * @param {Object} client - Discord客户端实例
 * @param {string} channelId - 要发送消息的频道ID
 * @param {string} userId - 用户ID（可选，用于获取默认位置）
 */
async function sendDailySummary(client, channelId, userId = null) {
  try {
    // 获取天气信息
    let weather;
    let isDefaultLocation = false;

    // 如果提供了用户ID，尝试获取用户的默认位置
    if (userId) {
      const { getUserDefaultLocation } = require('./../models/UserConfig');
      const userDefaultLocation = getUserDefaultLocation(userId);
      if (userDefaultLocation) {
        weather = await getWeather(userDefaultLocation);
        isDefaultLocation = true;
      } else {
        // 用户没有设置默认位置，使用默认城市
        weather = await getWeather('北京');
        isDefaultLocation = true;
      }
    } else {
      // 没有提供用户ID，使用默认城市
      weather = await getWeather('北京');
      isDefaultLocation = true;
    }

    // 获取头条新闻
    const news = await getNews('general');

    // 检查是否有有效的新闻数据
    if (news.articles.length === 0) {
      console.warn('没有获取到新闻数据');
    }

    // 获取频道对象
    const channel = await client.channels.fetch(channelId);

    if (!channel) {
      console.error(`找不到ID为 ${channelId} 的频道`);
      return;
    }

    // 发送天气信息
    const weatherEmbed = createDailyWeatherEmbed(weather, isDefaultLocation);

    await channel.send({ embeds: [weatherEmbed] });

    // 发送新闻信息（仅当有新闻时）
    if (news.articles.length > 0) {
      const newsEmbed = createDailyNewsEmbed(news);
      await channel.send({ embeds: [newsEmbed] });
    } else {
      await channel.send('⚠️ 抱歉，暂时无法获取新闻数据。');
    }

    console.log('每日摘要发送成功');
  } catch (error) {
    console.error('发送每日摘要时出错:', error);
    // 发送错误消息到 Discord 频道告知用户
    try {
      const channel = await client.channels.fetch(channelId);
      if (channel) {
        await channel.send('❌ 抱歉，获取摘要信息时出现错误，请稍后再试。');
      }
    } catch (sendError) {
      console.error('发送错误消息时出错:', sendError);
    }
  }
}

/**
 * 安排每日任务
 * @param {Object} client - Discord客户端实例
 * @param {string} channelId - 要发送消息的频道ID
 * @param {string} schedule - cron表达式 (默认为每天上午8点)
 */
function scheduleDailyTask(client, channelId, schedule = '0 0 8 * * *') {
  // 如果已有同频道的任务，先取消
  if (scheduledTasks.has(channelId)) {
    scheduledTasks.get(channelId).stop();
    scheduledTasks.delete(channelId);
  }

  // 创建新的定时任务
  const task = cron.schedule(schedule, () => {
    sendDailySummary(client, channelId);
  });

  // 存储任务
  scheduledTasks.set(channelId, task);

  console.log(`已安排频道 ${channelId} 的每日任务，执行时间: ${schedule}`);
}

/**
 * 获取所有已安排的任务
 * @returns {Map} 任务映射
 */
function getScheduledTasks() {
  return scheduledTasks;
}

module.exports = {
  scheduleDailyTask,
  sendDailySummary,
  getScheduledTasks
};