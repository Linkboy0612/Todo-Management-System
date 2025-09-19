/**
 * TodoList 组件 - 待办事项列表显示
 */
import React from 'react';
import { Todo } from '../types/todo';
import TodoItem from './TodoItem';
import './TodoList.css';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onUpdate?: (id: number, title: string, description?: string) => Promise<void>;
  loading?: boolean;
  filter?: 'all' | 'active' | 'completed';
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggle,
  onDelete,
  onUpdate,
  loading = false,
  filter = 'all'
}) => {
  // 根据筛选条件过滤待办事项
  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  // 按创建时间排序，未完成的在前
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    // 未完成的在前
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    // 同样状态下，按创建时间倒序
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const getFilterTitle = () => {
    switch (filter) {
      case 'active':
        return '未完成的待办事项';
      case 'completed':
        return '已完成的待办事项';
      default:
        return '所有待办事项';
    }
  };

  const getEmptyMessage = () => {
    switch (filter) {
      case 'active':
        return '太棒了！您已经完成了所有待办事项 🎉';
      case 'completed':
        return '还没有完成的待办事项';
      default:
        return '还没有待办事项，快来添加第一个吧！';
    }
  };

  if (loading && todos.length === 0) {
    return (
      <div className="todo-list-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="todo-list-container">
      <div className="list-header">
        <h2 className="list-title">{getFilterTitle()}</h2>
        <div className="list-stats">
          <span className="total-count">
            共 {filteredTodos.length} 项
          </span>
          {filter === 'all' && (
            <>
              <span className="stat-divider">|</span>
              <span className="completed-count">
                已完成 {todos.filter(todo => todo.completed).length} 项
              </span>
            </>
          )}
        </div>
      </div>

      {sortedTodos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            {filter === 'active' ? '✅' : filter === 'completed' ? '📝' : '📋'}
          </div>
          <h3>{getEmptyMessage()}</h3>
          {filter === 'all' && (
            <p>点击上方的添加按钮来创建您的第一个待办事项</p>
          )}
        </div>
      ) : (
        <div className="todo-list">
          {sortedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
              onUpdate={onUpdate}
              loading={loading}
            />
          ))}
        </div>
      )}

      {loading && sortedTodos.length > 0 && (
        <div className="list-loading">
          <div className="spinner"></div>
          <span>更新中...</span>
        </div>
      )}
    </div>
  );
};

export default TodoList;
