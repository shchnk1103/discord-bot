// 导入discord.js库中的Client类和GatewayIntentBits枚举
// Client是与Discord API交互的主要类
// GatewayIntentBits定义了机器人需要接收的事件类型
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');

// 导入dotenv库并立即调用config()方法
// 这会加载.env文件中的环境变量到process.env对象中
require('dotenv').config();

// 导入天气命令处理函数
const { handleWeatherCommand } = require('./src/commands/weather');
// 导入新闻命令处理函数
const { handleNewsCommand } = require('./src/commands/news');
// 导入摘要命令处理函数
const { handleSummaryCommand } = require('./src/commands/summary');
// 导入定时任务函数
const { scheduleDailyTask } = require('./src/utils/scheduler');

// 创建一个新的Discord客户端实例
// 需要指定intents来告诉Discord机器人需要接收哪些事件
const client = new Client({
  intents: [
    // Guilds intent: 接收与服务器相关的事件，如服务器创建、更新、删除
    GatewayIntentBits.Guilds,
    // GuildMessages intent: 接收服务器中消息相关的事件
    GatewayIntentBits.GuildMessages,
    // MessageContent intent: 接收消息内容（需要在开发者门户中启用）
    GatewayIntentBits.MessageContent,
  ],
  // 增加WebSocket连接超时时间以解决握手超时问题
  ws: {
    handshakeTimeout: 60000, // 60 seconds instead of default 30 seconds
    helloTimeout: 120000,    // 120 seconds instead of default 60 seconds
    readyTimeout: 30000      // 30 seconds instead of default 15 seconds
  }
});

// 连接重试计数器
let retryCount = 0;
const maxRetries = 5;
const baseDelay = 5000; // 5秒基础延迟

// 定义Slash Commands
const commands = [
  {
    name: 'weather',
    description: '获取天气信息',
    options: [
      {
        name: 'city',
        type: 3, // STRING
        description: '城市名称',
        required: false
      },
      {
        name: 'setlocation',
        type: 3, // STRING
        description: '设置默认位置（提供城市名称以设置默认位置）',
        required: false
      }
    ]
  },
  {
    name: 'news',
    description: '获取最新新闻',
    options: [
      {
        name: 'category',
        type: 3, // STRING
        description: '新闻分类',
        required: false,
        choices: [
          {
            name: '科技',
            value: 'technology'
          },
          {
            name: '商业',
            value: 'business'
          },
          {
            name: '娱乐',
            value: 'entertainment'
          },
          {
            name: '体育',
            value: 'sports'
          },
          {
            name: '健康',
            value: 'health'
          }
        ]
      }
    ]
  },
  {
    name: 'summary',
    description: '获取今日摘要信息（天气和新闻）'
  },
  ];

// 创建一个集合来存储命令
client.commands = new Collection();

// 监听一次性的'clientReady'事件
// 当机器人成功连接到Discord并准备就绪时触发
client.once('clientReady', async () => {
  // 在控制台输出机器人已就绪的信息
  console.log('机器人已就绪！');
  // 重置重试计数器
  retryCount = 0;

  // 安排每日任务
  // 你需要将'YOUR_CHANNEL_ID'替换为实际的频道ID
  // 可以通过启用Discord开发者模式并在频道上右键点击来获取频道ID
  const channelId = process.env.CHANNEL_ID || 'YOUR_CHANNEL_ID';

  if (channelId !== 'YOUR_CHANNEL_ID') {
    // 安排每天上午8点发送摘要 (cron表达式: 秒 分 时 日 月 周)
    scheduleDailyTask(client, channelId, '0 0 8 * * *');
    console.log(`每日摘要任务已安排，将在每天上午8点发送到频道 ${channelId}`);
  } else {
    console.log('请在.env文件中设置CHANNEL_ID以启用每日摘要功能');
  }
});

// 监听Shard错误事件
client.on('shardError', (error, shardId) => {
  console.error(`Shard ${shardId} 遇到错误:`, error);
  // 如果是超时错误，记录详细信息
  if (error.message && error.message.includes('timed out')) {
    console.error('WebSocket 连接超时，请检查网络连接或防火墙设置');
  }
});

// 监听Shard断开连接事件
client.on('shardDisconnect', (event, shardId) => {
  console.log(`Shard ${shardId} 断开连接，关闭代码: ${event.code}`);
});

