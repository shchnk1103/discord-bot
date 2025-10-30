require('dotenv').config();
const { getWeather, getNews } = require('./utils/api');

async function testAPIs() {
  try {
    console.log('Testing weather API...');
    const weather = await getWeather('北京');
    console.log('Weather data:', weather);
  } catch (error) {
    console.error('Weather API error:', error.message);
  }

  try {
    console.log('\nTesting news API...');
    const news = await getNews('general');
    console.log('News data:', {
      articlesCount: news.articles?.length || 0,
      firstArticleTitle: news.articles?.[0]?.title || 'No articles'
    });
  } catch (error) {
    console.error('News API error:', error.message);
  }
}

testAPIs();