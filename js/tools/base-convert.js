/**
 * base-convert.js - 进制转换工具逻辑
 */

const BASE_ALPHABET = {
  2:  '01',
  8:  '01234567',
  10: '0123456789',
  16: '0123456789abcdef',
  32: '0123456789ABCDEFGHJKMNPQRSTVWXYZ',  // 去除了容易混淆的 ILOU
  64: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
};

/**
 * BigInt 进制转换（支持任意进制 2-64）
 * @param {string} valueStr - 数值字符串
 * @param {number} fromBase - 源进制
 * @param {number} toBase - 目标进制
 * @returns {string}
 */
function bigIntBaseConvert(valueStr, fromBase, toBase) {
  const alphabet = BASE_ALPHABET[fromBase] || _buildAlpha(fromBase);
  const toAlpha = BASE_ALPHABET[toBase] || _buildAlpha(toBase);

  // 将输入转为 BigInt（十进制值）
  let num = _toBigInt(valueStr.toLowerCase(), alphabet, fromBase);

  if (num === 0n) return '0';

  let result = '';
  const baseBig = BigInt(toBase);
  const isNeg = num < 0n;
  if (isNeg) num = -num;

  while (num > 0n) {
    const rem = Number(num % baseBig);
    result = toAlpha[rem] + result;
    num = num / baseBig;
  }

  return isNeg ? '-' + result : result;
}

function _toBigInt(str, alphabet, base) {
  str = str.toLowerCase();
  let result = 0n;
  const baseBig = BigInt(base);
  for (const ch of str) {
    const val = BigInt(alphabet.indexOf(ch));
    if (val < 0n) throw new Error(`无效字符 "${ch}" 对于进制 ${base}`);
    result = result * baseBig + val;
  }
  return result;
}

function _buildAlpha(base) {
  let alpha = '';
  for (let i = 0; i < base; i++) alpha += String.fromCharCode(i + 33);
  return alpha;
}

/**
 * 执行转换（主入口）
 */
function doConvert() {
  const input = document.getElementById('inputValue').value.trim();
  const inputBase = parseInt(document.getElementById('inputBase').value, 10);
  const outputEl = document.getElementById('outputValue');
  const allBasesEl = document.getElementById('allBases');

  if (!input) {
    showToast('请输入要转换的数值', 'error');
    return;
  }

  try {
    // 转换到各进制
    const bases = [2, 8, 10, 16, 32, 64];
    const results = {};
    bases.forEach(b => {
      results[b] = bigIntBaseConvert(input, inputBase, b);
    });

    // 显示主结果（十进制）
    outputEl.textContent = '十进制：' + results[10];
    if (inputBase !== 10) {
      outputEl.textContent += '\n' + inputBase + '进制输入：' + input + '\n';
      outputEl.textContent += '2进制：' + results[2] + '\n';
      outputEl.textContent += '8进制：' + results[8] + '\n';
      outputEl.textContent += '16进制：' + results[16] + '\n';
      outputEl.textContent += '32进制：' + results[32] + '\n';
      outputEl.textContent += '64进制：' + results[64];
    }

    // 显示各进制详情
    allBasesEl.style.display = '';
    document.getElementById('res2').textContent = results[2];
    document.getElementById('res8').textContent = results[8];
    document.getElementById('res10').textContent = results[10];
    document.getElementById('res16').textContent = results[16];
    document.getElementById('res32').textContent = results[32];
    document.getElementById('res64').textContent = results[64];

    showToast('转换成功', 'success');
  } catch (e) {
    outputEl.textContent = '❌ 转换失败：' + e.message;
    allBasesEl.style.display = 'none';
    showToast('转换失败：' + e.message, 'error');
  }
}

// 回车键触发转换
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('inputValue');
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doConvert();
    });
  }
});
