/**
 * url-encode.js - URL 编解码工具逻辑
 */

function urlEncode() {
  const input = document.getElementById('urlInput').value;
  const output = document.getElementById('urlOutput');

  if (!input) {
    showToast('请输入内容', 'error');
    return;
  }

  try {
    const encoded = encodeURI(input);
    output.textContent = encoded;
    showToast('编码成功', 'success');
  } catch (e) {
    output.textContent = '❌ 编码失败：' + e.message;
    showToast('编码失败', 'error');
  }
}

function urlDecode() {
  const input = document.getElementById('urlInput').value.trim();
  const output = document.getElementById('urlOutput');

  if (!input) {
    showToast('请输入 URL 编码字符串', 'error');
    return;
  }

  try {
    const decoded = decodeURI(input);
    output.textContent = decoded;
    showToast('解码成功', 'success');
  } catch (e) {
    output.textContent = '❌ 解码失败：' + e.message + '\n请确认输入有效的 URL 编码字符串';
    showToast('解码失败', 'error');
  }
}

function urlEncodeComponent() {
  const input = document.getElementById('urlInput').value;
  const output = document.getElementById('urlOutput');

  if (!input) {
    showToast('请输入内容', 'error');
    return;
  }

  try {
    const encoded = encodeURIComponent(input);
    output.textContent = encoded;
    showToast('组件编码成功', 'success');
  } catch (e) {
    output.textContent = '❌ 编码失败：' + e.message;
    showToast('编码失败', 'error');
  }
}

// 回车触发编码
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('urlInput');
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') urlEncode();
    });
  }
});
