require('dotenv').config();

// 测试天气 API URL 构建
const city = '北京';
const apiKey = process.env.WEATHER_API_KEY;
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=zh_cn`;

console.log('Weather API URL:', url);

// 测试新闻 API URL 构建
const category = 'general';
const newsApiKey = process.env.NEWS_API_KEY;
const newsUrl = `https://newsapi.org/v2/top-headlines?category=${category}&country=cn&pageSize=5&apiKey=${newsApiKey}`;

console.log('News API URL:', newsUrl);