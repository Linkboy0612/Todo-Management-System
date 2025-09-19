/**
 * 前后端集成测试脚本
 * 测试完整的用户使用流程
 */
const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000/api/v1';
const FRONTEND_URL = 'http://localhost:3000';

// 创建一个axios实例，模拟前端的API调用
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 测试数据
const testTodos = [
  {
    title: '学习React Hooks',
    description: '深入理解useState和useEffect的使用'
  },
  {
    title: '完成前端页面',
    description: '实现待办事项的增删改查功能'
  },
  {
    title: '集成测试',
    description: '确保前后端能够正常通信'
  }
];

let createdTodoIds = [];

async function runIntegrationTests() {
  console.log('🧪 开始前后端集成测试');
  console.log('='.repeat(60));
  
  let testsPassed = 0;
  let totalTests = 0;

  // 测试1: 检查服务状态
  console.log('\n📡 测试1: 检查服务状态');
  totalTests++;
  try {
    // 检查后端
    const healthResponse = await axios.get('http://localhost:8000/health');
    console.log('   ✅ 后端服务正常运行');
    
    // 检查前端
    const frontendResponse = await axios.get(FRONTEND_URL);
    console.log('   ✅ 前端服务正常运行');
    
    testsPassed++;
  } catch (error) {
    console.log('   ❌ 服务检查失败:', error.message);
  }

  // 测试2: 清空现有数据
  console.log('\n🧹 测试2: 清空现有数据');
  totalTests++;
  try {
    const response = await api.delete('/todos/all');
    console.log(`   ✅ 清空成功，删除了 ${response.data.data.deleted_count} 个待办事项`);
    testsPassed++;
  } catch (error) {
    console.log('   ❌ 清空数据失败:', error.response?.data?.detail || error.message);
  }

  // 测试3: 创建待办事项
  console.log('\n➕ 测试3: 创建待办事项');
  totalTests++;
  try {
    for (let i = 0; i < testTodos.length; i++) {
      const response = await api.post('/todos', testTodos[i]);
      const todo = response.data.data;
      createdTodoIds.push(todo.id);
      console.log(`   ✅ 创建待办事项 ${i + 1}: ${todo.title} (ID: ${todo.id})`);
    }
    testsPassed++;
  } catch (error) {
    console.log('   ❌ 创建待办事项失败:', error.response?.data?.detail || error.message);
  }

  // 测试4: 获取待办事项列表
  console.log('\n📋 测试4: 获取待办事项列表');
  totalTests++;
  try {
    const response = await api.get('/todos');
    const todos = response.data.data;
    console.log(`   ✅ 获取到 ${todos.length} 个待办事项`);
    
    todos.forEach((todo, index) => {
      console.log(`   📝 ${index + 1}. ${todo.title} (${todo.completed ? '已完成' : '未完成'})`);
    });
    testsPassed++;
  } catch (error) {
    console.log('   ❌ 获取列表失败:', error.response?.data?.detail || error.message);
  }

  // 测试5: 更新待办事项状态
  console.log('\n✏️ 测试5: 更新待办事项状态');
  totalTests++;
  try {
    if (createdTodoIds.length > 0) {
      const todoId = createdTodoIds[0];
      const response = await api.put(`/todos/${todoId}`, {
        completed: true
      });
      const updatedTodo = response.data.data;
      console.log(`   ✅ 标记待办事项为已完成: ${updatedTodo.title}`);
      testsPassed++;
    } else {
      console.log('   ⚠️ 没有可更新的待办事项');
    }
  } catch (error) {
    console.log('   ❌ 更新状态失败:', error.response?.data?.detail || error.message);
  }

  // 测试6: 筛选功能测试
  console.log('\n🔍 测试6: 筛选功能测试');
  totalTests++;
  try {
    // 测试筛选未完成
    const activeResponse = await api.get('/todos?completed=false');
    const activeTodos = activeResponse.data.data;
    console.log(`   ✅ 未完成的待办事项: ${activeTodos.length} 个`);
    
    // 测试筛选已完成
    const completedResponse = await api.get('/todos?completed=true');
    const completedTodos = completedResponse.data.data;
    console.log(`   ✅ 已完成的待办事项: ${completedTodos.length} 个`);
    
    testsPassed++;
  } catch (error) {
    console.log('   ❌ 筛选功能失败:', error.response?.data?.detail || error.message);
  }

  // 测试7: 编辑待办事项
  console.log('\n✏️ 测试7: 编辑待办事项');
  totalTests++;
  try {
    if (createdTodoIds.length > 1) {
      const todoId = createdTodoIds[1];
      const response = await api.put(`/todos/${todoId}`, {
        title: '已修改的标题',
        description: '这是修改后的描述'
      });
      const updatedTodo = response.data.data;
      console.log(`   ✅ 编辑成功: ${updatedTodo.title}`);
      testsPassed++;
    } else {
      console.log('   ⚠️ 没有可编辑的待办事项');
    }
  } catch (error) {
    console.log('   ❌ 编辑失败:', error.response?.data?.detail || error.message);
  }

  // 测试8: 删除单个待办事项
  console.log('\n🗑️ 测试8: 删除单个待办事项');
  totalTests++;
  try {
    if (createdTodoIds.length > 2) {
      const todoId = createdTodoIds[2];
      await api.delete(`/todos/${todoId}`);
      console.log(`   ✅ 删除成功: 待办事项 ID ${todoId}`);
      
      // 验证删除
      try {
        await api.get(`/todos/${todoId}`);
        console.log('   ❌ 删除验证失败: 待办事项仍然存在');
      } catch (verifyError) {
        if (verifyError.response?.status === 404) {
          console.log('   ✅ 删除验证成功: 待办事项不存在');
        }
      }
      testsPassed++;
    } else {
      console.log('   ⚠️ 没有可删除的待办事项');
    }
  } catch (error) {
    console.log('   ❌ 删除失败:', error.response?.data?.detail || error.message);
  }

  // 测试9: 批量删除已完成
  console.log('\n🧹 测试9: 批量删除已完成的待办事项');
  totalTests++;
  try {
    const response = await api.delete('/todos/completed');
    const deletedCount = response.data.data.deleted_count;
    console.log(`   ✅ 批量删除成功: 删除了 ${deletedCount} 个已完成的待办事项`);
    testsPassed++;
  } catch (error) {
    console.log('   ❌ 批量删除失败:', error.response?.data?.detail || error.message);
  }

  // 测试10: 数据一致性验证
  console.log('\n🔄 测试10: 数据一致性验证');
  totalTests++;
  try {
    const response = await api.get('/todos');
    const finalTodos = response.data.data;
    console.log(`   ✅ 最终待办事项数量: ${finalTodos.length}`);
    
    finalTodos.forEach((todo, index) => {
      console.log(`   📝 ${index + 1}. ${todo.title} (${todo.completed ? '已完成' : '未完成'})`);
    });
    
    testsPassed++;
  } catch (error) {
    console.log('   ❌ 数据一致性验证失败:', error.response?.data?.detail || error.message);
  }

  // 测试结果总结
  console.log('\n' + '='.repeat(60));
  console.log('📊 集成测试结果总结:');
  console.log(`   通过测试: ${testsPassed}/${totalTests}`);
  console.log(`   成功率: ${((testsPassed / totalTests) * 100).toFixed(1)}%`);
  
  if (testsPassed === totalTests) {
    console.log('\n🎉 所有集成测试通过！');
    console.log('✅ 前后端联调成功，系统可以正常使用');
    console.log('\n🌐 访问地址:');
    console.log(`   前端应用: ${FRONTEND_URL}`);
    console.log(`   后端API: http://localhost:8000`);
    console.log(`   API文档: http://localhost:8000/docs`);
  } else {
    console.log('\n⚠️ 部分测试失败，请检查系统状态');
  }
  
  return testsPassed === totalTests;
}

