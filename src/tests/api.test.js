/**
 * API函数测试
 */

// 测试天气API函数
async function testWeatherAPI() {
  console.log('开始测试天气API...');

  try {
    const { getWeather } = require('../utils/api');

    // 测试获取北京天气
    console.log('\n=== 测试获取北京天气 ===');
    const beijingWeather = await getWeather('北京');
    console.log('北京天气:', beijingWeather);

    // 测试获取英文城市天气
    console.log('\n=== 测试获取New York天气 ===');
    const newYorkWeather = await getWeather('New York');
    console.log('New York天气:', newYorkWeather);

    console.log('\n天气API测试完成！');
  } catch (error) {
    console.error('天气API测试过程中出现错误:', error);
  }
}

// 测试新闻API函数
async function testNewsAPI() {
  console.log('开始测试新闻API...');

  try {
    const { getNews } = require('../utils/api');

    // 测试获取最新新闻
    console.log('\n=== 测试获取科技新闻 ===');
    const techNews = await getNews('technology', 'zh');
    console.log('科技新闻数量:', techNews.articles.length);

    // 测试获取一般新闻
    console.log('\n=== 测试获取一般新闻 ===');
    const generalNews = await getNews('general', 'zh');
    console.log('一般新闻数量:', generalNews.articles.length);

    console.log('\n新闻API测试完成！');
  } catch (error) {
    console.error('新闻API测试过程中出现错误:', error);
  }
}

// 测试翻译功能
async function testTranslate() {
  console.log('开始测试翻译功能...');

  try {
    const { translateText } = require('../utils/translate');

    // 测试中文翻译成英文
    console.log('\n=== 测试翻译功能 ===');
    const translated = await translateText('你好，世界', 'en');
    console.log('原文:', '你好，世界');
    console.log('译文:', translated);

    console.log('\n翻译功能测试完成！');
  } catch (error) {
    console.error('翻译功能测试过程中出现错误:', error);
  }
}

// 测试所有API功能
async function runAllAPITests() {
  console.log('开始运行所有API测试...\n');

  await testWeatherAPI();
  console.log('\n' + '='.repeat(50));
  await testNewsAPI();
  console.log('\n' + '='.repeat(50));
  await testTranslate();

  console.log('\n所有API测试完成！');
}

// 运行测试
if (require.main === module) {
  runAllAPITests();
}

module.exports = {
  testWeatherAPI,
  testNewsAPI,
  testTranslate,
  runAllAPITests
};