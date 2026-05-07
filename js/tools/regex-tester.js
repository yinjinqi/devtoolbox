/**
 * regex-tester.js - 正则测试工具逻辑
 * 内置超时保护（防止灾难性回溯）
 */

const REGEX_TIMEOUT = 2000; // 2 秒超时

/**
 * 带超时的正则测试
 * @param {RegExp} regex - 正则表达式对象
 * @param {string} str - 测试字符串
 * @returns {{ matches: Array, timedOut: boolean, error?: string }}
 */
function safeRegexTest(regex, str) {
  const startTime = Date.now();
  const matches = [];

  try {
    if (regex.global) {
      let match;
      let safety = 0;
      while ((match = regex.exec(str)) !== null && safety < 10000) {
        matches.push({
          fullMatch: match[0],
          groups: [...match].slice(1),
          index: match.index,
          length: match[0].length
        });
        // 防止零长度匹配导致死循环
        if (match[0].length === 0) regex.lastIndex++;
        if (Date.now() - startTime > REGEX_TIMEOUT) {
          return { matches, timedOut: true };
        }
        safety++;
      }
    } else {
      const match = regex.exec(str);
      if (match) {
        matches.push({
          fullMatch: match[0],
          groups: [...match].slice(1),
          index: match.index,
          length: match[0].length
        });
      }
      if (Date.now() - startTime > REGEX_TIMEOUT) {
        return { matches, timedOut: true };
      }
    }
    return { matches, timedOut: false };
  } catch (e) {
    return { matches: [], timedOut: false, error: e.message };
  }
}

/**
 * 高亮匹配结果（安全方式，防 XSS）
 */
function highlightMatches(str, matches) {
  if (matches.length === 0) return escapeHTML(str);

  let result = '';
  let lastIndex = 0;

  // 按位置排序
  const sorted = [...matches].sort((a, b) => a.index - b.index);

  for (const m of sorted) {
    if (m.index < lastIndex) continue; // 跳过重叠
    result += escapeHTML(str.substring(lastIndex, m.index));
    result += '<mark style="background:#0071e3;color:#fff;padding:1px 3px;border-radius:3px;">' + escapeHTML(m.fullMatch) + '</mark>';
    lastIndex = m.index + m.length;
  }
  result += escapeHTML(str.substring(lastIndex));
  return result;
}

// ========== UI 操作 ==========

function testRegex() {
  const regexStr = document.getElementById('regexInput').value.trim();
  const testStr = document.getElementById('testString').value;
  const resultEl = document.getElementById('regexResult');
  const countEl = document.getElementById('matchCount');

  if (!regexStr) {
    showToast('请输入正则表达式', 'error');
    return;
  }
  if (testStr === undefined || testStr === null) {
    showToast('请输入要测试的文本', 'error');
    return;
  }

  // 构建标志
  let flags = '';
  if (document.getElementById('flagG').checked) flags += 'g';
  if (document.getElementById('flagI').checked) flags += 'i';
  if (document.getElementById('flagM').checked) flags += 'm';

  let regex;
  try {
    regex = new RegExp(regexStr, flags);
  } catch (e) {
    resultEl.innerHTML = '❌ 正则表达式语法错误：' + escapeHTML(e.message);
    countEl.textContent = '';
    showToast('正则语法错误', 'error');
    return;
  }

  const { matches, timedOut, error } = safeRegexTest(regex, testStr);

  if (error) {
    resultEl.innerHTML = '❌ 执行出错：' + escapeHTML(error);
    countEl.textContent = '';
    return;
  }

  if (timedOut) {
    resultEl.innerHTML = '⚠️ 匹配超时（超过 ' + (REGEX_TIMEOUT / 1000) + ' 秒），请优化正则表达式以避免灾难性回溯。\n\n部分匹配结果：\n' + matches.map((m, i) => `#${i + 1}: "${escapeHTML(m.fullMatch)}" (位置 ${m.index})`).join('\n');
    countEl.textContent = `已匹配 ${matches.length} 项（超时截断）`;
    showToast('匹配超时，已截断结果', 'error');
    return;
  }

  if (matches.length === 0) {
    resultEl.innerHTML = '😶 无匹配结果。';
    countEl.textContent = '0 个匹配';
    showToast('无匹配结果', 'info');
    return;
  }

  // 显示高亮文本
  const highlighted = highlightMatches(testStr, matches);
  let output = `✅ 共找到 ${matches.length} 个匹配：\n\n`;
  output += '—— 高亮预览 ——\n';
  output += highlighted.replace(/<[^>]+>/g, (m) => m.includes('mark') ? '【' + m + '】' : '');
  // 其实用 innerHTML 直接渲染
  resultEl.innerHTML = `✅ 共找到 <strong>${matches.length}</strong> 个匹配：\n\n` +
    '<div style="margin-top:12px;padding:12px;background:var(--color-bg-tertiary);border-radius:var(--radius-sm);line-height:2;">' +
    highlighted + '</div>' +
    '\n\n—— 详细匹配 ——\n' +
    matches.map((m, i) => `#${i + 1}: "${escapeHTML(m.fullMatch)}" | 位置：${m.index} | 长度：${m.length}` +
      (m.groups.length ? ` | 捕获组：${m.groups.map((g, j) => `(${j + 1})"${escapeHTML(g || '""')}"`).join(', ')}` : '')
    ).join('\n');

  countEl.innerHTML = `<span style="color:var(--color-success);">${matches.length} 个匹配</span>`;
  showToast('匹配成功，共 ' + matches.length + ' 个结果', 'success');
}

function loadRegexSample() {
  document.getElementById('regexInput').value = '(\\w+)@(\\w+\\.\\w+)';
  document.getElementById('testString').value = '联系我们：admin@example.com 或 support@test.org\n技术支持：help@devtool.com';
  document.getElementById('flagG').checked = true;
  testRegex();
}

// 回车触发测试
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('regexInput');
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') testRegex();
    });
  }
  // 自动加载示例
  loadRegexSample();
});
