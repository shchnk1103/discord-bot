/**
 * 统一错误处理工具
 * 用于处理Discord命令中的各种错误情况
 */

/**
 * 检测用户的语言偏好
 * @param {Object} messageOrInteraction - Discord消息对象或交互对象
 * @returns {string} 语言代码 ('zh' 或 'en')
 */
function detectUserLanguage(messageOrInteraction) {
  try {
    // 对于Slash Commands交互
    if (messageOrInteraction.locale) {
      // Discord locale格式如: zh-CN, en-US
      const locale = messageOrInteraction.locale.toLowerCase();
      if (locale.startsWith('zh')) {
        return 'zh';
      }
      return 'en';
    }

    // 对于传统消息命令
    if (messageOrInteraction.author && messageOrInteraction.author.locale) {
      const locale = messageOrInteraction.author.locale.toLowerCase();
      if (locale.startsWith('zh')) {
        return 'zh';
      }
      return 'en';
    }

    // 默认返回英文
    return 'en';
  } catch (error) {
    console.error('检测用户语言时出错:', error);
    return 'en';
  }
}

/**
 * 格式化天气错误消息
 * @param {string} cityName - 城市名称
 * @param {Error} error - 错误对象
 * @returns {string} 格式化后的错误消息
 */
function formatWeatherError(cityName, error) {
  let errorMessage;
  if (error.message.includes('404') || error.message.includes('找不到城市')) {
    errorMessage = `抱歉，找不到城市 "${cityName}"。请检查城市名称是否正确，或尝试使用英文城市名。`;
  } else {
    errorMessage = `获取天气信息时出现错误：${error.message}。请稍后再试。`;
  }
  return errorMessage;
}

/**
 * 格式化新闻错误消息
 * @param {Error} error - 错误对象
 * @returns {string} 格式化后的错误消息
 */
function formatNewsError(error) {
  return `获取新闻信息时出现错误：${error.message}。请稍后再试。`;
}

/**
 * 发送错误响应
 * @param {Object} messageOrInteraction - Discord消息对象或交互对象
 * @param {string} errorMessage - 错误消息内容
 * @param {boolean} ephemeral - 是否为临时消息（仅适用于交互）
 */
async function sendErrorResponse(messageOrInteraction, errorMessage, ephemeral = true) {
  try {
    if (messageOrInteraction.reply) {
      // Slash Command交互
      if (messageOrInteraction.replied || messageOrInteraction.deferred) {
        await messageOrInteraction.editReply({ content: errorMessage, ephemeral });
      } else {
        await messageOrInteraction.reply({ content: errorMessage, ephemeral });
      }
    } else {
      // 消息命令
      await messageOrInteraction.reply(errorMessage);
    }
  } catch (error) {
    console.error('发送错误响应时出错:', error);
    // 如果发送失败，尝试其他方法
    try {
      if (messageOrInteraction.channel?.send) {
        await messageOrInteraction.channel.send(`❌ ${errorMessage}`);
      }
    } catch (fallbackError) {
      console.error('备用错误响应发送失败:', fallbackError);
    }
  }
}

/**
 * 处理Discord命令中的错误
 * @param {Object} error - 错误对象
 * @param {Object} messageOrInteraction - Discord消息对象或交互对象
 * @param {string} commandType - 命令类型 ('weather', 'news', 'summary')
 * @param {string} [additionalInfo] - 额外的错误信息（如城市名）
 */
async function handleError(error, messageOrInteraction, commandType, additionalInfo = null) {
  console.error(`处理${commandType}命令时出错:`, error);

  let errorMessage;
  const userLanguage = detectUserLanguage(messageOrInteraction);

  switch (commandType) {
    case 'weather':
      errorMessage = formatWeatherError(additionalInfo || 'unknown', error);
      break;
    case 'news':
      errorMessage = formatNewsError(error);
      break;
    case 'summary':
      errorMessage = '❌ 发送摘要信息时出现错误，请稍后再试。';
      break;
    default:
      errorMessage = '❌ 处理命令时出现错误，请稍后再试。';
  }

  // 根据错误类型调整消息的ephemeral属性
  const isEphemeral = commandType !== 'summary'; // summary命令错误不设为临时消息，让用户能看到

  await sendErrorResponse(messageOrInteraction, errorMessage, isEphemeral);
}

/**
 * 处理未知交互错误
 * @param {Object} interaction - Discord交互对象
 * @param {string} commandName - 命令名称
 */
async function handleUnknownInteraction(interaction, commandName) {
  console.error(`处理命令 ${commandName} 时遇到未知交互错误`);

  try {
    if (interaction.replied) {
      await interaction.followUp({
        content: '❌ 该命令响应时间过长，请稍后再试。',
        ephemeral: true
      });
    } else if (interaction.deferred) {
      await interaction.editReply({
        content: '❌ 该命令响应时间过长，请稍后再试。',
        ephemeral: true
      });
    } else {
      await interaction.reply({
        content: '❌ 该命令响应时间过长，请稍后再试。',
        ephemeral: true
      });
    }
  } catch (error) {
    console.error('处理未知交互错误时出错:', error);
  }
}

module.exports = {
  detectUserLanguage,
  formatWeatherError,
  formatNewsError,
  sendErrorResponse,
  handleError,
  handleUnknownInteraction
};