/**
 * cron-parser.js - Cron 表达式解析工具逻辑
 * 纯 JS 实现，无需外部库
 */

/**
 * 解析单个 cron 字段，返回匹配的值数组
 * @param {string} field - 字段字符串（如 "*/15", "1,3,5", "0-10"）
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number[]} 匹配的值数组
 */
function parseCronField(field, min, max) {
  if (field === '*') return rangeArray(min, max);

  const values = new Set();
  const parts = field.split(',');

  for (const part of parts) {
    if (part.includes('/')) {
      // 步长：*/15 或 1-30/3
      const [range, step] = part.split('/');
      const stepNum = parseInt(step, 10);
      let start = min, end = max;
      if (range !== '*') {
        if (range.includes('-')) {
          [start, end] = range.split('-').map(Number);
        } else {
          start = parseInt(range, 10);
        }
      }
      for (let i = start; i <= end; i += stepNum) {
        if (i >= min && i <= max) values.add(i);
      }
    } else if (part.includes('-')) {
      // 范围：1-10
      const [start, end] = part.split('-').map(Number);
      for (let i = start; i <= end; i++) {
        if (i >= min && i <= max) values.add(i);
      }
    } else {
      const num = parseInt(part, 10);
      if (num >= min && num <= max) values.add(num);
    }
  }

  return Array.from(values).sort((a, b) => a - b);
}

function rangeArray(min, max) {
  const arr = [];
  for (let i = min; i <= max; i++) arr.push(i);
  return arr;
}

/**
 * 解析 Cron 表达式，返回下 N 次执行时间
 * @param {string} expression - Cron 表达式（5位或6位）
 * @param {number} count - 返回次数
 * @returns {{ success: boolean, nextTimes?: string[], error?: string }}
 */
function parseCron(expression, count = 10) {
  const parts = expression.trim().split(/\s+/);
  if (parts.length < 5 || parts.length > 6) {
    return { success: false, error: 'Cron 表达式格式错误，需要 5 或 6 个字段' };
  }

  let [minute, hour, day, month, weekday] = parts;

  try {
    const minutes = parseCronField(minute, 0, 59);
    const hours = parseCronField(hour, 0, 23);
    const days = parseCronField(day, 1, 31);
    const months = parseCronField(month, 1, 12);
    const weekdays = parseCronField(weekday, 0, 7).map(d => d === 7 ? 0 : d);

    const now = new Date();
    const results = [];
    let current = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1, 0, 0);

    // 最多搜索 10000 个时间点
    const maxIter = 10000;
    let iter = 0;

    while (results.length < count && iter < maxIter) {
      iter++;
      const m = current.getMonth() + 1;
      const d = current.getDate();
      const h = current.getHours();
      const min = current.getMinutes();
      const wd = current.getDay();

      if (
        months.includes(m) &&
        days.includes(d) &&
        hours.includes(h) &&
        minutes.includes(min) &&
        weekdays.includes(wd)
      ) {
        results.push(new Date(current));
        current = new Date(current.getTime() + 60000); // 加1分钟继续搜索
        continue;
      }

      // 进位逻辑
      current = new Date(current.getTime() + 60000);
    }

    if (results.length === 0) {
      return { success: false, error: '未找到匹配的执行时间，请检查表达式' };
    }

    return {
      success: true,
      nextTimes: results.map((d, i) => {
        const ts = Math.floor(d.getTime() / 1000);
        const local = d.toLocaleString('zh-CN', {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', hour12: false
        });
        return `第 ${i + 1} 次：${local}（时间戳：${ts}）`;
      })
    };
  } catch (e) {
    return { success: false, error: '解析失败：' + e.message };
  }
}

// ========== UI 操作 ==========

function setCron(expr) {
  document.getElementById('cronInput').value = expr;
  parseCronUI();
}

function parseCronUI() {
  const input = document.getElementById('cronInput').value.trim();
  const output = document.getElementById('cronOutput');

  if (!input) {
    showToast('请输入 Cron 表达式', 'error');
    return;
  }

  const result = parseCron(input, 10);
  if (result.success) {
    output.textContent = `✅ 解析成功！接下来 ${result.nextTimes.length} 次执行时间：\n\n` + result.nextTimes.join('\n');
    showToast('解析成功', 'success');
  } else {
    output.textContent = '❌ ' + result.error;
    showToast('解析失败', 'error');
  }
}

// 回车触发解析
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('cronInput');
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') parseCronUI();
    });
  }
});
