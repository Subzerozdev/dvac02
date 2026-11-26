(() => {
  'use strict';
  const D = window.DATA;

  /* ========== Tiện ích ========== */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const norm = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const slug = s => norm(s).replace(/ /g, '-');
  const readJSON = k => { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch (e) { return {}; } };

  /* ========== Cài đặt ========== */
  const SKEY = 'dva-c02-settings-v1';
  const settings = Object.assign({ newPerDay: 10, sessionSize: 20, rate: 0.9, autoSpeak: true, pool: 'all' }, readJSON(SKEY));
  const saveSettings = () => { try { localStorage.setItem(SKEY, JSON.stringify(settings)); } catch (e) { /* bỏ qua */ } };

  /* ========== Dữ liệu ========== */
  const ITEMS = [];
  const BY_ID = {};
  function addItem(it) {
    let id = it.id, n = 2;
    while (BY_ID[id]) id = it.id + '-' + (n++);
    it.id = id; BY_ID[id] = it; ITEMS.push(it);
  }
  Object.keys(D.phrases).forEach(cat => D.phrases[cat].forEach(([en, vi, tip, ex, exVi]) =>
    addItem({ kind: 'p', id: 'p:' + slug(en), cat, en, vi, tip, ex, exVi })));
  D.formulas.forEach(f => f.examples.forEach(([en, vi]) =>
    addItem({ kind: 'f', id: 'f:' + slug(en), cat: 'formula', en, vi, formula: f })));
  D.signals.forEach(([en, vi, tip]) => addItem({ kind: 's', id: 's:' + slug(en), cat: 'signal', en, vi, tip }));

  const POOLS = [{ key: 'all', name: '🌐 Tất cả' }].concat(Object.keys(D.categories).map(k => ({ key: k, name: D.categories[k].icon + ' ' + D.categories[k].name })));
  const poolItems = key => (key === 'all' || !D.categories[key]) ? ITEMS : ITEMS.filter(i => i.cat === key);

  const clozeIndex = it => it.ex ? it.ex.toLowerCase().indexOf(it.en.toLowerCase()) : -1;

  /* ========== Phát âm ========== */
  const hasTTS = 'speechSynthesis' in window;
  let voices = [];
  if (hasTTS) {
    const lv = () => { voices = speechSynthesis.getVoices(); };
    lv(); speechSynthesis.onvoiceschanged = lv;
  }
  function speak(text, rate) {
    if (!hasTTS || !text) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = rate || settings.rate;
    const v = voices.find(x => /^en[-_]US/i.test(x.lang) && /Samantha|Google US|Aria|Jenny|Ava/i.test(x.name))
      || voices.find(x => /^en[-_]US/i.test(x.lang)) || voices.find(x => /^en/i.test(x.lang));
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  }
  const spk = (text, label) => `<button class="spk" type="button" data-say="${esc(text)}" title="Nghe phát âm" aria-label="Nghe phát âm">${label || '🔊'}</button>`;

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-say]');
    if (b) { e.preventDefault(); e.stopPropagation(); speak(b.dataset.say, b.dataset.rate ? +b.dataset.rate : undefined); }
  }, true);

  /* ========== Phím tắt ========== */
  let keyHandler = null;
  document.addEventListener('keydown', e => {
    if (keyHandler && !e.defaultPrevented && !e.metaKey && !e.ctrlKey && !e.altKey) keyHandler(e);
  });
  const inInput = e => e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA');

  /* ========== Hiển thị dùng chung ========== */
  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast'; t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2600);
  }
  function kindLabel(it) {
    if (it.kind === 'f') return '📐 Công thức câu';
    if (it.kind === 's') return '🎯 Tín hiệu đề';
    const c = D.categories[it.cat]; return c.icon + ' ' + c.name;
  }
  function boxBadge(id) {
    const b = SRS.box(id);
    if (b < 0) return '<span class="badge b-new">Mới</span>';
    return `<span class="badge b${b}">${b >= 5 ? '★ Thuộc' : 'Hộp ' + b}</span>`;
  }
  function highlight(text, phrase) {
    const i = text.toLowerCase().indexOf(phrase.toLowerCase());
    if (i < 0) return esc(text);
    return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + phrase.length)) + '</mark>' + esc(text.slice(i + phrase.length));
  }
  const fmtPattern = p => esc(p)
    .replace(/\[([^\]]+)\]/g, '<span class="slot">$1</span>')
    .replace(/\b(LEAST|MOST|TWO|THREE)\b/g, '<b class="key">$1</b>');
  const maskHint = s => s.replace(/[A-Za-z0-9]+/g, w => w[0] + '_'.repeat(w.length - 1));

  /** Phát âm các từ khó có trong cụm (tra cả dạng số nhiều -s/-es) */
  function pronHtml(text) {
    const P = D.pronounce || {};
    const seen = new Set();
    const rows = [];
    norm(text).split(' ').forEach(w => {
      const key = P[w] ? w : P[w.replace(/e?s$/, '')] ? w.replace(/e?s$/, '') : P[w.replace(/s$/, '')] ? w.replace(/s$/, '') : null;
      if (!key || seen.has(key)) return;
      seen.add(key);
      rows.push(`<span class="pron">${spk(key)}<b>${esc(key)}</b> <code>${esc(P[key][0])}</code> <span class="muted">≈ ${esc(P[key][1])}</span></span>`);
    });
    return rows.length ? `<div class="prons">🗣️ ${rows.join('')}</div>` : '';
  }

  function cardDetail(it, withEn) {
    let h = '';
    if (withEn) h += `<div class="d-en">${esc(it.en)} ${spk(it.en)}</div>`;
    h += `<div class="d-vi">${it.kind === 's' ? '➜ ' : ''}${esc(it.vi)}</div>`;
    h += pronHtml(it.en);
    if (it.tip) h += `<div class="tip">💡 ${esc(it.tip)}</div>`;
    if (it.ex) h += `<div class="ex"><div>${highlight(it.ex, it.en)} ${spk(it.ex)}</div><div class="muted">${esc(it.exVi)}</div></div>`;
    if (it.kind === 'f') h += `<div class="tip">📐 Công thức: ${fmtPattern(it.formula.pattern)}<br><span class="muted">${esc(it.formula.vi)}</span></div>`;
    return h;
  }

  function poolChips(onChange) {
    const html = `<div class="chips" role="group" aria-label="Chọn chủ đề">${POOLS.map(p =>
      `<button class="chip ${settings.pool === p.key ? 'on' : ''}" data-pool="${p.key}">${esc(p.name)}</button>`).join('')}</div>`;
    setTimeout(() => $$('[data-pool]').forEach(b => b.onclick = () => { settings.pool = b.dataset.pool; saveSettings(); onChange(); }));
    return html;
  }

  /* ========== Điều hướng ========== */
  const app = $('#app');
  const VIEWS = {};
  function go(view, ...args) {
    keyHandler = null;
    if (hasTTS) speechSynthesis.cancel();
    $$('#nav button').forEach(b => b.classList.toggle('active', b.dataset.view === view));
    VIEWS[view](...args);
    window.scrollTo(0, 0);
  }
  $('#nav').addEventListener('click', e => { const b = e.target.closest('button[data-view]'); if (b) go(b.dataset.view); });

  /* ========== Dạng bài ========== */
  const MODES = {
    auto: { name: 'Học thông minh', icon: '🚀', desc: 'Tự chọn dạng bài theo mức độ nhớ của từng mục (khuyên dùng).' },
    flash: { name: 'Flashcard', icon: '🃏', desc: 'Lật thẻ, tự đánh giá mức nhớ.' },
    mcqEnVi: { name: 'Trắc nghiệm Anh → Việt', icon: '🇬🇧', desc: 'Nhìn tiếng Anh, chọn nghĩa đúng.' },
    mcqViEn: { name: 'Trắc nghiệm Việt → Anh', icon: '🇻🇳', desc: 'Nhìn nghĩa, chọn cụm tiếng Anh.' },
    type: { name: 'Gõ lại cụm từ', icon: '⌨️', desc: 'Nhớ mặt chữ: gõ đúng từng chữ cái.' },
    cloze: { name: 'Điền vào câu', icon: '🧩', desc: 'Điền cụm từ còn thiếu trong câu ví dụ.' },
    scramble: { name: 'Xếp câu', icon: '🔀', desc: 'Sắp xếp các từ thành câu đúng (thuộc khuôn câu).' },
    dictation: { name: 'Nghe & chép', icon: '🎧', desc: 'Nghe phát âm rồi gõ lại chính xác.' },
    match: { name: 'Nối cặp', icon: '🔗', desc: 'Nối 6 cặp Anh – Việt nhanh nhất có thể.' },
    signal: { name: 'Tín hiệu đề thi', icon: '🎯', desc: 'Thấy cụm từ trong đề → đoán hướng đáp án.' },
    weak: { name: 'Ôn mục hay sai', icon: '🩹', desc: 'Tập trung vào các mục bạn sai nhiều nhất.' }
  };
  const FITS = {
    auto: () => true,
    flash: () => true,
    mcqEnVi: () => true,
    mcqViEn: () => true,
    type: i => i.kind === 'p',
    cloze: i => i.kind === 'p' && clozeIndex(i) >= 0,
    scramble: i => i.kind === 'f' || (i.kind === 'p' && !!i.ex && i.ex.split(/\s+/).length <= 16),
    dictation: i => i.kind !== 's' && hasTTS,
    signal: i => i.kind === 's',
    signalRev: i => i.kind === 's'
  };

  /** Thuật toán chọn dạng bài: nhận diện → nhớ lại → tự viết ra */
  function autoType(it) {
    const b = SRS.box(it.id);
    let t;
    if (it.kind === 's') t = b < 1 ? 'flash' : (b >= 3 && Math.random() < 0.5 ? 'signalRev' : 'signal');
    else if (it.kind === 'f') t = b < 1 ? 'flash' : b === 1 ? 'mcqViEn' : b <= 3 ? 'scramble' : pick(['scramble', 'dictation']);
    else if (b < 1) t = 'flash';
    else if (b === 1) t = pick(['mcqEnVi', 'mcqViEn']);
    else if (b === 2) t = pick(['mcqViEn', 'cloze']);
    else if (b === 3) t = pick(['type', 'cloze', 'scramble']);
    else t = pick(['type', 'dictation', 'cloze', 'scramble']);
    if (!FITS[t](it)) t = it.kind === 's' ? 'signal' : (it.kind === 'f' ? 'scramble' : 'type');
    return t;
  }
  const easyType = it => it.kind === 's' ? 'signal' : pick(['mcqEnVi', 'mcqViEn']);

  function distractors(it, n) {
    const same = ITEMS.filter(i => i !== it && i.kind === it.kind && i.cat === it.cat && i.vi !== it.vi && i.en !== it.en);
    const other = ITEMS.filter(i => i !== it && i.kind === it.kind && i.cat !== it.cat && i.vi !== it.vi);
    return shuffle(same).concat(shuffle(other)).slice(0, n);
  }

  /* ========== Xây hàng đợi câu hỏi ========== */
  function interleave(due, fresh) {
    const out = []; let i = 0, j = 0;
    while (i < due.length || j < fresh.length) {
      if (j < fresh.length) out.push(fresh[j++]);
      if (i < due.length) out.push(due[i++]);
      if (i < due.length) out.push(due[i++]);
    }
    return out;
  }
  function buildQueue(pool, size, learn) {
    const now = Date.now();
    const due = shuffle(pool.filter(i => SRS.isDue(i.id, now)));
    const fresh = pool.filter(i => !SRS.get(i.id));
    if (learn) {
      const newLeft = Math.max(0, settings.newPerDay - SRS.todayStats().new);
      const d = due.slice(0, size);
      const n = fresh.slice(0, Math.min(newLeft, Math.max(0, size - d.length)));
      return interleave(d, n);
    }
    const rest = shuffle(pool.filter(i => SRS.get(i.id) && !SRS.isDue(i.id, now))).sort((a, b) => SRS.box(a.id) - SRS.box(b.id));
    return shuffle(due.concat(rest).slice(0, size)).concat(fresh).slice(0, size);
  }
  const weakScore = it => { const s = SRS.get(it.id); return s ? s.ng * 2 - s.ok * 0.5 + (6 - s.box) : 0; };
  const entryFor = it => ({ item: it, practice: !!SRS.get(it.id) && !SRS.isDue(it.id) });

  function startSession(mode, poolKey, opts) {
    opts = opts || {};
    poolKey = poolKey || settings.pool;
    if (mode === 'match') return startMatch(poolKey);
    const restart = () => startSession(mode, poolKey, opts);
    let pool = opts.items || poolItems(poolKey);
    let runMode = mode, queue;

    if (mode === 'weak') {
      runMode = 'auto';
      queue = pool.filter(i => { const s = SRS.get(i.id); return s && s.ng > 0; })
        .sort((a, b) => weakScore(b) - weakScore(a)).slice(0, settings.sessionSize).map(entryFor);
      if (!queue.length) return toast('Bạn chưa sai mục nào trong chủ đề này. Tuyệt vời! 🎉');
    } else {
      pool = pool.filter(FITS[mode]);
      if (!pool.length) return toast('Chủ đề này không có mục phù hợp với dạng bài đã chọn.');
      let items = opts.items ? shuffle(pool).slice(0, settings.sessionSize) : buildQueue(pool, settings.sessionSize, mode === 'auto');
      if (!items.length && mode === 'auto') {
        const learned = pool.filter(i => SRS.get(i.id));
        items = (learned.length ? buildQueue(learned, settings.sessionSize, false) : pool.slice(0, settings.sessionSize));
        toast('Bạn đã hoàn thành lịch hôm nay 🎉 — chuyển sang ôn thêm.');
      }
      queue = items.map(entryFor);
    }
    runSession(queue, runMode, restart);
  }

  /* ========== Phiên học ========== */
  const PRAISE = ['Chính xác! 🎉', 'Giỏi quá! 👏', 'Đúng rồi! ✅', 'Tuyệt vời! 🌟', 'Chuẩn luôn! 💯'];

  function runSession(queue, mode, restart) {
    const S = { queue, i: 0, ok: 0, ng: 0, wrong: new Map(), waiting: false };
    keyHandler = null;
    app.innerHTML = `<section class="session">
      <div class="sess-top">
        <button class="btn ghost sm" id="quit">✕ Thoát</button>
        <div class="bar"><div id="prog"></div></div>
        <div class="score"><span class="ok-c" id="okc">✓ 0</span> <span class="ng-c" id="ngc">✗ 0</span></div>
      </div>
      <div id="stage"></div>
    </section>`;
    $('#quit').onclick = () => (S.ok + S.ng > 0 ? finish() : go('home'));
    next();

    function next() {
      S.waiting = false;
      keyHandler = null;
      if (S.i >= S.queue.length) return finish();
      const entry = S.queue[S.i];
      const it = entry.item;
      entry.isNew = !SRS.get(it.id);
      let type = entry.type || (mode === 'auto' ? autoType(it) : mode);
      if (!FITS[type](it)) type = autoType(it);
      $('#prog').style.width = (S.i / S.queue.length * 100) + '%';
      const stage = $('#stage');
      stage.innerHTML = '';
      EX[type]({ item: it, stage, done: (q, o) => answered(entry, type, q, o || {}) });
    }

    function answered(entry, type, q, o) {
      if (S.waiting) return;
      const it = entry.item;
      const correct = q > 0;
      if (entry.practice) SRS.practice(it.id, correct); else SRS.grade(it.id, q);
      if (correct) S.ok++; else { S.ng++; S.wrong.set(it.id, it); }
      const at = Math.min(S.i + 4, S.queue.length);
      if (!correct && !entry.retried) {
        S.queue.splice(at, 0, { item: it, practice: true, retried: true, type: easyType(it) });
      } else if (correct && type === 'flash' && entry.isNew && !entry.retried) {
        // Vừa học mục mới → kiểm tra lại ngay trong phiên để khắc sâu
        S.queue.splice(at, 0, { item: it, practice: true, retried: true, type: easyType(it) });
      }
      $('#okc').textContent = '✓ ' + S.ok;
      $('#ngc').textContent = '✗ ' + S.ng;
      S.i++;
      const stage = $('#stage');
      $$('.actions', stage).forEach(a => a.remove());
      if (o.silent) return next();

      S.waiting = true;
      const fb = document.createElement('div');
      fb.className = 'feedback ' + (correct ? 'ok' : 'bad');
      fb.innerHTML = `<div class="fb-title">${correct ? pick(PRAISE) : 'Chưa đúng — xem kỹ lại nhé 👀'}</div>
        ${o.html || ''}
        <div class="fb-card">${cardDetail(it, true)}</div>
        <button class="btn primary" id="nextBtn">Tiếp tục ↵</button>`;
      stage.appendChild(fb);
      if (document.activeElement) document.activeElement.blur();
      const cont = () => { if (S.waiting) next(); };
      $('#nextBtn').onclick = cont;
      keyHandler = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cont(); } };
      if (!correct && settings.autoSpeak) speak(it.en);
      fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function finish() {
      keyHandler = null;
      const total = S.ok + S.ng;
      const pct = total ? Math.round(S.ok * 100 / total) : 0;
      const wrong = Array.from(S.wrong.values());
      app.innerHTML = `<section class="card center finish">
        <div class="emoji">${pct >= 85 ? '🏆' : pct >= 60 ? '💪' : '📚'}</div>
        <h1>Hoàn thành phiên học!</h1>
        <p class="big-num">${S.ok}/${total} <span class="muted">(${pct}%)</span></p>
        <p class="muted">${pct >= 85 ? 'Xuất sắc! Các mục sẽ được hẹn ôn lại đúng lúc sắp quên.' : 'Không sao cả — sai là cách não ghi nhớ tốt nhất. Các mục sai sẽ quay lại sớm.'}</p>
        ${wrong.length ? `<h3>Các mục cần chú ý (${wrong.length})</h3>
          <ul class="wrong-list">${wrong.map(i => `<li>${spk(i.en)} <b>${esc(i.en)}</b> <span class="muted">— ${esc(i.vi)}</span></li>`).join('')}</ul>` : ''}
        <div class="row-btns">
          ${wrong.length ? '<button class="btn primary" id="again">🔁 Luyện lại mục sai</button>' : ''}
          <button class="btn ${wrong.length ? '' : 'primary'}" id="more">▶ Học tiếp</button>
          <button class="btn ghost" id="home">Về tổng quan</button>
        </div>
      </section>`;
      if ($('#again')) $('#again').onclick = () => runSession(shuffle(wrong).map(it => ({ item: it, practice: true, retried: true })), 'auto', restart);
      $('#more').onclick = restart;
      $('#home').onclick = () => go('home');
    }
  }

  /* ========== Các bài tập ========== */
  const EX = {
    flash: exFlash,
    mcqEnVi: c => exMcq(c, 'en-vi'),
    mcqViEn: c => exMcq(c, 'vi-en'),
    signal: c => exMcq(c, 'en-vi', true),
    signalRev: c => exMcq(c, 'vi-en', true),
    type: exType,
    cloze: exCloze,
    scramble: exScramble,
    dictation: exDictation
  };

  function exFlash(ctx) {
    const { item: it, stage } = ctx;
    const front = it.kind === 's'
      ? `<div class="q">Trong đề thấy cụm này → hướng đáp án là gì?</div><div class="big en">${esc(it.en)} ${spk(it.en)}</div>`
      : `<div class="big en">${esc(it.en)} ${spk(it.en)}</div><div class="mask">${it.kind === 'p' ? 'Đọc to theo 🔊 rồi đoán nghĩa trước khi lật' : 'Đọc to cả câu, đoán nghĩa trước khi lật'}</div>`;
    stage.innerHTML = `<div class="card ex-card">
      <div class="kind">${kindLabel(it)} · 🃏 Flashcard ${SRS.get(it.id) ? '' : '<span class="badge b-new">Mới</span>'}</div>
      ${front}
      <div class="back hidden">${cardDetail(it, false)}</div>
      <div class="actions"><button class="btn primary" id="flip">Lật thẻ <kbd>Space</kbd></button></div>
    </div>`;
    if (settings.autoSpeak) speak(it.en);
    let flipped = false;
    const grades = [['Quên', 0, 'bad'], ['Khó', 1, 'warn'], ['Nhớ', 2, 'good'], ['Dễ', 3, 'easy']];
    const flip = () => {
      if (flipped) return; flipped = true;
      $('.back', stage).classList.remove('hidden');
      $('.actions', stage).innerHTML = `<div class="q small">Bạn nhớ cụm này ở mức nào?</div><div class="grade-row">${grades.map(([l, q, c], k) =>
        `<button class="btn grade ${c}" data-q="${q}"><kbd>${k + 1}</kbd> ${l}</button>`).join('')}</div>`;
      $$('[data-q]', stage).forEach(b => b.onclick = () => ctx.done(+b.dataset.q, { silent: true }));
    };
    $('#flip').onclick = flip;
    keyHandler = e => {
      if (!flipped && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); flip(); }
      else if (flipped && /^[1-4]$/.test(e.key)) { e.preventDefault(); ctx.done(grades[+e.key - 1][1], { silent: true }); }
    };
  }

  function exMcq(ctx, dir, signal) {
    const { item: it, stage } = ctx;
    const opts = shuffle([it].concat(distractors(it, 3)));
    const enToVi = dir === 'en-vi';
    let question;
    if (signal) question = enToVi ? 'Đề bài có cụm này → hướng đáp án đúng là?' : 'Đáp án đúng là thế này → đề thường có cụm nào?';
    else question = enToVi ? 'Chọn nghĩa tiếng Việt đúng:' : 'Chọn cụm tiếng Anh đúng:';
    const prompt = enToVi ? `<div class="big en">${esc(it.en)} ${spk(it.en)}</div>` : `<div class="big">${esc(it.vi)}</div>`;
    stage.innerHTML = `<div class="card ex-card">
      <div class="kind">${kindLabel(it)} · ${signal ? '🎯 Tín hiệu đề' : enToVi ? '🇬🇧 Anh → Việt' : '🇻🇳 Việt → Anh'}</div>
      <div class="q">${question}</div>${prompt}
      <div class="options">${opts.map((o, k) => `<button class="opt" data-k="${k}"><kbd>${k + 1}</kbd><span>${esc(enToVi ? o.vi : o.en)}</span></button>`).join('')}</div>
    </div>`;
    if (enToVi && settings.autoSpeak) speak(it.en);
    let answered = false;
    const choose = k => {
      if (answered || !opts[k]) return; answered = true;
      const ok = opts[k] === it;
      $$('.opt', stage).forEach((b, i) => {
        b.disabled = true;
        if (opts[i] === it) b.classList.add('right');
        else if (i === k) b.classList.add('wrong');
      });
      if (!enToVi && ok) speak(it.en);
      ctx.done(ok ? 2 : 0, { html: ok ? '' : `<div class="diff">Bạn chọn: <s>${esc(enToVi ? opts[k].vi : opts[k].en)}</s></div>` });
    };
    $$('.opt', stage).forEach(b => b.onclick = () => choose(+b.dataset.k));
    keyHandler = e => { if (/^[1-4]$/.test(e.key)) { e.preventDefault(); choose(+e.key - 1); } };
  }

  function diffHtml(user, target) {
    const u = norm(user).split(' ');
    return norm(target).split(' ').map((w, i) => `<span class="${w === u[i] ? 'w-ok' : 'w-bad'}">${esc(w)}</span>`).join(' ');
  }

  /** Logic gõ chữ dùng chung cho: Gõ lại, Điền câu, Nghe & chép */
  function typing(ctx, input, target) {
    let hinted = false, finished = false;
    const check = () => {
      if (finished) return;
      const val = input.value;
      if (!norm(val)) { input.classList.add('shake'); setTimeout(() => input.classList.remove('shake'), 400); input.focus(); return; }
      finished = true; input.disabled = true;
      const ok = norm(val) === norm(target);
      input.classList.add(ok ? 'is-ok' : 'is-bad');
      ctx.done(ok ? (hinted ? 1 : 2) : 0, {
        html: ok ? (hinted ? '<div class="muted">Đúng nhưng có dùng gợi ý → tính là "Khó", sẽ ôn lại sớm hơn.</div>' : '')
          : `<div class="diff">Bạn gõ: <code>${esc(val)}</code><br>Đáp án: ${diffHtml(val, target)}</div>`
      });
    };
    const hint = () => {
      if (finished) return;
      hinted = true;
      const cur = input.value;
      let k = 0;
      while (k < cur.length && k < target.length && cur[k].toLowerCase() === target[k].toLowerCase()) k++;
      let end = Math.min(target.length, k + 1);
      while (end < target.length && !/[A-Za-z0-9]/.test(target[end - 1])) end++;
      input.value = target.slice(0, end);
      input.focus();
    };
    const giveUp = () => {
      if (finished) return;
      finished = true; input.disabled = true;
      ctx.done(0, { html: `<div class="diff">Đáp án: <b>${esc(target)}</b></div>` });
    };
    input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); check(); } });
    return { check, hint, giveUp };
  }
  const typingActions = `<div class="actions">
      <button class="btn primary" data-a="check">Kiểm tra <kbd>↵</kbd></button>
      <button class="btn" data-a="hint">💡 Gợi ý 1 chữ</button>
      <button class="btn ghost" data-a="skip">Không biết</button>
    </div>`;
  function bindTyping(stage, t) {
    $('[data-a=check]', stage).onclick = t.check;
    $('[data-a=hint]', stage).onclick = t.hint;
    $('[data-a=skip]', stage).onclick = t.giveUp;
  }
  const inputAttrs = 'autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"';

  function exType(ctx) {
    const { item: it, stage } = ctx;
    stage.innerHTML = `<div class="card ex-card">
      <div class="kind">${kindLabel(it)} · ⌨️ Gõ lại cụm từ</div>
      <div class="q">Gõ cụm tiếng Anh có nghĩa:</div>
      <div class="big">${esc(it.vi)}</div>
      <div class="mask" title="Chữ cái đầu của mỗi từ">${esc(maskHint(it.en))}</div>
      <input class="answer" id="ans" ${inputAttrs} placeholder="Gõ tiếng Anh...">
      ${typingActions}
    </div>`;
    const input = $('#ans', stage);
    bindTyping(stage, typing(ctx, input, it.en));
    input.focus();
  }

  function exCloze(ctx) {
    const { item: it, stage } = ctx;
    const i = clozeIndex(it);
    const target = it.ex.substr(i, it.en.length);
    stage.innerHTML = `<div class="card ex-card">
      <div class="kind">${kindLabel(it)} · 🧩 Điền vào câu</div>
      <div class="q">Điền cụm từ có nghĩa <b>"${esc(it.vi)}"</b> vào chỗ trống:</div>
      <div class="sentence">${esc(it.ex.slice(0, i))}<input class="blank" id="ans" ${inputAttrs} style="width:${Math.min(40, target.length + 3)}ch">${esc(it.ex.slice(i + it.en.length))}</div>
      <div class="muted">${esc(it.exVi)}</div>
      <div class="mask small">Gợi ý: ${esc(maskHint(target))}</div>
      ${typingActions}
    </div>`;
    const input = $('#ans', stage);
    bindTyping(stage, typing(ctx, input, target));
    input.focus();
  }

  function exDictation(ctx) {
    const { item: it, stage } = ctx;
    const words = it.en.split(/\s+/).length;
    stage.innerHTML = `<div class="card ex-card">
      <div class="kind">${kindLabel(it)} · 🎧 Nghe & chép</div>
      <div class="q">Nghe và gõ lại chính xác (${words} từ):</div>
      <div class="listen">
        <button class="btn big-btn" data-say="${esc(it.en)}">🔊 Nghe</button>
        <button class="btn" data-say="${esc(it.en)}" data-rate="0.6">🐢 Nghe chậm</button>
      </div>
      <details class="peek"><summary>Xem nghĩa tiếng Việt (gợi ý)</summary>${esc(it.vi)}</details>
      <input class="answer" id="ans" ${inputAttrs} placeholder="Gõ những gì bạn nghe được...">
      ${typingActions}
    </div>`;
    const input = $('#ans', stage);
    bindTyping(stage, typing(ctx, input, it.en));
    input.focus();
    setTimeout(() => speak(it.en), 250);
  }

  function exScramble(ctx) {
    const { item: it, stage } = ctx;
    const sentence = it.kind === 'f' ? it.en : it.ex;
    const trans = it.kind === 'f' ? it.vi : it.exVi;
    const words = sentence.split(/\s+/);
    let order = shuffle(words.map((w, i) => i));
    for (let k = 0; k < 6 && words.length > 1 && order.every((v, i) => words[v] === words[i]); k++) order = shuffle(order);
    let placed = [];
    let hinted = false, finished = false;
    stage.innerHTML = `<div class="card ex-card">
      <div class="kind">${kindLabel(it)} · 🔀 Xếp câu</div>
      <div class="q">Sắp xếp các từ thành câu có nghĩa:</div>
      <div class="big vi-s">${esc(trans)}</div>
      ${it.kind === 'f' ? `<div class="pattern-hint">📐 ${fmtPattern(it.formula.pattern)}</div>` : ''}
      <div class="zone answer-zone" id="az"></div>
      <div class="zone pool-zone" id="pz"></div>
      <div class="actions">
        <button class="btn primary" data-a="check" disabled>Kiểm tra <kbd>↵</kbd></button>
        <button class="btn" data-a="hint">💡 Gợi ý</button>
        <button class="btn" data-a="clear">↺ Xếp lại</button>
        <button class="btn ghost" data-a="skip">Không biết</button>
      </div>
    </div>`;
    const az = $('#az', stage), pz = $('#pz', stage);
    function render() {
      az.innerHTML = placed.length
        ? placed.map((wi, pos) => `<button class="wchip" data-pos="${pos}">${esc(words[wi])}</button>`).join('')
        : '<span class="placeholder">Bấm vào các từ bên dưới theo đúng thứ tự…</span>';
      pz.innerHTML = order.filter(wi => placed.indexOf(wi) < 0).map(wi => `<button class="wchip" data-wi="${wi}">${esc(words[wi])}</button>`).join('');
      const chk = $('[data-a=check]', stage);
      if (chk) chk.disabled = placed.length !== words.length;
      $$('[data-pos]', az).forEach(b => b.onclick = () => { if (finished) return; placed.splice(+b.dataset.pos, 1); render(); });
      $$('[data-wi]', pz).forEach(b => b.onclick = () => { if (finished) return; placed.push(+b.dataset.wi); render(); if (placed.length === words.length) $('[data-a=check]', stage).focus(); });
    }
    const check = () => {
      if (finished || placed.length !== words.length) return;
      finished = true;
      const ans = placed.map(i => words[i]).join(' ');
      const ok = ans === sentence || norm(ans) === norm(sentence);
      az.classList.add(ok ? 'is-ok' : 'is-bad');
      ctx.done(ok ? (hinted ? 1 : 2) : 0, {
        html: ok ? '' : `<div class="diff">Bạn xếp: <code>${esc(ans)}</code><br>Đáp án: <b>${esc(sentence)}</b> ${spk(sentence)}</div>`
      });
      if (ok) speak(sentence);
    };
    const hint = () => {
      if (finished) return;
      hinted = true;
      let pos = 0;
      while (pos < placed.length && words[placed[pos]] === words[pos]) pos++;
      placed = placed.slice(0, pos);
      if (pos < words.length) {
        const wi = words.findIndex((w, i) => w === words[pos] && placed.indexOf(i) < 0);
        if (wi >= 0) placed.push(wi);
      }
      render();
    };
    $('[data-a=check]', stage).onclick = check;
    $('[data-a=hint]', stage).onclick = hint;
    $('[data-a=clear]', stage).onclick = () => { if (!finished) { placed = []; render(); } };
    $('[data-a=skip]', stage).onclick = () => { if (finished) return; finished = true; ctx.done(0, { html: `<div class="diff">Đáp án: <b>${esc(sentence)}</b> ${spk(sentence)}</div>` }); };
    keyHandler = e => {
      if (inInput(e)) return;
      if (e.key === 'Enter') { e.preventDefault(); check(); }
      else if (e.key === 'Backspace' && !finished) { e.preventDefault(); placed.pop(); render(); }
    };
    render();
  }

  /* ========== Trò chơi nối cặp ========== */
  function startMatch(poolKey) {
    keyHandler = null;
    let pool = poolItems(poolKey).filter(i => i.kind === 'p');
    if (pool.length < 6) pool = ITEMS.filter(i => i.kind === 'p');
    const learned = shuffle(pool.filter(i => SRS.get(i.id))).sort((a, b) => SRS.box(a.id) - SRS.box(b.id));
    const fresh = pool.filter(i => !SRS.get(i.id));
    const set = shuffle(learned.slice(0, 6).concat(fresh).slice(0, 6));
    const left = shuffle(set), right = shuffle(set);
    const sel = { L: null, R: null };
    const mistakes = new Set();
    let matched = 0;
    const t0 = Date.now();

    app.innerHTML = `<section class="session">
      <div class="sess-top"><button class="btn ghost sm" id="quit">✕ Thoát</button><div class="muted">🔗 Nối cặp Anh – Việt</div><div class="score" id="clock">0s</div></div>
      <div class="card"><p class="muted center">Bấm 1 ô bên trái rồi 1 ô bên phải để nối. Sai thì mục đó sẽ được đưa về ôn lại.</p>
        <div class="match">
          <div class="col">${left.map(i => `<button class="mitem en" data-side="L" data-id="${esc(i.id)}">${esc(i.en)}</button>`).join('')}</div>
          <div class="col">${right.map(i => `<button class="mitem" data-side="R" data-id="${esc(i.id)}">${esc(i.vi)}</button>`).join('')}</div>
        </div>
      </div><div id="mres"></div>
    </section>`;
    $('#quit').onclick = () => go('practice');
    const timer = setInterval(() => { const c = $('#clock'); if (!c) return clearInterval(timer); c.textContent = Math.round((Date.now() - t0) / 1000) + 's'; }, 500);

    $$('.mitem').forEach(b => b.onclick = () => {
      if (b.classList.contains('done')) return;
      const side = b.dataset.side;
      if (sel[side]) sel[side].classList.remove('sel');
      sel[side] = b; b.classList.add('sel');
      if (side === 'L') speak(BY_ID[b.dataset.id].en);
      if (sel.L && sel.R) {
        const a = sel.L, c = sel.R;
        sel.L = sel.R = null;
        if (a.dataset.id === c.dataset.id) {
          [a, c].forEach(x => { x.classList.remove('sel'); x.classList.add('done'); });
          matched++;
          if (matched === set.length) done();
        } else {
          mistakes.add(a.dataset.id); mistakes.add(c.dataset.id);
          [a, c].forEach(x => { x.classList.remove('sel'); x.classList.add('wrong'); });
          setTimeout(() => [a, c].forEach(x => x.classList.remove('wrong')), 500);
        }
      }
    });

    function done() {
      clearInterval(timer);
      const secs = Math.round((Date.now() - t0) / 1000);
      set.forEach(i => {
        if (mistakes.has(i.id)) SRS.grade(i.id, 0);
        else if (SRS.isDue(i.id)) SRS.grade(i.id, 2);
        else SRS.practice(i.id, true);
      });
      $('#mres').innerHTML = `<div class="card center">
        <h2>${mistakes.size ? '💪 Xong!' : '🏆 Hoàn hảo!'}</h2>
        <p>Thời gian: <b>${secs}s</b> · Mục bị nối sai: <b>${mistakes.size}</b></p>
        ${mistakes.size ? `<ul class="wrong-list">${set.filter(i => mistakes.has(i.id)).map(i => `<li>${spk(i.en)} <b>${esc(i.en)}</b> <span class="muted">— ${esc(i.vi)}</span></li>`).join('')}</ul>` : ''}
        <div class="row-btns"><button class="btn primary" id="again">🔁 Ván mới</button><button class="btn ghost" id="back">Về luyện tập</button></div>
      </div>`;
      $('#again').onclick = () => startMatch(poolKey);
      $('#back').onclick = () => go('practice');
      $('#mres').scrollIntoView({ behavior: 'smooth' });
    }
  }

  /* ========== Trang: Tổng quan ========== */
  VIEWS.home = function () {
    const now = Date.now();
    const pool = poolItems(settings.pool);
    const boxCount = [0, 0, 0, 0, 0, 0, 0]; // [mới, hộp1..6]
    let due = 0;
    pool.forEach(i => { const b = SRS.box(i.id); boxCount[b < 0 ? 0 : b]++; if (SRS.isDue(i.id, now)) due++; });
    const learned = pool.length - boxCount[0];
    const mastered = boxCount[5] + boxCount[6];
    const t = SRS.todayStats();
    const newLeft = Math.min(boxCount[0], Math.max(0, settings.newPerDay - t.new));
    const streak = SRS.streak();
    const todo = Math.min(settings.sessionSize, due + newLeft);
    const nextDue = SRS.nextDueTime(pool.map(i => i.id));

    const cats = Object.keys(D.categories).map(k => {
      const list = ITEMS.filter(i => i.cat === k);
      const l = list.filter(i => SRS.box(i.id) >= 1).length;
      const m = list.filter(i => SRS.box(i.id) >= 5).length;
      return { k, c: D.categories[k], total: list.length, l, m };
    });
    const segColors = ['var(--b-new)', 'var(--b1)', 'var(--b2)', 'var(--b3)', 'var(--b4)', 'var(--b5)', 'var(--b6)'];
    const segNames = ['Mới', 'Hộp 1', 'Hộp 2', 'Hộp 3', 'Hộp 4', 'Hộp 5', 'Hộp 6'];

    app.innerHTML = `
    <section class="hero card">
      <div class="hero-main">
        <h1>Học tiếng Anh cho AWS DVA-C02 ☁️</h1>
        <p class="lead">${todo > 0
          ? `Hôm nay có <b>${due}</b> mục cần ôn và <b>${newLeft}</b> mục mới. Khoảng <b>${Math.max(3, Math.round(todo * 0.4))} phút</b>.`
          : `Bạn đã xong lịch hôm nay 🎉 ${isFinite(nextDue) ? 'Mục tiếp theo đến hạn: <b>' + new Date(nextDue).toLocaleString('vi-VN', { weekday: 'short', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) + '</b>.' : ''} Có thể ôn thêm nếu muốn.`}</p>
        ${poolChips(() => go('home'))}
        <div class="row-btns">
          <button class="btn primary big-btn" id="learn">🚀 ${todo > 0 ? 'Học hôm nay (' + todo + ' mục)' : 'Ôn thêm'}</button>
          <button class="btn" id="toPractice">🎮 Chọn dạng bài khác</button>
        </div>
      </div>
      <div class="streak"><div class="flame">🔥</div><div class="big-num">${streak}</div><div class="muted">ngày liên tiếp</div></div>
    </section>

    <section class="stats">
      <div class="stat card"><div class="muted">Tổng số mục</div><div class="big-num">${pool.length}</div></div>
      <div class="stat card"><div class="muted">Đã học</div><div class="big-num">${learned}</div></div>
      <div class="stat card"><div class="muted">Thuộc lâu (hộp 5+)</div><div class="big-num">${mastered}</div></div>
      <div class="stat card"><div class="muted">Hôm nay đúng</div><div class="big-num">${t.ok}<span class="muted small">/${t.n}</span></div></div>
    </section>

    <section class="card">
      <h2>Hộp ghi nhớ</h2>
      <p class="muted">Đúng → mục lên hộp cao hơn và được hẹn ôn thưa dần (1 → 2 → 4 → 7 → 15 → 30 ngày). Sai → quay về hộp 1.</p>
      <div class="stack">${boxCount.map((n, i) => n ? `<div style="flex:${n};background:${segColors[i]}" title="${segNames[i]}: ${n}"></div>` : '').join('')}</div>
      <div class="legend">${boxCount.map((n, i) => `<span><i style="background:${segColors[i]}"></i>${segNames[i]}: <b>${n}</b></span>`).join('')}</div>
    </section>

    <section class="card">
      <h2>Tiến độ theo chủ đề</h2>
      <div class="cat-list">${cats.map(x => `
        <button class="cat-row" data-cat="${x.k}">
          <span class="cat-name">${x.c.icon} ${esc(x.c.name)}</span>
          <span class="pbar"><span style="width:${x.total ? x.l / x.total * 100 : 0}%"></span><span class="m" style="width:${x.total ? x.m / x.total * 100 : 0}%"></span></span>
          <span class="muted small">${x.l}/${x.total}</span>
        </button>`).join('')}</div>
    </section>`;
    $('#learn').onclick = () => startSession('auto', settings.pool);
    $('#toPractice').onclick = () => go('practice');
    $$('[data-cat]').forEach(b => b.onclick = () => { settings.pool = b.dataset.cat; saveSettings(); go('home'); });
  };

  /* ========== Trang: Luyện tập ========== */
  VIEWS.practice = function () {
    const pool = poolItems(settings.pool);
    const order = ['auto', 'flash', 'mcqEnVi', 'mcqViEn', 'cloze', 'type', 'scramble', 'dictation', 'match', 'signal', 'weak'];
    app.innerHTML = `<section>
      <div class="page-head"><div><h1>🎮 Luyện tập</h1><p class="muted">Chọn chủ đề rồi chọn dạng bài. Mọi kết quả đều được ghi vào hộp ghi nhớ.</p></div></div>
      ${poolChips(() => go('practice'))}
      <div class="modes">${order.map(k => {
        const m = MODES[k];
        const fitN = k === 'weak' ? pool.filter(i => { const s = SRS.get(i.id); return s && s.ng > 0; }).length
          : k === 'match' ? pool.filter(i => i.kind === 'p').length : pool.filter(FITS[k]).length;
        const disabled = (k === 'dictation' && !hasTTS);
        return `<button class="mode card ${k === 'auto' ? 'featured' : ''}" data-mode="${k}" ${disabled ? 'disabled' : ''}>
          <div class="mode-icon">${m.icon}</div><div class="mode-name">${m.name}</div>
          <div class="muted small">${disabled ? 'Trình duyệt không hỗ trợ đọc giọng nói' : m.desc}</div>
          <div class="mode-count">${fitN} mục</div></button>`;
      }).join('')}</div>
      <p class="muted small">⌨️ Phím tắt: <kbd>Space</kbd> lật thẻ · <kbd>1</kbd>–<kbd>4</kbd> chọn đáp án · <kbd>Enter</kbd> kiểm tra / tiếp tục · <kbd>Backspace</kbd> gỡ từ khi xếp câu.</p>
    </section>`;
    $$('[data-mode]').forEach(b => b.onclick = () => startSession(b.dataset.mode, settings.pool));
  };

  /* ========== Trang: Từ điển ========== */
  let dictCat = 'all', dictQ = '';
  VIEWS.dict = function () {
    app.innerHTML = `<section>
      <div class="page-head"><div><h1>📖 Từ điển cụm từ</h1><p class="muted">${ITEMS.filter(i => i.kind === 'p').length} cụm từ + ${D.signals.length} tín hiệu đề. Bấm vào một dòng để xem mẹo nhớ và câu ví dụ.</p></div></div>
      <input class="search" id="q" placeholder="🔎 Tìm tiếng Anh hoặc tiếng Việt..." value="${esc(dictQ)}">
      <div class="chips">${POOLS.filter(p => p.key !== 'formula').map(p => `<button class="chip ${dictCat === p.key ? 'on' : ''}" data-dc="${p.key}">${esc(p.name)}</button>`).join('')}</div>
      <div id="list" class="dict"></div>
    </section>`;
    const render = () => {
      const q = dictQ.trim().toLowerCase();
      const list = ITEMS.filter(i => i.kind !== 'f' && (dictCat === 'all' || i.cat === dictCat) &&
        (!q || i.en.toLowerCase().includes(q) || i.vi.toLowerCase().includes(q) || norm(i.en).includes(norm(q))));
      $('#list').innerHTML = list.length ? list.map(i => `<details class="drow">
        <summary>${spk(i.en)}<span class="d-main"><b class="en">${esc(i.en)}</b><span class="muted">${esc(i.vi)}</span></span>${boxBadge(i.id)}</summary>
        <div class="d-body">${cardDetail(i, false)}</div></details>`).join('') : '<p class="muted center">Không tìm thấy kết quả.</p>';
    };
    $('#q').oninput = e => { dictQ = e.target.value; render(); };
    $$('[data-dc]').forEach(b => b.onclick = () => { dictCat = b.dataset.dc; go('dict'); });
    render();
  };

  /* ========== Trang: Công thức câu ========== */
  VIEWS.formulas = function () {
    app.innerHTML = `<section>
      <div class="page-head">
        <div><h1>📐 Công thức câu</h1>
        <p class="muted">Câu hỏi DVA-C02 lặp lại rất ít khuôn câu. Thuộc khuôn → đọc đề nhanh và nắm ý chính ngay. Phần <span class="slot">trong khung</span> là chỗ thay từ; chữ <b class="key">IN HOA</b> là tiêu chí chấm điểm.</p></div>
        <button class="btn primary" id="allF">🔀 Luyện xếp câu tất cả</button>
      </div>
      ${D.formulas.map((f, fi) => `<article class="card formula">
        <div class="f-head"><span class="f-num">${fi + 1}</span><div>
          <div class="f-kind">${esc(f.kind)}</div>
          <div class="pattern">${fmtPattern(f.pattern)}</div>
          <div class="f-vi">${fmtPattern(f.vi)}</div></div></div>
        ${f.note ? `<div class="tip">💡 ${esc(f.note)}</div>` : ''}
        <ul class="examples">${f.examples.map(([en, vi]) => `<li>${spk(en)}<div><div>${esc(en)}</div><div class="muted">${esc(vi)}</div></div></li>`).join('')}</ul>
        <button class="btn sm" data-f="${fi}">🔀 Luyện công thức này</button>
      </article>`).join('')}
    </section>`;
    $('#allF').onclick = () => startSession('scramble', 'formula');
    $$('[data-f]').forEach(b => b.onclick = () => {
      const f = D.formulas[+b.dataset.f];
      startSession('scramble', 'formula', { items: ITEMS.filter(i => i.kind === 'f' && i.formula === f) });
    });
  };

  /* ========== Trang: Tín hiệu đề ========== */
  VIEWS.signals = function () {
    const sigs = ITEMS.filter(i => i.kind === 's');
    app.innerHTML = `<section>
      <div class="page-head">
        <div><h1>🎯 Tín hiệu đề thi</h1>
        <p class="muted">Mẹo làm bài: thấy cụm từ khóa trong đề → gần như biết hướng đáp án. Học thuộc bảng này giúp loại đáp án sai rất nhanh.</p></div>
        <button class="btn primary" id="goSig">🎯 Luyện tín hiệu đề</button>
      </div>
      <div class="signals">${sigs.map(s => `<div class="card sig">
        <div class="sig-k">${spk(s.en)} <span>“${esc(s.en)}”</span></div>
        <div class="sig-arrow">➜ <b>${esc(s.vi)}</b></div>
        <div class="muted small">${esc(s.tip)}</div>
        <div class="sig-foot">${boxBadge(s.id)}</div></div>`).join('')}</div>
    </section>`;
    $('#goSig').onclick = () => startSession('auto', 'signal');
  };

  /* ========== Trang: Hướng dẫn ========== */
  VIEWS.guide = function () {
    app.innerHTML = `<section class="card prose">
      <h1>🧠 Phương pháp học</h1>
      <p>Trang này kết hợp 4 kỹ thuật ghi nhớ đã được chứng minh hiệu quả. Bạn chỉ cần mỗi ngày bấm <b>🚀 Học hôm nay</b> khoảng 10–15 phút; thuật toán tự lo phần còn lại.</p>

      <h2>1. Lặp lại ngắt quãng (Spaced Repetition)</h2>
      <p>Não quên theo "đường cong lãng quên". Ôn <b>đúng lúc sắp quên</b> sẽ giúp nhớ lâu nhất. Mỗi mục nằm trong một <b>hộp</b>:</p>
      <table class="tbl"><tr><th>Hộp</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr>
        <tr><td>Ôn lại sau</td><td>1 ngày</td><td>2 ngày</td><td>4 ngày</td><td>7 ngày</td><td>15 ngày</td><td>30 ngày</td></tr></table>
      <ul><li>Trả lời đúng → lên 1 hộp (bấm "Dễ" → lên 2 hộp).</li>
        <li>Đúng nhưng dùng gợi ý / bấm "Khó" → giữ nguyên hộp.</li>
        <li>Sai → về hộp 1, được hỏi lại sau ~3 câu trong cùng phiên và sau 10 phút.</li></ul>

      <h2>2. Từ nhận diện → nhớ lại → tự viết ra</h2>
      <p>Dạng bài <b>tự khó dần</b> theo hộp của từng mục (chế độ <b>Học thông minh</b>):</p>
      <table class="tbl"><tr><th>Mức</th><th>Dạng bài</th><th>Mục tiêu</th></tr>
        <tr><td>Mục mới</td><td>🃏 Flashcard + kiểm tra lại ngay trong phiên</td><td>Làm quen mặt chữ, phát âm, nghĩa</td></tr>
        <tr><td>Hộp 1</td><td>Trắc nghiệm Anh ↔ Việt</td><td>Nhận ra nghĩa</td></tr>
        <tr><td>Hộp 2</td><td>Trắc nghiệm Việt → Anh, Điền vào câu</td><td>Nhận ra mặt chữ trong ngữ cảnh</td></tr>
        <tr><td>Hộp 3</td><td>Gõ lại, Điền câu, Xếp câu</td><td>Tự nhớ lại chính tả</td></tr>
        <tr><td>Hộp 4+</td><td>Nghe & chép, Gõ lại, Xếp câu</td><td>Phản xạ khi đọc / nghe đề</td></tr></table>

      <h2>3. Học theo cụm & công thức (chunking)</h2>
      <p>Đừng học từng từ riêng lẻ. Hãy học nguyên cụm như <i>"least operational overhead"</i> vì đề thi dùng đúng cụm đó. Trang <b>📐 Công thức câu</b> gom các khuôn câu lặp lại nhiều nhất trong đề: thuộc khuôn rồi thì chỉ cần nhìn phần thay đổi.</p>

      <h2>4. Mẹo nhớ bằng gốc từ</h2>
      <p>Các từ khó đọc có 🗣️ phiên âm IPA và cách đọc gần đúng cho người Việt (âm VIẾT HOA là âm nhấn). Mỗi cụm có 💡 mẹo nhớ: tách gốc từ (<i>de + couple = tách đôi</i>), liên tưởng hình ảnh (<i>spike = cái gai → tăng vọt</i>), và gắn với dịch vụ AWS hay đi kèm.</p>

      <h2>💡 Lời khuyên</h2>
      <ul>
        <li><b>Luôn đọc to</b> theo nút 🔊: vừa nghe vừa nói nhớ gấp đôi so với chỉ nhìn.</li>
        <li>Thà học <b>ít mà đều mỗi ngày</b> còn hơn học dồn. Giữ chuỗi 🔥.</li>
        <li>Khi gõ sai, đọc kỹ phần <span class="w-bad">tô đỏ</span>: đó là chữ bạn hay nhầm.</li>
        <li>Mỗi cuối tuần chơi <b>🔗 Nối cặp</b> và <b>🩹 Ôn mục hay sai</b>.</li>
        <li>Muốn thêm từ mới? Mở <code>js/data.js</code> và thêm 1 dòng vào nhóm phù hợp.</li>
      </ul>
    </section>`;
  };

  /* ========== Trang: Cài đặt ========== */
  VIEWS.settings = function () {
    app.innerHTML = `<section class="card">
      <h1>⚙️ Cài đặt</h1>
      <div class="form">
        <label>Số mục mới mỗi ngày <input type="number" id="newPerDay" min="0" max="60" value="${settings.newPerDay}"></label>
        <label>Số câu mỗi phiên <input type="number" id="sessionSize" min="5" max="80" value="${settings.sessionSize}"></label>
        <label>Tốc độ đọc: <b id="rateVal">${settings.rate}</b>
          <span class="inline"><input type="range" id="rate" min="0.5" max="1.3" step="0.1" value="${settings.rate}"> <button class="btn sm" data-say="Which solution will meet these requirements with the least operational overhead?">🔊 Thử</button></span></label>
        <label class="check"><input type="checkbox" id="autoSpeak" ${settings.autoSpeak ? 'checked' : ''}> Tự động đọc tiếng Anh khi hiện câu hỏi</label>
      </div>
    </section>
    <section class="card">
      <h2>💾 Dữ liệu tiến độ</h2>
      <p class="muted">Tiến độ được lưu ngay trong trình duyệt này. Hãy xuất file để sao lưu hoặc chuyển sang máy khác.</p>
      <div class="row-btns">
        <button class="btn" id="exp">⬇️ Xuất tiến độ</button>
        <label class="btn">⬆️ Nhập tiến độ<input type="file" id="imp" accept="application/json,.json" hidden></label>
        <button class="btn danger" id="reset">🗑 Xóa toàn bộ tiến độ</button>
      </div>
    </section>`;
    const num = (id, min, max) => { const el = $('#' + id); el.onchange = () => { settings[id] = Math.max(min, Math.min(max, parseInt(el.value, 10) || min)); el.value = settings[id]; saveSettings(); toast('Đã lưu cài đặt'); }; };
    num('newPerDay', 0, 60); num('sessionSize', 5, 80);
    $('#rate').oninput = e => { settings.rate = +e.target.value; $('#rateVal').textContent = settings.rate; saveSettings(); };
    $('#autoSpeak').onchange = e => { settings.autoSpeak = e.target.checked; saveSettings(); };
    $('#exp').onclick = () => {
      const blob = new Blob([SRS.exportData()], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'dva-c02-tien-do-' + new Date().toISOString().slice(0, 10) + '.json';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    };
    $('#imp').onchange = e => {
      const f = e.target.files[0]; if (!f) return;
      f.text().then(txt => { SRS.importData(txt); toast('Đã nhập tiến độ ✅'); }).catch(err => toast('Lỗi: ' + err.message));
    };
    $('#reset').onclick = () => { if (confirm('Xóa toàn bộ tiến độ học? Không thể hoàn tác.')) { SRS.reset(); toast('Đã xóa tiến độ'); } };
  };

  go('home');
})();
