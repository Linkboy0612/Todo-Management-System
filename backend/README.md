# 待办事项管理系统 - 后端API

一个基于FastAPI构建的现代化待办事项管理系统后端服务，提供完整的RESTful API接口。

## 🚀 项目特性

- **现代化框架**: 基于FastAPI，支持自动API文档生成
- **类型安全**: 全面使用Python类型注解和Pydantic数据验证
- **异步支持**: 支持异步数据库操作，提升性能
- **标准化API**: RESTful设计，统一的响应格式
- **完整测试**: 包含全面的单元测试和集成测试
- **CORS支持**: 配置跨域资源共享，支持前端集成

## 📋 核心功能

- ✅ 创建待办事项
- ✅ 查看待办事项列表（支持状态筛选）
- ✅ 更新待办事项（标题、描述、完成状态）
- ✅ 删除单个待办事项
- ✅ 批量删除已完成的待办事项
- ✅ 清空所有待办事项
- ✅ 实时数据同步

## 🛠 技术栈

- **Web框架**: FastAPI 0.116+
- **ASGI服务器**: Uvicorn
- **数据库**: SQLite3
- **ORM**: SQLAlchemy 2.0+
- **数据验证**: Pydantic V2
- **测试框架**: Pytest
- **HTTP客户端**: HTTPX (测试用)

## 📁 项目结构

```
backend/
├── app/                          # 应用核心代码
│   ├── __init__.py
│   ├── main.py                   # FastAPI应用入口
│   ├── database.py               # 数据库配置
│   ├── models.py                 # SQLAlchemy数据模型
│   ├── schemas.py                # Pydantic数据验证模式
│   └── routers/
│       ├── __init__.py
│       └── todos.py              # 待办事项API路由
├── tests/                        # 测试文件
│   ├── __init__.py
│   └── test_todos.py             # API测试
├── venv/                         # Python虚拟环境
├── requirements.txt              # Python依赖
├── init_db.py                    # 数据库初始化脚本
├── run_server.py                 # 服务器启动脚本
├── setup_env.py                  # 环境设置脚本
├── todos.db                      # SQLite数据库文件
└── README.md                     # 项目文档
```

## ⚡ 快速开始

### 1. 环境要求

- Python 3.8+
- pip

### 2. 环境设置

#### 方法一：自动设置（推荐）

```bash
# 运行环境设置脚本
python setup_env.py
```

#### 方法二：手动设置

```bash
# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt
```

### 3. 初始化数据库

```bash
# 激活虚拟环境后运行
python init_db.py
```

### 4. 启动服务器

#### 方法一：使用启动脚本

```bash
python run_server.py
```

#### 方法二：直接使用uvicorn

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 5. 访问服务

- **API服务**: http://localhost:8000
- **交互式文档**: http://localhost:8000/docs
- **ReDoc文档**: http://localhost:8000/redoc

## 📚 API接口文档

### 基础信息

- **Base URL**: `http://localhost:8000/api/v1`
- **Content-Type**: `application/json`
- **响应格式**: JSON

### 端点列表

#### 1. 获取所有待办事项

```http
GET /api/v1/todos
```

**查询参数:**
- `completed` (可选): `true` | `false` - 按完成状态筛选

**响应示例:**
```json
{
    "code": 200,
    "message": "success",
    "data": [
        {
            "id": 1,
            "title": "学习FastAPI",
            "description": "完成FastAPI教程学习",
            "completed": false,
            "created_at": "2024-01-01T10:00:00",
            "updated_at": "2024-01-01T10:00:00"
        }
    ]
}
```

#### 2. 创建待办事项

```http
POST /api/v1/todos
```

**请求体:**
```json
{
    "title": "待办事项标题",
    "description": "详细描述（可选）"
}
```

**响应示例:**
```json
{
    "code": 201,
    "message": "Todo created successfully",
    "data": {
        "id": 2,
        "title": "待办事项标题",
        "description": "详细描述（可选）",
        "completed": false,
        "created_at": "2024-01-01T10:30:00",
        "updated_at": "2024-01-01T10:30:00"
    }
}
```

#### 3. 获取单个待办事项

```http
GET /api/v1/todos/{todo_id}
```

