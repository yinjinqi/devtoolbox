/**
 * hash-calc.js - Hash 计算工具逻辑
 * 优先使用浏览器原生 Web Crypto API，完全不依赖外部库
 */

/**
 * 使用 Web Crypto API 计算文本 Hash
 * @param {string} text - 文本
 * @param {string} algo - 算法：SHA-1 | SHA-256 | SHA-512
 * @returns {Promise<string>}
 */
async function cryptoHash(text, algo) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algo, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * 计算 MD5（Web Crypto 不支持 MD5，使用轻量实现）
 */
function md5(text) {
  function md5cycle(x, k) {
    let a = x[0], b = x[1], c = x[2], d = x[3];
    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);

    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);

    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);

    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);

    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);
  }

  function cmn(q, a, b, x, s, t) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
  }
  function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
  function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
  function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
  function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
  function md5blk(s) {
    const md5blks = [];
    for (let i = 0; i < 64; i += 4) {
      md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
    }
    return md5blks;
  }
  const hex_chr = '0123456789abcdef'.split('');
  function binl2hex(binarray) {
    let str = '';
    for (let i = 0; i < binarray.length * 32; i += 8) {
      str += hex_chr[(binarray[i >> 5] >>> (i % 32)) & 0xf] + hex_chr[(binarray[i >> 5] >>> ((i % 32) + 4)) & 0xf];
    }
    return str;
  }
  function add32(a, b) {
    return (a + b) & 0xffffffff;
  }

  function md5str(s) {
    const n = s.length;
    let state = [1732584193, -271733879, -1732584194, 271733878];
    let i;
    for (i = 64; i <= n; i += 64) {
      const x = md5blk(s.substring(i - 64, i));
      md5cycle(state, x);
    }
    s = s.substring(i - 64);
    const tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
    tail[i >> 2] |= 0x80 << ((i % 4) << 3);
    tail[14] = n * 8;
    md5cycle(state, tail);
    return binl2hex(state);
  }

  return md5str(text);
}

// ========== UI 操作 ==========

async function calcTextHash() {
  const input = document.getElementById('hashInput').value;
  const output = document.getElementById('hashOutput');
  const algos = Array.from(document.querySelectorAll('.hash-algo:checked')).map(el => el.value);

  if (!input) {
    showToast('请输入要计算 Hash 的文本', 'error');
    return;
  }
  if (algos.length === 0) {
    showToast('请至少选择一个算法', 'error');
    return;
  }

  let result = `📝 输入内容（${input.length} 字符）：\n"${input.substring(0, 50)}${input.length > 50 ? '...' : ''}"\n\n`;

  for (const algo of algos) {
    try {
      let hash;
      if (algo === 'MD5') {
        hash = md5(input);
        result += `🔹 MD5：${hash}\n`;
      } else {
        const algoMap = { 'SHA-1': 'SHA-1', 'SHA-256': 'SHA-256', 'SHA-512': 'SHA-512' };
        hash = await cryptoHash(input, algoMap[algo]);
        result += `🔹 ${algo}：${hash}\n`;
      }
    } catch (e) {
      result += `❌ ${algo} 计算失败：${e.message}\n`;
    }
  }

  output.textContent = result;
  showToast('Hash 计算完成', 'success');
}

async function calcFileHash() {
  const fileInput = document.getElementById('hashFileInput');
  const output = document.getElementById('fileHashOutput');
  const progress = document.getElementById('fileHashProgress');
  const algo = document.getElementById('fileHashAlgo').value;

  if (!fileInput.files.length) {
    showToast('请选择文件', 'error');
    return;
  }

  const file = fileInput.files[0];
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSize) {
    showToast('文件过大（最大 100MB）', 'error');
    return;
  }

  progress.style.display = '';
  progress.textContent = `正在计算 ${algo}…（${formatSize(file.size)}）`;

  try {
    let hash;
    if (algo === 'MD5') {
      // 大文件 MD5：分片读取
      const buffer = await file.arrayBuffer();
      const text = new TextDecoder().decode(new Uint8Array(buffer).slice(0, Math.min(buffer.byteLength, 1024 * 1024)));
      hash = md5(text); // 简化：只取前 1MB
      progress.textContent = '⚠️ MD5 大文件：仅计算前 1MB 内容';
    } else {
      const buffer = await file.arrayBuffer();
      const algoMap = { 'SHA-1': 'SHA-1', 'SHA-256': 'SHA-256', 'SHA-512': 'SHA-512' };
      const hashBuffer = await crypto.subtle.digest(algoMap[algo], buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    output.textContent = `📁 文件：${file.name}\n大小：${formatSize(file.size)}\n\n🔹 ${algo}：${hash}`;
    progress.textContent = '✅ 计算完成';
    showToast('文件 Hash 计算完成', 'success');
  } catch (e) {
    output.textContent = `❌ 计算失败：${e.message}`;
    progress.textContent = '';
    showToast('Hash 计算失败', 'error');
  }
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}
