/**
 * qr-generator.js - 二维码生成工具逻辑
 * 使用 qrcode.js（CDN），失败时使用 Canvas 内置方案
 */

/**
 * 生成二维码
 */
function generateQR() {
  const input = document.getElementById('qrInput').value.trim();
  const output = document.getElementById('qrOutput');
  const size = parseInt(document.getElementById('qrSize').value, 10);
  const ec = document.getElementById('qrEC').value;

  if (!input) {
    showToast('请输入文本或链接', 'error');
    return;
  }
  if (input.length > 2048) {
    showToast('内容过长（最大 2048 字符）', 'error');
    return;
  }

  // 清空之前的内容
  output.innerHTML = '';

  if (typeof QRCode !== 'undefined') {
    // 使用 qrcode.js
    try {
      QRCode.toCanvas(input, {
        width: size,
        height: size,
        errorCorrectionLevel: ec,
        margin: 2,
        color: {
          dark: getComputedStyle(document.documentElement).getPropertyValue('--color-text-primary').trim() || '#1d1d1f',
          light: getComputedStyle(document.documentElement).getPropertyValue('--color-card-bg').trim() || '#ffffff'
        }
      }, (err, canvas) => {
        if (err) {
          renderQRCanvasFallback(input, size, output);
        } else {
          canvas.style.borderRadius = '8px';
          output.appendChild(canvas);
          showToast('二维码生成成功', 'success');
        }
      });
    } catch (e) {
      renderQRCanvasFallback(input, size, output);
    }
  } else {
    renderQRCanvasFallback(input, size, output);
  }
}

/**
 * 内置 Canvas 二维码方案（简化版：把文本画在 Canvas 上）
 * 作为 qrcode.js 完全失败时的后备
 */
function renderQRCanvasFallback(text, size, container) {
  // 简单方案：显示文本编码后的展示图
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // 绘制背景
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  // 绘制文字提示
  ctx.fillStyle = '#333';
  ctx.font = `${Math.floor(size / 12)}px -apple-system, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('二维码内容：', size / 2, size / 3);
  ctx.fillText(text.substring(0, 30), size / 2, size / 2);
  ctx.fillText('（使用 qrcode.js 生成失败）', size / 2, size * 2 / 3);

  canvas.style.borderRadius = '8px';
  container.appendChild(canvas);
  showToast('使用后备方案渲染', 'info');
}

/**
 * 下载二维码为 PNG
 */
function downloadQR() {
  const output = document.getElementById('qrOutput');
  const canvas = output.querySelector('canvas');

  if (!canvas) {
    showToast('请先生成二维码', 'error');
    return;
  }

  const link = document.createElement('a');
  link.download = 'qrcode.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('已下载二维码', 'success');
}

// 回车触发生成
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('qrInput');
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') generateQR();
    });
  }
});

// 显式挂载到 window 对象，确保内联函数可以调用
window._generateQR = generateQR;
window._downloadQR = downloadQR;
