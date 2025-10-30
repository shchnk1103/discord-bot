/**
 * 用户配置模型
 * 用于存储用户的默认设置，如默认地理位置等
 */

const fs = require('fs');
const path = require('path');

// 配置文件路径
const configPath = path.join(__dirname, '../../userConfigs.json');

// 加载用户配置
function loadUserConfigs() {
  try {
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, 'utf8');
      return new Map(Object.entries(JSON.parse(data)));
    }
  } catch (error) {
    console.error('加载用户配置时出错:', error);
  }
  return new Map();
}

// 保存用户配置
function saveUserConfigs(userConfigs) {
  return new Promise((resolve, reject) => {
    try {
      const data = JSON.stringify(Object.fromEntries(userConfigs), null, 2);
      fs.writeFileSync(configPath, data, 'utf8');
      resolve();
    } catch (error) {
      console.error('保存用户配置时出错:', error);
      reject(error);
    }
  });
}

// 用户配置存储
const userConfigs = loadUserConfigs();

/**
 * 获取用户配置
 * @param {string} userId - 用户ID
 * @returns {Object|null} 用户配置对象或null（如果不存在）
 */
function getUserConfig(userId) {
  return userConfigs.get(userId) || null;
}

/**
 * 设置用户配置
 * @param {string} userId - 用户ID
 * @param {Object} config - 配置对象
 */
async function setUserConfig(userId, config) {
  const existingConfig = userConfigs.get(userId) || {};
  const updatedConfig = { ...existingConfig, ...config };
  userConfigs.set(userId, updatedConfig);
  saveUserConfigs(userConfigs); // 保存到文件
  return updatedConfig;
}

/**
 * 设置用户的默认地理位置
 * @param {string} userId - 用户ID
 * @param {string} location - 地理位置
 */
async function setUserDefaultLocation(userId, location) {
  return setUserConfig(userId, { defaultLocation: location });
}

/**
 * 获取用户的默认地理位置
 * @param {string} userId - 用户ID
 * @returns {string|null} 默认地理位置或null（如果未设置）
 */
function getUserDefaultLocation(userId) {
  const config = getUserConfig(userId);
  return config ? config.defaultLocation : null;
}

/**
 * 清除用户配置
 * @param {string} userId - 用户ID
 */
function clearUserConfig(userId) {
  userConfigs.delete(userId);
  saveUserConfigs(userConfigs); // 保存到文件
}

module.exports = {
  getUserConfig,
  setUserConfig,
  setUserDefaultLocation,
  getUserDefaultLocation,
  clearUserConfig
};