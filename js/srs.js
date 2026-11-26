/*
 * SRS = Spaced Repetition System (lặp lại ngắt quãng) kiểu hộp Leitner.
 * Mỗi mục nằm trong 1 hộp (1..6). Trả lời đúng → lên hộp, khoảng ôn dài dần.
 * Sai → về hộp 1 và được hỏi lại sớm.
 *   Hộp:      1    2    3    4    5     6
 *   Ôn sau:   1    2    4    7    15    30  (ngày)
 */
window.SRS = (() => {
  const KEY = 'dva-c02-srs-v1';
  const DAY = 86400000;
  const INTERVALS = [0, 1, 2, 4, 7, 15, 30];
  const MAX_BOX = 6;

  let db = load();

  function load() {
    try {
      const d = JSON.parse(localStorage.getItem(KEY));
      if (d && d.items) return { items: d.items, days: d.days || {} };
    } catch (e) { /* bỏ qua */ }
    return { items: {}, days: {} };
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) { /* bỏ qua */ }
  }

  function dayKey(t) {
    const d = new Date(t === undefined ? Date.now() : t);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function startOfDay(t) {
    const d = new Date(t === undefined ? Date.now() : t);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }
  function today() {
    const k = dayKey();
    if (!db.days[k]) db.days[k] = { n: 0, ok: 0, new: 0 };
    return db.days[k];
  }

  const get = id => db.items[id];
  const box = id => (db.items[id] ? db.items[id].box : -1);
  const isDue = (id, now) => !!db.items[id] && db.items[id].due <= (now || Date.now());

  /** q: 0 = quên, 1 = khó, 2 = nhớ, 3 = dễ */
  function grade(id, q) {
    const t = today();
    let s = db.items[id];
    if (!s) {
      s = db.items[id] = { box: 0, due: 0, ok: 0, ng: 0, last: 0 };
      t.new++;
    }
    t.n++;
    if (q === 0) {
      s.box = 1;
      s.ng++;
      s.due = Date.now() + 10 * 60 * 1000; // hỏi lại sau 10 phút
    } else {
      t.ok++;
      s.ok++;
      if (q === 1) s.box = Math.max(1, s.box);
      else if (q === 2) s.box = Math.min(MAX_BOX, s.box + 1);
      else s.box = Math.min(MAX_BOX, s.box + 2);
      s.due = startOfDay() + INTERVALS[s.box] * DAY;
    }
    s.last = Date.now();
    save();
    return s;
  }

  /** Luyện thêm (mục chưa đến hạn): đúng chỉ tính thống kê, sai thì về hộp 1. */
  function practice(id, ok) {
    if (!ok || !db.items[id]) return grade(id, ok ? 2 : 0);
    const t = today();
    t.n++; t.ok++;
    save();
    return db.items[id];
  }

  function todayStats() {
    return db.days[dayKey()] || { n: 0, ok: 0, new: 0 };
  }

  function streak() {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    const has = () => db.days[dayKey(d.getTime())] && db.days[dayKey(d.getTime())].n > 0;
    if (!has()) d.setDate(d.getDate() - 1);
    let s = 0;
    while (has()) { s++; d.setDate(d.getDate() - 1); }
    return s;
  }

  function nextDueTime(ids) {
    let min = Infinity;
    ids.forEach(id => { const s = db.items[id]; if (s && s.due < min) min = s.due; });
    return min;
  }

  function exportData() { return JSON.stringify({ app: 'dva-c02-english', version: 1, exported: new Date().toISOString(), ...db }, null, 1); }
  function importData(text) {
    const d = JSON.parse(text);
    if (!d || typeof d.items !== 'object') throw new Error('File không đúng định dạng');
    db = { items: d.items, days: d.days || {} };
    save();
  }
  function reset() { db = { items: {}, days: {} }; save(); }

  return { get, box, isDue, grade, practice, todayStats, streak, nextDueTime, exportData, importData, reset, INTERVALS };
})();
