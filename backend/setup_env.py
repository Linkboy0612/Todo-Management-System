"""
虚拟环境设置脚本
"""
import subprocess
import sys
import os

def create_virtual_environment():
    """创建虚拟环境"""
    print("正在创建Python虚拟环境...")
    try:
        subprocess.run([sys.executable, "-m", "venv", "venv"], check=True)
        print("✓ 虚拟环境创建成功")
    except subprocess.CalledProcessError as e:
        print(f"✗ 虚拟环境创建失败: {e}")
        return False
    return True

def install_dependencies():
    """安装依赖包"""
    print("正在安装依赖包...")
    
    # 确定虚拟环境的pip路径
    if os.name == 'nt':  # Windows
        pip_path = os.path.join("venv", "Scripts", "pip")
    else:  # macOS/Linux
        pip_path = os.path.join("venv", "bin", "pip")
    
    try:
        subprocess.run([pip_path, "install", "-r", "requirements.txt"], check=True)
        print("✓ 依赖包安装成功")
    except subprocess.CalledProcessError as e:
        print(f"✗ 依赖包安装失败: {e}")
        return False
    except FileNotFoundError:
        print("✗ 找不到pip，请确保虚拟环境已正确创建")
        return False
    return True

def main():
    """主函数"""
    print("开始设置后端开发环境...")
    
    if not create_virtual_environment():
        sys.exit(1)
    
    if not install_dependencies():
        sys.exit(1)
    
    print("\n环境设置完成！")
    print("\n启动说明:")
    print("Windows: .\\venv\\Scripts\\activate")
    print("macOS/Linux: source venv/bin/activate")
    print("然后运行: uvicorn app.main:app --reload")

if __name__ == "__main__":
    main()

