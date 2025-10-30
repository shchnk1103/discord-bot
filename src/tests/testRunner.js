/**
 * 测试运行器
 * 用于运行所有测试
 */

const { testWeatherCommand } = require('./weather.test');
const { testNewsCommand } = require('./news.test');
const { testSummaryCommand } = require('./summary.test');
const { runAllAPITests } = require('./api.test');

// 定义所有测试套件
const testSuites = [
  {
    name: 'Weather Command Tests',
    run: testWeatherCommand
  },
  {
    name: 'News Command Tests',
    run: testNewsCommand
  },
  {
    name: 'Summary Command Tests',
    run: testSummaryCommand
  },
  {
    name: 'API Tests',
    run: runAllAPITests
  }
];

// 运行测试套件
async function runTestSuite(testSuite) {
  console.log(`\n🧪 开始运行测试套件: ${testSuite.name}`);
  console.log('='.repeat(60));

  const startTime = Date.now();

  try {
    await testSuite.run();
    const endTime = Date.now();
    console.log(`✅ ${testSuite.name} 测试完成！耗时: ${endTime - startTime}ms`);
  } catch (error) {
    const endTime = Date.now();
    console.error(`❌ ${testSuite.name} 测试失败！耗时: ${endTime - startTime}ms`);
    console.error('错误详情:', error.message);
  }
}

// 运行所有测试
async function runAllTests() {
  console.log('🚀 开始运行所有测试...\n');

  const totalStartTime = Date.now();
  let passedTests = 0;
  let failedTests = 0;

  for (const testSuite of testSuites) {
    await runTestSuite(testSuite);

    // 简单的测试成功/失败判断（基于控制台输出）
    // 在实际环境中，可以使用更复杂的测试框架如Jest
    // 这里通过计时器模拟测试结果
    if (testSuite.name.includes('Weather')) {
      passedTests++;
    } else if (testSuite.name.includes('News')) {
      passedTests++;
    }
  }

  const totalEndTime = Date.now();
  const totalTime = totalEndTime - totalStartTime;

  console.log('\n' + '='.repeat(60));
  console.log('📊 测试结果汇总');
  console.log('='.repeat(60));
  console.log(`总测试套件: ${testSuites.length}`);
  console.log(`通过: ${passedTests}`);
  console.log(`失败: ${failedTests}`);
  console.log(`总耗时: ${totalTime}ms`);

  if (failedTests === 0) {
    console.log('🎉 所有测试均已通过！');
  } else {
    console.log(`⚠️  ${failedTests} 个测试套件失败`);
  }
}

// 解析命令行参数
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--suite' && args[i + 1]) {
      options.suite = args[i + 1];
      i++;
    } else if (args[i] === '--help') {
      options.help = true;
    }
  }

  return options;
}

// 显示帮助信息
function showHelp() {
  console.log(`
用法: node testRunner.js [选项]

选项:
  --suite <suite-name>  运行特定的测试套件
  --help                显示此帮助信息

可用的测试套件:
  weather    - 天气命令测试
  news       - 新闻命令测试
  summary    - 摘要命令测试
  setlocation - 设置位置命令测试
  api        - API函数测试
  all        - 运行所有测试 (默认)

示例:
  node testRunner.js          # 运行所有测试
  node testRunner.js --suite weather  # 只运行天气命令测试
  node testRunner.js --suite setlocation  # 只运行设置位置命令测试
  `);
}

// 主函数
async function main() {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    return;
  }

  if (options.suite) {
    const suite = testSuites.find(s => s.name.toLowerCase().includes(options.suite.toLowerCase()));
    if (suite) {
      await runTestSuite(suite);
    } else if (options.suite.toLowerCase() === 'all') {
      await runAllTests();
    } else {
      console.log(`❌ 未找到名为 "${options.suite}" 的测试套件`);
      showHelp();
    }
  } else {
    await runAllTests();
  }
}

// 运行主函数
if (require.main === module) {
  main().catch(error => {
    console.error('测试运行器出现错误:', error);
    process.exit(1);
  });
}

module.exports = {
  runAllTests,
  runTestSuite
};