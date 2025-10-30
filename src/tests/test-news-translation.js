require('dotenv').config();
const { getNews } = require('./utils/api');

async function testNewsTranslation() {
  console.log('测试新闻翻译功能...\n');

  try {
    console.log('1. 获取英文新闻（不翻译）:');
    const englishNews = await getNews('general', 'en');
    console.log(`获取到 ${englishNews.articles.length} 篇新闻`);
    console.log('第一篇新闻标题:', englishNews.articles[0]?.title);
    console.log('是否已翻译:', englishNews.articles[0]?.translated || false);
    console.log('');

    console.log('2. 获取中文新闻（翻译）:');
    const chineseNews = await getNews('general', 'zh');
    console.log(`获取到 ${chineseNews.articles.length} 篇新闻`);
    console.log('第一篇新闻标题:', chineseNews.articles[0]?.title);
    console.log('是否已翻译:', chineseNews.articles[0]?.translated || false);
    if (chineseNews.articles[0]?.translated) {
      console.log('原文标题:', chineseNews.articles[0]?.originalTitle);
    }
    console.log('');
  } catch (error) {
    console.error('测试新闻翻译功能时出错:', error.message);
  }
}

testNewsTranslation();