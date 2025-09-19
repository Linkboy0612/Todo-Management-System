/**
 * TodoForm 组件 - 添加新待办事项的表单
 */
import React, { useState } from 'react';
import { TodoCreate } from '../types/todo';
import './TodoForm.css';

interface TodoFormProps {
  onSubmit: (todo: TodoCreate) => Promise<void>;
  loading?: boolean;
}

const TodoForm: React.FC<TodoFormProps> = ({ onSubmit, loading = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('请输入待办事项标题');
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
      });
      
      // 清空表单
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('提交失败:', error);
    }
  };

  return (
    <div className="todo-form-container">
      <form onSubmit={handleSubmit} className="todo-form">
        <div className="form-group">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入新的待办事项..."
            className="input todo-input"
            disabled={loading}
            maxLength={255}
          />
        </div>
        
        <div className="form-group">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="详细描述 (可选)"
            className="input todo-textarea"
            disabled={loading}
            maxLength={1000}
            rows={3}
          />
        </div>
        
        <button
          type="submit"
          className="btn btn-primary btn-lg add-btn"
          disabled={loading || !title.trim()}
        >
          {loading ? (
            <>
              <div className="spinner" />
              添加中...
            </>
          ) : (
            <>
              <span>➕</span>
              添加待办事项
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TodoForm;
