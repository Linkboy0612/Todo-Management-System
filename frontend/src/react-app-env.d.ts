/// <reference types="react-scripts" />

// 扩展全局类型
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PUBLIC_URL: string;
    readonly REACT_APP_API_URL?: string;
  }
}

// 扩展Window接口
declare global {
  interface Window {
    __TODO_APP_DEV_TOOLS__?: any;
  }
}
