import json
from datetime import datetime

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

    # 添加首页
    sitemap_xml.append(f'  <url>')
    sitemap_xml.append(f'    <loc>{base_url}</loc>')
    sitemap_xml.append(f'    <lastmod>{current_date}</lastmod>')
    sitemap_xml.append(f'    <changefreq>daily</changefreq>') # 首页可能经常更新
    sitemap_xml.append(f'    <priority>1.0</priority>')
    sitemap_xml.append(f'  </url>')

    # 添加分类页面
    for category_id, category_info in categories.items():
        # 排除 'all' 类别如果它只是一个聚合页面，或者根据你的实际网站结构决定是否包含
        # 这里我们假设 'all' 类别页面也是一个独立的访问入口
        # 假设分类页面路径为 base_url/category/{category_id}/index.html 或 base_url/category/{category_id}
        # 如果你的分类页面是动态生成的，例如 base_url/categories?cat=image，则需要相应调整
        category_url_path = f"categories/{category_id}/" # 假设分类页面在 /categories/{category_id}/ 目录下
        if category_id == "all":
            category_url_path = "" # 如果 all 类别指向根目录或主工具列表页，则路径为空

        sitemap_xml.append(f'  <url>')
        sitemap_xml.append(f'    <loc>{base_url}{category_url_path}</loc>')
        sitemap_xml.append(f'    <lastmod>{current_date}</lastmod>')
        sitemap_xml.append(f'    <changefreq>weekly</changefreq>') # 分类页面更新频率适中
        sitemap_xml.append(f'    <priority>0.8</priority>')
        sitemap_xml.append(f'  </url>')

    # 添加工具页面
    for tool in tools:
        tool_url_path = tool.get('url')
        if tool_url_path:
            # 移除开头的 './'，并确保路径以 '/' 结尾（如果它是一个目录页面）或直接是文件
            if tool_url_path.startswith('./'):
                tool_url_path = tool_url_path[2:]
            
            # 如果 url 中包含 index.html，通常我们会把 sitemap 中的 loc 写成目录形式
            # 例如 ./tools/image/compressor/index.html -> https://www.example.com/tools/image/compressor/
            if tool_url_path.endswith('/index.html'):
                tool_url_path = tool_url_path.replace('/index.html', '/')
            elif '/' not in tool_url_path and tool_url_path.endswith('.html'): # 针对根目录下的 .html 文件
                pass # 保持原样
            elif not tool_url_path.endswith('/'): # 确保目录形式的URL以 / 结尾
                if '.' not in tool_url_path.split('/')[-1]: # 如果最后一段没有文件扩展名，认为是目录
                     tool_url_path += '/'


            full_tool_url = f"{base_url}{tool_url_path}"

            sitemap_xml.append(f'  <url>')
            sitemap_xml.append(f'    <loc>{full_tool_url}</loc>')
            sitemap_xml.append(f'    <lastmod>{current_date}</lastmod>')
            sitemap_xml.append(f'    <changefreq>monthly</changefreq>') # 工具页面更新频率可能较低
            sitemap_xml.append(f'    <priority>0.7</priority>')
            sitemap_xml.append(f'  </url>')

    sitemap_xml.append('</urlset>')

    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(sitemap_xml))
        print(f"站点地图 '{output_file}' 已成功生成！")
        print(f"共包含 {1 + len(categories) + len(tools)} 个URL (首页 + {len(categories)} 个分类 + {len(tools)} 个工具)。")
    except IOError as e:
        print(f"错误：写入文件 '{output_file}' 失败：{e}")

# --- 如何使用 ---
if __name__ == "__main__":
    # 配置你的 tools.json 文件路径和你的网站主域名
    json_file = "./data/tools.json"
    your_base_url = "https://ziyourufeng.eu.org" # !!! 请替换为你的实际域名 !!!

    # 调用函数生成站点地图
    generate_sitemap(json_file, your_base_url)

    # 假设你的网站也有一个关于页面
    # 可以手动添加，或者在 JSON 中加入关于页面信息
    # sitemap_xml.append(f'  <url>')
    # sitemap_xml.append(f'    <loc>{your_base_url}/about/</loc>')
    # sitemap_xml.append(f'    <lastmod>{datetime.now().strftime("%Y-%m-%d")}</lastmod>')
    # sitemap_xml.append(f'    <changefreq>yearly</changefreq>')
    # sitemap_xml.append(f'    <priority>0.5</priority>')
    # sitemap_xml.append(f'  </url>')
