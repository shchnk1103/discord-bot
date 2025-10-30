# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a Discord bot project that provides weather and news information to users. The bot is built using Node.js with the discord.js library.

## Development Setup
1. Install dependencies: `npm install`
2. Create a `.env` file with the required API keys:
   - DISCORD_TOKEN: Your Discord bot token
   - WEATHER_API_KEY: Your OpenWeatherMap API key
   - NEWS_API_KEY: Your NewsAPI key
3. Run in development mode: `npm run dev`
4. Run in production mode: `npm start`

## Project Structure
- `index.js`: Main entry point for the Discord bot
- `.env`: Environment variables (not committed to version control)
- `.gitignore`: Specifies intentionally untracked files to ignore
- `package.json`: Project metadata and dependencies

## Dependencies
- discord.js: Library for interacting with the Discord API
- dotenv: Module for loading environment variables from a .env file
- nodemon: Tool for automatically restarting the server during development

## Key Features
- Discord bot integration
- Weather information retrieval with default location support
- News updates
- Scheduled daily messages
- User default location management integrated into weather command

## How to Use Default Location Feature
The weather command now supports setting and using a default location for each user:

1. **Setting a default location:**
   - Slash Command: `/weather setlocation:<city>` - Sets your default location to the specified city
   - Message Command: `!weather setlocation <city>` - Sets your default location to the specified city

2. **Using your default location:**
   - Simply use `/weather` or `!weather` without any parameters to get weather for your default location

3. **Getting weather for a specific city:**
   - Slash Command: `/weather city:<city>` - Gets weather for the specified city
   - Message Command: `!weather <city>` - Gets weather for the specified city

## API Integrations
- Discord API (via discord.js)
- OpenWeatherMap API (for weather data)
- NewsAPI (for news updates)

## Intents Required
- Guilds
- GuildMessages
- MessageContent

## Command Management Scripts
This project includes several scripts for managing Discord Slash Commands. Each script serves a specific purpose:

1. **`npm run commands:cleanup`** - cleanup-commands.js
   - Purpose: Cleans up duplicate Slash Commands by removing all global commands, keeping only guild-specific commands
   - When to use: When you notice duplicate commands appearing in Discord, to ensure commands only appear in specific servers

2. **`npm run commands:cleanup-complete`** - complete-cleanup.js
   - Purpose: Completely cleans up all commands (both global and guild-specific) and then re-registers guild-specific commands
   - When to use: When commands have serious issues or need a complete reset

3. **`npm run commands:register`** - register-guild-commands.js
   - Purpose: Registers only guild-specific Slash Commands, without creating global commands
   - When to use: Initial command setup or when you want to ensure commands only appear in specific servers

4. **`npm run commands:update-guild`** - update-guild-commands.js
   - Purpose: Updates guild-specific commands
   - When to use: After modifying command definitions and you need to update commands in a specific server

5. **`npm run commands:update-global`** - update-commands.js
   - Purpose: Updates global commands (applies to all servers)
   - When to use: After modifying command definitions and you need to update global commands

## MCP (Model Context Protocol)

This project supports the Model Context Protocol (MCP), which allows Claude to access external tools and resources. The following MCP servers are configured for this project:

### Filesystem MCP
- **Purpose**: Provides direct file system access for reading, writing, and editing files
- **Usage**: Use filesystem tools when you need to read or modify project files
- **Examples**: Reading configuration files, editing source code, creating new files

### Context7 MCP
- **Purpose**: Provides access to up-to-date documentation and code examples for libraries and frameworks
- **Usage**: Use context7 tools when you need to look up API documentation or code snippets
- **Examples**: Getting discord.js API documentation, finding usage examples for specific functions

### When to Use MCP
1. **For file operations**: Use filesystem MCP instead of bash commands for file reading/writing
2. **For documentation lookups**: Use context7 MCP when you need to understand library APIs or find code examples
3. **For efficient development**: MCP tools are generally faster and more reliable than web searches

### Best Practices
- Prefer MCP tools over bash commands when available
- Use filesystem MCP for all file operations (read, write, edit)
- Use context7 MCP for library documentation and code examples
- Only use bash commands for actual system operations (npm install, git commands, etc.)