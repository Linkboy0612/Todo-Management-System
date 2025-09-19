/**
 * API接口服务层
 * 与后端FastAPI服务进行通信
 */
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  Todo, 
  TodoCreate, 
  TodoUpdate, 
  TodosResponse, 
  TodoResponse,
  BatchDeleteResponse
} from '../types/todo';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:8000/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 请求拦截器
    this.api.interceptors.request.use(
      (config) => {
        console.log('API Request:', config.method?.toUpperCase(), config.url);
        return config;
      },
      (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.api.interceptors.response.use(
      (response) => {
        console.log('API Response:', response.status, response.data);
        return response;
      },
      (error) => {
        console.error('Response Error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
      }
    );
  }

  /**
   * 获取所有待办事项
   */
  async getTodos(completed?: boolean): Promise<Todo[]> {
    try {
      const params = completed !== undefined ? { completed } : {};
      const response: AxiosResponse<TodosResponse> = await this.api.get('/todos', { params });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw new Error('获取待办事项失败');
    }
  }

  /**
   * 获取单个待办事项
   */
  async getTodo(id: number): Promise<Todo> {
    try {
      const response: AxiosResponse<Todo> = await this.api.get(`/todos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching todo:', error);
      throw new Error('获取待办事项详情失败');
    }
  }

  /**
   * 创建新的待办事项
   */
  async createTodo(todoData: TodoCreate): Promise<Todo> {
    try {
      const response: AxiosResponse<TodoResponse> = await this.api.post('/todos', todoData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw new Error('创建待办事项失败');
    }
  }

  /**
   * 更新待办事项
   */
  async updateTodo(id: number, todoData: TodoUpdate): Promise<Todo> {
    try {
      const response: AxiosResponse<TodoResponse> = await this.api.put(`/todos/${id}`, todoData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw new Error('更新待办事项失败');
    }
  }

  /**
   * 删除单个待办事项
   */
  async deleteTodo(id: number): Promise<void> {
    try {
      await this.api.delete(`/todos/${id}`);
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw new Error('删除待办事项失败');
    }
  }

  /**
   * 批量删除已完成的待办事项
   */
  async deleteCompletedTodos(): Promise<number> {
    try {
      const response: AxiosResponse<BatchDeleteResponse> = await this.api.delete('/todos/completed');
      return response.data.data.deleted_count;
    } catch (error) {
      console.error('Error deleting completed todos:', error);
      throw new Error('删除已完成事项失败');
    }
  }

  /**
   * 删除所有待办事项
   */
  async deleteAllTodos(): Promise<number> {
    try {
      const response: AxiosResponse<BatchDeleteResponse> = await this.api.delete('/todos/all');
      return response.data.data.deleted_count;
    } catch (error) {
      console.error('Error deleting all todos:', error);
      throw new Error('清空所有事项失败');
    }
  }

  /**
   * 切换待办事项完成状态
   */
  async toggleTodo(id: number, completed: boolean): Promise<Todo> {
    return this.updateTodo(id, { completed });
  }
}

// 导出单例实例
export const apiService = new ApiService();
export default apiService;
