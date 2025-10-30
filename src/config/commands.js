/**
 * 集中式的Slash Commands定义
 *
 * 这个文件包含了所有Slash Commands的定义，
 * 确保所有脚本使用一致的命令结构。
 */

const commands = [
  {
    name: 'weather',
    description: '获取天气信息',
    options: [
      {
        name: 'city',
        type: 3, // STRING
        description: '城市名称',
        required: false
      },
      {
        name: 'setlocation',
        type: 3, // STRING
        description: '设置默认位置（提供城市名称以设置默认位置）',
        required: false
      }
    ]
  },
  {
    name: 'news',
    description: '获取最新新闻',
    options: [
      {
        name: 'category',
        type: 3, // STRING
        description: '新闻分类',
        required: false,
        choices: [
          {
            name: '科技',
            value: 'technology'
          },
          {
            name: '商业',
            value: 'business'
          },
          {
            name: '娱乐',
            value: 'entertainment'
          },
          {
            name: '体育',
            value: 'sports'
          },
          {
            name: '健康',
            value: 'health'
          }
        ]
      }
    ]
  },
  {
    name: 'summary',
    description: '获取今日摘要信息（天气和新闻）'
  }
];

module.exports = commands;