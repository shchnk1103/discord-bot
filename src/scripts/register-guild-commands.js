/**
 * 注册服务器特定的 Slash Commands
 *
 * 这个脚本只注册服务器特定命令，不会创建全局命令，
 * 确保命令只在特定服务器中显示且更新更快。
 */

require('dotenv').config();
const { REST, Routes } = require('discord.js');

// 导入集中式的Slash Commands定义
const commands = require('../config/commands');

// 创建REST实例
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

async function registerGuildCommands() {
  try {
    console.log('开始注册服务器特定命令...');

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

    // 从 .env 获取服务器 ID（注意：这里应该用服务器 ID，不是频道 ID）
    // 但为了兼容性，我们继续使用 CHANNEL_ID
    const guildId = process.env.CHANNEL_ID;

    if (guildId && guildId !== 'YOUR_CHANNEL_ID') {
      // 注册服务器特定命令
      await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands }
      );

      console.log('服务器特定命令已成功注册！');
      console.log('命令列表:');
      commands.forEach(cmd => console.log(`  /${cmd.name}`));
    } else {
      console.log('未设置服务器 ID，请在 .env 文件中设置 CHANNEL_ID');
    }
  } catch (error) {
    console.error('注册服务器特定命令时出错:', error);
  }
}

registerGuildCommands();