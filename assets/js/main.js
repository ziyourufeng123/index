// 应用主逻辑
class ToolsApp {
    constructor() {
        this.config = {}; // 添加配置属性
        this.tools = [];
        this.categories = {};
        this.currentCategory = 'all';
        this.searchQuery = '';
        this.aboutPage = null; // 用于存储关于页面配置
      
        this.init();
    }

    // 初始化应用
    async init() {
        try {
            await this.loadConfig(); // 首先加载配置
            await this.loadToolsData();
            this.applySEO(); // 应用SEO配置
            this.initializeTheme();
            this.renderNavigation();
            this.renderTools();
            this.renderAboutButton(); // 渲染关于按钮
            this.bindEventListeners();
            this.updateCounts();
            this.handleRouting(); // 处理路由
        } catch (error) {
            console.error('初始化应用失败:', error);
            this.showError('应用加载失败，请刷新页面重试');
        }
    }

    // 加载应用配置
    async loadConfig() {
        try {
            const response = await fetch('./config/app.json');
            if (!response.ok) {
                throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            this.config = data;
        } catch (error) {
            console.error('加载应用配置失败:', error);
            this.showError('无法加载应用配置，请检查网络连接或联系管理员');
            throw error;
        }
    }

    // 加载工具数据
    async loadToolsData() {
        try {
            const response = await fetch('./data/tools.json');
            if (!response.ok) {
                throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            this.tools = data.tools || [];
            this.categories = data.categories || {};
        } catch (error) {
            console.error('加载工具数据失败:', error);
            this.showError('无法加载工具数据，请检查网络连接或联系管理员');
            throw error;
        }
    }

    // 应用SEO配置
    applySEO() {
        const seoConfig = this.config.seo;
        if (!seoConfig) return;

        // 更新页面标题
        if (seoConfig.title) {
            document.title = seoConfig.title;
        }

        // 辅助函数：更新或创建meta标签
        const updateMeta = (name, content, isProperty = false) => {
            let meta = document.querySelector(`meta[${isProperty ? 'property' : 'name'}="${name}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute(isProperty ? 'property' : 'name', name);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        // 辅助函数：更新或创建link标签 (用于canonical和favicon)
        const updateLink = (rel, href, type = null) => {
            let link = document.querySelector(`link[rel="${rel}"]`);
            if (!link) {
                link = document.createElement('link');
                link.setAttribute('rel', rel);
                if (type) link.setAttribute('type', type); // 有些link标签可能需要type
                document.head.appendChild(link);
            }
            link.setAttribute('href', href);
        };

        // --- 标准 Meta 标签 ---
        if (seoConfig.description) {
            updateMeta('description', seoConfig.description);
        }
        if (seoConfig.keywords) {
            updateMeta('keywords', seoConfig.keywords);
        }

        // --- Canonical URL ---
        // 🚨 注意：canonicalUrl 必须是绝对路径。您的app.json中已正确设置为绝对路径。
        if (seoConfig.canonicalUrl) {
            updateLink('canonical', seoConfig.canonicalUrl);
        }

        // --- Open Graph Meta 标签 (社交媒体分享) ---
        // og:title: 优先使用独立的ogTitle，否则使用document.title
        if (seoConfig.ogTitle) {
            updateMeta('og:title', seoConfig.ogTitle, true);
        } else if (seoConfig.title) { // Fallback to page title
             updateMeta('og:title', seoConfig.title, true);
        }
        
        // og:description: 优先使用独立的ogDescription，否则使用meta description
        if (seoConfig.ogDescription) {
            updateMeta('og:description', seoConfig.ogDescription, true);
        } else if (seoConfig.description) { // Fallback to meta description
             updateMeta('og:description', seoConfig.description, true);
        }

        // og:url: 优先使用ogUrl，否则使用canonicalUrl，都不是则使用当前页面URL
        if (seoConfig.ogUrl) {
            updateMeta('og:url', seoConfig.ogUrl, true);
        } else if (seoConfig.canonicalUrl) { // Fallback to canonical URL
            updateMeta('og:url', seoConfig.canonicalUrl, true);
        } else { // Fallback to current window URL
            updateMeta('og:url', window.location.href, true);
        }
        
        // og:image
        if (seoConfig.ogImage) {
            // 确保ogImage是绝对路径，尤其是当它在app.json中是相对路径时
            // 这里假设seoConfig.ogImage在app.json中是相对路径或者绝对路径都可以
            // 如果它总是相对根目录的，比如/assets/images/logo.png，那么它可以直接使用
            // 如果你希望它相对于canonicalUrl，可能需要更复杂的拼接逻辑，但通常ogImage直接用/开头即可
            updateMeta('og:image', `${window.location.protocol}//${window.location.host}${seoConfig.ogImage}`, true); // 确保是绝对路径
        }

        // --- Twitter Card Meta 标签 (Twitter 分享) ---
        if (seoConfig.twitterCard) {
            updateMeta('twitter:card', seoConfig.twitterCard);
        }
        // twitter:title, twitter:description, twitter:image 通常会自动从og标签继承
        // 但也可以独立设置，如果需要，按ogTitle/ogDescription/ogImage的方式添加即可。
        // 目前app.json中没有单独的twitterTitle/twitterDescription，所以可以不加。

        // --- Favicon ---
        if (seoConfig.favicon) {
            // 确保favicon的href是正确的路径。
            // 假设favicon也是相对于根目录的，例如 /assets/images/favicon.ico
            updateLink('icon', seoConfig.favicon);
            // 对于apple-touch-icon （用于iOS主屏幕图标），如果需要也可以添加
            // updateLink('apple-touch-icon', seoConfig.appleTouchIcon || seoConfig.favicon);
        }
    }


    // 初始化主题
    initializeTheme() {
        // 页面主题由 ThemeManager 在其 constructor 中设置，这里只需更新按钮
        // ThemeManager 实例化时已经完成了 document.documentElement.setAttribute('data-theme', ...)
        this.updateThemeToggle(); 
    }

    // 更新主题切换按钮
    updateThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.textContent = window.themeManager.theme === 'light' ? '☀️' : '🌙'; // 从 ThemeManager 获取当前主题
        }
    }

    // 渲染关于按钮
    renderAboutButton() {
        const headerActions = document.querySelector('.header-actions');
        if (!headerActions || !this.config.pages || !this.config.pages.about) return;

        this.aboutPage = this.config.pages.about;

        const aboutButton = document.createElement('button');
        aboutButton.id = 'aboutButton';
        aboutButton.className = 'theme-toggle'; // 复用 theme-toggle 的样式
        aboutButton.innerHTML = `${this.aboutPage.icon} ${this.aboutPage.name}`;
        
        // 将关于按钮插入到 theme-toggle 之前
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            headerActions.insertBefore(aboutButton, themeToggle);
        } else {
            headerActions.appendChild(aboutButton);
        }
    }

