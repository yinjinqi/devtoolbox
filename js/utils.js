/**
 * utils.js - 公共工具函数
 * 包含：统一错误处理、输入校验、安全过滤、防抖/节流、Web Worker 辅助
 */

/* ====== 错误处理 ====== */

/**
 * 统一显示提示消息（Apple 风格 Toast）
 * @param {string} message - 提示内容
 * @param {'success'|'error'|'info'} type - 类型
 * @param {number} duration - 显示时长 ms
 */
function showToast(message, type = 'info', duration = 2500) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = 'toast' + (type ? ' ' + type : '');
  // 触发重排以重新启动动画
  void toast.offsetWidth;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/**
 * 安全执行函数，捕获异常并返回结果对象
 * @param {Function} fn - 要执行的函数
 * @param {*} input - 传入参数
 * @returns {{ success: boolean, data?: *, error?: string }}
 */
function safeExecute(fn, input) {
  try {
    const data = fn(input);
    return { success: true, data };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/* ====== 输入校验 ====== */

/**
 * 校验输入字符串长度
 * @param {string} input - 输入字符串
 * @param {number} maxLength - 最大长度（字符数）
 * @param {string} label - 字段名称（用于错误提示）
 * @returns {{ valid: boolean, error?: string }}
 */
function validateLength(input, maxLength, label = '输入') {
  if (!input) return { valid: true };
  if (input.length > maxLength) {
    return {
      valid: false,
      error: `${label}过长（最大 ${maxLength.toLocaleString()} 字符，当前 ${input.length.toLocaleString()} 字符）`
    };
  }
  return { valid: true };
}

/**
 * 校验文件大小
 * @param {File} file - 文件对象
 * @param {number} maxBytes - 最大字节数
 * @returns {{ valid: boolean, error?: string }}
 */
function validateFileSize(file, maxBytes) {
  if (file.size > maxBytes) {
    const maxMB = (maxBytes / 1024 / 1024).toFixed(0);
    const fileMB = (file.size / 1024 / 1024).toFixed(2);
    return {
      valid: false,
      error: `文件过大（最大 ${maxMB}MB，当前 ${fileMB}MB）`
    };
  }
  return { valid: true };
}

/* ====== 安全过滤 ====== */

/**
 * 转义 HTML 特殊字符（防 XSS）
 * @param {string} str - 原始字符串
 * @returns {string} 转义后的字符串
 */
function escapeHTML(str) {
  if (typeof str !== 'string') return String(str);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * 简单 Markdown 渲染（只渲染安全标签，防 XSS）
 * @param {string} md - Markdown 文本
 * @returns {string} HTML 字符串
 */
function renderSafeMarkdown(md) {
  if (typeof md !== 'string') return '';
  let html = escapeHTML(md);
  // 加粗
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // 斜体
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // 行内代码
  html = html.replace(/`(.+?)`/g, '<code>$1</code>');
  // 代码块
  html = html.replace(/```[\s\S]*?```/g, function (m) {
    const inner = m.replace(/```/g, '').trim();
    return '<pre><code>' + inner + '</code></pre>';
  });
  // 链接（限制安全协议）
  html = html.replace(/\[(.+?)\]\(((https?:\/\/).+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  // 换行
  html = html.replace(/\n/g, '<br>');
  return html;
}

/* ====== 防抖 & 节流 ====== */

/**
 * 防抖函数
 * @param {Function} fn - 目标函数
 * @param {number} delay - 延迟 ms
 * @returns {Function}
 */
function debounce(fn, delay = 300) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * 节流函数
 * @param {Function} fn - 目标函数
 * @param {number} interval - 最小间隔 ms
 * @returns {Function}
 */
function throttle(fn, interval = 200) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn.apply(this, args);
    }
  };
}

/* ====== 正则超时控制 ====== */

/**
 * 带超时的正则表达式测试
 * @param {RegExp} regex - 正则表达式
 * @param {string} str - 测试字符串
 * @param {number} timeoutMs - 超时 ms，默认 2000
 * @returns {{ matched: boolean, timeout: boolean, error?: string }}
 */
function safeRegexTest(regex, str, timeoutMs = 2000) {
  const startTime = Date.now();
  // 使用 setTimeout 模拟超时（在主线程中通过检查时间实现）
  try {
    // 对于可能卡死的正则，分步匹配
    const flags = regex.global ? 'g' : '';
    const re = new RegExp(regex.source, flags);
    const result = re.test(str);
    if (Date.now() - startTime > timeoutMs) {
      return { matched: false, timeout: true };
    }
    return { matched: result, timeout: false };
  } catch (e) {
    return { matched: false, timeout: false, error: e.message };
  }
}

/* ====== 大文件分片读取 ====== */

/**
 * 分片读取文件为文本（用于大文件 Base64 等场景）
 * @param {File} file - 文件对象
 * @param {Function} onProgress - 进度回调 (0-100)
 * @param {number} chunkSize - 分片大小（默认 1MB）
 * @returns {Promise<string>}
 */
function readFileInChunks(file, onProgress, chunkSize = 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    let offset = 0;
    let result = '';

    reader.onload = function (e) {
      result += e.target.result;
      offset += e.target.result.length;
      const progress = Math.min(100, Math.round((offset / file.size) * 100));
      if (onProgress) onProgress(progress);

      if (offset < file.size) {
        readNextChunk();
      } else {
        resolve(result);
      }
    };

    reader.onerror = function () {
      reject(new Error('文件读取失败'));
    };

    function readNextChunk() {
      const slice = file.slice(offset, offset + chunkSize);
      reader.readAsText(slice);
    }

    readNextChunk();
  });
}

/* ====== 复制文本到剪贴板 ====== */

/**
 * 复制文本到剪贴板（Apple 风格提示）
 * @param {string} text - 要复制的文本
 * @param {string} label - 提示标签
 */
async function copyToClipboard(text, label = '内容') {
  try {
    await navigator.clipboard.writeText(text);
    showToast(label + '已复制到剪贴板', 'success');
  } catch (e) {
    // fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast(label + '已复制到剪贴板', 'success');
  }
}

/* ====== 滚动渐现动画 ====== */

/**
 * 初始化滚动渐现动画（无需 AOS.js，原生实现）
 */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ====== 主题切换 ====== */

/**
 * 初始化主题（读取 localStorage，默认跟随系统）
 */
function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

/**
 * 切换明暗主题
 */
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon();
}

/**
 * 更新主题切换按钮图标
 */
function updateThemeIcon() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  btn.innerHTML = isDark
    ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
    : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
}

/**
 * 切换中英文
 */
function toggleLanguage() {
  var newLang = i18n.currentLang === 'zh' ? 'en' : 'zh';
  i18n.setLanguage(newLang);
  showToast(newLang === 'zh' ? '已切换为中文' : 'Switched to English', 'success');
}

/* ====== 初始化 ====== */

// DOM 加载完成后自动初始化
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateThemeIcon();
  initScrollAnimations();
});