// 监听Shard重新连接事件
client.on('shardReconnecting', (shardId) => {
  console.log(`Shard ${shardId} 正在重新连接...`);
});

// 监听Shard恢复事件
client.on('shardResume', (shardId, replayedEvents) => {
  console.log(`Shard ${shardId} 已恢复，重放事件数: ${replayedEvents}`);
});

// 监听消息创建事件
// 当在服务器中收到新消息时触发
client.on('messageCreate', async (message) => {
  // 如果消息来自机器人本身，则忽略
  if (message.author.bot) return;

  // 如果消息不以指定前缀开头，则忽略
  const prefix = '!';
  if (!message.content.startsWith(prefix)) return;

  // 解析命令和参数
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // 处理天气命令
  if (command === 'weather') {
    handleWeatherCommand(message, args);
  }

  // 处理新闻命令
  if (command === 'news') {
    handleNewsCommand(message, args);
  }

  // 处理摘要命令
  if (command === 'summary') {
    handleSummaryCommand(message, args, client);
  }

  });

// 监听Slash Commands交互事件
client.on('interactionCreate', async (interaction) => {
  // 只处理命令交互
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  try {
    // 处理天气命令
    if (commandName === 'weather') {
      // 延迟回复，因为API请求可能需要一些时间
      const setLocationValue = options.getString('setlocation');
      if (setLocationValue) {
        await interaction.deferReply({ flags: [1 << 6] }); // EPHEMERAL flag
      } else {
        await interaction.deferReply();
      }
      const city = options.getString('city');
      const setLocation = setLocationValue;
      await handleWeatherCommand(interaction, [], city, setLocation);
    }

    // 处理新闻命令
    if (commandName === 'news') {
      // 延迟回复，因为API请求可能需要一些时间
      await interaction.deferReply();
      const category = options.getString('category') || 'general';
      await handleNewsCommand(interaction, [], category);
    }

    // 处理摘要命令
    if (commandName === 'summary') {
      // 延迟回复，因为API请求可能需要一些时间
      await interaction.deferReply();
      await handleSummaryCommand(interaction, [], client);
    }
  } catch (error) {
    console.error(`处理命令 ${commandName} 时出错:`, error);
    try {
      if (interaction.replied || interaction.deferred) {
        // 如果交互已经被响应或延迟，使用 followUp 发送错误消息
        if (!interaction.ephemeral) {
          await interaction.followUp({ content: '处理命令时出现错误！', ephemeral: true });
        } else {
          // 如果交互是临时的，我们不能再次 followUp，只能在编辑已有的响应
          // 但这里我们只能记录错误，因为无法向用户发送错误消息
          console.error(`无法发送错误消息，交互已处理: ${commandName}`);
        }
      } else {
        // 如果交互还没有被响应，可以正常回复
        await interaction.reply({ content: '处理命令时出现错误！', ephemeral: true });
      }
    } catch (replyError) {
      // 如果回复也失败了，记录错误但不抛出，避免无限循环
      console.error('发送错误消息时失败:', replyError);
    }
  }
});

// 使用.env文件中的DISCORD_TOKEN登录机器人
// 这个令牌是机器人身份验证的关键，不要泄露

// 带重试机制的登录函数
async function loginWithRetry() {
  try {
    await client.login(process.env.DISCORD_TOKEN);
    console.log('成功连接到Discord!');
  } catch (error) {
    console.error('登录Discord时出错:', error);
    
    // 检查是否是网络超时错误
    if (error.message && (error.message.includes('timed out') || error.message.includes('ETIMEDOUT') || error.message.includes('ENOTFOUND'))) {
      retryCount++;
      if (retryCount <= maxRetries) {
        // 指数退避延迟 (基础延迟 * 2^重试次数)
        const delay = baseDelay * Math.pow(2, retryCount - 1);
        console.log(`连接失败，${delay/1000}秒后进行第${retryCount}次重试...`);
        
        setTimeout(() => {
          loginWithRetry();
        }, delay);
      } else {
        console.error(`已达到最大重试次数 (${maxRetries})，请检查网络连接或Discord令牌`);
        process.exit(1);
      }
    } else {
      // 非超时错误直接退出
      console.error('无法重试的错误:', error.message);
      process.exit(1);
    }
  }
}

// 启动登录过程
loginWithRetry();