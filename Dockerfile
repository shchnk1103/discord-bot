# 使用官方Node.js运行时作为基础镜像
# 使用alpine版本以减小镜像大小
FROM node:18-alpine

# 设置工作目录
WORKDIR /usr/src/app

# 复制package.json和package-lock.json（如果存在）
COPY package*.json ./

# 安装生产依赖
# 使用--only=production标志确保只安装生产依赖
# 使用--prefer-offline标志优先使用本地缓存
RUN npm ci --only=production && npm cache clean --force

# 复制应用源代码
COPY . .

# 创建一个非root用户来运行应用
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# 创建目录用于存储用户配置
RUN mkdir -p /var/data
RUN chown -R nextjs:nodejs /var/data

# 设置用户配置文件的权限
RUN chown nextjs:nodejs userConfigs.json || touch userConfigs.json && chown nextjs:nodejs userConfigs.json

# 更改工作目录的所有者
RUN chown -R nextjs:nodejs /usr/src/app

# 切换到非root用户
USER nextjs

# 应用程序端口（虽然Discord机器人不需要公开端口，但为了完整性而声明）
EXPOSE 3000

# 定义环境变量
# 注意：这些环境变量需要在运行容器时提供
# ENV DISCORD_TOKEN=""
# ENV WEATHER_API_KEY=""
# ENV NEWS_API_KEY=""
# ENV CHANNEL_ID=""

# 启动应用
CMD ["npm", "start"]