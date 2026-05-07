/**
 * markdown-preview.js - Markdown 预览工具逻辑
 * 使用 marked.js（CDN），fallback 到内置安全渲染
 */

let renderTimeout = null;

/**
 * 渲染 Markdown 为 HTML
 */
function renderMarkdown() {
  const input = document.getElementById('mdInput');
  const preview = document.getElementById('mdPreview');
  if (!input || !preview) return;

  const md = input.value;

  // 优先使用 marked.js
  if (typeof marked !== 'undefined') {
    try {
      const html = marked.parse(md, { breaks: true, gfm: true });
      preview.innerHTML = html;
      return;
    } catch (e) {
      console.warn('marked.js 渲染失败，使用内置渲染', e);
    }
  }

  // Fallback：内置安全渲染
  preview.innerHTML = renderSafeMarkdown(md);
}

/**
 * 防抖渲染（输入时触发）
 */
function onMarkdownInput() {
  clearTimeout(renderTimeout);
  renderTimeout = setTimeout(renderMarkdown, 300);
}

/**
 * 加载示例 Markdown
 */
function loadMarkdownSample() {
  const sample = `# Markdown 预览示例

欢迎使用 **DevToolbox** Markdown 预览工具！

## 功能特点

- ✅ 实时预览
- ✅ 安全渲染（防 XSS）
- ✅ 支持 GFM 语法

## 代码示例

\`\`\`javascript
function hello(name) {
  console.log("Hello, " + name + "!");
}
\`\`\`

## 链接

[访问 DevToolbox](https://example.com)

> 💡 提示：在左侧编辑区输入 Markdown，右侧会实时预览效果。

---

*Happy Coding!*
`;
  document.getElementById('mdInput').value = sample;
  renderMarkdown();
  showToast('已加载示例 Markdown', 'success');
}

/**
 * 导出为 HTML 文件
 */
function exportHTML() {
  const preview = document.getElementById('mdPreview');
  if (!preview || !preview.textContent.trim()) {
    showToast('没有可导出的内容', 'error');
    return;
  }

  const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Markdown</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif;
           max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.8; color: #1d1d1f; }
    pre { background: #f5f5f7; padding: 16px; border-radius: 8px; overflow-x: auto; }
    code { background: #f5f5f7; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
    blockquote { border-left: 4px solid #0071e3; padding-left: 16px; color: #86868b; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #d2d2d7; padding: 8px 12px; text-align: left; }
    th { background: #f5f5f7; }
  </style>
</head>
<body>
${preview.innerHTML}
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'markdown-export.html';
  a.click();
  URL.revokeObjectURL(url);
  showToast('已导出 HTML 文件', 'success');
}

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('mdInput');
  if (input) {
    input.addEventListener('input', onMarkdownInput);
  }
  // 延迟执行，等待 marked.js 加载
  const checkReady = setInterval(() => {
    if (typeof marked !== 'undefined' || document.readyState === 'complete') {
      clearInterval(checkReady);
      loadMarkdownSample();
    }
  }, 200);
});
