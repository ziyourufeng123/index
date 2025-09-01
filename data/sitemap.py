import json
from datetime import datetime
import re # 导入正则表达式模块

def generate_sitemap(json_data_path, base_url, output_file="sitemap.xml"):
    """
    根据 tools.json 文件生成站点地图（sitemap.xml）。

    Args:
        json_data_path (str): tools.json 文件的路径。
        base_url (str): 站点的根URL，例如 "https://www.example.com"。
        output_file (str): 生成的站点地图文件的名称。
    """
    try:
        with open(json_data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"错误：未找到文件 '{json_data_path}'，请检查路径。")
        return
    except json.JSONDecodeError:
        print(f"错误：无法解析文件 '{json_data_path}'，请检查JSON格式。")
        return

    categories = data.get("categories", {})
    tools = data.get("tools", [])
    
    # 确保 base_url 以斜杠结尾，方便拼接
    if not base_url.endswith('/'):
        base_url += '/'

    # 获取当前日期，作为 lastmod 使用
    current_date = datetime.now().strftime("%Y-%m-%d")

    sitemap_xml = []
    sitemap_xml.append('<?xml version="1.0" encoding="UTF-8"?>')
    sitemap_xml.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

    # 用于追踪已添加的URL，避免重复
    added_urls = set()

    # --- 添加首页 ---
    home_url = base_url
    if home_url not in added_urls:
        sitemap_xml.append(f'  <url>')
        sitemap_xml.append(f'    <loc>{home_url}</loc>')
        sitemap_xml.append(f'    <lastmod>{current_date}</lastmod>')
        sitemap_xml.append(f'    <changefreq>daily</changefreq>') # 首页可能经常更新
        sitemap_xml.append(f'    <priority>1.0</priority>')
        sitemap_xml.append(f'  </url>')
        added_urls.add(home_url)

    # --- 添加分类页面 ---
    for category_id, category_info in categories.items():
        # 'all' 类别如果指向根目录，则与首页合并，不单独生成
        if category_id == "all":
            continue # 跳过，因为我们已经处理了 home_url

        # 假设分类页面路径为 base_url/categories/{category_id}/
        category_url = f"{base_url}categories/{category_id}/"
        
        # 移除任何可能的重复斜杠
        category_url = re.sub(r'([^:])//+', r'\1/', category_url)

        if category_url not in added_urls:
            sitemap_xml.append(f'  <url>')
            sitemap_xml.append(f'    <loc>{category_url}</loc>')
            sitemap_xml.append(f'    <lastmod>{current_date}</lastmod>')
            sitemap_xml.append(f'    <changefreq>weekly</changefreq>') # 分类页面更新频率适中
            sitemap_xml.append(f'    <priority>0.8</priority>')
            sitemap_xml.append(f'  </url>')
            added_urls.add(category_url)

    # --- 添加工具页面 ---
    for tool in tools:
        tool_url_path = tool.get('url')
        if tool_url_path:
            full_tool_url = ""
            # 判断是否为绝对路径
            if tool_url_path.startswith('http://') or tool_url_path.startswith('https://'):
                full_tool_url = tool_url_path
            else:
                # 处理相对路径
                if tool_url_path.startswith('./'):
                    tool_url_path = tool_url_path[2:] # 移除 './'
                
                # 规范化URL：移除 'index.html'，并确保目录以 '/' 结尾
                if tool_url_path.endswith('/index.html'):
                    tool_url_path = tool_url_path.replace('/index.html', '/')
                elif not re.search(r'\.[a-zA-Z0-9]+$', tool_url_path.split('/')[-1]) and not tool_url_path.endswith('/'):
                    # 如果路径最后一段没有文件扩展名，并且不以斜杠结尾，则将其视为目录并添加斜杠
                    tool_url_path += '/'
                
                full_tool_url = f"{base_url}{tool_url_path}"
                # 移除可能由拼接导致的重复斜杠 (例如 https://example.com//path/)
                full_tool_url = re.sub(r'([^:])//+', r'\1/', full_tool_url)

            # 避免重复添加相同的URL
            if full_tool_url not in added_urls:
                sitemap_xml.append(f'  <url>')
                sitemap_xml.append(f'    <loc>{full_tool_url}</loc>')
                sitemap_xml.append(f'    <lastmod>{current_date}</lastmod>')
                sitemap_xml.append(f'    <changefreq>monthly</changefreq>') # 工具页面更新频率可能较低
                sitemap_xml.append(f'    <priority>0.7</priority>')
                sitemap_xml.append(f'  </url>')
                added_urls.add(full_tool_url)

    sitemap_xml.append('</urlset>')

    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(sitemap_xml))
        print(f"站点地图 '{output_file}' 已成功生成！")
        print(f"共包含 {len(added_urls)} 个URL。")
    except IOError as e:
        print(f"错误：写入文件 '{output_file}' 失败：{e}")

# --- 如何使用 ---
if __name__ == "__main__":
    # 配置你的 tools.json 文件路径和你的网站主域名
    # json_file = "C:/Users/Administrator/Desktop/HTML/index-ziyourufeng/index/data/tools.json" # 如果是绝对路径
    json_file = "./data/tools.json" # 如果sitemap.py运行在 C:/Users/Administrator/Desktop/HTML/index-ziyourufeng/index/ 目录下
    your_base_url = "https://ziyourufeng.eu.org" # !!! 请替换为你的实际域名 !!!

    # 调用函数生成站点地图
    generate_sitemap(json_file, your_base_url)

