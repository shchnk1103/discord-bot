# Discord Bot

一个功能丰富的Discord机器人，提供天气信息和新闻摘要服务。

## 功能特性

### 天气信息
- 获取全球城市天气信息
- 支持中英文城市名
- 提供温度、湿度、体感温度等详细信息

### 新闻摘要
- 获取最新新闻头条
- 支持多种新闻分类（科技、商业、娱乐、体育、健康等）
- 自动翻译功能，根据用户语言偏好显示相应语言的新闻

### 每日摘要
- 定时发送天气和新闻摘要
- 支持手动触发摘要命令

## 安装与设置

### 环境要求
- Node.js 16.6.0 或更高版本
- Discord Bot Token
- OpenWeatherMap API Key
- NewsAPI Key

### 安装步骤

1. 克隆项目仓库：
   ```bash
   git clone <repository-url>
   cd discord-bot
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 配置环境变量：
   创建 `.env` 文件并添加以下内容：
   ```env
   DISCORD_TOKEN=your_discord_bot_token
   WEATHER_API_KEY=your_openweathermap_api_key
   NEWS_API_KEY=your_newsapi_key
   CHANNEL_ID=your_discord_channel_id
   ```

4. 启动机器人：
   ```bash
   npm start
   ```

## 使用方法

### 消息命令
- `!weather [城市名]` - 获取指定城市的天气信息
- `!news [分类]` - 获取指定分类的新闻
- `!summary` - 获取今日天气和新闻摘要

### Slash Commands
- `/weather [城市名]` - 获取指定城市的天气信息
- `/news [分类]` - 获取指定分类的新闻
- `/summary` - 获取今日天气和新闻摘要

## 项目结构

```
discord-bot/
├── index.js                 # 主入口文件
├── .env                     # 环境变量配置
├── .gitignore               # Git忽略文件
├── package.json             # 项目依赖和脚本
├── src/
│   ├── commands/           # 命令处理函数
│   │   ├── weather.js      # 天气命令处理
│   │   ├── news.js         # 新闻命令处理
│   │   └── summary.js      # 摘要命令处理
│   ├── utils/              # 工具函数
│   │   ├── api.js          # API调用函数
│   │   ├── embeds.js       # 嵌入消息创建函数
│   │   ├── scheduler.js    # 定时任务处理
│   │   ├── translate.js    # 翻译功能
│   │   └── errorHandler.js # 错误处理函数
│   └── tests/              # 测试文件
└── README.md               # 项目说明文档
```

## 开发

### 开发模式
```bash
npm run dev
```

### 代码规范
- 使用ESLint进行代码检查
- 遵循JavaScript Standard Style

## 贡献

欢迎提交Issue和Pull Request来改进这个项目。

## 许可证

MIT