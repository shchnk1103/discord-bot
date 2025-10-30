/**
 * 天气命令测试
 */

// 模拟Discord消息对象
const mockMessage = {
  author: { bot: false },
  content: '!weather 北京',
  channel: {
    send: async (content) => {
      console.log('发送消息:', content);
      return { id: 'mock-message-id' };
    }
  },
  reply: async (content) => {
    console.log('回复消息:', content);
    return { id: 'mock-reply-id' };
  },
  deferReply: undefined // 消息命令没有deferReply方法
};

// 模拟设置默认位置的消息对象
const mockSetLocationMessage = {
  author: { bot: false, id: 'test-user-id-123' },
  content: '!weather setlocation 上海',
  channel: {
    send: async (content) => {
      console.log('发送消息:', content);
      return { id: 'mock-message-id' };
    }
  },
  reply: async (content) => {
    console.log('回复消息:', content);
    return { id: 'mock-reply-id' };
  },
  deferReply: undefined // 消息命令没有deferReply方法
};

// 模拟Discord交互对象
const mockInteraction = {
  replied: false,
  deferred: false,
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
  commandName: 'weather',
  options: {
    getString: (name) => {
      if (name === 'city') return '北京';
      return null;
    }
  }
};

// 模拟设置位置的Discord交互对象
const mockSetLocationInteraction = {
  replied: false,
  deferred: false,
  user: { id: 'test-user-id-123' },
  deferReply: async () => {
    console.log('延迟回复');
    mockSetLocationInteraction.deferred = true;
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
  commandName: 'weather',
  options: {
    getString: (name) => {
      if (name === 'setlocation') return '上海';
      return null;
    }
  }
};

// 测试天气命令处理函数
async function testWeatherCommand() {
  console.log('开始测试天气命令...');

  try {
    // 导入天气命令处理函数
    const { handleWeatherCommand } = require('../commands/weather');

    // 测试消息命令
    console.log('\n=== 测试消息命令 ===');
    await handleWeatherCommand(mockMessage, ['北京']);

    // 测试消息命令设置默认位置
    console.log('\n=== 测试消息命令设置默认位置 ===');
    await handleWeatherCommand(mockSetLocationMessage, ['setlocation', '上海']);

    // 测试Slash Command
    console.log('\n=== 测试Slash Command ===');
    await handleWeatherCommand(mockInteraction, [], '北京');

    // 测试设置默认位置功能
    console.log('\n=== 测试设置默认位置功能 ===');
    await handleWeatherCommand(mockSetLocationInteraction, [], null, '上海');

    console.log('\n所有测试完成！');
  } catch (error) {
    console.error('测试过程中出现错误:', error);
  }
}

// 运行测试
if (require.main === module) {
  testWeatherCommand();
}

module.exports = {
  testWeatherCommand
};