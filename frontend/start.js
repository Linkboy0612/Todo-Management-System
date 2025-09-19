/**
 * 前端启动脚本
 */
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 启动待办事项前端应用...\n');

// 检查是否安装了依赖
const fs = require('fs');
if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('📦 正在安装依赖包...');
  const install = spawn('npm', ['install'], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname
  });

  install.on('close', (code) => {
    if (code === 0) {
      startApp();
    } else {
      console.error('❌ 依赖安装失败');
      process.exit(1);
    }
  });
} else {
  startApp();
}

function startApp() {
  console.log('🌐 启动开发服务器...');
  console.log('📱 前端地址: http://localhost:3000');
  console.log('🔗 后端地址: http://localhost:8000');
  console.log('📚 API文档: http://localhost:8000/docs\n');
  console.log('⚠️  请确保后端服务已启动！');
  console.log('💡 如需启动后端，请在另一个终端运行：');
  console.log('   cd ../backend && python run_server.py\n');

  const start = spawn('npm', ['start'], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname,
    env: {
      ...process.env,
      BROWSER: 'none', // 禁止自动打开浏览器
      PORT: '3000'
    }
  });

  start.on('close', (code) => {
    console.log(`前端应用已停止，退出码: ${code}`);
  });

  // 处理Ctrl+C
  process.on('SIGINT', () => {
    console.log('\n🛑 正在停止前端服务...');
    start.kill('SIGINT');
  });
}
