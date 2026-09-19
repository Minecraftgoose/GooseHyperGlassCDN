/* ------------------------------------------------------------------ *
 * Guide-mode presentation for the liquid-glass CDN demo page.
 * Steps through each component full-screen, one at a time:
 *   - component fills the viewport (no scrollbars)
 *   - arrow keys / click right-left / dots navigate between steps
 *   - progress dots at the bottom
 *   - "自由试玩" button closes the guide → normal grid demo
 * ------------------------------------------------------------------ */
(function () {
  if (window.__lgGuideLoaded) return;
  window.__lgGuideLoaded = true;

  var GROUPS = {
    'toggle': { title: '开关', highlight: '液态玻璃开关', tip: '点一下，感受玻璃凹陷与回弹', interact: '点一下，玻璃会凹陷', tags: ['single-toggle', 'toggle-card'] },
    'slider': { title: '滑块', highlight: '跟手玻璃滑块', tip: '按住拖拽，带按压弹性', interact: '按住左右拖动', tags: ['single-slider', 'slider-card'] },
    'bottom-tabs': { title: '底部标签栏', highlight: '玻璃标签栏', tip: '点击切换，指示条平滑滑动', interact: '点一个标签试试', tags: ['single-bottom-tabs', 'bottom-tabs-2'] },
    'buttons': { title: '按钮', highlight: '四款玻璃按钮', tip: '透明 / 表面 / 蓝色 / 橙色，逐个试试', interact: '挨个点一点', tags: ['buttons'] },
    'dialog': { title: '对话框', highlight: '玻璃对话框', tip: '带模糊底板，点按操作', interact: '点击弹出对话框', tags: ['dialog'] },
    'scroll-container': { title: '滚动容器', highlight: '弹性玻璃滚动', tip: '拖动或滚轮，松手惯性滚动', interact: '上下拖动试试', tags: ['scroll-container'] },
    'rating': { title: '评分', highlight: '玻璃评分', tip: '点击或拖动给出星级', interact: '点星星评分', tags: ['rating'] },
    'siri-wave': { title: 'Siri 声波', highlight: '纯 shader 声波动画', tip: 'Apple 新版 Siri 复刻，拖拽交互', interact: '看看它的流动', tags: ['siri-wave'] },
    'search': { title: '搜索框', highlight: '拖拽唤醒搜索', tip: '从顶部黑边往下拖，拉过半屏松手凝聚成搜索框', interact: '从顶部黑边往下拖', tags: ['search'] },
  };
  var ORDER = ['toggle', 'slider', 'bottom-tabs', 'buttons', 'dialog', 'scroll-container', 'rating', 'siri-wave', 'search'];

  var stage = document.getElementById('stage');
  var nav = document.getElementById('nav');

  // ---- wallpaper ready (shared with demo) ----
  var _wpReady = true;
  var elIndex = 0;

  // ---- build + attach one glass element for a mode ----
  // 关键时序：先 create 元素 → append 进 DOM（触发 connected，默认 mode）→
  // 再 setAttribute('mode') 触发 attributeChangedCallback → rebuild 出对应组件。
  // 若先设 mode 再 append，connected 时 mode 已存在，组件不 rebuild（显示空白/默认）。
  function addGlass(holder, mode, extra) {
    var el = document.createElement('liquid-glass');
    el.setAttribute('theme-button', '');
    el.setAttribute('dpr', String(window.devicePixelRatio || 1));
    if (_wpReady) el.setAttribute('wallpaper', './wallpaper.jpg');
    extra = extra || {};
    holder.appendChild(el);
    el.setAttribute('mode', mode);
    if (extra.variant) el.setAttribute('variant', extra.variant);
    if (extra.tabs) el.setTabs(extra.tabs);
    if (extra.buttons) el.setButtons(extra.buttons);
    if (extra.dialog) el.setDialog(extra.dialog);
    return el;
  }

  var TABS = [
    [{ icon: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z', viewport: 24, label: '首页' },
     { icon: 'M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z', viewport: 24, label: '发现' },
     { icon: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z', viewport: 24, label: '收藏' }],
    // bottom-tabs-2 需要第二组（否则回退默认飞机图标）
    [{ icon: 'M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 2a3 3 0 1 1-3 3 3 3 0 0 1 3-3zm0 7c-2.33 0-7 1.17-7 3.5V19h14v-4.5c0-2.33-4.67-3.5-7-3.5z', viewport: 24, label: '我的' },
     { icon: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z', viewport: 24, label: '完成' },
     { icon: 'M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z', viewport: 24, label: '用户' },
     { icon: 'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z', viewport: 24, label: '设置' }]
  ];

  // ---- count total steps across all groups ----
  var TOTAL = 0;
  ORDER.forEach(function (k) {
    var g = GROUPS[k];
    if (k === 'search') { TOTAL += 1; return; }
    if (k === 'siri-wave') { TOTAL += 2; return; }
    TOTAL += g.tags.length;
  });

  // ---- DOM shell ----
  var shell = document.createElement('div');
  shell.className = 'guide';
  shell.innerHTML =
    '<div class="guide-top">' +
      '<div class="guide-brand">GooseHyperGlass</div>' +
      '<button class="guide-exit">退出引导</button>' +
    '</div>' +
    '<div class="guide-stage"></div>' +
    '<div class="guide-arrow prev">‹</div>' +
    '<div class="guide-arrow next">›</div>' +
    '<div class="guide-bar">' +
      '<div class="guide-text"></div>' +
      '<div class="guide-dots"></div>' +
      '<div class="guide-actions">' +
        '<button class="guide-cta">自由试玩</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(shell);

  var stepEl = shell.querySelector('.guide-stage');
  var textEl = shell.querySelector('.guide-text');
  var dotsEl = shell.querySelector('.guide-dots');
  var prevEl = shell.querySelector('.prev');
  var nextEl = shell.querySelector('.next');
  var exitEl = shell.querySelector('.guide-exit');
  var ctaEl = shell.querySelector('.guide-cta');

  // ---- 交互提示浮层（组件下方，文字提示，数秒后淡出） ----
  var hintEl = document.createElement('div');
  hintEl.className = 'guide-hint';
  hintEl.innerHTML = '<span class="guide-hint-txt"></span>';
  stepEl.appendChild(hintEl);
  var _hintTimer = 0;
  function showInteract(text) {
    hintEl.querySelector('.guide-hint-txt').textContent = text;
    hintEl.classList.remove('show', 'hide');
    clearTimeout(_hintTimer);
    // 先隐藏再强制 reflow 重启动画
    void hintEl.offsetWidth;
    hintEl.classList.add('show');
    _hintTimer = setTimeout(function () {
      hintEl.classList.add('hide');
      hintEl.classList.remove('show');
    }, 3500);
  }

  // ---- build dots ----
  for (var i = 0; i < TOTAL; i++) {
    var d = document.createElement('span');
    d.className = 'dot';
    d.setAttribute('data-i', String(i));
    dotsEl.appendChild(d);
  }
  dotsEl.addEventListener('click', function (e) {
    var d = e.target.closest('.dot');
    if (!d) return;
    var target = parseInt(d.getAttribute('data-i'), 10);
    show(target, target > _cur ? 1 : -1);
  });

  // ---- step index → group+step ----
  var FLAT = [];
  ORDER.forEach(function (k) {
    var g = GROUPS[k];
    if (k === 'search') { FLAT.push([k, 0]); return; }
    if (k === 'siri-wave') { FLAT.push([k, 0]); FLAT.push([k, 1]); return; }
    for (var i = 0; i < g.tags.length; i++) FLAT.push([k, i]);
  });

  var _cur = 0;
  var _timer = 0;

  // ---- 每步只建 1 个组件，切走即销毁（context 恒 1 个，避免超限） ----
  // 教训一：预加载隐藏组件→context 堆积超限→deleted object。
  // 教训二：不要把组件复用在隐藏/重建间，remove/append 会走 gooseKill→重建。
  // 教训三（关键）：销毁旧组件后不能立即建新的——旧组件的 rAF 若正在执行，
  // 销毁（gooseKill 删 program）和该帧渲染同帧交织 → "useProgram: deleted object"。
  // 修复：销毁后等 2 帧（requestAnimationFrame 双帧），确保旧 rAF 完全停止再建。
  var _currentHolder = null;
  var _pendingBuild = null;   // { idx, holder }

  function ensureCurrent(idx) {
    var holder = document.createElement('div');
    holder.className = 'guide-step';
    // 销毁所有残留旧组件（含 slide-out 动画未移除的、快速连点留下的）
    // 逐个 remove 触发 disconnectedCallback → gooseKill → 释放 context
    var leftovers = stepEl.querySelectorAll('liquid-glass, liquid-glass-search');
    for (var i = 0; i < leftovers.length; i++) {
      if (leftovers[i].parentNode) leftovers[i].parentNode.removeChild(leftovers[i]);
    }
    var oldHolders = stepEl.querySelectorAll('.guide-step');
    for (var j = 0; j < oldHolders.length; j++) {
      if (oldHolders[j].parentNode) oldHolders[j].parentNode.removeChild(oldHolders[j]);
    }
    _currentHolder = holder;
    // 延迟 2 帧再填充组件，避免旧 rAF 与销毁同帧交织
    var pair = FLAT[idx];
    _pendingBuild = { idx: idx, holder: holder };
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (!_pendingBuild || _pendingBuild.idx !== idx) return;
        buildStepInto(pair[0], pair[1], holder);
        _pendingBuild = null;
      });
    });
    return holder;
  }

  function buildStepInto(key, si, holder) {
    var g = GROUPS[key];
    // siri-wave 单独处理：FLAT 里给它 push 了 [k,0]+[k,1]，但 tags 只有 1 个
    // 元素，不能用 g.tags[si] 取 tag（si=1 时 undefined）。直接用 key 判断。
    if (key === 'siri-wave') {
      addGlass(holder, 'siri-wave', { variant: si === 0 ? 'wave' : 'orb' });
      return;
    }
    var tag = g.tags[si];
    if (tag === 'search') {
      var sel = document.createElement('liquid-glass-search');
      if (_wpReady) sel.setAttribute('wallpaper', './wallpaper.jpg');
      sel.setAttribute('dpr', String(window.devicePixelRatio || 1));
      holder.appendChild(sel);
      return;
    }
    if (tag === 'buttons') {
      var b = [
        { id: 'btn-transparent', label: '透明', style: 'transparent' },
        { id: 'btn-surface', label: '表面', style: 'surface' },
        { id: 'btn-blue', label: '蓝色', style: 'blue' },
        { id: 'btn-orange', label: '橙色', style: 'orange' }
      ];
      addGlass(holder, 'buttons', { buttons: b });
      return;
    }
    if (tag === 'single-toggle') addGlass(holder, 'single-toggle');
    else if (tag === 'toggle-card') addGlass(holder, 'toggle-card');
    else if (tag === 'single-slider') addGlass(holder, 'single-slider');
    else if (tag === 'slider-card') addGlass(holder, 'slider-card');
    else if (tag === 'single-bottom-tabs') addGlass(holder, 'single-bottom-tabs', { tabs: TABS });
    else if (tag === 'bottom-tabs-2') addGlass(holder, 'bottom-tabs-2', { tabs: TABS });
    else if (tag === 'dialog') addGlass(holder, 'dialog', { dialog: { title: '提示', body: '这是一条示例通知消息。', cancelText: '取消', okayText: '确定' } });
    else if (tag === 'scroll-container') addGlass(holder, 'scroll-container');
    else if (tag === 'rating') addGlass(holder, 'rating');
  }

  function show(idx, dir) {
    idx = Math.max(0, Math.min(TOTAL - 1, idx));
    var goingForward = dir === undefined ? (idx > _cur) : dir > 0;
    _cur = idx;
    var pair = FLAT[idx];

    // 旧内容先滑出
    var old = stepEl.firstChild;
    if (old && old.classList && old.classList.contains('guide-step')) {
      old.classList.add(goingForward ? 'slide-out-left' : 'slide-out-right');
      setTimeout(function () { if (old.parentNode) old.parentNode.removeChild(old); }, 300);
    }

    // 建当前组件：销毁旧的释放 context → holder 进 DOM → 延迟 2 帧填充组件
    // （ensureCurrent 内部 rAF 双帧后 buildStepInto，避免旧 rAF 与销毁同帧交织）
    var holder = ensureCurrent(idx);
    holder.style.display = '';
    holder.classList.remove('slide-out-left', 'slide-out-right');
    holder.classList.add('guide-step', goingForward ? 'slide-in-right' : 'slide-in-left');
    stepEl.appendChild(holder);            // holder 进 DOM（组件在 2 帧后填充，此时已 connected）
    void holder.offsetWidth;
    requestAnimationFrame(function () { holder.classList.remove('slide-in-right', 'slide-in-left'); });

    var key = pair[0];
    var g = GROUPS[key];
    textEl.innerHTML = '<b class="guide-hl">' + g.highlight + '</b>' + (g.tip ? '<span class="guide-tip"> · ' + g.tip + '</span>' : '');

    // ---- 交互提示浮层：按组件类型提示操作，几秒后淡出 ----
    showInteract(g.interact || '点击 / 拖动试试');

    // progress dots
    var ds = dotsEl.querySelectorAll('.dot');
    for (var k = 0; k < ds.length; k++) ds[k].classList.toggle('active', k === idx);

    // arrows
    prevEl.classList.toggle('off', idx === 0);
    nextEl.classList.toggle('off', idx === TOTAL - 1);
    prevEl.classList.toggle('on', idx > 0);
    nextEl.classList.toggle('on', idx < TOTAL - 1);
  }

  function next() { if (_cur < TOTAL - 1) show(_cur + 1, 1); }
  function prev() { if (_cur > 0) show(_cur - 1, -1); }

  nextEl.addEventListener('click', next);
  prevEl.addEventListener('click', prev);
  document.addEventListener('keydown', function (e) {
    if (!shell.classList.contains('on')) return;
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    else if (e.key === 'Escape') { e.preventDefault(); closeGuide(true); }
  });

  // swipe support
  var _tx = 0, _ty = 0;
  shell.addEventListener('touchstart', function (e) {
    var t = e.touches[0];
    _tx = t.clientX; _ty = t.clientY;
  }, { passive: true });
  shell.addEventListener('touchend', function (e) {
    if (_tx === 0) return;
    var t = e.changedTouches[0];
    var dx = t.clientX - _tx, dy = t.clientY - _ty;
    _tx = 0; _ty = 0;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) next(); else prev();
  }, { passive: true });

  function openGuide() {
    shell.classList.add('on');
    document.body.style.overflow = 'hidden';
    if (stage) stage.style.display = 'none';
    if (nav) nav.style.display = 'none';
    show(0);
  }
  function closeGuide(enterDemo) {
    shell.classList.remove('on');
    document.body.style.overflow = '';
    if (stage) stage.style.display = '';
    if (nav) nav.style.display = '';
    // 退出引导进 demo 前，先弹声明弹窗（splash），点"开始试玩"才进
    if (enterDemo) showSplash();
    else _startDemo();
  }

  // ---- 声明弹窗（splash）----
  var _splashShown = false;
  var _demoStarted = false;
  function _startDemo() {
    if (_demoStarted) return;
    _demoStarted = true;
    if (window.__enterDemo) window.__enterDemo();
  }
  function showSplash() {
    var sp = document.getElementById('splash');
    if (!sp) { _startDemo(); return; }
    sp.classList.remove('hidden');
    sp.style.display = 'flex';
    _splashShown = true;
    // 点"开始试玩"进 demo
    var go = document.getElementById('splashGo');
    if (go) go.onclick = function () { hideSplash(); _startDemo(); };
    var close = document.getElementById('splashClose');
    if (close) close.onclick = hideSplash;
    sp.onclick = function (e) { if (e.target === sp) hideSplash(); };
    // 用户读声明时，后台预加载 demo 组件（不等点"开始试玩"才建 WebGL context）
    setTimeout(_startDemo, 300);
  }
  function hideSplash() {
    var sp = document.getElementById('splash');
    if (!sp) return;
    sp.classList.add('hidden');
    setTimeout(function () { sp.style.display = 'none'; }, 300);
  }

  exitEl.addEventListener('click', function () { closeGuide(true); });
  ctaEl.addEventListener('click', function () { closeGuide(true); });

  // ---- 开屏动画 → 自动进引导 ----
  var intro = document.getElementById('intro');
  if (intro) {
    // 1.8 秒开屏动画，播完淡出，自动进引导
    setTimeout(function () {
      intro.classList.add('off');
      setTimeout(function () { if (intro.parentNode) intro.parentNode.removeChild(intro); }, 550);
      openGuide();
    }, 1800);
  } else {
    // 无开屏层兜底直接进引导
    openGuide();
  }
})();
