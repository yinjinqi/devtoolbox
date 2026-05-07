/**
 * timestamp.js - 时间戳转换工具逻辑
 */

// 更新当前时间戳显示
function updateCurrentTs() {
  const now = Date.now();
  const el = document.getElementById('currentTs');
  const dateEl = document.getElementById('currentDate');
  if (el) {
    el.textContent = Math.floor(now / 1000) + '（秒）';
  }
  if (dateEl) {
    dateEl.textContent = new Date(now).toLocaleString('zh-CN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false
    }) + '（本地时间）';
  }
}

// 时间戳 → 日期时间
function tsToDate() {
  const input = document.getElementById('tsInput').value.trim();
  const unit = document.getElementById('tsUnit').value;
  const resultEl = document.getElementById('tsResult');

  if (!input) {
    showToast('请输入时间戳', 'error');
    return;
  }

  const num = Number(input);
  if (isNaN(num)) {
    resultEl.textContent = '❌ 无效的时间戳（请输入数字）';
    return;
  }

  const ms = unit === 's' ? num * 1000 : num;
  const d = new Date(ms);

  if (isNaN(d.getTime())) {
    resultEl.textContent = '❌ 无效的时间戳（日期超出范围）';
    return;
  }

  const utc = d.toUTCString();
  const local = d.toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false
  });
  const iso = d.toISOString();

  resultEl.textContent =
    '📅 本地时间：' + local + '\n' +
    '🌐 UTC 时间：' + utc + '\n' +
    '📆 ISO 格式：' + iso + '\n' +
    '📱 毫秒时间戳：' + ms + '\n' +
    '⏱ 秒时间戳：' + Math.floor(ms / 1000);

  showToast('转换成功', 'success');
}

// 日期时间 → 时间戳
function dateToTs() {
  const input = document.getElementById('dateInput').value;
  const unit = document.getElementById('dateUnit').value;
  const resultEl = document.getElementById('dateResult');

  if (!input) {
    showToast('请选择日期时间', 'error');
    return;
  }

  const d = new Date(input);
  if (isNaN(d.getTime())) {
    resultEl.textContent = '❌ 无效的日期时间';
    return;
  }

  const ms = d.getTime();
  const s = Math.floor(ms / 1000);

  resultEl.textContent =
    '⏱ 秒时间戳：' + s + '\n' +
    '📱 毫秒时间戳：' + ms + '\n' +
    '📆 ISO 格式：' + d.toISOString();

  showToast('转换成功', 'success');
}

// 初始化：填充当前时间到输入框，启动定时器
document.addEventListener('DOMContentLoaded', () => {
  updateCurrentTs();
  setInterval(updateCurrentTs, 1000);

  // 当前时间填入「日期时间→时间戳」输入框
  const dateInput = document.getElementById('dateInput');
  if (dateInput) {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    dateInput.value =
      now.getFullYear() + '-' +
      pad(now.getMonth() + 1) + '-' +
      pad(now.getDate()) + 'T' +
      pad(now.getHours()) + ':' +
      pad(now.getMinutes());
  }
});
