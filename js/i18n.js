/**
 * i18n.js - 国际化翻译系统
 * 支持中文(zh)和英文(en)
 */

var i18n = {
  currentLang: 'zh',
  translations: {
    zh: {
      // 导航
      'nav.title': 'DevToolbox',
      'nav.home': '首页',

      // Hero
      'hero.badge': '纯前端 · 无需安装 · 即开即用',
      'hero.badge.en': 'Pure Frontend · No Install · Ready to Use',
      'hero.title': '实用工具<br>触手可及',
      'hero.title.en': 'Useful Tools<br>At Your Fingertips',
      'hero.desc': '进制转换、Cron 解析、JSON 格式化……多种开发者常用工具，全部在浏览器中安全运行。',
      'hero.desc.en': 'Number base conversion, Cron parsing, JSON formatting... all your dev tools, running securely in the browser.',
      'hero.cta': '开始使用',
      'hero.cta.en': 'Get Started',
      'hero.browse': '浏览全部工具',
      'hero.browse.en': 'Browse All Tools',

      // 特色亮点
      'feature.pure.title': '纯前端',
      'feature.pure.title.en': '100% Frontend',
      'feature.pure.desc': '所有计算都在浏览器中完成，数据不会上传任何服务器。',
      'feature.pure.desc.en': 'All processing happens in your browser. No data ever leaves your device.',
      'feature.offline.title': '即开即用',
      'feature.offline.title.en': 'Works Instantly',
      'feature.offline.desc': '无需安装、无需注册，打开网页就能使用全部功能。',
      'feature.offline.desc.en': 'No installation, no sign-up. Open the page and start using it right away.',
      'feature.privacy.title': '安全隐私',
      'feature.privacy.title.en': 'Privacy First',
      'feature.privacy.desc': '敏感数据（如密钥、密码）仅在本地处理，不留痕迹。',
      'feature.privacy.desc.en': 'Sensitive data like keys and passwords are processed locally with zero traces.',

      // 搜索
      'search.placeholder': '搜索工具…',
      'search.placeholder.en': 'Search tools…',
      'search.noresult': '没有找到匹配的工具"{{keyword}}"',
      'search.noresult.en': 'No tool matching "{{keyword}}"',
      'search.count': '找到 {{count}} 个工具',
      'search.count.en': 'Found {{count}} tools',

      // Section
      'section.title': '全部工具',
      'section.title.en': 'All Tools',
      'section.desc': '精心挑选的开发者工具，让日常工作更高效。',
      'section.desc.en': 'Hand-picked dev tools to make your daily work more productive.',
      'section.hot': '热门工具',
      'section.hot.en': 'Popular Tools',

      // 工具卡片 - 名称
      'tool.base-convert': '进制转换',
      'tool.base-convert.en': 'Base Converter',
      'tool.base-convert.desc': '在 2/8/10/16/32/64 进制之间自由转换，支持大整数。',
      'tool.base-convert.desc.en': 'Convert between 2/8/10/16/32/64 bases with BigInt support.',
      'tool.cron-parser': 'Cron 表达式解析',
      'tool.cron-parser.en': 'Cron Parser',
      'tool.cron-parser.desc': '解析 Cron 表达式，查看下次执行时间，验证定时任务配置。',
      'tool.cron-parser.desc.en': 'Parse cron expressions and preview upcoming execution times.',
      'tool.float-convert': '浮点数转换',
      'tool.float-convert.en': 'Float Converter',
      'tool.float-convert.desc': '查看单精度/双精度浮点数的二进制表示，深入理解 IEEE 754。',
      'tool.float-convert.desc.en': 'Explore IEEE 754 binary representation of single/double precision floats.',
      'tool.json-formatter': 'JSON 格式化',
      'tool.json-formatter.en': 'JSON Formatter',
      'tool.json-formatter.desc': '格式化、压缩、验证 JSON 数据，支持大文件和循环引用检测。',
      'tool.json-formatter.desc.en': 'Format, minify & validate JSON with circular reference detection.',
      'tool.regex-tester': '正则表达式测试',
      'tool.regex-tester.en': 'Regex Tester',
      'tool.regex-tester.desc': '实时测试正则表达式，高亮匹配结果，内置超时保护。',
      'tool.regex-tester.desc.en': 'Test regex patterns in real-time with highlighting and timeout protection.',
      'tool.timestamp': '时间戳转换',
      'tool.timestamp.en': 'Timestamp Converter',
      'tool.timestamp.desc': 'Unix 时间戳与日期时间互转，支持多时区和毫秒级精度。',
      'tool.timestamp.desc.en': 'Convert Unix timestamps to dates and vice versa with millisecond precision.',
      'tool.uuid-gen': 'UUID 生成器',
      'tool.uuid-gen.en': 'UUID Generator',
      'tool.uuid-gen.desc': '生成 v1/v4 UUID，支持批量生成和自定义格式。',
      'tool.uuid-gen.desc.en': 'Generate v1/v4 UUIDs with batch mode and custom formatting.',
      'tool.base64': 'Base64 编解码',
      'tool.base64.en': 'Base64 Encode/Decode',
      'tool.base64.desc': '文本和文件的 Base64 编码与解码，支持大文件分片处理。',
      'tool.base64.desc.en': 'Encode/decode text and files with chunked processing for large files.',
      'tool.markdown-preview': 'Markdown 预览',
      'tool.markdown-preview.en': 'Markdown Preview',
      'tool.markdown-preview.desc': '实时编辑 Markdown 并预览效果，支持导出 HTML。',
      'tool.markdown-preview.desc.en': 'Edit Markdown live with preview and HTML export support.',
      'tool.qr-generator': '二维码生成',
      'tool.qr-generator.en': 'QR Generator',
      'tool.qr-generator.desc': '将文本或链接转换为二维码，支持自定义尺寸和容错级别。',
      'tool.qr-generator.desc.en': 'Convert text or links to QR codes with custom size and error correction.',
      'tool.hash-calc': 'Hash 计算',
      'tool.hash-calc.en': 'Hash Calculator',
      'tool.hash-calc.desc': '计算文本或文件的 MD5/SHA1/SHA256/SHA512 哈希值。',
      'tool.hash-calc.desc.en': 'Calculate MD5, SHA1, SHA256, SHA512 hashes for text or files.',
      'tool.url-encode': 'URL 编解码',
      'tool.url-encode.en': 'URL Encode/Decode',
      'tool.url-encode.desc': 'URL 编码与解码，支持批量处理和组件级别编码。',
      'tool.url-encode.desc.en': 'Encode/decode URLs with batch processing support.',
      'tool.color-convert': '颜色转换',
      'tool.color-convert.en': 'Color Converter',
      'tool.color-convert.desc': 'HEX、RGB、HSL 颜色格式互转，实时预览和调色盘。',
      'tool.color-convert.desc.en': 'Convert between HEX, RGB, HSL with real-time color preview.',
      'tool.file-converter': '文件格式转换',
      'tool.file-converter.en': 'File Converter',
      'tool.file-converter.desc': 'Excel、CSV、JSON、PDF、Word 等格式互转，纯前端处理不上传服务器。',
      'tool.file-converter.desc.en': 'Convert between Excel, CSV, JSON, PDF, Word — all in your browser.',

      // 工具卡片 - 通用
      'tool.view': '查看 →',
      'tool.view.en': 'View →',

      // 语言
      'lang.switch': '中/EN',

      // Footer
      'footer.about': '关于',
      'footer.privacy': '隐私政策',
      'footer.copyright': '© 2026 DevToolbox. 纯前端实现，数据不会上传服务器。',
      'footer.copyright.en': '© 2026 DevToolbox. Pure frontend, no data uploaded to any server.',
      'footer.dev': '开发中',
      'footer.dev.en': 'Coming soon',

      // 通用
      'common.loading': '加载中…',
      'common.loading.en': 'Loading…',
    },

    en: {
      // 导航
      'nav.title': 'DevToolbox',
      'nav.home': 'Home',

      // Hero — 英文直接从 zh 的 .en 版取
      'hero.badge': 'Pure Frontend · No Install · Ready to Use',
      'hero.title': 'Useful Tools<br>At Your Fingertips',
      'hero.desc': 'Number base conversion, Cron parsing, JSON formatting... all your dev tools, running securely in the browser.',
      'hero.cta': 'Get Started',
      'hero.browse': 'Browse All Tools',

      // 特色
      'feature.pure.title': '100% Frontend',
      'feature.pure.desc': 'All processing happens in your browser. No data ever leaves your device.',
      'feature.offline.title': 'Works Instantly',
      'feature.offline.desc': 'No installation, no sign-up. Open the page and start using it right away.',
      'feature.privacy.title': 'Privacy First',
      'feature.privacy.desc': 'Sensitive data like keys and passwords are processed locally with zero traces.',

      // 搜索
      'search.placeholder': 'Search tools…',
      'search.noresult': 'No tool matching "{{keyword}}"',
      'search.count': 'Found {{count}} tools',

      // Section
      'section.title': 'All Tools',
      'section.desc': 'Hand-picked dev tools to make your daily work more productive.',
      'section.hot': 'Popular Tools',

      // 工具卡片
      'tool.base-convert': 'Base Converter',
      'tool.base-convert.desc': 'Convert between 2/8/10/16/32/64 bases with BigInt support.',
      'tool.cron-parser': 'Cron Parser',
      'tool.cron-parser.desc': 'Parse cron expressions and preview upcoming execution times.',
      'tool.float-convert': 'Float Converter',
      'tool.float-convert.desc': 'Explore IEEE 754 binary representation of single/double precision floats.',
      'tool.json-formatter': 'JSON Formatter',
      'tool.json-formatter.desc': 'Format, minify & validate JSON with circular reference detection.',
      'tool.regex-tester': 'Regex Tester',
      'tool.regex-tester.desc': 'Test regex patterns in real-time with highlighting and timeout protection.',
      'tool.timestamp': 'Timestamp Converter',
      'tool.timestamp.desc': 'Convert Unix timestamps to dates and vice versa with millisecond precision.',
      'tool.uuid-gen': 'UUID Generator',
      'tool.uuid-gen.desc': 'Generate v1/v4 UUIDs with batch mode and custom formatting.',
      'tool.base64': 'Base64 Encode/Decode',
      'tool.base64.desc': 'Encode/decode text and files with chunked processing for large files.',
      'tool.markdown-preview': 'Markdown Preview',
      'tool.markdown-preview.desc': 'Edit Markdown live with preview and HTML export support.',
      'tool.qr-generator': 'QR Generator',
      'tool.qr-generator.desc': 'Convert text or links to QR codes with custom size and error correction.',
      'tool.hash-calc': 'Hash Calculator',
      'tool.hash-calc.desc': 'Calculate MD5, SHA1, SHA256, SHA512 hashes for text or files.',
      'tool.url-encode': 'URL Encode/Decode',
      'tool.url-encode.desc': 'Encode/decode URLs with batch processing support.',
      'tool.color-convert': 'Color Converter',
      'tool.color-convert.desc': 'Convert between HEX, RGB, HSL with real-time color preview.',
      'tool.file-converter': 'File Converter',
      'tool.file-converter.desc': 'Convert between Excel, CSV, JSON, PDF, Word — all in your browser.',

      // 工具卡片 - 通用
      'tool.view': 'View →',

      // 语言
      'lang.switch': '中文',

      // Footer
      'footer.about': 'About',
      'footer.privacy': 'Privacy',
      'footer.copyright': '© 2026 DevToolbox. Pure frontend, no data uploaded to any server.',
      'footer.dev': 'Coming soon',

      // 通用
      'common.loading': 'Loading…',
    }
  },

  /**
   * 获取当前语言的翻译
   */
  t: function(key) {
    var lang = this.currentLang;
    var dict = this.translations[lang];
    if (dict && dict[key] !== undefined) return dict[key];

    // fallback: 中文缺失时返回 key 本身
    if (lang === 'en') {
      var zhDict = this.translations['zh'];
      if (zhDict && zhDict[key] !== undefined) return zhDict[key];
    }
    return key;
  },

  /**
   * 设置语言
   */
  setLanguage: function(lang) {
    if (!this.translations[lang]) return;
    this.currentLang = lang;
    localStorage.setItem('lang', lang);

    // 更新所有 data-i18n 元素
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      var text = i18n.t(key);
      // 支持 HTML 内容
      el.innerHTML = text;
    });

    // 更新所有 data-i18n-placeholder 元素
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = i18n.t(key);
    });

    // 更新语言切换按钮
    var langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
      langBtn.textContent = lang === 'zh' ? '中/EN' : '中文';
    }

    // 触发自定义事件
    document.dispatchEvent(new CustomEvent('languageChanged', {detail: {lang: lang}}));
  },

  /**
   * 初始化语言
   */
  init: function() {
    var saved = localStorage.getItem('lang');
    var lang = saved || 'zh';
    this.setLanguage(lang);
  }
};
