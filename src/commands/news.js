// commands/news.js
// 处理新闻相关的Discord命令

// 导入新闻API函数
const { getNews } = require('../utils/api');
// 导入嵌入消息创建函数
const { createNewsEmbed } = require('../utils/embeds');
// 导入错误处理函数
const { handleError, detectUserLanguage } = require('../utils/errorHandler');

// 定义支持的新闻分类
const SUPPORTED_CATEGORIES = [
  'business', 'entertainment', 'general', 'health',
  'science', 'sports', 'technology'
];


/**
 * 处理新闻命令
 * @param {Object} messageOrInteraction - Discord消息对象或交互对象
 * @param {Array<string>} args - 命令参数（仅用于消息命令）
 * @param {string} category - 新闻分类（仅用于Slash Commands）
 */
async function handleNewsCommand(messageOrInteraction, args = [], category = null) {
  // 确定分类参数来源
  let newsCategory;
  if (category) {
    // 来自Slash Command
    newsCategory = category;
  } else if (args.length > 0) {
    // 来自消息命令
    const requestedCategory = args[0].toLowerCase();
    if (SUPPORTED_CATEGORIES.includes(requestedCategory)) {
      newsCategory = requestedCategory;
    } else {
      // 不支持的分类
      const errorMessage = `不支持的新闻分类 "${requestedCategory}"。\n支持的分类有: ${SUPPORTED_CATEGORIES.join(', ')}`;

      if (messageOrInteraction.reply) {
        // Slash Command
        return messageOrInteraction.reply({ content: errorMessage, ephemeral: true });
      } else {
        // 消息命令
        return messageOrInteraction.reply(errorMessage);
      }
    }
  } else {
    // 默认分类
    newsCategory = 'general';
  }

  try {
    // 发送正在处理的消息（仅适用于Slash Commands）
    if (messageOrInteraction.reply && !messageOrInteraction.replied && !messageOrInteraction.deferred) {
      // 只有当deferReply方法存在时才调用
      if (typeof messageOrInteraction.deferReply === 'function') {
        await messageOrInteraction.deferReply();
      }
    }

    // 检测用户语言偏好
    const userLanguage = detectUserLanguage(messageOrInteraction);

    // 调用新闻API获取信息，根据用户语言进行翻译
    const news = await getNews(newsCategory, userLanguage);

    // 创建新闻信息的嵌入消息
    const newsEmbed = createNewsEmbed(news, userLanguage);

    // 发送响应
    if (messageOrInteraction.reply) {
      // Slash Command交互
      if (messageOrInteraction.replied || messageOrInteraction.deferred) {
        await messageOrInteraction.editReply({ embeds: [newsEmbed] });
      } else {
        await messageOrInteraction.reply({ embeds: [newsEmbed] });
      }
    } else {
      // 消息命令
      await messageOrInteraction.channel.send({ embeds: [newsEmbed] });
    }
  } catch (error) {
    // 使用统一错误处理
    await handleError(error, messageOrInteraction, 'news');
  }
}

module.exports = {
  handleNewsCommand
};