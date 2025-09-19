/**
 * 主应用组件 - 待办事项管理系统
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Todo, TodoCreate, FilterType } from './types/todo';
import { apiService } from './services/api';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import FilterBar from './components/FilterBar';
import './styles/globals.css';
import './App.css';

const App: React.FC = () => {
  // 状态管理
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 显示错误消息
  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  // 加载待办事项
  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const todosData = await apiService.getTodos();
      setTodos(todosData);
    } catch (err) {
      showError('加载待办事项失败，请检查网络连接');
      console.error('加载失败:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 组件挂载时加载数据
  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  // 添加新待办事项
  const handleAddTodo = async (todoData: TodoCreate) => {
    try {
      setLoading(true);
      const newTodo = await apiService.createTodo(todoData);
      setTodos(prevTodos => [newTodo, ...prevTodos]);
    } catch (err) {
      showError('添加待办事项失败');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 切换待办事项完成状态
  const handleToggleTodo = async (id: number, completed: boolean) => {
    try {
      setLoading(true);
      const updatedTodo = await apiService.toggleTodo(id, completed);
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? updatedTodo : todo
        )
      );
    } catch (err) {
      showError('更新待办事项状态失败');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 更新待办事项
  const handleUpdateTodo = async (id: number, title: string, description?: string) => {
    try {
      setLoading(true);
      const updatedTodo = await apiService.updateTodo(id, { title, description });
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? updatedTodo : todo
        )
      );
    } catch (err) {
      showError('更新待办事项失败');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 删除单个待办事项
  const handleDeleteTodo = async (id: number) => {
    try {
      setLoading(true);
      await apiService.deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (err) {
      showError('删除待办事项失败');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 批量删除已完成的待办事项
  const handleClearCompleted = async () => {
    try {
      setLoading(true);
      const deletedCount = await apiService.deleteCompletedTodos();
      setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
      
      if (deletedCount > 0) {
        // 显示成功消息
        setError(`成功删除 ${deletedCount} 个已完成的待办事项`);
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      showError('清除已完成事项失败');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 清空所有待办事项
  const handleClearAll = async () => {
    try {
      setLoading(true);
      const deletedCount = await apiService.deleteAllTodos();
      setTodos([]);
      
      if (deletedCount > 0) {
        // 显示成功消息
        setError(`成功删除所有 ${deletedCount} 个待办事项`);
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      showError('清空所有事项失败');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 统计数据
  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="app">
      <div className="container">
        {/* 应用标题 */}
        <header className="app-header">
          <h1 className="app-title">
            <span className="title-icon">✨</span>
            待办事项管理系统
            <span className="title-subtitle">让生活更有条理</span>
          </h1>
          {totalCount > 0 && (
            <div className="header-stats">
              <span className="stat">
                总计 <strong>{totalCount}</strong> 项
              </span>
              {completedCount > 0 && (
                <span className="stat">
                  已完成 <strong>{completedCount}</strong> 项
                </span>
              )}
            </div>
          )}
        </header>

        {/* 错误提示 */}
        {error && (
          <div className={`error ${error.includes('成功') ? 'success' : ''}`}>
            {error}
          </div>
        )}

        {/* 添加待办事项表单 */}
        <TodoForm onSubmit={handleAddTodo} loading={loading} />

        {/* 筛选和操作栏 */}
        <FilterBar
          currentFilter={filter}
          onFilterChange={setFilter}
          onClearCompleted={handleClearCompleted}
          onClearAll={handleClearAll}
          completedCount={completedCount}
          totalCount={totalCount}
          loading={loading}
        />

        {/* 待办事项列表 */}
        <TodoList
          todos={todos}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
          onUpdate={handleUpdateTodo}
          loading={loading}
          filter={filter}
        />

        {/* 页脚 */}
        <footer className="app-footer">
          <p>
            <span>💡</span>
            提示：点击编辑按钮修改待办事项，点击复选框标记完成状态
          </p>
          <div className="footer-links">
            <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer">
              API 文档
            </a>
            <span className="divider">|</span>
            <a href="http://localhost:8000/health" target="_blank" rel="noopener noreferrer">
              服务状态
            </a>
          </div>
        </footer>
      </div>

      {/* 全局加载指示器 */}
      {loading && (
        <div className="global-loading">
          <div className="loading-backdrop" />
          <div className="loading-content">
            <div className="spinner large"></div>
            <span>处理中...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
