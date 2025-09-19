/**
 * API连接测试脚本
 * 用于验证前端是否能够正常连接后端API
 */
const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000/api/v1';

async function testAPIConnection() {
  console.log('🔍 开始API连接测试...\n');

  const tests = [
    {
      name: '健康检查',
      method: 'GET',
      url: 'http://localhost:8000/health',
      expected: 200
    },
    {
      name: '获取待办事项列表',
      method: 'GET',
      url: `${API_BASE_URL}/todos`,
      expected: 200
    },
    {
      name: '创建待办事项',
      method: 'POST',
      url: `${API_BASE_URL}/todos`,
      data: {
        title: '测试待办事项',
        description: '这是一个API测试事项'
      },
      expected: 200
    }
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    try {
      console.log(`🧪 测试: ${test.name}`);
      
      const config = {
        method: test.method,
        url: test.url,
        timeout: 5000
      };

      if (test.data) {
        config.data = test.data;
        config.headers = {
          'Content-Type': 'application/json'
        };
      }

      const response = await axios(config);
      
      if (response.status === test.expected) {
        console.log(`   ✅ 成功 - 状态码: ${response.status}`);
        if (test.name === '创建待办事项') {
          console.log(`   📝 创建的待办事项ID: ${response.data.data?.id}`);
        }
        passedTests++;
      } else {
        console.log(`   ❌ 失败 - 期望: ${test.expected}, 实际: ${response.status}`);
      }
    } catch (error) {
      console.log(`   ❌ 失败 - 错误: ${error.message}`);
      if (error.code === 'ECONNREFUSED') {
        console.log(`   💡 提示: 请确保后端服务已启动 (http://localhost:8000)`);
      }
    }
    console.log('');
  }

  console.log('📊 测试结果总结:');
  console.log(`   通过: ${passedTests}/${totalTests} 个测试`);
  
  if (passedTests === totalTests) {
    console.log('   🎉 所有API测试通过！前端可以正常连接后端');
    return true;
  } else {
    console.log('   ⚠️  部分测试失败，请检查后端服务状态');
    return false;
  }
}

// 检查CORS设置
async function testCORS() {
  console.log('\n🌐 测试CORS配置...');
  
  try {
    const response = await axios.options(`${API_BASE_URL}/todos`, {
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log('   ✅ CORS预检请求成功');
    console.log(`   🔧 允许的方法: ${response.headers['access-control-allow-methods'] || '未设置'}`);
    console.log(`   🔧 允许的来源: ${response.headers['access-control-allow-origin'] || '未设置'}`);
  } catch (error) {
    console.log('   ⚠️  CORS预检请求失败，但这可能是正常的');
  }
}

// 主函数
async function main() {
  console.log('🚀 前后端API连接测试');
  console.log('='.repeat(50));
  
  const apiResult = await testAPIConnection();
  await testCORS();
  
  console.log('\n' + '='.repeat(50));
  if (apiResult) {
    console.log('✅ 测试完成 - 可以启动前端应用');
    console.log('💡 运行 "npm start" 启动前端服务');
  } else {
    console.log('❌ 测试失败 - 请先修复API连接问题');
    console.log('💡 请确保后端服务正在运行');
  }
}

// 安装axios依赖
async function installAxios() {
  const { spawn } = require('child_process');
  
  return new Promise((resolve) => {
    console.log('📦 安装axios依赖...');
    const install = spawn('npm', ['install', 'axios'], {
      stdio: 'inherit',
      shell: true
    });
    
    install.on('close', (code) => {
      if (code === 0) {
        console.log('✅ axios安装成功\n');
        resolve(true);
      } else {
        console.log('❌ axios安装失败\n');
        resolve(false);
      }
    });
  });
}

// 检查axios是否已安装
async function checkAndInstallAxios() {
  try {
    require.resolve('axios');
    return true;
  } catch (e) {
    return await installAxios();
  }
}

// 启动测试
checkAndInstallAxios().then((hasAxios) => {
  if (hasAxios) {
    main();
  } else {
    console.log('❌ 无法安装axios，请手动安装后重试');
  }
});
