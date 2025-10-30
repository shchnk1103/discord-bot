/**
 * 嵌入消息创建工具
 * 用于创建统一格式的Discord嵌入消息
 */

/**
 * 创建天气信息嵌入消息
 * @param {Object} weather - 天气信息对象
 * @param {boolean} isDefaultLocation - 是否使用默认位置
 * @returns {Object} Discord嵌入消息对象
 */
function createWeatherEmbed(weather, isDefaultLocation = false) {
  // 基础嵌入消息
  const embed = {
    color: 0x0099ff,
    title: `🌍 ${weather.city}, ${weather.country} 的天气`,
    description: '当前天气状况',
    fields: [
      {
        name: '🌡️ 温度',
        value: `${weather.temperature}°C (体感: ${weather.feelsLike}°C)`,
        inline: true
      },
      {
        name: '📊 温度范围',
        value: `${weather.tempMin}°C ~ ${weather.tempMax}°C`,
        inline: true
      },
      {
        name: '💧 湿度',
        value: `${weather.humidity}%`,
        inline: true
      },
      {
        name: '🌪️ 气压',
        value: `${weather.pressure} hPa`,
        inline: true
      },
      {
        name: '💨 风力',
        value: `${weather.windSpeed} m/s`,
        inline: true
      },
      {
        name: '👁️ 能见度',
        value: `${weather.visibility} km`,
        inline: true
      },
      {
        name: '☁️ 云量',
        value: `${weather.clouds}%`,
        inline: true
      },
      {
        name: '📝 描述',
        value: weather.description,
        inline: false
      }
    ],
    timestamp: new Date(),
    footer: {
      text: isDefaultLocation ? '天气信息提供 | 使用 /setlocation 设置默认位置' : '天气信息提供'
    }
  };

  // 如果使用默认位置，添加提示信息
  if (isDefaultLocation) {
    embed.fields.push({
      name: 'ℹ️ 提示',
      value: '这是您的默认位置天气。使用 `/setlocation <城市名>` 来更改默认位置。',
      inline: false
    });
  }

  return embed;
}

/**
 * 创建新闻信息嵌入消息
 * @param {Object} news - 新闻信息对象
 * @param {string} userLanguage - 用户语言
 * @returns {Object} Discord嵌入消息对象
 */
function createNewsEmbed(news, userLanguage = 'en') {
  return {
    color: 0x0099ff,
    title: `📰 ${news.category.toUpperCase()} 新闻`,
    description: `最新的${news.category}新闻头条`,
    fields: news.articles.map((article, index) => {
      // 如果文章已翻译，添加翻译标识
      const title = article.translated ?
        `${article.title} [译]` :
        article.title;

      const description = article.description || '无描述';

      return {
        name: `${index + 1}. ${title}`,
        value: `${description}\n[阅读更多](${article.url})`,
        inline: false
      };
    }),
    timestamp: new Date(),
    footer: {
      text: userLanguage === 'zh' ? '新闻信息提供（已自动翻译）' : '新闻信息提供'
    }
  };
}

/**
 * 创建每日天气摘要嵌入消息
 * @param {Object} weather - 天气信息对象
 * @param {boolean} isDefaultLocation - 是否使用默认位置
 * @returns {Object} Discord嵌入消息对象
 */
function createDailyWeatherEmbed(weather, isDefaultLocation = false) {
  const embed = {
    color: 0x0099ff,
    title: '🌤️ 今日天气',
    description: '今日天气预报',
    fields: [
      {
        name: '🌍 城市',
        value: `${weather.city}, ${weather.country}`,
        inline: true
      },
      {
        name: '🌡️ 温度',
        value: `${weather.temperature}°C (体感: ${weather.feelsLike}°C)`,
        inline: true
      },
      {
        name: '📊 温度范围',
        value: `${weather.tempMin}°C ~ ${weather.tempMax}°C`,
        inline: true
      },
      {
        name: '💧 湿度',
        value: `${weather.humidity}%`,
        inline: true
      },
      {
        name: '🌪️ 气压',
        value: `${weather.pressure} hPa`,
        inline: true
      },
      {
        name: '💨 风力',
        value: `${weather.windSpeed} m/s`,
        inline: true
      },
      {
        name: '👁️ 能见度',
        value: `${weather.visibility} km`,
        inline: true
      },
      {
        name: '☁️ 云量',
        value: `${weather.clouds}%`,
        inline: true
      },
      {
        name: '📝 描述',
        value: weather.description,
        inline: false
      }
    ],
    timestamp: new Date(),
    footer: {
      text: isDefaultLocation ? '每日天气预报 | 使用 /setlocation 设置默认位置' : '每日天气预报'
    }
  };

  // 如果使用默认位置，添加提示信息
  if (isDefaultLocation) {
    embed.fields.push({
      name: 'ℹ️ 提示',
      value: '这是您的默认位置天气。使用 `/setlocation <城市名>` 来更改默认位置。',
      inline: false
    });
  }

  return embed;
}

/**
 * 创建每日新闻摘要嵌入消息
 * @param {Object} news - 新闻信息对象
 * @returns {Object} Discord嵌入消息对象
 */
function createDailyNewsEmbed(news) {
  return {
    color: 0x0099ff,
    title: '📰 今日新闻',
    description: '今日头条新闻',
    fields: news.articles.slice(0, 3).map((article, index) => ({
      name: `${index + 1}. ${article.title}`,
      value: `${article.description || '无描述'}\n[阅读更多](${article.url})`,
      inline: false
    })),
    timestamp: new Date(),
    footer: {
      text: '每日新闻摘要'
    }
  };
}

module.exports = {
  createWeatherEmbed,
  createNewsEmbed,
  createDailyWeatherEmbed,
  createDailyNewsEmbed
};