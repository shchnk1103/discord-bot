// 模拟Discord交互对象用于测试
const mockInteraction = {
  locale: 'zh-CN', // 模拟中文用户
  replied: false,
  deferred: false,
  deferReply: async function() {
    console.log('正在处理请求...');
    this.deferred = true;
  },
  reply: async function(response) {
    console.log('Slash Command回复:', response);
  },
  editReply: async function(response) {
    console.log('编辑回复:', response);
  }
};

// 模拟Discord消息对象用于测试
const mockMessage = {
  author: {
    locale: 'en-US' // 模拟英文用户
  },
  channel: {
    send: async function(response) {
      console.log('发送消息:', response);
    }
  },
  reply: async function(response) {
    console.log('消息回复:', response);
  }
};

async function testNewsCommand() {
  console.log('测试新闻命令处理函数...\n');

  // 导入新闻命令处理函数
  const { handleNewsCommand } = require('./commands/news');

  try {
    console.log('1. 测试Slash Command交互（中文用户）:');
    await handleNewsCommand(mockInteraction, [], 'technology');
    console.log('');

    console.log('2. 测试消息命令（英文用户）:');
    await handleNewsCommand(mockMessage, ['sports']);
    console.log('');
  } catch (error) {
    console.error('测试新闻命令处理函数时出错:', error);
  }
}

testNewsCommand();