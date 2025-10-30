require('dotenv').config();
const { getNews } = require('./utils/api');
const { handleNewsCommand } = require('./commands/news');

// 模拟中文用户的Slash Command交互
const mockChineseInteraction = {
  locale: 'zh-CN',
  replied: false,
  deferred: false,
  deferReply: async function() {
    console.log('正在处理中文用户的请求...');
    this.deferred = true;
  },
  reply: async function(response) {
    console.log('中文用户Slash Command回复:');
    console.log('  标题:', response.embeds[0].title);
    console.log('  描述:', response.embeds[0].description);
    console.log('  文章数量:', response.embeds[0].fields.length);
    console.log('  页脚:', response.embeds[0].footer.text);
  },
  editReply: async function(response) {
    console.log('编辑回复给中文用户:');
    console.log('  标题:', response.embeds[0].title);
    console.log('  描述:', response.embeds[0].description);
    console.log('  文章数量:', response.embeds[0].fields.length);
    console.log('  页脚:', response.embeds[0].footer.text);

    // 显示第一篇文章的标题（检查是否包含翻译标识）
    if (response.embeds[0].fields.length > 0) {
      console.log('  第一篇文章标题:', response.embeds[0].fields[0].name);
    }
  }
};

// 模拟英文用户的Slash Command交互
const mockEnglishInteraction = {
  locale: 'en-US',
  replied: false,
  deferred: false,
  deferReply: async function() {
    console.log('正在处理英文用户的请求...');
    this.deferred = true;
  },
  reply: async function(response) {
    console.log('英文用户Slash Command回复:');
    console.log('  标题:', response.embeds[0].title);
    console.log('  描述:', response.embeds[0].description);
    console.log('  文章数量:', response.embeds[0].fields.length);
    console.log('  页脚:', response.embeds[0].footer.text);
  },
  editReply: async function(response) {
    console.log('编辑回复给英文用户:');
    console.log('  标题:', response.embeds[0].title);
    console.log('  描述:', response.embeds[0].description);
    console.log('  文章数量:', response.embeds[0].fields.length);
    console.log('  页脚:', response.embeds[0].footer.text);

    // 显示第一篇文章的标题（检查是否包含翻译标识）
    if (response.embeds[0].fields.length > 0) {
      console.log('  第一篇文章标题:', response.embeds[0].fields[0].name);
    }
  }
};

async function testFullTranslation() {
  console.log('=== 测试完整的新闻翻译功能 ===\n');

  try {
    console.log('1. 测试中文用户获取科技新闻（应自动翻译）:');
    await handleNewsCommand(mockChineseInteraction, [], 'technology');
    console.log('');

    console.log('2. 测试英文用户获取科技新闻（不应翻译）:');
    await handleNewsCommand(mockEnglishInteraction, [], 'technology');
    console.log('');

    console.log('3. 直接测试API翻译功能:');
    console.log('  获取英文新闻:');
    const englishNews = await getNews('technology', 'en');
    console.log('    第一篇新闻标题:', englishNews.articles[0]?.title);
    console.log('    是否已翻译:', englishNews.articles[0]?.translated || false);
    console.log('');

    console.log('  获取中文新闻:');
    const chineseNews = await getNews('technology', 'zh');
    console.log('    第一篇新闻标题:', chineseNews.articles[0]?.title);
    console.log('    是否已翻译:', chineseNews.articles[0]?.translated || false);
    if (chineseNews.articles[0]?.translated) {
      console.log('    原文标题:', chineseNews.articles[0]?.originalTitle);
    }
    console.log('');

  } catch (error) {
    console.error('测试完整翻译功能时出错:', error);
  }

  console.log('=== 测试完成 ===');
}

testFullTranslation();