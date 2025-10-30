# Discord 机器人 [English Version](README.md)

一个功能丰富的 Discord 机器人，为用户提供天气信息和新闻摘要。

## 功能特性

### 天气信息
- 获取全球城市的天气信息
- 支持中英文城市名称
- 提供详细信息包括温度、湿度和体感温度

### 新闻摘要
- 获取最新新闻头条
- 支持多个新闻类别（科技、商业、娱乐、体育、健康等）
- 自动翻译功能，以用户首选语言显示新闻

### 每日摘要
- 定时发送天气和新闻摘要
- 支持手动触发摘要命令

### 默认位置管理
- 为天气查询设置默认位置
- 通过简单命令获取默认位置的天气

## 安装和设置

### 前置要求
- Node.js 16.6.0 或更高版本
- Discord 机器人令牌
- OpenWeatherMap API 密钥
- NewsAPI 密钥

### 安装步骤

1. 克隆仓库：
   ```bash
   git clone https://github.com/shchnk1103/discord-bot.git
   cd discord-bot
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 配置环境变量：
   在项目根目录创建 `.env` 文件并添加以下内容：
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
- `!weather [城市]` - 获取指定城市的天气信息
- `!weather setlocation <城市>` - 设置默认位置
- `!news [类别]` - 获取指定类别的新闻
- `!summary` - 获取今日天气和新闻摘要

### 斜线命令
- `/weather [城市]` - 获取指定城市的天气信息
- `/weather setlocation:<城市>` - 设置默认位置
- `/news [类别]` - 获取指定类别的新闻
- `/summary` - 获取今日天气和新闻摘要

## 配置

### 环境变量
- `DISCORD_TOKEN` - 您的 Discord 机器人令牌
- `WEATHER_API_KEY` - 您的 OpenWeatherMap API 密钥
- `NEWS_API_KEY` - 您的 NewsAPI 密钥
- `CHANNEL_ID` - 用于定时消息的 Discord 频道 ID

### 命令管理
机器人包含几个用于管理 Discord 斜线命令的脚本：
- `npm run commands:cleanup` - 清理重复命令
- `npm run commands:cleanup-complete` - 完整命令清理和重新注册
- `npm run commands:register` - 注册服务器特定命令
- `npm run commands:update-guild` - 更新服务器特定命令
- `npm run commands:update-global` - 更新全局命令

## 项目结构

```
discord-bot/
├── index.js                 # 主入口点
├── .env                     # 环境变量
├── .gitignore               # Git 忽略文件
├── LICENSE                  # MIT 许可证
├── package.json             # 项目依赖和脚本
├── src/
│   ├── commands/           # 命令处理器
│   │   ├── weather.js      # 天气命令处理器
│   │   ├── news.js         # 新闻命令处理器
│   │   └── summary.js      # 摘要命令处理器
│   ├── config/             # 配置文件
│   │   └── commands.js     # 命令定义
│   ├── models/             # 数据模型
│   │   └── UserConfig.js   # 用户配置模型
│   ├── scripts/            # 命令管理脚本
│   │   ├── cleanup-commands.js
│   │   ├── complete-cleanup.js
│   │   ├── register-guild-commands.js
│   │   ├── update-commands.js
│   │   └── update-guild-commands.js
│   ├── utils/              # 工具函数
│   │   ├── api.js          # API 调用函数
│   │   ├── embeds.js       # 嵌入消息创建
│   │   ├── scheduler.js    # 定时任务处理
│   │   ├── translate.js    # 翻译功能
│   │   └── errorHandler.js # 错误处理函数
│   └── tests/              # 测试文件
│       ├── testRunner.js   # 测试运行器
│       └── *.test.js       # 单个测试文件
└── README.md               # 项目文档
```

## 开发

### 开发模式
```bash
npm run dev
```

### 测试
运行所有测试：
```bash
npm test
```

运行特定测试套件：
```bash
npm run test:weather
npm run test:news
npm run test:summary
npm run test:api
```

### 代码风格
- 使用 ESLint 进行代码检查
- 遵循 JavaScript Standard Style

## 贡献

欢迎贡献！请遵循以下步骤：

1. Fork 仓库
2. 为您的功能或错误修复创建新分支
3. 进行更改
4. 根据需要添加或更新测试
5. 确保所有测试通过
6. 使用清晰的提交消息提交更改
7. 推送到您的 Fork
8. 创建 Pull Request

### 报告问题
如果您遇到任何问题，请在 GitHub 上提交问题并包含：
- 问题的清晰描述
- 重现问题的步骤
- 任何相关的错误消息
- 您的环境信息

## 许可证

本项目采用 MIT 许可证 - 详情请见 [LICENSE](LICENSE) 文件。

## 支持

如果您有任何问题或需要设置帮助，请在 GitHub 上提交问题。