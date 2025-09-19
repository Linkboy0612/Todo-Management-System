"""
Pydantic数据验证模式
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class TodoBase(BaseModel):
    """待办事项基础模式"""
    title: str = Field(..., min_length=1, max_length=255, description="待办事项标题")
    description: Optional[str] = Field(None, max_length=1000, description="详细描述")

class TodoCreate(TodoBase):
    """创建待办事项模式"""
    pass

class TodoUpdate(BaseModel):
    """更新待办事项模式"""
    title: Optional[str] = Field(None, min_length=1, max_length=255, description="待办事项标题")
    description: Optional[str] = Field(None, max_length=1000, description="详细描述")
    completed: Optional[bool] = Field(None, description="完成状态")

class TodoResponse(TodoBase):
    """待办事项响应模式"""
    id: int
    completed: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

class TodosResponse(BaseModel):
    """待办事项列表响应"""
    code: int = 200
    message: str = "success"
    data: list[TodoResponse]

class TodoCreateResponse(BaseModel):
    """创建待办事项响应"""
    code: int = 201
    message: str = "Todo created successfully"
    data: TodoResponse

class TodoUpdateResponse(BaseModel):
    """更新待办事项响应"""
    code: int = 200
    message: str = "Todo updated successfully"
    data: TodoResponse

class TodoDeleteResponse(BaseModel):
    """删除待办事项响应"""
    code: int = 200
    message: str = "Todo deleted successfully"

class BatchDeleteResponse(BaseModel):
    """批量删除响应"""
    code: int = 200
    message: str
    data: dict = {"deleted_count": 0}

