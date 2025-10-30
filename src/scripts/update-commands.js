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

    // 更新全局命令（所有服务器）
    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands }
    );

    console.log('全局命令已成功更新！');
  } catch (error) {
    console.error('更新命令时出错:', error);
  }
}

updateCommands();