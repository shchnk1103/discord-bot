require('dotenv').config();

console.log('WEATHER_API_KEY exists:', !!process.env.WEATHER_API_KEY);
console.log('NEWS_API_KEY exists:', !!process.env.NEWS_API_KEY);
console.log('CHANNEL_ID exists:', !!process.env.CHANNEL_ID);

console.log('DISCORD_TOKEN length:', process.env.DISCORD_TOKEN?.length || 0);
console.log('WEATHER_API_KEY length:', process.env.WEATHER_API_KEY?.length || 0);
console.log('NEWS_API_KEY length:', process.env.NEWS_API_KEY?.length || 0);
console.log('CHANNEL_ID:', process.env.CHANNEL_ID);