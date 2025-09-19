"""
FastAPI应用主入口
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .database import init_db, engine
from .models import Base
from .routers import todos

# 创建数据库表
Base.metadata.create_all(bind=engine)

# 创建FastAPI应用实例
app = FastAPI(
    title="待办事项管理API",
    description="一个简单而强大的待办事项管理系统",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# 配置CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # 前端开发服务器地址
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(todos.router)

@app.get("/")
async def root():
    """
    API根路径
    """
    return JSONResponse(
        content={
            "message": "欢迎使用待办事项管理API",
            "version": "1.0.0",
            "docs": "/docs",
            "redoc": "/redoc"
        }
    )

@app.get("/health")
async def health_check():
    """
    健康检查端点
    """
    return JSONResponse(
        content={
            "status": "healthy",
            "message": "服务运行正常"
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