    // 渲染导航
    renderNavigation() {
        const navList = document.getElementById('navList');
        if (!navList) return;

        navList.innerHTML = '';

        // 检查是否有分类数据
        if (!this.categories || Object.keys(this.categories).length === 0) {
            return;
        }

        // 添加全部工具导航
        if (this.categories.all) {
            const allItem = this.createNavItem('all', this.categories.all.name, this.categories.all.icon);
            navList.appendChild(allItem);
        }

        // 添加其他分类导航
        Object.entries(this.categories).forEach(([key, category]) => {
            if (key !== 'all') {
                const navItem = this.createNavItem(key, category.name, category.icon);
                navList.appendChild(navItem);
            }
        });
    }

    // 创建导航项
    createNavItem(category, name, icon) {
        const li = document.createElement('li');
        li.className = 'nav-item';

        const a = document.createElement('a');
        a.href = '#';
        a.className = `nav-link ${category === this.currentCategory ? 'active' : ''}`;
        a.dataset.category = category;

        const count = this.getToolsCount(category);
        
        a.innerHTML = `
            <span class="nav-icon">${icon}</span>
            <span>${name}</span>
            <span class="nav-count">${count}</span>
        `;

        li.appendChild(a);
        return li;
    }

    // 获取工具数量
    getToolsCount(category) {
        if (category === 'all') return this.tools.length;
        return this.tools.filter(tool => tool.category === category).length;
    }

