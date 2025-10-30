require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { sendDailySummary } = require('./utils/scheduler');

// 创建一个模拟的 Discord 客户端
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

// 模拟客户端登录
client.login(process.env.DISCORD_TOKEN).then(() => {
  console.log('Discord client logged in successfully');

  // 等待客户端准备就绪
  client.once('ready', async () => {
    console.log('Client is ready, testing sendDailySummary function...');

    // 使用环境变量中的频道 ID 测试发送摘要
    const channelId = process.env.CHANNEL_ID;

    if (channelId) {
      try {
        console.log(`Sending test summary to channel ${channelId}...`);
        await sendDailySummary(client, channelId);
        console.log('Test summary sent successfully!');
      } catch (error) {
        console.error('Error sending test summary:', error);
      }
    } else {
      console.log('CHANNEL_ID not found in environment variables');
    }

    // 关闭客户端
    client.destroy();
  });
}).catch(error => {
  console.error('Failed to login:', error);
});