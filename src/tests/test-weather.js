require('dotenv').config();
const { getWeather } = require('./utils/api');

async function testWeatherAPI() {
  console.log('测试天气API改进功能...\n');

  // 测试各种城市名
  const testCities = ['北京', 'Beijing', '上海', 'Shanghai', '纽约', 'New York', '伦敦', 'London', '东京', 'Tokyo'];

  for (const city of testCities) {
    try {
      console.log(`测试城市: ${city}`);
      const weather = await getWeather(city);
      console.log(`  城市: ${weather.city}, ${weather.country}`);
      console.log(`  温度: ${weather.temperature}°C`);
      console.log(`  描述: ${weather.description}\n`);
    } catch (error) {
      console.log(`  错误: ${error.message}\n`);
    }
  }
}

testWeatherAPI();