    // 更新导航计数
    updateCounts() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const category = link.dataset.category;
            const countElement = link.querySelector('.nav-count');
            if (countElement) {
                countElement.textContent = this.getToolsCount(category);
            }
        });
    }

    // 渲染工具卡片
    renderTools() {
        const toolsGrid = document.getElementById('toolsGrid');
        const emptyState = document.getElementById('emptyState');
        const aboutPageContent = document.getElementById('aboutPageContent');
        
        if (!toolsGrid || !emptyState || !aboutPageContent) return;

        // 隐藏关于页面，显示工具网格
        aboutPageContent.style.display = 'none';
        toolsGrid.style.display = 'grid';

        // 过滤工具
        const filteredTools = this.tools.filter(tool => {
            const matchesCategory = this.currentCategory === 'all' || tool.category === this.currentCategory;
            const matchesSearch = this.searchQuery === '' || 
                tool.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                tool.description.toLowerCase().includes(this.searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        // 清空网格
        toolsGrid.innerHTML = '';

        if (filteredTools.length === 0) {
            emptyState.style.display = 'block';
            return;
        } else {
            emptyState.style.display = 'none';
        }

        // 生成工具卡片
        filteredTools.forEach(tool => {
            const toolCard = this.createToolCard(tool);
            toolsGrid.appendChild(toolCard);
        });
    }

    // 创建工具卡片
    createToolCard(tool) {
        const card = document.createElement('a');
        card.className = 'tools-item';
        card.href = '#';
        
        card.innerHTML = `
            <div class="tools-item-icon" style="background-color: ${tool.iconColor}20; color: ${tool.iconColor}">
                ${tool.icon}
            </div>
            <h3>${tool.name}</h3>
            <div class="tools-item-content">
                <p>${tool.description}</p>
                <div class="tools-item-badges">
                    ${tool.isNew ? '<span class="tools-item-badge new">新功能！</span>' : ''}
                    ${tool.author ? `<span class="tools-item-badge">${tool.author}</span>` : ''}
                </div>
            </div>
        `;

        // 添加点击事件
        card.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleToolClick(tool);
        });

        return card;
    }

    // 处理工具点击
    handleToolClick(tool) {
        if (tool.url) {
            // 所有工具都在新标签页打开
            window.open(tool.url, '_blank');
        } else {
            AppUtils.showMessage(`即将打开工具: ${tool.name}`, 'info');
        }
    }

    // 绑定事件监听器
    bindEventListeners() {
        // 主题切换
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // 关于页面按钮 (只绑定一次事件监听)
        const aboutButton = document.getElementById('aboutButton');
        if (aboutButton) {
            aboutButton.addEventListener('click', () => {
                // 根据当前按钮的文本判断是显示关于页面还是返回主页
                if (aboutButton.innerHTML.includes(this.aboutPage.name)) {
                    this.handleAboutClick();
                } else {
                    this.handleHomeClick();
                }
            });
        }

        // 搜索功能
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e));
        }

        // 分类导航
        document.addEventListener('click', (e) => {
            if (e.target.closest('.nav-link')) {
                e.preventDefault();
                this.handleCategoryChange(e.target.closest('.nav-link'));
            }
        });

        // 移动端菜单
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        }

        // 点击外部关闭移动端菜单
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar');
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            
            if (window.innerWidth <= 768 && 
                sidebar && !sidebar.contains(e.target) && 
                mobileMenuBtn && !mobileMenuBtn.contains(e.target)) {
                sidebar.classList.remove('mobile-open');
            }
        });

        // 响应式处理
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                const sidebar = document.getElementById('sidebar');
                if (sidebar) {
                    sidebar.classList.remove('mobile-open');
                }
            }
        });
    }

    // 切换主题
    toggleTheme() {
        if (window.themeManager) { // 确保 ThemeManager 实例存在
            window.themeManager.toggle(); // 调用 ThemeManager 的切换方法
            this.updateThemeToggle(); // 切换后更新按钮图标
        }
    }

    // 处理搜索
    handleSearch(e) {
        this.searchQuery = e.target.value.trim();
        this.renderTools();
    }

    // 处理分类变更
    handleCategoryChange(linkElement) {
        // 更新当前分类
        this.currentCategory = linkElement.dataset.category;
        
        // 更新导航状态
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        linkElement.classList.add('active');
        
        // 重新渲染工具
        this.renderTools();
        
        // 移动端自动关闭侧边栏
        if (window.innerWidth <= 768) {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.remove('mobile-open');
            }
        }

        // 如果当前是关于页面，切换到工具页面
        if (window.location.hash === '#about') {
            window.history.pushState({}, '', '/');
            this.handleRouting();
        }
    }

    // 切换移动端菜单
    toggleMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('mobile-open');
        }
    }

    // 显示消息
    showMessage(message, type = 'info') {
        AppUtils.showMessage(message, type);
    }

    // 显示错误
    showError(message) {
        AppUtils.showError(message);
    }

    // 处理关于页面点击
    async handleAboutClick() {
        if (!this.aboutPage) return;

        // 隐藏工具网格和空状态
        document.getElementById('toolsGrid').style.display = 'none';
        document.getElementById('emptyState').style.display = 'none';
        
        // 显示关于页面容器
        const aboutPageContent = document.getElementById('aboutPageContent');
        if (aboutPageContent) {
            aboutPageContent.style.display = 'block';
            
            // 加载 Markdown 内容
            try {
                const response = await fetch(this.aboutPage.path);
                if (!response.ok) {
                    throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
                }
                const markdown = await response.text();
                
                // 使用 marked.js 转换为 HTML
                aboutPageContent.innerHTML = marked.parse(markdown);

                // 初始化 Twikoo 评论系统
                if (window.twikoo) {
                    twikoo.init({
                        envId: 'https://twikoo.ziyourufeng.eu.org/', // 腾讯云环境填 envId；Vercel 环境填地址（https://xxx.vercel.app）
                        el: '#tcomment', // 容器元素
                        lang: 'zh-CN', // 用于手动设定评论区语言
                    });
                }

                // 更新关于按钮为返回主页按钮
                const aboutButton = document.getElementById('aboutButton');
                if (aboutButton) {
                    aboutButton.innerHTML = '🏠 主页'; // 或者其他表示返回主页的图标和文本
                }

            } catch (error) {
                console.error('加载或转换关于页面失败:', error);
                this.showError('无法加载关于页面内容');
                aboutPageContent.innerHTML = `<p class="text-danger">加载关于页面失败: ${error.message}</p>`;
            }
        }
    }

    // 处理返回主页点击
    handleHomeClick() {
        this.renderToolsPage(); // 重新渲染工具页面
    }

    // 处理路由
    handleRouting() {
        // 默认显示工具页面
        this.renderToolsPage();
    }

    // 渲染工具页面
    renderToolsPage() {
        document.getElementById('toolsGrid').style.display = 'grid';
        document.getElementById('emptyState').style.display = 'none';
        const aboutPageContent = document.getElementById('aboutPageContent');
        if (aboutPageContent) {
            aboutPageContent.style.display = 'none';
        }

        // 恢复关于按钮为原始状态
        const aboutButton = document.getElementById('aboutButton');
        if (aboutButton && this.aboutPage) {
            aboutButton.innerHTML = `${this.aboutPage.icon} ${this.aboutPage.name}`;
        }
    }
}