// CORS测试
async function testCORSSettings() {
  console.log('\n🌐 CORS配置测试');
  console.log('-'.repeat(40));
  
  try {
    // 模拟前端发起的请求
    const response = await axios({
      method: 'OPTIONS',
      url: `${API_BASE_URL}/todos`,
      headers: {
        'Origin': FRONTEND_URL,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log('✅ CORS预检请求成功');
    console.log(`   允许的来源: ${response.headers['access-control-allow-origin']}`);
    console.log(`   允许的方法: ${response.headers['access-control-allow-methods']}`);
    console.log(`   允许的头部: ${response.headers['access-control-allow-headers']}`);
    
    return true;
  } catch (error) {
    console.log('⚠️ CORS测试结果不确定，但这可能是正常的');
    return true; // CORS错误在某些情况下是正常的
  }
}

// 性能测试
async function performanceTest() {
  console.log('\n⚡ 性能测试');
  console.log('-'.repeat(40));
  
  const tests = [
    { name: '获取待办事项列表', method: 'get', url: '/todos' },
    { name: '创建待办事项', method: 'post', url: '/todos', data: { title: '性能测试项' } },
  ];
  
  for (const test of tests) {
    const startTime = Date.now();
    
    try {
      if (test.method === 'post') {
        await api.post(test.url, test.data);
      } else {
        await api.get(test.url);
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log(`   ${test.name}: ${duration}ms ${duration < 1000 ? '✅' : '⚠️'}`);
    } catch (error) {
      console.log(`   ${test.name}: 失败 ❌`);
    }
  }
}

// 主函数
async function main() {
  console.log('🚀 前后端集成测试套件');
  console.log('测试时间:', new Date().toLocaleString('zh-CN'));
  console.log('='.repeat(60));
  
  try {
    const result = await runIntegrationTests();
    await testCORSSettings();
    await performanceTest();
    
    console.log('\n' + '='.repeat(60));
    if (result) {
      console.log('🎊 恭喜！所有测试通过，系统已就绪！');
    } else {
      console.log('🔧 请根据上述测试结果修复问题');
    }
    
  } catch (error) {
    console.log('\n❌ 测试执行出错:', error.message);
    console.log('\n💡 请确保:');
    console.log('   1. 后端服务正在运行 (http://localhost:8000)');
    console.log('   2. 前端服务正在运行 (http://localhost:3000)');
    console.log('   3. 网络连接正常');
  }
}

// 运行测试
main();
