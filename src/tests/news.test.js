/**
 * 新闻命令测试
 */

// 模拟Discord消息对象
const mockMessage = {
  author: { bot: false },
  content: '!news technology',
  channel: {
    send: async (content) => {
      console.log('发送消息:', content);
      return { id: 'mock-message-id' };
    }
  },
  reply: async (content) => {
    console.log('回复消息:', content);
    return { id: 'mock-reply-id' };
  }
};

// 模拟Discord交互对象
const mockInteraction = {
  replied: false,
  deferred: false,
  locale: 'zh-CN', // 测试中文环境
  deferReply: async () => {
    console.log('延迟回复');
    mockInteraction.deferred = true;
  },
  editReply: async (content) => {
    console.log('编辑回复:', content);
    return { id: 'mock-edit-id' };
  },
  reply: async (content) => {
    console.log('回复交互:', content);
    return { id: 'mock-interaction-id' };
  },
  isCommand: () => true,
  commandName: 'news',
  options: {
    getString: (name) => {
      if (name === 'category') return 'technology';
      return null;
    }
  }
};

// 测试新闻命令处理函数
async function testNewsCommand() {
  console.log('开始测试新闻命令...');

  try {
    // 导入新闻命令处理函数
    const { handleNewsCommand } = require('../commands/news');

    // 测试消息命令
    console.log('\n=== 测试消息命令 ===');
    await handleNewsCommand(mockMessage, ['technology']);

    // 重置交互状态并测试Slash Command
    mockInteraction.replied = false;
    mockInteraction.deferred = false;
    console.log('\n=== 测试Slash Command ===');
    await handleNewsCommand(mockInteraction, [], 'technology');

    console.log('\n所有测试完成！');
  } catch (error) {
    console.error('测试过程中出现错误:', error);
  }
}

// 运行测试
if (require.main === module) {
  testNewsCommand();
}

module.exports = {
  testNewsCommand
};