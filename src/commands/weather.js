// commands/weather.js
// 处理天气相关的Discord命令

// 导入天气API函数
const { getWeather } = require('../utils/api');
// 导入嵌入消息创建函数
const { createWeatherEmbed } = require('../utils/embeds');
// 导入错误处理函数
const { handleError } = require('../utils/errorHandler');
// 导入用户配置模型
const { getUserDefaultLocation } = require('../models/UserConfig');

/**
 * 处理天气命令
 * @param {Object} messageOrInteraction - Discord消息对象或交互对象
 * @param {Array<string>} args - 命令参数（仅用于消息命令）
 * @param {string} city - 城市名称（仅用于Slash Commands）
 * @param {string} setLocation - 要设置的默认位置（仅用于Slash Commands）
 */
async function handleWeatherCommand(messageOrInteraction, args = [], city = null, setLocation = null) {
    // 检查是否是设置默认位置的操作
  if (setLocation) {
    // 导入用户配置模型
    const { setUserDefaultLocation } = require('../models/UserConfig');

    // 获取用户ID
    const userId = messageOrInteraction.author?.id || messageOrInteraction.user?.id;

    if (!userId) {
      throw new Error('无法获取用户ID');
    }

    // 设置用户的默认位置
    await setUserDefaultLocation(userId, setLocation);

    // 发送成功消息
    const successMessage = `✅ 已将您的默认位置设置为: ${setLocation}`;

    if (messageOrInteraction.reply) {
      // Slash Command交互
      if (messageOrInteraction.replied || messageOrInteraction.deferred) {
        await messageOrInteraction.editReply({ content: successMessage, ephemeral: true });
      } else {
        await messageOrInteraction.reply({ content: successMessage, ephemeral: true });
      }
    } else {
      // 消息命令
      await messageOrInteraction.reply(successMessage);
    }
    return;
  }

  // 确定城市参数来源
  let cityName;
  let isDefaultLocation = false;
  if (city) {
    // 来自Slash Command
    cityName = city;
  } else if (args.length > 0) {
    // 来自消息命令

    // 检查是否是设置默认位置的操作（使用 'setlocation' 作为命令的一部分）
    if (args[0].toLowerCase() === 'setlocation' || args[0].toLowerCase() === 'set' || args[0].toLowerCase() === 'default') {
      if (args.length > 1) {
        // 导入用户配置模型
        const { setUserDefaultLocation } = require('../models/UserConfig');

        // 获取用户ID
        const userId = messageOrInteraction.author?.id || messageOrInteraction.user?.id;

        if (!userId) {
          throw new Error('无法获取用户ID');
        }

        // 设置用户的默认位置
        const newLocation = args.slice(1).join(' ');
        await setUserDefaultLocation(userId, newLocation);

        // 发送成功消息
        const successMessage = `✅ 已将您的默认位置设置为: ${newLocation}`;

        if (messageOrInteraction.reply) {
          // Slash Command交互
          if (messageOrInteraction.replied || messageOrInteraction.deferred) {
            await messageOrInteraction.editReply({ content: successMessage, ephemeral: true });
          } else {
            await messageOrInteraction.reply({ content: successMessage, ephemeral: true });
          }
        } else {
          // 消息命令
          await messageOrInteraction.reply(successMessage);
        }
        return;
      } else {
        // 没有提供位置参数
        const errorMessage = '请提供一个位置名称。用法: `!weather setlocation <城市名>`';

        if (messageOrInteraction.reply) {
          // Slash Command交互
          if (messageOrInteraction.replied || messageOrInteraction.deferred) {
            await messageOrInteraction.editReply({ content: errorMessage, ephemeral: true });
          } else {
            await messageOrInteraction.reply({ content: errorMessage, ephemeral: true });
          }
        } else {
          // 消息命令
          await messageOrInteraction.reply(errorMessage);
        }
        return;
      }
    }

    cityName = args.join(' ');
  } else {
    // 没有提供城市参数，尝试使用用户的默认位置
    const userId = messageOrInteraction.author?.id || messageOrInteraction.user?.id;
    if (userId) {
      const userDefaultLocation = getUserDefaultLocation(userId);
      if (userDefaultLocation) {
        cityName = userDefaultLocation;
        isDefaultLocation = true;
      } else {
        // 用户没有设置默认位置，使用默认城市，并提示用户如何设置默认位置
        cityName = '北京';
        isDefaultLocation = true;
        // 添加提示信息，告诉用户如何设置默认位置
        console.log(`用户 ${userId} 未设置默认位置，使用默认城市北京。`);
      }
    } else {
      // 无法获取用户ID，使用默认城市
      cityName = '北京';
      isDefaultLocation = true;
    }
  }

  try {
    // 发送正在处理的消息（仅适用于Slash Commands）
    // 注意：在index.js中已经调用了deferReply，这里不再需要重复调用

    // 调用天气API获取信息
    const weather = await getWeather(cityName);

    // 创建天气信息的嵌入消息
    const weatherEmbed = createWeatherEmbed(weather, isDefaultLocation);

    // 发送响应
    if (messageOrInteraction.reply) {
      // Slash Command交互
      if (messageOrInteraction.replied || messageOrInteraction.deferred) {
        await messageOrInteraction.editReply({ embeds: [weatherEmbed] });
      } else {
        await messageOrInteraction.reply({ embeds: [weatherEmbed] });
      }
    } else {
      // 消息命令
      await messageOrInteraction.channel.send({ embeds: [weatherEmbed] });
    }
  } catch (error) {
    // 使用统一错误处理
    await handleError(error, messageOrInteraction, 'weather', cityName);
  }
}

module.exports = {
  handleWeatherCommand
};