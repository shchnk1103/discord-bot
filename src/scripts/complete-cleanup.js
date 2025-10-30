/**
 * 彻底清理所有重复的 Slash Commands
 *
 * 这个脚本会清理所有全局命令和服务器特定命令，
 * 然后重新注册一次服务器特定命令，确保没有重复。
 */

require('dotenv').config();
const { REST, Routes } = require('discord.js');

// 导入集中式的Slash Commands定义
const commands = require('../config/commands');

// 创建REST实例
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

async function cleanupAndReRegister() {
  try {
    console.log('开始彻底清理和重新注册命令...');

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

    // 删除所有全局命令
    try {
      const globalCommands = await rest.get(Routes.applicationCommands(clientId));
      console.log(`找到 ${globalCommands.length} 个全局命令`);

      for (const command of globalCommands) {
        await rest.delete(Routes.applicationCommand(clientId, command.id));
        console.log(`已删除全局命令: ${command.name}`);
      }
    } catch (error) {
      console.log('没有全局命令需要删除或删除时出错:', error.message);
    }

    // 从 .env 获取服务器 ID
    const guildId = process.env.CHANNEL_ID;

    if (guildId && guildId !== 'YOUR_CHANNEL_ID') {
      // 删除所有服务器特定命令
      try {
        const guildCommands = await rest.get(Routes.applicationGuildCommands(clientId, guildId));
        console.log(`找到 ${guildCommands.length} 个服务器特定命令`);

        for (const command of guildCommands) {
          await rest.delete(Routes.applicationGuildCommand(clientId, guildId, command.id));
          console.log(`已删除服务器特定命令: ${command.name}`);
        }
      } catch (error) {
        console.log('没有服务器特定命令需要删除或删除时出错:', error.message);
      }

      // 重新注册服务器特定命令
      await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands }
      );

      console.log('服务器特定命令已重新注册！');
    } else {
      console.log('未设置服务器 ID，跳过服务器特定命令注册');
    }

    console.log('命令清理和重新注册完成！');
  } catch (error) {
    console.error('清理和重新注册命令时出错:', error);
  }
}

cleanupAndReRegister();