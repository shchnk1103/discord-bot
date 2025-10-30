/**
 * 翻译工具函数
 * 使用Google Translate API进行文本翻译
 */

// 注意：Google Translate API的免费版本基于URL，有一定的限制
// 对于生产环境，建议使用付费的Google Cloud Translation API

/**
 * 翻译文本
 * @param {string} text - 要翻译的文本
 * @param {string} targetLang - 目标语言代码 (e.g., 'zh' for Chinese, 'en' for English)
 * @param {string} sourceLang - 源语言代码 (可选)
 * @returns {Promise<string>} 翻译后的文本
 */
async function translateText(text, targetLang, sourceLang = null) {
  try {
    // 如果文本为空或太短，直接返回
    if (!text || text.length < 2) {
      return text;
    }

    // 构建Google Translate URL
    // 注意：这是免费版本，有使用限制
    let url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

    // 如果指定了源语言
    if (sourceLang) {
      url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    }

    // 发送请求
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`翻译服务请求失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // 解析翻译结果
    // Google Translate API返回的结果结构比较复杂
    if (data && data[0] && Array.isArray(data[0])) {
      // 提取翻译后的文本
      const translatedText = data[0].map(item => item[0]).join('');
      return translatedText;
    }

    // 如果解析失败，返回原文
    return text;
  } catch (error) {
    console.error('翻译文本时出错:', error);
    // 翻译失败时返回原文
    return text;
  }
}

/**
 * 检测文本语言
 * @param {string} text - 要检测语言的文本
 * @returns {Promise<string>} 语言代码
 */
async function detectLanguage(text) {
  try {
    if (!text || text.length < 2) {
      return 'en'; // 默认返回英文
    }

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=ld&q=${encodeURIComponent(text)}`;

    const response = await fetch(url);

    if (!response.ok) {
      return 'en'; // 默认返回英文
    }

    const data = await response.json();

    // 解析语言检测结果
    if (data && data[2]) {
      return data[2];
    }

    return 'en'; // 默认返回英文
  } catch (error) {
    console.error('检测语言时出错:', error);
    return 'en'; // 默认返回英文
  }
}

/**
 * 翻译新闻文章
 * @param {Object} article - 新闻文章对象
 * @param {string} targetLang - 目标语言
 * @returns {Promise<Object>} 翻译后的文章对象
 */
async function translateArticle(article, targetLang) {
  try {
    // 翻译标题
    const translatedTitle = await translateText(article.title, targetLang);

    // 翻译描述
    const translatedDescription = article.description ?
      await translateText(article.description, targetLang) :
      null;

    // 返回翻译后的文章对象
    return {
      ...article,
      title: translatedTitle,
      description: translatedDescription,
      translated: true,
      originalTitle: article.title,
      originalDescription: article.description
    };
  } catch (error) {
    console.error('翻译文章时出错:', error);
    // 翻译失败时返回原文
    return {
      ...article,
      translated: false
    };
  }
}

module.exports = {
  translateText,
  detectLanguage,
  translateArticle
};