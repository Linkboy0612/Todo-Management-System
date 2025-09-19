"""
待办事项API路由
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from ..models import Todo
from ..schemas import (
    TodoCreate, TodoUpdate, TodoResponse, TodosResponse,
    TodoCreateResponse, TodoUpdateResponse, TodoDeleteResponse,
    BatchDeleteResponse
)

router = APIRouter(prefix="/api/v1", tags=["todos"])

@router.get("/todos", response_model=TodosResponse)
async def get_todos(
    completed: Optional[bool] = Query(None, description="筛选完成状态"),
    db: Session = Depends(get_db)
):
    """
    获取所有待办事项
    """
    try:
        query = db.query(Todo)
        
        # 根据完成状态筛选
        if completed is not None:
            query = query.filter(Todo.completed == completed)
        
        todos = query.order_by(Todo.created_at.desc()).all()
        
        return TodosResponse(data=todos)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取待办事项失败: {str(e)}")

@router.post("/todos", response_model=TodoCreateResponse)
async def create_todo(
    todo: TodoCreate,
    db: Session = Depends(get_db)
):
    """
    创建新的待办事项
    """
    try:
        db_todo = Todo(
            title=todo.title,
            description=todo.description,
            completed=False
        )
        db.add(db_todo)
        db.commit()
        db.refresh(db_todo)
        
        return TodoCreateResponse(data=db_todo)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"创建待办事项失败: {str(e)}")

@router.delete("/todos/completed", response_model=BatchDeleteResponse)
async def delete_completed_todos(db: Session = Depends(get_db)):
    """
    批量删除已完成的待办事项
    """
    try:
        completed_todos = db.query(Todo).filter(Todo.completed == True).all()
        deleted_count = len(completed_todos)
        
        for todo in completed_todos:
            db.delete(todo)
        
        db.commit()
        
        return BatchDeleteResponse(
            message="已完成的待办事项删除成功",
            data={"deleted_count": deleted_count}
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"批量删除失败: {str(e)}")

@router.delete("/todos/all", response_model=BatchDeleteResponse)
async def delete_all_todos(db: Session = Depends(get_db)):
    """
    删除所有待办事项
    """
    try:
        all_todos = db.query(Todo).all()
        deleted_count = len(all_todos)
        
        for todo in all_todos:
            db.delete(todo)
        
        db.commit()
        
        return BatchDeleteResponse(
            message="所有待办事项删除成功",
            data={"deleted_count": deleted_count}
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"删除所有待办事项失败: {str(e)}")

@router.get("/todos/{todo_id}", response_model=TodoResponse)
async def get_todo(
    todo_id: int,
    db: Session = Depends(get_db)
):
    """
    获取单个待办事项
    """
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="待办事项不存在")
    return todo

@router.put("/todos/{todo_id}", response_model=TodoUpdateResponse)
async def update_todo(
    todo_id: int,
    todo_update: TodoUpdate,
    db: Session = Depends(get_db)
):
    """
    更新待办事项
    """
    try:
        db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
        if not db_todo:
            raise HTTPException(status_code=404, detail="待办事项不存在")
        
        # 更新字段
        update_data = todo_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_todo, field, value)
        
        db.commit()
        db.refresh(db_todo)
        
        return TodoUpdateResponse(data=db_todo)
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"更新待办事项失败: {str(e)}")

@router.delete("/todos/{todo_id}", response_model=TodoDeleteResponse)
async def delete_todo(
    todo_id: int,
    db: Session = Depends(get_db)
):
    """
    删除单个待办事项
    """
    try:
        db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
        if not db_todo:
            raise HTTPException(status_code=404, detail="待办事项不存在")
        
        db.delete(db_todo)
        db.commit()
        
        return TodoDeleteResponse()
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"删除待办事项失败: {str(e)}")

