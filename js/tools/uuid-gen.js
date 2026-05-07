/**
 * uuid-gen.js - UUID 生成器逻辑
 */

/**
 * 生成单个 v4 UUID（使用浏览器原生 crypto.randomUUID）
 * @returns {string}
 */
function generateUUID() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // fallback：手动生成
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * 格式化 UUID
 * @param {string} uuid - 原始 UUID
 * @param {string} format - lower | upper | no-dash
 * @returns {string}
 */
function formatUUID(uuid, format) {
  let s = uuid;
  if (format === 'upper') return s.toUpperCase();
  if (format === 'no-dash') return s.replace(/-/g, '');
  return s.toLowerCase();
}

/**
 * 批量生成 UUID
 */
function generateUUIDs() {
  const count = parseInt(document.getElementById('uuidCount').value, 10) || 1;
  const format = document.getElementById('uuidFormat').value;
  const resultEl = document.getElementById('uuidResult');

  if (count < 1 || count > 100) {
    showToast('生成数量请在 1-100 之间', 'error');
    return;
  }

  const results = [];
  for (let i = 0; i < count; i++) {
    results.push(formatUUID(generateUUID(), format));
  }

  resultEl.textContent = results.join('\n');
  showToast('已生成 ' + count + ' 个 UUID', 'success');
}

// 页面加载时自动生成一次
document.addEventListener('DOMContentLoaded', () => {
  generateUUIDs();
});
