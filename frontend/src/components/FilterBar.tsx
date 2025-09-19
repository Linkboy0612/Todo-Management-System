/**
 * FilterBar 组件 - 筛选条件和批量操作栏
 */
import React from 'react';
import { FilterType } from '../types/todo';
import './FilterBar.css';

interface FilterBarProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onClearCompleted: () => Promise<void>;
  onClearAll: () => Promise<void>;
  completedCount: number;
  totalCount: number;
  loading?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({
  currentFilter,
  onFilterChange,
  onClearCompleted,
  onClearAll,
  completedCount,
  totalCount,
  loading = false
}) => {
  const handleClearCompleted = async () => {
    if (completedCount === 0) return;
    
    if (window.confirm(`确定要删除 ${completedCount} 个已完成的待办事项吗？`)) {
      try {
        await onClearCompleted();
      } catch (error) {
        console.error('清除已完成事项失败:', error);
      }
    }
  };

  const handleClearAll = async () => {
    if (totalCount === 0) return;
    
    if (window.confirm(`确定要删除所有 ${totalCount} 个待办事项吗？此操作不可恢复！`)) {
      try {
        await onClearAll();
      } catch (error) {
        console.error('清空所有事项失败:', error);
      }
    }
  };

  const activeCount = totalCount - completedCount;

  return (
    <div className="filter-bar">
      {/* 筛选按钮组 */}
      <div className="filter-section">
        <h3 className="filter-label">查看</h3>
        <div className="filter-group">
          <button
            className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
            onClick={() => onFilterChange('all')}
            disabled={loading}
          >
            <span className="filter-icon">📋</span>
            全部
            <span className="filter-count">{totalCount}</span>
          </button>
          
          <button
            className={`filter-btn ${currentFilter === 'active' ? 'active' : ''}`}
            onClick={() => onFilterChange('active')}
            disabled={loading}
          >
            <span className="filter-icon">⏳</span>
            未完成
            <span className="filter-count">{activeCount}</span>
          </button>
          
          <button
            className={`filter-btn ${currentFilter === 'completed' ? 'active' : ''}`}
            onClick={() => onFilterChange('completed')}
            disabled={loading}
          >
            <span className="filter-icon">✅</span>
            已完成
            <span className="filter-count">{completedCount}</span>
          </button>
        </div>
      </div>

      {/* 批量操作区域 */}
      <div className="actions-section">
        <h3 className="actions-label">操作</h3>
        <div className="actions-group">
          <button
            className="btn btn-outline action-btn"
            onClick={handleClearCompleted}
            disabled={loading || completedCount === 0}
            title={`删除 ${completedCount} 个已完成的待办事项`}
          >
            {loading ? (
              <div className="spinner" />
            ) : (
              <span className="action-icon">🗑️</span>
            )}
            清除已完成
            {completedCount > 0 && (
              <span className="action-count">({completedCount})</span>
            )}
          </button>
          
          <button
            className="btn btn-danger action-btn"
            onClick={handleClearAll}
            disabled={loading || totalCount === 0}
            title={`删除所有 ${totalCount} 个待办事项`}
          >
            {loading ? (
              <div className="spinner" />
            ) : (
              <span className="action-icon">🧹</span>
            )}
            清空全部
            {totalCount > 0 && (
              <span className="action-count">({totalCount})</span>
            )}
          </button>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="stats-section">
        <div className="progress-info">
          <span className="progress-text">
            进度: {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
          </span>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
