require('dotenv').config();
const { REST, Routes } = require('discord.js');

// 导入集中式的Slash Commands定义
const commands = require('../config/commands');

// 创建REST实例
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

async function updateCommands() {
  try {
    console.log('开始更新命令...');

    // 从 token 解析 client ID
    const tokenParts = process.env.DISCORD_TOKEN.split('.');
    let clientId;

    if (tokenParts.length >= 2) {
      // 解码 Base64 编码的 client ID
      clientId = Buffer.from(tokenParts[0], 'base64').toString('ascii');
    } else {
      console.error('无法从 token 解析 client ID');
      return;
    }

    console.log(`识别的 Client ID: ${clientId}`);

    // 从 .env 获取服务器 ID
    const guildId = process.env.CHANNEL_ID; // 注意：这里应该用服务器 ID，不是频道 ID
    console.log(`使用服务器 ID: ${guildId}`);

    // 更新服务器特定命令（更快地在特定服务器中显示）
    if (guildId && guildId !== 'YOUR_CHANNEL_ID') {
      await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands }
      );

      console.log('服务器特定命令已成功更新！');
    } else {
      console.log('未设置服务器 ID，跳过服务器特定命令更新');
    }
  } catch (error) {
    console.error('更新命令时出错:', error);
  }
}

updateCommands();