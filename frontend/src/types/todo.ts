/**
 * 待办事项相关的TypeScript类型定义
 */

export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TodoCreate {
  title: string;
  description?: string;
}

export interface TodoUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data?: T;
}

export interface TodosResponse extends ApiResponse<Todo[]> {
  data: Todo[];
}

export interface TodoResponse extends ApiResponse<Todo> {
  data: Todo;
}

export interface BatchDeleteResponse extends ApiResponse<{ deleted_count: number }> {
  data: { deleted_count: number };
}

export type FilterType = 'all' | 'active' | 'completed';

export interface AppState {
  todos: Todo[];
  filter: FilterType;
  loading: boolean;
  error: string | null;
}
