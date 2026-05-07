/**
 * base64.js - Base64 编解码工具逻辑
 */

// ========== 文本编解码 ==========

function b64Encode() {
  const input = document.getElementById('b64Input').value;
  const output = document.getElementById('b64Output');

  if (!input) {
    showToast('请输入文本内容', 'error');
    return;
  }

  try {
    // 支持中文：先 encode 为 UTF-8 再 Base64
    const utf8Bytes = new TextEncoder().encode(input);
    let binary = '';
    utf8Bytes.forEach(b => binary += String.fromCharCode(b));
    const encoded = btoa(binary);
    output.textContent = encoded;
    showToast('编码成功', 'success');
  } catch (e) {
    output.textContent = '❌ 编码失败：' + e.message;
    showToast('编码失败', 'error');
  }
}

function b64Decode() {
  const input = document.getElementById('b64Input').value.trim();
  const output = document.getElementById('b64Output');

  if (!input) {
    showToast('请输入 Base64 字符串', 'error');
    return;
  }

  try {
    const binary = atob(input);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const decoded = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    output.textContent = decoded;
    showToast('解码成功', 'success');
  } catch (e) {
    output.textContent = '❌ 解码失败：' + e.message + '\n请确认输入的是有效的 Base64 字符串';
    showToast('解码失败', 'error');
  }
}

// ========== 文件编解码 ==========

function b64EncodeFile() {
  const fileInput = document.getElementById('b64FileInput');
  const output = document.getElementById('b64FileOutput');
  const info = document.getElementById('b64FileInfo');

  if (!fileInput.files.length) {
    showToast('请选择文件', 'error');
    return;
  }

  const file = fileInput.files[0];
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    showToast('文件过大（最大 10MB）', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const base64 = e.target.result.split(',')[1]; // 去掉 data:*/*;base64, 前缀
    output.textContent = base64;
    info.textContent = `文件：${file.name}（${formatSize(file.size)}）`;
    showToast('文件编码成功', 'success');
  };
  reader.onerror = function () {
    output.textContent = '❌ 文件读取失败';
    showToast('文件读取失败', 'error');
  };
  reader.readAsDataURL(file);
}

function b64DecodeToFile() {
  const input = document.getElementById('b64Input').value.trim();
  const output = document.getElementById('b64FileOutput');
  const info = document.getElementById('b64FileInfo');

  if (!input) {
    showToast('请在文本框中输入 Base64 字符串（或粘贴到上方文本框）', 'error');
    return;
  }

  try {
    const binary = atob(input);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes]);
    const url = URL.createObjectURL(blob);
    output.textContent = `✅ 已解码为 Blob，可点击下载：\n${url}`;
    info.innerHTML = `解码完成 <a href="${url}" download="decoded_file" class="btn btn-primary" style="margin-left:8px;padding:4px 12px;font-size:13px;">下载文件</a>`;
    showToast('解码成功，可下载文件', 'success');
  } catch (e) {
    output.textContent = '❌ 解码失败：' + e.message;
    showToast('解码失败', 'error');
  }
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}