#### 4. 更新待办事项

```http
PUT /api/v1/todos/{todo_id}
```

**请求体:**
```json
{
    "title": "更新后的标题",
    "description": "更新后的描述",
    "completed": true
}
```

#### 5. 删除单个待办事项

```http
DELETE /api/v1/todos/{todo_id}
```

#### 6. 批量删除已完成的待办事项

```http
DELETE /api/v1/todos/completed
```

#### 7. 删除所有待办事项

```http
DELETE /api/v1/todos/all
```

### 响应状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 404 | 资源不存在 |
| 422 | 数据验证失败 |
| 500 | 服务器内部错误 |

## 🧪 运行测试

```bash
# 激活虚拟环境后运行
python -m pytest tests/ -v

# 查看测试覆盖率（需要安装pytest-cov）
pip install pytest-cov
python -m pytest tests/ --cov=app --cov-report=html
```

## 📊 数据库模式

### todos 表结构

| 字段名 | 数据类型 | 说明 | 约束 |
|--------|----------|------|------|
| id | INTEGER | 主键，自动递增 | PRIMARY KEY |
| title | VARCHAR(255) | 待办事项标题 | NOT NULL |
| description | TEXT | 待办事项详细描述 | 可选 |
| completed | BOOLEAN | 完成状态 | DEFAULT FALSE |
| created_at | DATETIME | 创建时间 | DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME | 更新时间 | DEFAULT CURRENT_TIMESTAMP |

### 索引优化

- `idx_todos_completed`: 按完成状态查询优化
- `idx_todos_created_at`: 按创建时间排序优化

## 🔧 开发指南

### 代码结构说明

1. **app/main.py**: FastAPI应用入口，配置中间件和路由
2. **app/database.py**: 数据库连接和会话管理
3. **app/models.py**: SQLAlchemy ORM模型定义
4. **app/schemas.py**: Pydantic数据验证和序列化模式
5. **app/routers/todos.py**: 待办事项相关API端点

### 添加新功能

1. 在 `models.py` 中定义数据模型
2. 在 `schemas.py` 中创建验证模式
3. 在 `routers/` 中实现API端点
4. 在 `tests/` 中添加测试用例

### 环境变量配置

创建 `.env` 文件来配置环境变量：

```env
DATABASE_URL=sqlite:///./todos.db
DEBUG=True
CORS_ORIGINS=["http://localhost:3000"]
```

## 🚀 生产环境部署

### 使用Gunicorn

```bash
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### 使用Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 使用Docker Compose

```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "8000:8000"
    volumes:
      - ./todos.db:/app/todos.db
    environment:
      - DEBUG=False
```

## 🔒 安全考虑

- 输入验证：使用Pydantic进行严格的数据验证
- CORS配置：限制允许的前端域名
- SQL注入防护：使用SQLAlchemy ORM
- 错误处理：避免泄露敏感信息

## 📈 性能优化

- 数据库索引：为常用查询字段添加索引
- 连接池：SQLAlchemy自动管理连接池
- 异步支持：支持异步数据库操作
- 响应压缩：FastAPI自动支持gzip压缩

## 🐛 故障排除

### 常见问题

1. **端口占用**: 更改启动端口或停止占用进程
2. **数据库锁定**: 确保没有其他进程使用数据库文件
3. **虚拟环境问题**: 重新创建虚拟环境并安装依赖

### 日志查看

服务器运行时会输出详细的日志信息，包括：
- 请求日志
- 错误信息
- 数据库操作

## 📞 技术支持

如果遇到问题，请检查：

1. Python版本是否为3.8+
2. 所有依赖是否正确安装
3. 数据库文件权限是否正确
4. 端口8000是否被占用

## 📄 许可证

本项目仅用于学习和教育目的。

## 🔄 更新日志

### v1.0.0 (2025-09-19)
- ✨ 初始版本发布
- ✅ 实现基础CRUD操作
- ✅ 添加数据验证
- ✅ 完成API文档
- ✅ 添加单元测试

---

**开发环境测试通过** ✅  
**API文档自动生成** ✅  
**单元测试覆盖** ✅  
**生产环境就绪** ✅

