/**
 * float-convert.js - 浮点数转换工具逻辑
 * 使用 TypedArray 查看 IEEE 754 二进制表示
 */

/**
 * 将数字转换为单精度（32位）Float32 的二进制表示
 * @param {number} num
 * @returns {{ hex: string, binary: string, sign: string, exponent: string, mantissa: string }}
 */
function float32ToBinary(num) {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setFloat32(0, num, false); // big-endian
  const hex = view.getUint32(0).toString(16).toUpperCase().padStart(8, '0');
  const bin = parseInt(hex, 16).toString(2).padStart(32, '0');
  return {
    hex: '0x' + hex,
    binary: bin,
    sign: bin[0],
    exponent: bin.substring(1, 9),
    mantissa: bin.substring(9, 32),
    rawExponent: parseInt(bin.substring(1, 9), 2),
    value: num
  };
}

/**
 * 将数字转换为双精度（64位）Float64 的二进制表示
 * @param {number} num
 * @returns {{ hex: string, binary: string, sign: string, exponent: string, mantissa: string }}
 */
function float64ToBinary(num) {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setFloat64(0, num, false); // big-endian
  // 读取高32位和低32位
  const hi = view.getUint32(0).toString(16).toUpperCase().padStart(8, '0');
  const lo = view.getUint32(4).toString(16).toUpperCase().padStart(8, '0');
  const hex = hi + lo;
  // 构建64位二进制
  const binHi = parseInt(hi, 16).toString(2).padStart(32, '0');
  const binLo = parseInt(lo, 16).toString(2).padStart(32, '0');
  const bin = binHi + binLo;
  return {
    hex: '0x' + hex,
    binary: bin,
    sign: bin[0],
    exponent: bin.substring(1, 12),
    mantissa: bin.substring(12, 64),
    rawExponent: parseInt(bin.substring(1, 12), 2),
    value: num
  };
}

/**
 * 格式化二进制展示（每4位加空格）
 */
function formatBinary(bin) {
  return bin.match(/.{1,4}/g).join(' ');
}

/**
 * 获取特殊值说明
 */
function getSpecialValueInfo(result) {
  const v = result.value;
  if (isNaN(v)) return '⚠️ NaN（非数字）';
  if (v === Infinity) return '➕ +∞（正无穷）';
  if (v === -Infinity) return '➖ -∞（负无穷）';
  if (v === 0 && result.sign === '1') return '⚠️ 负零（-0）';
  if (v === 0) return '0（零）';
  return null;
}

// ========== UI 操作 ==========

function convertFloat() {
  const input = document.getElementById('floatInput').value.trim();
  const output = document.getElementById('floatOutput');

  if (!input) {
    showToast('请输入数值', 'error');
    return;
  }

  const num = parseFloat(input);
  if (isNaN(num)) {
    output.textContent = '❌ 无效的数字：' + input;
    showToast('无效的数字', 'error');
    return;
  }

  const f32 = float32ToBinary(num);
  const f64 = float64ToBinary(num);

  let text = '';

  // Float32
  text += '【单精度 Float32（32 位）】\n';
  text += `  十六进制：${f32.hex}\n`;
  text += `  二进制：${formatBinary(f32.binary)}\n`;
  text += `  符号位（1位）：${f32.sign}（${f32.sign === '0' ? '正数' : '负数'}）\n`;
  text += `  指数位（8位）：${f32.exponent}（偏移值：${f32.rawExponent}，实际指数：${f32.rawExponent - 127}）\n`;
  text += `  尾数位（23位）：${formatBinary(f32.mantissa)}\n`;
  const sp = getSpecialValueInfo(f32);
  if (sp) text += `  ${sp}\n`;
  text += '\n';

  // Float64
  text += '【双精度 Float64（64 位）】\n';
  text += `  十六进制：${f64.hex}\n`;
  text += `  二进制：${f64.binary.substring(0, 32).match(/.{1,4}/g).join(' ')} ${f64.binary.substring(32).match(/.{1,4}/g).join(' ')}\n`;
  text += `  符号位（1位）：${f64.sign}（${f64.sign === '0' ? '正数' : '负数'}）\n`;
  text += `  指数位（11位）：${f64.exponent}（偏移值：${f64.rawExponent}，实际指数：${f64.rawExponent - 1023}）\n`;
  text += `  尾数位（52位）：${formatBinary(f64.mantissa).substring(0, 52 + 12)}...\n`;
  const sp2 = getSpecialValueInfo(f64);
  if (sp2) text += `  ${sp2}\n`;
  text += '\n';

  // 精度对比
  text += '【精度对比】\n';
  text += `  输入值：${num}\n`;
  text += `  Float32 还原：${new Float32Array([num])[0]}\n`;
  text += `  Float64 还原：${new Float64Array([num])[0]}\n`;

  output.textContent = text;
  showToast('转换成功', 'success');
}

function loadFloatSample() {
  const samples = ['3.14', '-0.001', '0.1', '1.0e20', 'NaN', 'Infinity'];
  const r = samples[Math.floor(Math.random() * samples.length)];
  document.getElementById('floatInput').value = r;
  convertFloat();
}

// 回车触发转换
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('floatInput');
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') convertFloat();
    });
  }
});
