/**
 * 摘要命令测试
 */

// 模拟Discord客户端对象
const mockClient = {
  channels: {
    fetch: async (channelId) => {
      return {
        id: channelId,
        send: async (content) => {
          console.log('发送消息到频道:', content);
          return { id: 'mock-message-id' };
        }
      };
    }
  }
};

// 模拟Discord消息对象
const mockMessage = {
  author: { bot: false },
  content: '!summary',
  channel: {
    id: 'test-channel-id',
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
  channelId: 'test-channel-id',
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
  commandName: 'summary'
};

// 测试摘要命令处理函数
async function testSummaryCommand() {
  console.log('开始测试摘要命令...');

  try {
    // 导入摘要命令处理函数
    const { handleSummaryCommand } = require('../commands/summary');

    // 测试消息命令
    console.log('\n=== 测试消息命令 ===');
    await handleSummaryCommand(mockMessage, [], mockClient);

    // 重置交互状态并测试Slash Command
    mockInteraction.replied = false;
    mockInteraction.deferred = false;
    console.log('\n=== 测试Slash Command ===');
    await handleSummaryCommand(mockInteraction, [], mockClient);

    console.log('\n所有测试完成！');
  } catch (error) {
    console.error('测试过程中出现错误:', error);
  }
}

// 运行测试
if (require.main === module) {
  testSummaryCommand();
}

module.exports = {
  testSummaryCommand
};