"""
数据库初始化脚本
"""
from app.database import engine, SessionLocal
from app.models import Base, Todo

def create_tables():
    """创建数据库表"""
    print("正在创建数据库表...")
    Base.metadata.create_all(bind=engine)
    print("✓ 数据库表创建成功")

def create_sample_data():
    """创建示例数据"""
    db = SessionLocal()
    try:
        print("正在创建示例数据...")
        
        # 检查是否已有数据
        existing_todos = db.query(Todo).count()
        if existing_todos > 0:
            print(f"数据库中已有 {existing_todos} 条记录，跳过示例数据创建")
            return
        
        # 创建示例待办事项
        sample_todos = [
            Todo(
                title="学习FastAPI框架",
                description="完成FastAPI官方文档的学习，掌握基本用法",
                completed=False
            ),
            Todo(
                title="完成项目文档编写",
                description="编写技术架构文档和API接口文档",
                completed=True
            ),
            Todo(
                title="进行代码审查",
                description="审查待办事项应用的后端代码质量",
                completed=False
            ),
            Todo(
                title="部署到生产环境",
                description="将应用部署到服务器并进行测试",
                completed=False
            )
        ]
        
        for todo in sample_todos:
            db.add(todo)
        
        db.commit()
        print(f"✓ 成功创建 {len(sample_todos)} 条示例数据")
        
    except Exception as e:
        print(f"✗ 创建示例数据失败: {e}")
        db.rollback()
    finally:
        db.close()

def main():
    """主函数"""
    print("开始初始化数据库...")
    
    create_tables()
    create_sample_data()
    
    print("\n数据库初始化完成！")
    print("可以运行 'python run_server.py' 启动服务器")

if __name__ == "__main__":
    main()

