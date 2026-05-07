/**
 * app.js - 主应用逻辑
 * 搜索过滤、滚动动画、主题切换、导航交互、UX 增强
 */

/* ====== 搜索过滤（增强版） ====== */
function initSearch() {
  const input = document.getElementById('search-input');
  if (!input) return;

  // Ctrl+K / Cmd+K 聚焦搜索
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      input.focus();
    }
    // Escape 退出搜索
    if (e.key === 'Escape' && document.activeElement === input) {
      input.blur();
      input.value = '';
      filterCards('');
    }
  });

  // 搜索清除按钮
  var clearBtn = document.createElement('button');
  clearBtn.innerHTML = '✕';
  clearBtn.style.cssText = 'position:absolute;right:44px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--color-text-tertiary);font-size:16px;padding:4px;display:none;line-height:1;';
  clearBtn.setAttribute('aria-label', '清除搜索');
  clearBtn.onclick = function() {
    input.value = '';
    filterCards('');
    input.focus();
  };
  input.parentNode.appendChild(clearBtn);

  // 搜索结果计数
  var countEl = document.createElement('div');
  countEl.className = 'search-results-count';
  input.parentNode.parentNode.appendChild(countEl);

  input.addEventListener('input', debounce(function() {
    var keyword = input.value.trim().toLowerCase();
    clearBtn.style.display = keyword ? 'block' : 'none';
    filterCards(keyword);
  }, 150));

  function filterCards(keyword) {
    var cards = document.querySelectorAll('.tool-card');
    var visibleCount = 0;

    cards.forEach(function(card) {
      var title = (card.querySelector('h4')?.textContent || '').toLowerCase();
      var desc = (card.querySelector('p')?.textContent || '').toLowerCase();
      var match = !keyword || title.includes(keyword) || desc.includes(keyword);

      card.style.display = match ? '' : 'none';
      if (match) visibleCount++;
    });

    // 无结果提示
    var noResult = document.getElementById('no-result-msg');
    if (visibleCount === 0 && keyword) {
      if (!noResult) {
        noResult = document.createElement('div');
        noResult.id = 'no-result-msg';
        noResult.style.cssText = 'text-align:center;padding:48px 0;color:var(--color-text-tertiary);font-size:17px;';
        document.getElementById('tools-grid').appendChild(noResult);
      }
      noResult.textContent = '没有找到匹配的工具"' + keyword + '"';
      noResult.style.display = '';
    } else if (noResult) {
      noResult.style.display = 'none';
    }

    // 更新计数
    countEl.textContent = keyword ? '找到 ' + visibleCount + ' 个工具' : '';
  }
}

/* ====== 滚动渐现动画（原生实现，无需 AOS.js） ====== */
function initScrollFadeIn() {
  var elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  var observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(function(el) { observer.observe(el); });
}

/* ====== 导航栏滚动效果 ====== */
function initNavScroll() {
  var nav = document.getElementById('main-nav');
  if (!nav) return;

  var lastScroll = 0;

  window.addEventListener('scroll', throttle(function() {
    var currentScroll = window.scrollY;

    if (currentScroll > 80) {
      nav.style.boxShadow = 'var(--shadow-sm)';
    } else {
      nav.style.boxShadow = 'none';
    }

    // 向下滚动隐藏导航，向上滚动显示
    if (currentScroll > 200 && currentScroll > lastScroll) {
      nav.classList.add('nav-hidden');
    } else {
      nav.classList.remove('nav-hidden');
    }

    lastScroll = currentScroll;
  }, 100));
}

/* ====== 滚动进度条 ====== */
function initScrollProgress() {
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);

  window.addEventListener('scroll', throttle(function() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  }, 50));
}

/* ====== 回到顶部按钮 ====== */
function initBackToTop() {
  var btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', '回到顶部');
  btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(btn);

  btn.onclick = function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  window.addEventListener('scroll', throttle(function() {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, 100));
}

/* ====== 工具页：通用输入/输出逻辑 ====== */
function initToolPage() {
  // 为所有「复制结果」按钮绑定事件
  document.querySelectorAll('[data-action="copy-result"]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var targetId = btn.getAttribute('data-target');
      var target = document.getElementById(targetId);
      if (!target) return;
      var text = target.textContent || target.value || '';
      if (!text.trim()) {
        showToast('没有可复制的内容', 'error');
        return;
      }
      copyToClipboard(text, '结果');
    });
  });

  // 为所有「清空」按钮绑定事件
  document.querySelectorAll('[data-action="clear"]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var inputId = btn.getAttribute('data-input');
      var outputId = btn.getAttribute('data-output');
      if (inputId) {
        var input = document.getElementById(inputId);
        if (input) input.value = '';
      }
      if (outputId) {
        var output = document.getElementById(outputId);
        if (output) output.textContent = '';
      }
      showToast('已清空', 'success');
    });
  });

  // 为所有「执行」按钮添加动画反馈
  document.querySelectorAll('[data-action="execute"]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      btn.style.transform = 'scale(0.97)';
      setTimeout(function() { btn.style.transform = ''; }, 150);
    });
  });

  // 按钮涟漪效果
  document.querySelectorAll('.btn:not([data-action])').forEach(function(btn) {
    btn.addEventListener('mousedown', function(e) {
      var rect = btn.getBoundingClientRect();
      btn.style.setProperty('--ripple-x', ((e.clientX - rect.left) / rect.width * 100) + '%');
      btn.style.setProperty('--ripple-y', ((e.clientY - rect.top) / rect.height * 100) + '%');
    });
  });
}

/* ====== 初始化 ====== */
document.addEventListener('DOMContentLoaded', function() {
  initTheme();
  updateThemeIcon();
  i18n.init();  // 初始化国际化
  initSearch();
  initScrollFadeIn();
  initNavScroll();
  initScrollProgress();
  initBackToTop();
  initToolPage();
});
