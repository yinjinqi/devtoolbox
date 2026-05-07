/**
 * app.js - 主应用逻辑
 * 搜索过滤、滚动动画、主题切换、导航交互
 */

/* ====== 搜索过滤 ====== */
function initSearch() {
  const input = document.getElementById('search-input');
  if (!input) return;

  input.addEventListener('input', debounce(() => {
    const keyword = input.value.trim().toLowerCase();
    const cards = document.querySelectorAll('.tool-card');
    let visibleCount = 0;

    cards.forEach(card => {
      const title = (card.querySelector('h4')?.textContent || '').toLowerCase();
      const desc = (card.querySelector('p')?.textContent || '').toLowerCase();
      const match = !keyword || title.includes(keyword) || desc.includes(keyword);

      card.style.display = match ? '' : 'none';
      if (match) visibleCount++;
    });

    // 显示无结果提示
    let noResult = document.getElementById('no-result-msg');
    if (visibleCount === 0 && keyword) {
      if (!noResult) {
        noResult = document.createElement('div');
        noResult.id = 'no-result-msg';
        noResult.style.cssText = 'text-align:center;padding:48px 0;color:var(--color-text-tertiary);font-size:17px;';
        noResult.textContent = '没有找到匹配的工具';
        document.getElementById('tools-grid').appendChild(noResult);
      }
      noResult.style.display = '';
    } else if (noResult) {
      noResult.style.display = 'none';
    }
  }, 200));
}

/* ====== 滚动渐现动画（原生实现，无需 AOS.js） ====== */
function initScrollFadeIn() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ====== 导航栏滚动效果 ====== */
function initNavScroll() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  let lastScroll = 0;

  window.addEventListener('scroll', throttle(() => {
    const currentScroll = window.scrollY;

    if (currentScroll > 80) {
      nav.style.boxShadow = 'var(--shadow-sm)';
    } else {
      nav.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
  }, 100));
}

/* ====== 工具页：通用输入/输出逻辑 ====== */
function initToolPage() {
  // 为所有「复制结果」按钮绑定事件
  document.querySelectorAll('[data-action="copy-result"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const target = document.getElementById(targetId);
      if (!target) return;
      const text = target.textContent || target.value || '';
      if (!text.trim()) {
        showToast('没有可复制的内容', 'error');
        return;
      }
      copyToClipboard(text, '结果');
    });
  });

  // 为所有「清空」按钮绑定事件
  document.querySelectorAll('[data-action="clear"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const inputId = btn.getAttribute('data-input');
      const outputId = btn.getAttribute('data-output');
      if (inputId) {
        const input = document.getElementById(inputId);
        if (input) input.value = '';
      }
      if (outputId) {
        const output = document.getElementById(outputId);
        if (output) output.textContent = '';
      }
      showToast('已清空', 'success');
    });
  });

  // 为所有「执行」按钮添加动画反馈
  document.querySelectorAll('[data-action="execute"]').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.style.transform = 'scale(0.97)';
      setTimeout(() => { btn.style.transform = ''; }, 150);
    });
  });
}

/* ====== 初始化 ====== */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateThemeIcon();
  initSearch();
  initScrollFadeIn();
  initNavScroll();
  initToolPage();
});
