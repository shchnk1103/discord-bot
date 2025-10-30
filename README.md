# Discord Bot [中文版](README.zh.md)

A feature-rich Discord bot that provides weather information and news summaries for users.

## Features

### Weather Information
- Get weather information for cities worldwide
- Support for both Chinese and English city names
- Provides detailed information including temperature, humidity, and feels-like temperature

### News Summaries
- Get the latest news headlines
- Support for multiple news categories (Technology, Business, Entertainment, Sports, Health, etc.)
- Automatic translation feature that displays news in the user's preferred language

### Daily Summaries
- Scheduled delivery of weather and news summaries
- Support for manually triggering summary commands

### Default Location Management
- Set a default location for weather queries
- Retrieve weather for your default location with a simple command

## Installation and Setup

### Prerequisites
- Node.js 16.6.0 or higher
- Discord Bot Token
- OpenWeatherMap API Key
- NewsAPI Key

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/shchnk1103/discord-bot.git
   cd discord-bot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the project root and add the following:
   ```env
   DISCORD_TOKEN=your_discord_bot_token
   WEATHER_API_KEY=your_openweathermap_api_key
   NEWS_API_KEY=your_newsapi_key
   CHANNEL_ID=your_discord_channel_id
   ```

4. Start the bot:
   ```bash
   npm start
   ```

## Usage

### Message Commands
- `!weather [city]` - Get weather information for a specific city
- `!weather setlocation <city>` - Set your default location
- `!news [category]` - Get news for a specific category
- `!summary` - Get today's weather and news summary

### Slash Commands
- `/weather [city]` - Get weather information for a specific city
- `/weather setlocation:<city>` - Set your default location
- `/news [category]` - Get news for a specific category
- `/summary` - Get today's weather and news summary

## Configuration

### Environment Variables
- `DISCORD_TOKEN` - Your Discord bot token
- `WEATHER_API_KEY` - Your OpenWeatherMap API key
- `NEWS_API_KEY` - Your NewsAPI key
- `CHANNEL_ID` - The Discord channel ID for scheduled messages

### Command Management
The bot includes several scripts for managing Discord Slash Commands:
- `npm run commands:cleanup` - Clean up duplicate commands
- `npm run commands:cleanup-complete` - Complete command cleanup and re-registration
- `npm run commands:register` - Register guild-specific commands
- `npm run commands:update-guild` - Update guild-specific commands
- `npm run commands:update-global` - Update global commands

## Project Structure

```
discord-bot/
├── index.js                 # Main entry point
├── .env                     # Environment variables
├── .gitignore               # Git ignore file
├── LICENSE                  # MIT License
├── package.json             # Project dependencies and scripts
├── src/
│   ├── commands/           # Command handlers
│   │   ├── weather.js      # Weather command handler
│   │   ├── news.js         # News command handler
│   │   └── summary.js      # Summary command handler
│   ├── config/             # Configuration files
│   │   └── commands.js     # Command definitions
│   ├── models/             # Data models
│   │   └── UserConfig.js   # User configuration model
│   ├── scripts/            # Command management scripts
│   │   ├── cleanup-commands.js
│   │   ├── complete-cleanup.js
│   │   ├── register-guild-commands.js
│   │   ├── update-commands.js
│   │   └── update-guild-commands.js
│   ├── utils/              # Utility functions
│   │   ├── api.js          # API call functions
│   │   ├── embeds.js       # Embed message creation
│   │   ├── scheduler.js    # Scheduled task handling
│   │   ├── translate.js    # Translation functionality
│   │   └── errorHandler.js # Error handling functions
│   └── tests/              # Test files
│       ├── testRunner.js   # Test runner
│       └── *.test.js       # Individual test files
└── README.md               # Project documentation
```

## Development

### Development Mode
```bash
npm run dev
```

### Testing
Run all tests:
```bash
npm test
```

Run specific test suites:
```bash
npm run test:weather
npm run test:news
npm run test:summary
npm run test:api
```

### Code Style
- Uses ESLint for code linting
- Follows JavaScript Standard Style

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes
4. Add or update tests as necessary
5. Ensure all tests pass
6. Commit your changes with a clear commit message
7. Push to your fork
8. Create a pull request

### Reporting Issues
If you encounter any issues, please open an issue on GitHub with:
- A clear description of the problem
- Steps to reproduce the issue
- Any relevant error messages
- Information about your environment

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help with setup, please open an issue on GitHub.