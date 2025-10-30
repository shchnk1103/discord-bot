// utils/api.js
// 用于处理所有外部API调用的工具函数

// 导入环境变量
require("dotenv").config();

// 导入翻译工具
const { translateArticle } = require("./translate");

/**
 * 获取天气信息
 * @param {string} city - 城市名称
 * @returns {Promise<Object>} 天气信息对象
 */
async function getWeather(city) {
  try {
    // 处理中英文城市名映射（扩展常用城市）
    const cityMap = {
      嘉兴: "Jiaxing",
      宁波: "Ningbo",
      北京: "Beijing",
      上海: "Shanghai",
      广州: "Guangzhou",
      深圳: "Shenzhen",
      杭州: "Hangzhou",
      成都: "Chengdu",
      重庆: "Chongqing",
      天津: "Tianjin",
      南京: "Nanjing",
      武汉: "Wuhan",
      西安: "Xian",
      长沙: "Changsha",
      青岛: "Qingdao",
      大连: "Dalian",
      厦门: "Xiamen",
      // 国际城市中英文映射
      纽约: "New York",
      洛杉矶: "Los Angeles",
      旧金山: "San Francisco",
      伦敦: "London",
      巴黎: "Paris",
      柏林: "Berlin",
      东京: "Tokyo",
      大阪: "Osaka",
      京都: "Kyoto",
      首尔: "Seoul",
      新加坡: "Singapore",
      悉尼: "Sydney",
      墨尔本: "Melbourne",
      多伦多: "Toronto",
      温哥华: "Vancouver",
      莫斯科: "Moscow",
      迪拜: "Dubai",
      罗马: "Rome",
      阿姆斯特丹: "Amsterdam",
      苏黎世: "Zurich",
      马德里: "Madrid",
      巴塞罗那: "Barcelona",
      雅典: "Athens",
      维也纳: "Vienna",
      布鲁塞尔: "Brussels",
      斯德哥尔摩: "Stockholm",
      赫尔辛基: "Helsinki",
      哥本哈根: "Copenhagen",
      里斯本: "Lisbon",
      都柏林: "Dublin",
      渥太华: "Ottawa",
      墨西哥城: "Mexico City",
      圣保罗: "Sao Paulo",
      布宜诺斯艾利斯: "Buenos Aires",
      开罗: "Cairo",
      开普敦: "Cape Town",
      约翰内斯堡: "Johannesburg",
      内罗毕: "Nairobi",
      拉各斯: "Lagos",
      孟买: "Mumbai",
      新德里: "New Delhi",
      班加罗尔: "Bangalore",
      曼谷: "Bangkok",
      吉隆坡: "Kuala Lumpur",
      雅加达: "Jakarta",
      马尼拉: "Manila",
      胡志明市: "Ho Chi Minh City",
      河内: "Hanoi",
      汉城: "Seoul",
      台北: "Taipei",
      香港: "Hong Kong",
    };

    // 首先尝试使用映射表
    let processedCity = cityMap[city] || city;

    // 如果城市名包含中文且不在映射表中，尝试直接使用（API可能支持）
    if (/[^\x00-\x7F]/.test(city) && !cityMap[city]) {
      processedCity = city;
    }

    // 构建OpenWeatherMap API URL
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      processedCity
    )}&appid=${apiKey}&units=metric&lang=zh_cn`;

    // 发送HTTP请求获取天气数据
    const response = await fetch(url);

    // 检查响应状态
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 404) {
        throw new Error(`找不到城市 "${city}"，请检查城市名称是否正确。`);
      } else {
        throw new Error(
          `天气API请求失败: ${response.status} ${response.statusText}${
            errorData.message ? ` - ${errorData.message}` : ""
          }`
        );
      }
    }

    // 解析JSON响应
    const data = await response.json();

    // 返回格式化的天气信息（包含更多详细数据）
    return {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      tempMin: Math.round(data.main.temp_min),
      tempMax: Math.round(data.main.temp_max),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      windSpeed: data.wind?.speed || 0,
      windDeg: data.wind?.deg || 0,
      visibility: data.visibility ? data.visibility / 1000 : 0, // 转换为公里
      clouds: data.clouds?.all || 0,
      sunrise: new Date(data.sys.sunrise * 1000),
      sunset: new Date(data.sys.sunset * 1000),
    };
  } catch (error) {
    console.error("获取天气信息时出错:", error);
    throw error;
  }
}

/**
 * 获取新闻信息
 * @param {string} category - 新闻分类（可选）
 * @param {string} targetLang - 目标语言（可选）
 * @returns {Promise<Object>} 新闻信息对象
 */
async function getNews(category = "general", targetLang = null) {
  try {
    // 构建NewsAPI URL，使用更可靠的国际新闻源
    const apiKey = process.env.NEWS_API_KEY;
    const url = `https://newsapi.org/v2/top-headlines?sources=techcrunch&pageSize=5&apiKey=${apiKey}`;

    // 发送HTTP请求获取新闻数据
    const response = await fetch(url);

    // 检查响应状态
    if (!response.ok) {
      throw new Error(
        `新闻API请求失败: ${response.status} ${response.statusText}`
      );
    }

    // 解析JSON响应
    const data = await response.json();

    // 检查API响应是否成功
    if (data.status !== "ok") {
      throw new Error(`新闻API返回错误: ${data.message}`);
    }

    // 处理文章数据
    let articles = data.articles.map((article) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
    }));

    // 如果指定了目标语言且不是英语，翻译文章
    if (targetLang && targetLang !== "en") {
      try {
        // 翻译文章
        const translatedArticles = [];
        for (const article of articles) {
          const translatedArticle = await translateArticle(article, targetLang);
          translatedArticles.push(translatedArticle);
        }
        articles = translatedArticles;
      } catch (translateError) {
        console.error("翻译新闻时出错:", translateError);
        // 翻译失败时使用原文
      }
    }

    // 返回格式化的新闻信息
    return {
      category: category,
      articles: articles,
    };
  } catch (error) {
    console.error("获取新闻信息时出错:", error);
    throw error;
  }
}

module.exports = {
  getWeather,
  getNews,
};
