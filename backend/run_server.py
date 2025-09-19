"""
启动开发服务器脚本
"""
import uvicorn
import sys
import os

def main():
    """启动FastAPI开发服务器"""
    try:
        print("正在启动FastAPI开发服务器...")
        print("API文档地址: http://localhost:8000/docs")
        print("ReDoc文档地址: http://localhost:8000/redoc")
        print("按 Ctrl+C 停止服务器")
        
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            reload_dirs=["app"],
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n服务器已停止")
    except Exception as e:
        print(f"启动服务器失败: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

