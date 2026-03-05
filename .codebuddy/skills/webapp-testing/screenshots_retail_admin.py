from playwright.sync_api import sync_playwright
import os

# 创建截图目录
screenshot_dir = 'd:/AI/supply-chain/retail-admin/screenshots'
os.makedirs(screenshot_dir, exist_ok=True)

# 页面列表
pages = [
    ('/', '01-dashboard'),
    ('/finance', '02-finance'),
    ('/enterprise', '03-enterprise'),
    ('/contracts', '04-contracts'),
    ('/orders', '05-orders'),
    ('/shipments', '06-shipments'),
    ('/suppliers', '07-suppliers'),
]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1920, 'height': 1080})
    
    print("开始截图...")
    
    for path, name in pages:
        url = f'http://localhost:5175{path}'
        print(f"正在截取: {url}")
        
        try:
            page.goto(url, wait_until='networkidle', timeout=30000)
            page.wait_for_timeout(1000)  # 等待动画完成
            
            # 全页面截图
            screenshot_path = f'{screenshot_dir}/{name}.png'
            page.screenshot(path=screenshot_path, full_page=True)
            print(f"  [OK] 已保存: {screenshot_path}")
            
        except Exception as e:
            print(f"  [ERROR] 错误: {e}")
    
    browser.close()
    print("\n截图完成！")
    print(f"截图保存位置: {screenshot_dir}")
