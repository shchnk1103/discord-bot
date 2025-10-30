require('dotenv').config();
const { translateText, detectLanguage, translateArticle } = require('./utils/translate');

async function testTranslation() {
  console.log('测试翻译功能...\n');

  // 测试文本翻译
  try {
    console.log('1. 测试中文翻译成英文:');
    const chineseText = '今天天气很好';
    const translatedToEn = await translateText(chineseText, 'en');
    console.log(`原文: ${chineseText}`);
    console.log(`译文: ${translatedToEn}\n`);
  } catch (error) {
    console.error('中文翻译测试失败:', error.message);
  }

  try {
    console.log('2. 测试英文翻译成中文:');
    const englishText = 'The weather is very nice today';
    const translatedToZh = await translateText(englishText, 'zh');
    console.log(`原文: ${englishText}`);
    console.log(`译文: ${translatedToZh}\n`);
  } catch (error) {
    console.error('英文翻译测试失败:', error.message);
  }

  // 测试语言检测
  try {
    console.log('3. 测试语言检测:');
    const text1 = 'Hello, how are you?';
    const lang1 = await detectLanguage(text1);
    console.log(`文本: ${text1}`);
    console.log(`检测到的语言: ${lang1}\n`);

    const text2 = '你好，你怎么样？';
    const lang2 = await detectLanguage(text2);
    console.log(`文本: ${text2}`);
    console.log(`检测到的语言: ${lang2}\n`);
  } catch (error) {
    console.error('语言检测测试失败:', error.message);
  }

  // 测试文章翻译
  try {
    console.log('4. 测试文章翻译:');
    const article = {
      title: 'Breaking News: New Technology Update',
      description: 'A new breakthrough in technology has been announced today.',
      url: 'https://example.com/news/123',
      source: { name: 'Tech News' }
    };

    const translatedArticle = await translateArticle(article, 'zh');
    console.log('原文标题:', article.title);
    console.log('译文标题:', translatedArticle.title);
    console.log('原文描述:', article.description);
    console.log('译文描述:', translatedArticle.description);
    console.log('是否已翻译:', translatedArticle.translated);
  } catch (error) {
    console.error('文章翻译测试失败:', error.message);
  }
}

testTranslation();