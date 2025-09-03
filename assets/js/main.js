// 应用主逻辑
class ToolsApp {
    constructor() {
        this.config = {}; // 添加配置属性
        this.tools = [];
        this.categories = {};
        this.currentCategory = 'all';
        this.searchQuery = '';
        this.aboutPage = null; // 用于存储关于页面配置
        this.translations = {}; // 添加翻译属性
        this.currentLang = localStorage.getItem('lang') || 'zh-CN'; // 当前语言，从localStorage获取或默认为中文
      
        this.init();
    }

    /**
     * @description 初始化应用程序，加载所有必要的数据和配置
     */
    async init() {
        try {
            await this.loadConfig(); // 首先加载配置
            // 在加载配置后，根据当前语言设置aboutPage的路径
            if (this.config.pages && this.config.pages.about) {
                this.aboutPage = { ...this.config.pages.about }; // 复制对象以避免直接修改config
            }
            await this.loadToolsData();
            await this.loadTranslations(); // 加载翻译数据
            this.setInitialLanguage(); // 设置初始语言
            this.applySEO(); // 应用SEO配置
            this.initializeTheme();
            this.renderNavigation();
            this.renderTools();
            this.renderAboutButton(); // 渲染关于按钮
            this.bindEventListeners();
            this.updateCounts();
            
            this.handleRouting(); // 处理初始路由
            window.addEventListener('hashchange', () => this.handleRouting()); // 监听路由变化

            this.translatePage(); // 翻译页面内容
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

    // 加载翻译数据
    async loadTranslations() {
        try {
            const response = await fetch('./config/languages.json');
            if (!response.ok) {
                throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            this.translations = data;
        } catch (error) {
            console.error('加载翻译数据失败:', error);
            this.showError('无法加载翻译数据，请检查网络连接或联系管理员');
            throw error;
        }
    }

    // 设置初始语言
    setInitialLanguage() {
        const savedLang = localStorage.getItem('lang');
        if (savedLang && this.translations[savedLang]) {
            this.currentLang = savedLang;
        } else {
            // 尝试从浏览器获取语言，默认为zh-CN
            const browserLang = navigator.language.startsWith('zh') ? 'zh-CN' : 'en';
            this.currentLang = this.translations[browserLang] ? browserLang : 'zh-CN';
            localStorage.setItem('lang', this.currentLang);
        }
        // 更新语言选择器
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = this.currentLang;
        }
    }

    // 应用SEO配置
    applySEO() {
        const seoConfig = this.config.seo;
        if (!seoConfig) return;

        // 更新页面标题
        if (seoConfig.title) {
            document.title = this.getTranslation(seoConfig.title); // 使用翻译
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
            updateMeta('description', this.getTranslation(seoConfig.description)); // 使用翻译
        }
        if (seoConfig.keywords) {
            updateMeta('keywords', this.getTranslation(seoConfig.keywords)); // 使用翻译
        }

        // --- Canonical URL ---
        if (seoConfig.canonicalUrl) {
            updateLink('canonical', seoConfig.canonicalUrl);
        }

        // --- Open Graph Meta 标签 (社交媒体分享) ---
        if (seoConfig.ogTitle) {
            updateMeta('og:title', this.getTranslation(seoConfig.ogTitle), true);
        } else if (seoConfig.title) {
             updateMeta('og:title', this.getTranslation(seoConfig.title), true);
        }
        
        if (seoConfig.ogDescription) {
            updateMeta('og:description', this.getTranslation(seoConfig.ogDescription), true);
        } else if (seoConfig.description) {
             updateMeta('og:description', this.getTranslation(seoConfig.description), true);
        }

        if (seoConfig.ogUrl) {
            updateMeta('og:url', seoConfig.ogUrl, true);
        } else if (seoConfig.canonicalUrl) {
            updateMeta('og:url', seoConfig.canonicalUrl, true);
        } else {
            updateMeta('og:url', window.location.href, true);
        }
        
        if (seoConfig.ogImage) {
            updateMeta('og:image', `${window.location.protocol}//${window.location.host}${seoConfig.ogImage}`, true);
        }

        // --- Twitter Card Meta 标签 (Twitter 分享) ---
        if (seoConfig.twitterCard) {
            updateMeta('twitter:card', seoConfig.twitterCard);
        }

        // --- Favicon ---
        if (seoConfig.favicon) {
            updateLink('icon', seoConfig.favicon);
        }
    }


    // 初始化主题
    initializeTheme() {
        this.updateThemeToggle(); 
    }

    // 获取翻译文本
    getTranslation(key) {
        return this.translations[this.currentLang] && this.translations[this.currentLang][key]
            ? this.translations[this.currentLang][key]
            : key; // 如果没有找到翻译，则返回原始键
    }

    // 更新主题切换按钮
    updateThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.textContent = window.themeManager.theme === 'light' ? '☀️' : '🌙';
        }
    }

