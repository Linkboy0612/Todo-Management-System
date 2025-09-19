#!/usr/bin/env python3
"""
待办事项应用完整启动脚本
同时启动前端和后端服务
"""
import subprocess
import sys
import os
import time
import signal
from pathlib import Path

def print_banner():
    """打印启动横幅"""
    print("=" * 60)
    print("🚀 待办事项管理系统 - 完整启动")
    print("=" * 60)
    print("📋 功能特性:")
    print("  ✅ React + TypeScript 前端")
    print("  ⚡ FastAPI + SQLite 后端")
    print("  🎨 现代化UI设计")
    print("  📱 响应式布局")
    print("  🔄 实时数据同步")
    print("=" * 60)

def check_requirements():
    """检查运行环境"""
    print("🔍 检查运行环境...")
    
    # 检查Python
    if sys.version_info < (3, 8):
        print("❌ 需要Python 3.8+版本")
        return False
    print(f"✅ Python版本: {sys.version.split()[0]}")
    
    # 检查Node.js
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Node.js版本: {result.stdout.strip()}")
        else:
            print("❌ 未找到Node.js，请先安装Node.js")
            return False
    except FileNotFoundError:
        print("❌ 未找到Node.js，请先安装Node.js")
        return False
    
    # 检查npm
    try:
        result = subprocess.run(['npm', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ npm版本: {result.stdout.strip()}")
        else:
            print("❌ 未找到npm")
            return False
    except FileNotFoundError:
        print("❌ 未找到npm")
        return False
    
    return True

def setup_backend():
    """设置后端环境"""
    print("\n🔧 设置后端环境...")
    backend_dir = Path(__file__).parent / "backend"
    
    # 检查虚拟环境
    venv_dir = backend_dir / "venv"
    if not venv_dir.exists():
        print("📦 创建Python虚拟环境...")
        subprocess.run([sys.executable, "-m", "venv", str(venv_dir)], 
                      cwd=backend_dir, check=True)
    
    # 安装依赖
    if os.name == 'nt':  # Windows
        pip_path = venv_dir / "Scripts" / "pip"
        python_path = venv_dir / "Scripts" / "python"
    else:  # macOS/Linux
        pip_path = venv_dir / "bin" / "pip"
        python_path = venv_dir / "bin" / "python"
    
    print("📦 安装后端依赖...")
    subprocess.run([str(pip_path), "install", "-r", "requirements.txt"], 
                  cwd=backend_dir, check=True)
    
    # 初始化数据库
    print("🗄️ 初始化数据库...")
    subprocess.run([str(python_path), "init_db.py"], 
                  cwd=backend_dir, check=True)
    
    return python_path

def setup_frontend():
    """设置前端环境"""
    print("\n🔧 设置前端环境...")
    frontend_dir = Path(__file__).parent / "frontend"
    
    # 检查node_modules
    node_modules = frontend_dir / "node_modules"
    if not node_modules.exists():
        print("📦 安装前端依赖...")
        subprocess.run(["npm", "install"], cwd=frontend_dir, check=True)
    
    return True

def start_services():
    """启动服务"""
    print("\n🚀 启动服务...")
    
    backend_dir = Path(__file__).parent / "backend"
    frontend_dir = Path(__file__).parent / "frontend"
    
    # 确定python路径
    venv_dir = backend_dir / "venv"
    if os.name == 'nt':  # Windows
        python_path = venv_dir / "Scripts" / "python"
    else:  # macOS/Linux
        python_path = venv_dir / "bin" / "python"
    
    processes = []
    
    try:
        # 启动后端
        print("🔙 启动后端服务 (http://localhost:8000)...")
        backend_process = subprocess.Popen(
            [str(python_path), "run_server.py"],
            cwd=backend_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        processes.append(('backend', backend_process))
        
        # 等待后端启动
        time.sleep(3)
        
        # 启动前端
        print("🌐 启动前端服务 (http://localhost:3000)...")
        frontend_process = subprocess.Popen(
            ["npm", "start"],
            cwd=frontend_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env={**os.environ, "BROWSER": "none"}
        )
        processes.append(('frontend', frontend_process))
        
        # 等待前端启动
        time.sleep(5)
        
        print("\n" + "=" * 60)
        print("🎉 应用启动成功！")
        print("=" * 60)
        print("🌐 前端地址: http://localhost:3000")
        print("🔙 后端地址: http://localhost:8000")
        print("📚 API文档: http://localhost:8000/docs")
        print("❤️  健康检查: http://localhost:8000/health")
        print("=" * 60)
        print("💡 按 Ctrl+C 停止所有服务")
        print("=" * 60)
        
        # 等待用户中断
        try:
            while True:
                time.sleep(1)
                # 检查进程是否还在运行
                for name, process in processes:
                    if process.poll() is not None:
                        print(f"⚠️  {name}服务已停止")
                        return
        except KeyboardInterrupt:
            print("\n🛑 正在停止所有服务...")
    
    finally:
        # 停止所有进程
        for name, process in processes:
            try:
                if process.poll() is None:
                    print(f"🛑 停止{name}服务...")
                    if os.name == 'nt':  # Windows
                        process.terminate()
                    else:  # macOS/Linux
                        process.send_signal(signal.SIGTERM)
                    
                    # 等待进程结束
                    try:
                        process.wait(timeout=5)
                    except subprocess.TimeoutExpired:
                        print(f"⚡ 强制结束{name}服务...")
                        process.kill()
            except Exception as e:
                print(f"❌ 停止{name}服务时出错: {e}")
        
        print("✅ 所有服务已停止")

def main():
    """主函数"""
    try:
        print_banner()
        
        if not check_requirements():
            print("\n❌ 环境检查失败，请安装必要的依赖")
            sys.exit(1)
        
        setup_backend()
        setup_frontend()
        start_services()
        
    except KeyboardInterrupt:
        print("\n👋 用户取消启动")
    except Exception as e:
        print(f"\n❌ 启动失败: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
