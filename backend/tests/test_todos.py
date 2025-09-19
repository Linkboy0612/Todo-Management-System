"""
待办事项API简化测试
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import tempfile
import os

from app.main import app
from app.database import get_db, Base
from app.models import Todo

# 使用临时文件数据库
def get_test_db_url():
    db_fd, db_path = tempfile.mkstemp(suffix='.db')
    os.close(db_fd)
    return f"sqlite:///{db_path}", db_path

DATABASE_URL, DB_PATH = get_test_db_url()
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    """覆盖数据库依赖"""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture(scope="function", autouse=True)
def setup_test_db():
    """每个测试前设置数据库"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_root_endpoint():
    """测试根路径"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data

def test_health_check():
    """测试健康检查"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_create_todo():
    """测试创建待办事项"""
    todo_data = {
        "title": "测试待办事项",
        "description": "这是一个测试描述"
    }
    response = client.post("/api/v1/todos", json=todo_data)
    assert response.status_code == 200
    data = response.json()
    assert data["code"] == 201
    assert data["data"]["title"] == todo_data["title"]
    assert data["data"]["completed"] == False

def test_get_todos():
    """测试获取待办事项列表"""
    # 先创建一个待办事项
    todo_data = {"title": "测试获取", "description": "测试描述"}
    client.post("/api/v1/todos", json=todo_data)
    
    # 获取列表
    response = client.get("/api/v1/todos")
    assert response.status_code == 200
    data = response.json()
    assert data["code"] == 200
    assert len(data["data"]) == 1

def test_update_todo():
    """测试更新待办事项"""
    # 创建待办事项
    todo_data = {"title": "原始标题", "description": "原始描述"}
    create_response = client.post("/api/v1/todos", json=todo_data)
    todo_id = create_response.json()["data"]["id"]
    
    # 更新待办事项
    update_data = {"title": "更新后标题", "completed": True}
    response = client.put(f"/api/v1/todos/{todo_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["title"] == "更新后标题"
    assert data["data"]["completed"] == True

def test_delete_todo():
    """测试删除待办事项"""
    # 创建待办事项
    todo_data = {"title": "待删除项", "description": "测试删除"}
    create_response = client.post("/api/v1/todos", json=todo_data)
    todo_id = create_response.json()["data"]["id"]
    
    # 删除待办事项
    response = client.delete(f"/api/v1/todos/{todo_id}")
    assert response.status_code == 200
    
    # 验证已删除
    get_response = client.get(f"/api/v1/todos/{todo_id}")
    assert get_response.status_code == 404

def test_delete_completed_todos():
    """测试批量删除已完成的待办事项"""
    # 创建多个待办事项
    client.post("/api/v1/todos", json={"title": "未完成"})
    
    # 创建并完成两个待办事项
    for i in range(2):
        create_response = client.post("/api/v1/todos", json={"title": f"已完成{i+1}"})
        todo_id = create_response.json()["data"]["id"]
        client.put(f"/api/v1/todos/{todo_id}", json={"completed": True})
    
    # 批量删除已完成的
    response = client.delete("/api/v1/todos/completed")
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["deleted_count"] == 2
    
    # 验证只剩未完成的
    response = client.get("/api/v1/todos")
    assert len(response.json()["data"]) == 1

def test_delete_all_todos():
    """测试删除所有待办事项"""
    # 创建多个待办事项
    for i in range(3):
        client.post("/api/v1/todos", json={"title": f"待办事项{i+1}"})
    
    # 删除所有
    response = client.delete("/api/v1/todos/all")
    assert response.status_code == 200
    data = response.json()
    assert data["data"]["deleted_count"] == 3
    
    # 验证列表为空
    response = client.get("/api/v1/todos")
    assert len(response.json()["data"]) == 0

def test_filter_todos():
    """测试筛选功能"""
    # 创建未完成和已完成的待办事项
    client.post("/api/v1/todos", json={"title": "未完成1"})
    client.post("/api/v1/todos", json={"title": "未完成2"})
    
    create_response = client.post("/api/v1/todos", json={"title": "已完成"})
    todo_id = create_response.json()["data"]["id"]
    client.put(f"/api/v1/todos/{todo_id}", json={"completed": True})
    
    # 测试筛选未完成
    response = client.get("/api/v1/todos?completed=false")
    assert response.status_code == 200
    assert len(response.json()["data"]) == 2
    
    # 测试筛选已完成
    response = client.get("/api/v1/todos?completed=true")
    assert response.status_code == 200
    assert len(response.json()["data"]) == 1

# 清理函数
def cleanup():
    try:
        if os.path.exists(DB_PATH):
            os.remove(DB_PATH)
    except:
        pass

import atexit
atexit.register(cleanup)