    // 翻译单个元素
    translateElement(element) {
        const key = element.dataset.i18n;
        if (key) {
            element.textContent = this.getTranslation(key);
        }
        const placeholderKey = element.dataset.i18nPlaceholder;
        if (placeholderKey) {
            element.placeholder = this.getTranslation(placeholderKey);
        }
    }

    // 翻译整个页面
    translatePage() {
        document.querySelectorAll('[data-i18n]').forEach(element => this.translateElement(element));
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => this.translateElement(element));
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.placeholder = this.getTranslation('search_tools');
        }
        this.updateHeaderButtons(); // 更新按钮状态和文本
        this.renderNavigation();
        this.renderTools();
    }

    // 渲染关于按钮
    renderAboutButton() {
        const headerActions = document.querySelector('.header-actions');
        if (!headerActions || !this.config.pages || !this.config.pages.about) return;

        let aboutButton = document.getElementById('aboutButton');

        if (!aboutButton) {
            aboutButton = document.createElement('a'); // Change to an anchor tag for routing
            aboutButton.id = 'aboutButton';
            aboutButton.className = 'theme-toggle'; // 复用 theme-toggle 的样式
            
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) {
                headerActions.insertBefore(aboutButton, themeToggle);
            } else {
                headerActions.appendChild(aboutButton);
            }
        }
        this.updateHeaderButtons(); // 初始化按钮状态
    }

    // 更新头部按钮状态（关于/返回）
    updateHeaderButtons() {
        const aboutButton = document.getElementById('aboutButton');
        if (!aboutButton) return;

        const isSubPage = window.location.hash.startsWith('#/about') || 
                          window.location.hash.startsWith('#/privacy-policy') || 
                          window.location.hash.startsWith('#/terms-of-service');

        if (isSubPage) {
            // 在子页面，显示“返回主页”
            aboutButton.href = '#/';
            aboutButton.innerHTML = `↩️ ${this.getTranslation('back_to_home')}`;
        } else {
            // 在主页，显示“关于我们”
            aboutButton.href = '#/about';
            aboutButton.innerHTML = `${this.config.pages.about.icon} ${this.getTranslation('about_us')}`;
        }
    }

    // 渲染导航
    renderNavigation() {
        const navList = document.getElementById('navList');
        if (!navList) return;

        navList.innerHTML = '';

        if (!this.categories || Object.keys(this.categories).length === 0) {
            return;
        }

        Object.entries(this.categories).forEach(([key, category]) => {
            const categoryName = this.currentLang === 'en' && category.name_en ? category.name_en : category.name;
            const navItem = this.createNavItem(key, categoryName, category.icon);
            navList.appendChild(navItem);
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
        
        if (!toolsGrid || !emptyState) return;

        const filteredTools = this.tools.filter(tool => {
            const matchesCategory = this.currentCategory === 'all' || tool.category === this.currentCategory;
            const lowerCaseQuery = this.searchQuery.toLowerCase();
            const matchesSearch = this.searchQuery === '' || 
                tool.name.toLowerCase().includes(lowerCaseQuery) ||
                (tool.name_en && tool.name_en.toLowerCase().includes(lowerCaseQuery)) ||
                tool.description.toLowerCase().includes(lowerCaseQuery) ||
                (tool.description_en && tool.description_en.toLowerCase().includes(lowerCaseQuery));
            return matchesCategory && matchesSearch;
        });

        toolsGrid.innerHTML = '';

        if (filteredTools.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
        }

        filteredTools.forEach(tool => {
            const toolCard = this.createToolCard(tool);
            toolsGrid.appendChild(toolCard);
        });
    }

    // 创建工具卡片
    createToolCard(tool) {
        const card = document.createElement('a');
        card.className = 'tools-item';
        card.href = tool.url;

        if (!tool.url.startsWith('#')) {
            card.target = '_blank';
            card.rel = 'noopener noreferrer';
        }
        
        const toolName = this.currentLang === 'en' && tool.name_en ? tool.name_en : tool.name;
        const toolDescription = this.currentLang === 'en' && tool.description_en ? tool.description_en : tool.description;

        card.innerHTML = `
            <div class="tools-item-icon" style="background-color: ${tool.iconColor}20; color: ${tool.iconColor}">
                ${tool.icon}
            </div>
            <h3>${toolName}</h3>
            <div class="tools-item-content">
                <p>${toolDescription}</p>
                <div class="tools-item-badges">
                    ${tool.isNew ? `<span class="tools-item-badge new">${this.getTranslation('new_feature')}</span>` : ''}
                    ${tool.author === '官方' ? `<span class="tools-item-badge">${this.getTranslation('official')}</span>` : ''}
                    ${tool.author === '原创' ? `<span class="tools-item-badge">${this.getTranslation('original')}</span>` : ''}
                    ${tool.author && tool.author !== '官方' && tool.author !== '原创' ? `<span class="tools-item-badge">${tool.author}</span>` : ''}
                </div>
            </div>
        `;

        return card;
    }

    // 绑定事件监听器
    bindEventListeners() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => this.setLanguage(e.target.value));
        }

        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e));
        }

        document.addEventListener('click', (e) => {
            if (e.target.closest('.nav-link')) {
                e.preventDefault();
                this.handleCategoryChange(e.target.closest('.nav-link'));
            }
        });

        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        }

        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar');
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            
            if (window.innerWidth <= 768 && 
                sidebar && !sidebar.contains(e.target) && 
                mobileMenuBtn && !mobileMenuBtn.contains(e.target)) {
                sidebar.classList.remove('mobile-open');
            }
        });

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
        if (window.themeManager) {
            window.themeManager.toggle();
            this.updateThemeToggle();
        }
    }

    // 处理搜索
    handleSearch(e) {
        this.searchQuery = e.target.value.trim();
        this.renderTools();
    }

    // 处理分类变更
    handleCategoryChange(linkElement) {
        this.currentCategory = linkElement.dataset.category;
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        linkElement.classList.add('active');
        
        this.renderTools();
        
        if (window.innerWidth <= 768) {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.remove('mobile-open');
            }
        }
        
        // If on a different page, navigate to home to show tools
        if (window.location.hash !== '' && window.location.hash !== '#/') {
            window.location.hash = '#/';
        }
    }

    setLanguage(langCode) {
        if (this.currentLang === langCode) return;

        this.currentLang = langCode;
        localStorage.setItem('lang', langCode);

        // 更新SEO信息
        document.documentElement.lang = langCode;
        this.applySEO();

        this.translatePage();
        
        // If on a page that depends on language, refresh its content
        this.handleRouting();
    }

    toggleMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('mobile-open');
        }
    }

    showMessage(message, type = 'info') {
        AppUtils.showMessage(message, type);
    }

    showError(message) {
        AppUtils.showError(message);
    }

    // --- Page Rendering & Routing ---

    handleRouting() {
        const hash = window.location.hash;

        if (hash.startsWith('#/tool/')) {
            const toolId = hash.substring('#/tool/'.length);
            this.showToolTutorialPage(toolId);
        } else if (hash === '#/about') {
            this.showMarkdownPage('about');
        } else if (hash === '#/privacy-policy') {
            this.showMarkdownPage('privacy-policy');
        } else if (hash === '#/terms-of-service') {
            this.showMarkdownPage('terms-of-service');
        } else {
            this.showMainPage();
        }
    }

    showMainPage() {
        document.getElementById('toolsGrid').style.display = 'grid';
        document.getElementById('aboutPageContent').style.display = 'none';
        document.getElementById('toolTutorialPageContent').style.display = 'none';
        this.renderTools();
        this.updateHeaderButtons(); // Update button state
    }

    async showMarkdownPage(pageId) {
        this.updateHeaderButtons(); // Update button state
        document.getElementById('toolsGrid').style.display = 'none';
        document.getElementById('emptyState').style.display = 'none';
        document.getElementById('toolTutorialPageContent').style.display = 'none';
        
        const pageContent = document.getElementById('aboutPageContent');
        pageContent.style.display = 'block';
        
        const twikooContainer = document.getElementById('twikooContainer');
        const markdownContainer = document.getElementById('markdownRenderedContent');

        try {
            const path = `./docs/${pageId}.${this.currentLang}.md`;
            let response = await fetch(path);
            if (!response.ok) {
                const fallbackLang = 'zh-CN';
                const fallbackPath = `./docs/${pageId}.${fallbackLang}.md`;
                response = await fetch(fallbackPath);
                if (!response.ok) throw new Error(`Could not load content file: ${fallbackPath}`);
            }
            const markdown = await response.text();
            markdownContainer.innerHTML = marked.parse(markdown);

            // Only show comments on the 'about' page
            if (pageId === 'about' && window.twikoo) {
                twikooContainer.style.display = 'block';
                twikoo.init({
                    envId: 'https://twikoo.ziyourufeng.eu.org/.netlify/functions/twikoo',
                    el: '#tcomment',
                    lang: this.currentLang,
                });
            } else {
                twikooContainer.style.display = 'none';
            }
        } catch (error) {
            console.error(`Failed to load or render ${pageId} page:`, error);
            this.showError(`Could not load ${pageId} content`);
            markdownContainer.innerHTML = `<p class="text-danger">Failed to load content: ${error.message}</p>`;
        }
    }

    async showToolTutorialPage(toolId) {
        const tool = this.tools.find(t => t.id === toolId);
        if (!tool) {
            this.showError(`Tool "${toolId}" not found.`);
            window.location.hash = '#/';
            return;
        }

        document.getElementById('toolsGrid').style.display = 'none';
        document.getElementById('emptyState').style.display = 'none';
        document.getElementById('aboutPageContent').style.display = 'none';
        const tutorialPage = document.getElementById('toolTutorialPageContent');
        tutorialPage.style.display = 'block';

        const toolName = this.currentLang === 'en' && tool.name_en ? tool.name_en : tool.name;
        document.getElementById('toolTutorialTitle').textContent = toolName;
        const goToToolBtn = document.getElementById('goToToolBtn');
        goToToolBtn.href = tool.tool_url;
        
        // Translate buttons on this page
        document.querySelector('[data-i18n="go_to_tool"]').textContent = this.getTranslation('go_to_tool');
        document.querySelector('[data-i18n="back_to_home"]').textContent = this.getTranslation('back_to_home');

        const markdownContentEl = document.getElementById('toolTutorialMarkdownContent');
        markdownContentEl.innerHTML = `<p>${this.getTranslation('loading')}...</p>`;

        const basePath = `./docs/tools/${toolId}`;
        let mdPath = `${basePath}.${this.currentLang}.md`;

        try {
            let response = await fetch(mdPath);
            if (!response.ok) {
                const fallbackLang = 'zh-CN';
                mdPath = `${basePath}.${fallbackLang}.md`;
                response = await fetch(mdPath);
                if (!response.ok) throw new Error(`Could not load tutorial file: ${mdPath}`);
            }
            const markdown = await response.text();
            markdownContentEl.innerHTML = marked.parse(markdown);
        } catch (error) {
            console.error('Failed to load tool tutorial:', error);
            this.showError('Could not load tool tutorial content');
            markdownContentEl.innerHTML = `<p class="text-danger">Failed to load tutorial.</p>`;
        }
    }
}

// 应用特定的工具函数
const AppUtils = {
    showMessage(message, type = 'info') {
        if (window.Utils && window.Utils.showMessage) {
            window.Utils.showMessage(message, type);
        } else {
            alert(message);
        }
    },
    showError(message) { this.showMessage(message, 'danger'); },
    showSuccess(message) { this.showMessage(message, 'success'); },
    showWarning(message) { this.showMessage(message, 'warning'); },
    showInfo(message) { this.showMessage(message, 'info'); }
};

// 应用初始化
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
    window.app = new ToolsApp();
    window.AppUtils = AppUtils;
});
