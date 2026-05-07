/**
 * color-convert.js - 颜色转换工具逻辑
 * 支持 HEX ↔ RGB ↔ HSL 互转
 */

/**
 * HEX → RGB
 */
function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
  const num = parseInt(hex, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

/**
 * RGB → HEX
 */
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

/**
 * RGB → HSL
 */
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

/**
 * HSL → RGB
 */
function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

/**
 * 解析任意颜色输入
 * @returns {{ r: number, g: number, b: number } | null}
 */
function parseColorInput(input) {
  input = input.trim().toLowerCase();

  // HEX
  if (/^#?([0-9a-f]{3}|[0-9a-f]{6})$/.test(input)) {
    const hex = input.replace(/^#/, '');
    return hexToRgb(hex);
  }

  // rgb(R, G, B)
  const rgbMatch = input.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
  if (rgbMatch) {
    return { r: +rgbMatch[1], g: +rgbMatch[2], b: +rgbMatch[3] };
  }

  // hsl(H, S%, L%)
  const hslMatch = input.match(/^hsl\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)$/);
  if (hslMatch) {
    return hslToRgb(+hslMatch[1], +hslMatch[2], +hslMatch[3]);
  }

  return null;
}

// ========== UI 操作 ==========

function convertColor() {
  const input = document.getElementById('colorInput').value.trim();
  const output = document.getElementById('colorOutput');
  const preview = document.getElementById('colorPreview');

  if (!input) {
    showToast('请输入颜色值', 'error');
    return;
  }

  const rgb = parseColorInput(input);
  if (!rgb) {
    output.textContent = '❌ 无法识别的颜色格式\n\n支持的格式：\n- HEX：#ff5733 或 ff5733\n- RGB：rgb(255, 87, 51)\n- HSL：hsl(14, 100%, 60%)';
    preview.style.background = 'var(--color-bg-tertiary)';
    showToast('无法识别颜色格式', 'error');
    return;
  }

  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // 显示结果
  output.textContent =
    `✅ 转换成功！\n\n` +
    `▣ 颜色预览：\n\n` +
    `🔹 HEX：  ${hex.toUpperCase()}\n` +
    `🔹 RGB：  rgb(${rgb.r}, ${rgb.g}, ${rgb.b})\n` +
    `🔹 HSL：  hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)\n\n` +
    `🔹 反色：  ${rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b).toUpperCase()}\n` +
    `🔹 灰度：  ${Math.round(rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114)}`;

  // 更新预览块
  preview.style.background = hex;

  // 同步调色盘
  document.getElementById('colorPicker').value = hex;

  showToast('转换成功', 'success');
}

function onColorPickerChange() {
  const hex = document.getElementById('colorPicker').value;
  document.getElementById('colorInput').value = hex;
  convertColor();
}

function setColor(hex) {
  document.getElementById('colorPicker').value = hex;
  document.getElementById('colorInput').value = hex;
  convertColor();
}

// 回车触发转换
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('colorInput');
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') convertColor();
    });
  }
  // 默认加载示例
  setColor('#ff5733');
});
