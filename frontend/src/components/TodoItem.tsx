/**
 * TodoItem 组件 - 单个待办事项显示和操作
 */
import React, { useState } from 'react';
import { Todo } from '../types/todo';
import './TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onUpdate?: (id: number, title: string, description?: string) => Promise<void>;
  loading?: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onUpdate,
  loading = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');

  const handleToggle = async () => {
    try {
      await onToggle(todo.id, !todo.completed);
    } catch (error) {
      console.error('切换状态失败:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('确定要删除这个待办事项吗？')) {
      try {
        await onDelete(todo.id);
      } catch (error) {
        console.error('删除失败:', error);
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editTitle.trim()) {
      alert('标题不能为空');
      return;
    }

    if (onUpdate) {
      try {
        await onUpdate(
          todo.id, 
          editTitle.trim(), 
          editDescription.trim() || undefined
        );
        setIsEditing(false);
      } catch (error) {
        console.error('更新失败:', error);
      }
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${loading ? 'loading' : ''}`}>
      <div className="todo-content">
        {/* 完成状态复选框 */}
        <label className="custom-checkbox">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggle}
            disabled={loading || isEditing}
          />
          <span className="checkmark"></span>
        </label>

        {/* 内容区域 */}
        <div className="todo-text">
          {isEditing ? (
            <div className="edit-form">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="input edit-title"
                placeholder="标题"
                maxLength={255}
                autoFocus
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="input edit-description"
                placeholder="描述 (可选)"
                maxLength={1000}
                rows={2}
              />
            </div>
          ) : (
            <div className="display-content">
              <h3 className="todo-title">{todo.title}</h3>
              {todo.description && (
                <p className="todo-description">{todo.description}</p>
              )}
              <div className="todo-meta">
                <span className="todo-date">
                  创建于 {formatDate(todo.created_at)}
                </span>
                {todo.updated_at !== todo.created_at && (
                  <span className="todo-date">
                    更新于 {formatDate(todo.updated_at)}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="todo-actions">
        {isEditing ? (
          <div className="edit-actions">
            <button
              onClick={handleSave}
              className="btn btn-success btn-sm"
              disabled={loading || !editTitle.trim()}
            >
              ✓ 保存
            </button>
            <button
              onClick={handleCancel}
              className="btn btn-outline btn-sm"
              disabled={loading}
            >
              ✕ 取消
            </button>
          </div>
        ) : (
          <div className="display-actions">
            {!todo.completed && onUpdate && (
              <button
                onClick={handleEdit}
                className="btn btn-outline btn-sm"
                disabled={loading}
                title="编辑"
              >
                ✏️ 编辑
              </button>
            )}
            <button
              onClick={handleDelete}
              className="btn btn-danger btn-sm"
              disabled={loading}
              title="删除"
            >
              🗑️ 删除
            </button>
          </div>
        )}
      </div>

      {loading && (
        <div className="item-loading">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