// 应用特定的工具函数
const AppUtils = {
    // 显示消息提示
    showMessage(message, type = 'info') {
        // 创建消息提示元素
        const messageElement = document.createElement('div');
        messageElement.className = `alert alert-${type}`;
        messageElement.textContent = message;
        messageElement.style.position = 'fixed';
        messageElement.style.top = '20px';
        messageElement.style.right = '20px';
        messageElement.style.zIndex = '9999';
        messageElement.style.minWidth = '300px';
        messageElement.style.boxShadow = 'var(--shadow-hover)';
        
        // 添加到页面
        document.body.appendChild(messageElement);
        
        // 自动移除
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 3000);
    },

    // 显示错误
    showError(message) {
        this.showMessage(message, 'danger');
    },

    // 显示成功
    showSuccess(message) {
        this.showMessage(message, 'success');
    },

    // 显示警告
    showWarning(message) {
        this.showMessage(message, 'warning');
    },

    // 显示信息
    showInfo(message) {
        this.showMessage(message, 'info');
    }
};

// 应用初始化
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager(); // 首先实例化 ThemeManager
    window.app = new ToolsApp(); // 然后实例化 ToolsApp，此时 themeManager 已可用
  
    // 将工具函数暴露到全局
    window.AppUtils = AppUtils;
});
