/**
 * 清理重复的 Slash Commands
 *
 * 这个脚本会清理所有重复的命令，只保留服务器特定的命令，
 * 因为它们更新更快且只在特定服务器中可见。
 */

require('dotenv').config();
const { REST, Routes } = require('discord.js');

// 创建REST实例
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

async function cleanupCommands() {
  try {
    console.log('开始清理重复的命令...');

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

    // 获取所有全局命令
    const globalCommands = await rest.get(Routes.applicationCommands(clientId));
    console.log(`找到 ${globalCommands.length} 个全局命令`);

    // 删除所有全局命令
    for (const command of globalCommands) {
      await rest.delete(Routes.applicationCommand(clientId, command.id));
      console.log(`已删除全局命令: ${command.name}`);
    }

    // 从 .env 获取服务器 ID
    const guildId = process.env.CHANNEL_ID;

    if (guildId && guildId !== 'YOUR_CHANNEL_ID') {
      // 获取服务器特定命令
      const guildCommands = await rest.get(Routes.applicationGuildCommands(clientId, guildId));
      console.log(`找到 ${guildCommands.length} 个服务器特定命令`);

      // 如果服务器特定命令数量正确（3个），则不需要重新注册
      if (guildCommands.length === 3) {
        console.log('服务器特定命令已正确设置，无需重新注册');
        return;
      }

      // 导入集中式的Slash Commands定义
      const commands = require('../config/commands');

      // 重新注册服务器特定命令
      await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands }
      );

      console.log('服务器特定命令已重新注册！');
    } else {
      console.log('未设置服务器 ID，无法清理服务器特定命令');
    }

    console.log('命令清理完成！');
  } catch (error) {
    console.error('清理命令时出错:', error);
  }
}

cleanupCommands();