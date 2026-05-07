/**
 * json-formatter.js - JSON 格式化工具逻辑
 */

/**
 * 安全格式化 JSON（支持循环引用检测）
 * @param {string} input - 原始 JSON 字符串
 * @param {number} indent - 缩进空格数
 * @returns {{ success: boolean, result?: string, error?: string }}
 */
function formatJSONStr(input, indent = 2) {
  try {
    // 使用 replacer 检测循环引用
    const seen = new WeakSet();
    const parsed = JSON.parse(input, (key, value) => {
      if (value !== null && typeof value === 'object') {
        if (seen.has(value)) {
          throw new Error('检测到循环引用');
        }
        seen.add(value);
      }
      return value;
    });
    return {
      success: true,
      result: JSON.stringify(parsed, null, indent)
    };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * 压缩 JSON（去除空白）
 */
function minifyJSONStr(input) {
  try {
    const parsed = JSON.parse(input);
    return { success: true, result: JSON.stringify(parsed) };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// ========== UI 操作 ==========

function formatJSON() {
  const input = document.getElementById('jsonInput').value.trim();
  const output = document.getElementById('jsonOutput');

  if (!input) {
    showToast('请输入 JSON 数据', 'error');
    return;
  }

  const result = formatJSONStr(input);
  if (result.success) {
    output.textContent = result.result;
    showToast('格式化成功', 'success');
  } else {
    output.textContent = '❌ ' + result.error;
    showToast('格式化失败：' + result.error, 'error');
  }
}

function minifyJSON() {
  const input = document.getElementById('jsonInput').value.trim();
  const output = document.getElementById('jsonOutput');

  if (!input) {
    showToast('请输入 JSON 数据', 'error');
    return;
  }

  const result = minifyJSONStr(input);
  if (result.success) {
    output.textContent = result.result;
    showToast('压缩成功', 'success');
  } else {
    output.textContent = '❌ ' + result.error;
    showToast('压缩失败：' + result.error, 'error');
  }
}

function validateJSON() {
  const input = document.getElementById('jsonInput').value.trim();
  const output = document.getElementById('jsonOutput');

  if (!input) {
    showToast('请输入 JSON 数据', 'error');
    return;
  }

  const result = formatJSONStr(input);
  if (result.success) {
    const stats = getJSONStats(result.result);
    output.textContent = '✅ JSON 验证通过！\n\n' + stats;
    showToast('JSON 格式正确', 'success');
  } else {
    output.textContent = '❌ JSON 验证失败：\n' + result.error;
    showToast('JSON 格式错误', 'error');
  }
}

/**
 * 获取 JSON 统计信息
 */
function getJSONStats(jsonStr) {
  try {
    const parsed = JSON.parse(jsonStr);
    const type = Array.isArray(parsed) ? '数组' : '对象';
    const size = new Blob([jsonStr]).size;
    const sizeStr = size > 1024 ? (size / 1024).toFixed(2) + ' KB' : size + ' B';
    return `类型：${type}\n大小：${sizeStr}\n内容：${jsonStr}`;
  } catch {
    return jsonStr;
  }
}

/**
 * 加载示例 JSON
 */
function loadSampleJSON() {
  const sample = {
    "name": "DevToolbox",
    "version": "1.0.0",
    "description": "开发者在线工具集合",
    "tools": [
      { "id": 1, "name": "进制转换", "category": "编码" },
      { "id": 2, "name": "时间戳转换", "category": "时间" },
      { "id": 3, "name": "JSON 格式化", "category": "编码" }
    ],
    "author": {
      "name": "开发者",
      "email": "dev@example.com"
    },
    "features": ["纯前端", "无需安装", "即开即用"]
  };
  document.getElementById('jsonInput').value = JSON.stringify(sample, null, 2);
  showToast('已加载示例 JSON', 'success');
}

// 页面加载时自动加载示例
document.addEventListener('DOMContentLoaded', () => {
  loadSampleJSON();
});
