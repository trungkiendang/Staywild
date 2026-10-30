/* Thành phần dựng một lần, dùng chung cho cả ba bề mặt (nút, thẻ, bảng, modal, chip, tab, trạng thái...). */
(function () {
  const SW = window.SW;
  const U = (SW.ui = {});

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  U.esc = esc;
  U.money = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
  U.num = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // ---- biểu tượng nét đều 1,75px (vector nhúng, lưới 24) ----
  const P = {
    home: "M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10",
    compass: "M12 3a9 9 0 100 18 9 9 0 000-18zM15.5 8.5l-2 5-5 2 2-5z",
    map: "M9 4L3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14",
    pin: "M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
    sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z",
    trip: "M4 7h16v13H4zM9 7V4h6v3M4 13h16",
    user: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 3.6-6 8-6s8 2 8 6",
    users: "M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM2 20c0-3.5 3-5 7-5s7 1.5 7 5M17 11a3 3 0 100-6M18 15c2.5.4 4 1.8 4 5",
    bell: "M6 17V11a6 6 0 1112 0v6l1.5 2h-15zM10 21h4",
    search: "M11 18a7 7 0 100-14 7 7 0 000 14zM20 20l-4-4",
    heart: "M12 20s-8-5-8-11a4.5 4.5 0 018-2.5A4.5 4.5 0 0120 9c0 6-8 11-8 11z",
    star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z",
    shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4",
    phone: "M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z",
    check: "M5 12.5l4.5 4.5L19 7.5",
    x: "M6 6l12 12M18 6L6 18",
    chevR: "M9 5l7 7-7 7",
    chevL: "M15 5l-7 7 7 7",
    chevD: "M5 9l7 7 7-7",
    back: "M19 12H5M11 6l-6 6 6 6",
    plus: "M12 5v14M5 12h14",
    filter: "M4 6h16M7 12h10M10 18h4",
    cal: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
    ticket: "M3 8a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 100-4zM14 6v12",
    qr: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h3v3h-3zM20 14v6h-3M14 20h0",
    cloud: "M7 18a4 4 0 010-8 5.5 5.5 0 0110.5 1A3.5 3.5 0 0117 18z",
    rain: "M7 15a4 4 0 010-8 5.5 5.5 0 0110.5 1A3.5 3.5 0 0117 15zM8 18l-1 3M12 18l-1 3M16 18l-1 3",
    alert: "M12 3l10 18H2zM12 10v5M12 18h0",
    info: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 11v5M12 8h0",
    clock: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2",
    settings: "M12 15a3 3 0 100-6 3 3 0 000 6zM19 12l2-1-1-3-2 .5-1.5-1.5.5-2-3-1-1 2h-2l-1-2-3 1 .5 2L6.5 8.5 4.5 8l-1 3 2 1v2l-2 1 1 3 2-.5L8 19.5l-.5 2 3 1 1-2h2l1 2 3-1-.5-2 1.5-1.5 2 .5 1-3-2-1z",
    lock: "M6 11h12v10H6zM8 11V8a4 4 0 018 0v3",
    upload: "M12 16V4M7 9l5-5 5 5M4 20h16",
    download: "M12 4v12M7 11l5 5 5-5M4 20h16",
    camera: "M4 8h3l2-3h6l2 3h3v12H4zM12 17a3.5 3.5 0 100-7 3.5 3.5 0 000 7z",
    chart: "M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-8",
    money: "M3 7h18v10H3zM12 14a2 2 0 100-4 2 2 0 000 4zM6 10h0M18 14h0",
    list: "M8 6h12M8 12h12M8 18h12M4 6h0M4 12h0M4 18h0",
    globe: "M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
    eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z",
    send: "M21 3L3 11l7 3 3 7zM10 14l11-11",
    edit: "M4 20h4L19 9l-4-4L4 16zM13 7l4 4",
    trash: "M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13",
    link: "M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1",
    store: "M4 9l1-5h14l1 5M4 9v11h16V9M4 9a3 3 0 006 0 3 3 0 006 0 3 3 0 004 0M10 20v-6h4v6",
    box: "M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10",
    flag: "M5 21V4M5 4h12l-2 4 2 4H5",
    gift: "M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-2-4-6-3-5 0M12 7c2-4 6-3 5 0",
    mountain: "M3 20l6-11 4 6 3-4 5 9z",
    menu: "M4 7h16M4 12h16M4 17h16",
    mic: "M12 15a3 3 0 003-3V6a3 3 0 00-6 0v6a3 3 0 003 3zM6 11a6 6 0 0012 0M12 17v4",
    wifioff: "M3 3l18 18M5 10a10 10 0 014-2.5M12 18h0M8.5 14.5a5 5 0 017 0",
    refresh: "M20 11a8 8 0 10-2.3 5.7M20 5v6h-6",
    share: "M18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 22a3 3 0 100-6 3 3 0 000 6zM8.7 10.5l6.6-3.9M8.7 13.5l6.6 3.9",
    book: "M5 4h10a3 3 0 013 3v13H8a3 3 0 01-3-3zM5 17a3 3 0 013-3h10",
    pause: "M8 5v14M16 5v14",
    flash: "M13 2L4 14h7l-1 8 9-12h-7z",
    layers: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5",
    db: "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
    scale: "M12 4v16M6 20h12M5 8l-3 7a3.5 3.5 0 006 0zM19 8l-3 7a3.5 3.5 0 006 0zM5 8h14",
    bolt: "M13 2L4 14h7l-1 8 9-12h-7z",
    minus: "M5 12h14",
    wallet: "M3 7h15a3 3 0 013 3v8H6a3 3 0 01-3-3zM3 7l12-3v3M16 13h2",
    credit: "M3 6h18v12H3zM3 10h18",
  };
  U.ic = (n, c) => '<svg class="ic ' + (c || "") + '" viewBox="0 0 24 24" aria-hidden="true"><path d="' + (P[n] || P.info) + '"/></svg>';

  // ---- nút, huy hiệu, chip ----
  U.btn = (label, cls, attrs, icon) => '<button type="button" class="c-btn ' + (cls || "") + '" ' + (attrs || "") + ">" + (icon ? U.ic(icon, "sm") : "") + label + "</button>";
  U.ibtn = (icon, label, attrs, cls) => '<button type="button" class="ib ' + (cls || "") + '" aria-label="' + esc(label) + '" ' + (attrs || "") + ">" + U.ic(icon) + "</button>";
  U.badge = (t, k, icon) => '<span class="c-badge ' + (k || "") + '">' + (icon ? U.ic(icon, "sm") : "") + t + "</span>";
  U.chip = (label, attrs, on, x) => '<button type="button" class="c-chip' + (on ? " on" : "") + '" aria-pressed="' + (on ? "true" : "false") + '" ' + (attrs || "") + ">" + label + (x ? '<span class="x">' + U.ic("x", "sm") + "</span>" : "") + "</button>";
  U.chips = (key, items, def) => '<div class="row wrap gap2">' + items.map((it) => { const v = Array.isArray(it) ? it[0] : it, l = Array.isArray(it) ? it[1] : it; return U.chip(l, 'data-pick="' + key + ":" + v + '"', SW.pick(key, def) === v); }).join("") + "</div>";
  U.multiChips = (key, items) => '<div class="row wrap gap2">' + items.map((it) => U.chip(it, 'data-multi="' + key + ":" + esc(it) + '"', SW.has(key, it))).join("") + "</div>";
  U.sample = () => '<span class="c-sample" title="Dữ liệu mẫu giả lập">Dữ liệu mẫu</span>';
  U.ava = (name, cls) => '<span class="c-ava ' + (cls || "") + '" aria-hidden="true">' + esc(name.split(" ").slice(-2).map((w) => w[0]).join("").toUpperCase()) + "</span>";
  U.stars = (n, total) => { let h = '<span class="c-stars" role="img" aria-label="' + n + ' trên 5 sao">'; for (let i = 1; i <= 5; i++) h += '<svg class="ic sm ' + (i > Math.round(n) ? "off" : "") + '" viewBox="0 0 24 24" style="fill:currentColor;stroke:none"><path d="' + P.star + '"/></svg>'; return h + "</span>" + (total != null ? ' <span class="t-cap muted">' + n.toFixed(1).replace(".", ",") + " (" + total + ")</span>" : ""); };

  // ---- biểu mẫu ----
  U.field = (label, control, o) => { o = o || {}; return '<div class="c-field"><label>' + label + (o.req ? ' <span aria-hidden="true">*</span>' : "") + "</label>" + control + (o.hint ? '<div class="hint">' + o.hint + "</div>" : "") + (o.err ? '<div class="err">' + U.ic("alert", "sm") + o.err + "</div>" : "") + "</div>"; };
  U.input = (o) => { o = o || {}; return '<input class="c-input ' + (o.err ? "is-error" : "") + '" type="' + (o.type || "text") + '" ' + (o.bind ? 'data-bind="' + o.bind + '" ' : "") + 'placeholder="' + esc(o.ph || "") + '" value="' + esc(o.val != null ? o.val : o.bind ? SW.form(o.bind, "") : "") + '" ' + (o.dis ? "disabled" : "") + " " + (o.attrs || "") + ">"; };
  U.select = (opts, o) => { o = o || {}; const cur = o.bind ? SW.form(o.bind, o.val) : o.val; return '<select class="c-select" ' + (o.bind ? 'data-bind="' + o.bind + '" ' + (o.redraw ? "data-redraw" : "") : "") + ">" + opts.map((x) => { const v = Array.isArray(x) ? x[0] : x, l = Array.isArray(x) ? x[1] : x; return '<option value="' + esc(v) + '"' + (cur === v ? " selected" : "") + ">" + l + "</option>"; }).join("") + "</select>"; };
  U.textarea = (ph, bind) => '<textarea class="c-textarea" placeholder="' + esc(ph || "") + '" ' + (bind ? 'data-bind="' + bind + '"' : "") + ">" + esc(bind ? SW.form(bind, "") : "") + "</textarea>";
  U.sw = (bind, def, label, o) => { o = o || {}; const on = SW.form(bind, def); return '<label class="row between" style="gap:12px;cursor:pointer"><span>' + label + '</span><span class="c-switch"><input type="checkbox" role="switch" data-bind="' + bind + '" ' + (o.redraw ? "data-redraw " : "") + (on ? "checked " : "") + (o.dis ? "disabled" : "") + "><i></i></span></label>"; };
  U.check = (bind, def, label) => '<label class="c-check"><input type="checkbox" data-redraw data-bind="' + bind + '" ' + (SW.form(bind, def) ? "checked" : "") + "><span>" + label + "</span></label>";

  // ---- thẻ, danh sách, bố cục ----
  U.card = (inner, cls, attrs) => '<div class="c-card ' + (cls || "") + '" ' + (attrs || "") + ">" + inner + "</div>";
  U.kv = (pairs) => '<dl class="c-kv" style="margin:0">' + pairs.map((p) => "<dt>" + p[0] + "</dt><dd>" + p[1] + "</dd>").join("") + "</dl>";
  U.alert = (kind, title, text, actions) => '<div class="c-alert ' + kind + '" role="' + (kind === "error" ? "alert" : "status") + '">' + U.ic(kind === "success" ? "check" : kind === "info" ? "info" : "alert") + '<div class="grow">' + (title ? "<b>" + title + "</b>" : "") + (text || "") + (actions ? '<div class="mt2">' + actions + "</div>" : "") + "</div></div>";
  U.tabs = (grp, items, cur) => '<div class="c-tabs" role="tablist">' + items.map((it) => '<button role="tab" aria-selected="' + (it[0] === cur) + '" data-tab="' + grp + ":" + it[0] + '">' + it[1] + "</button>").join("") + "</div>";
  U.segment = (grp, items, cur) => '<div class="c-segment" role="tablist">' + items.map((it) => '<button role="tab" aria-selected="' + (it[0] === cur) + '" data-tab="' + grp + ":" + it[0] + '">' + it[1] + "</button>").join("") + "</div>";
  U.progress = (pct) => '<div class="c-progress" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"><i style="width:' + pct + '%"></i></div>';
  U.stepper = (steps, nowIdx) => '<ol class="c-stepper">' + steps.map((s, i) => '<li class="' + (i < nowIdx ? "done" : i === nowIdx ? "now" : "") + '"><span class="dot">' + (i < nowIdx ? U.ic("check", "sm") : i + 1) + '</span><div><div class="t-label">' + s[0] + "</div>" + (s[1] ? '<div class="t-cap muted">' + s[1] + "</div>" : "") + "</div></li>").join("") + "</ol>";

  // ---- bảng dữ liệu ----
  // cols: [{h, k|f, n(số), w}] ; rows: mảng đối tượng ; o: {rowAttrs(r,i), foot:[...], sel}
  U.table = (cols, rows, o) => {
    o = o || {};
    let h = '<div class="c-tablewrap"><table class="c-table"><thead><tr>' + cols.map((c) => '<th scope="col" class="' + (c.n ? "n" : "") + '"' + (c.w ? ' style="width:' + c.w + '"' : "") + ">" + c.h + "</th>").join("") + "</tr></thead><tbody>";
    rows.forEach((r, i) => {
      const at = o.rowAttrs ? o.rowAttrs(r, i) : "";
      h += "<tr " + at + (at ? ' class="click' + (o.sel && o.sel(r, i) ? " sel" : "") + '"' : o.sel && o.sel(r, i) ? ' class="sel"' : "") + ">" + cols.map((c) => '<td class="' + (c.n ? "n" : "") + '">' + (c.f ? c.f(r, i) : esc(r[c.k])) + "</td>").join("") + "</tr>";
    });
    h += "</tbody>" + (o.foot ? "<tfoot><tr>" + o.foot.map((x, i) => '<td class="' + (cols[i] && cols[i].n ? "n" : "") + '">' + x + "</td>").join("") + "</tr></tfoot>" : "") + "</table></div>";
    return h + (o.pager ? '<div class="c-pager"><span>' + o.pager + '</span><span class="row gap2">' + U.btn("Trước", "secondary sm", "disabled") + U.btn("Sau", "secondary sm", 'data-toast="Trang 2 (mô phỏng)"') + "</span></div>" : "");
  };
  U.filterbar = (searchPh, selects, extra) => '<div class="filterbar" role="search">' + '<input class="c-input" type="search" placeholder="' + esc(searchPh) + '" aria-label="' + esc(searchPh) + '">' + (selects || []).map((s) => '<select class="c-select" aria-label="' + esc(s[0]) + '"><option>' + s[0] + "</option>" + s.slice(1).map((o) => "<option>" + o + "</option>").join("") + "</select>").join("") + (extra || "") + "</div>";

  // ---- trạng thái: tải / rỗng / lỗi / ngoại tuyến ----
  U.skeleton = (n) => '<div class="c-skel" aria-busy="true" aria-label="Đang tải">' + '<i class="b"></i>' + Array.from({ length: n || 3 }, (_, i) => '<i style="width:' + (92 - i * 14) + '%"></i>').join("") + "</div>";
  const ART = '<svg class="art" viewBox="0 0 96 96" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><ellipse cx="48" cy="50" rx="40" ry="30"/><ellipse cx="48" cy="50" rx="28" ry="20"/><ellipse cx="48" cy="50" rx="16" ry="10"/><path d="M40 52l8-14 8 14z" fill="currentColor" fill-opacity=".25"/></svg>';
  U.empty = (o) => '<div class="c-empty">' + ART + "<h3>" + o.title + "</h3><p>" + (o.text || "") + "</p>" + (o.cta ? '<div class="mt2">' + o.cta + "</div>" : "") + "</div>";
  U.error = (o) => { o = o || {}; return '<div class="c-empty err" role="alert">' + ART + "<h3>" + (o.title || "Không tải được dữ liệu") + "</h3><p>" + (o.text || "Kiểm tra kết nối rồi thử lại. Dữ liệu của bạn không bị mất.") + '</p><div class="mt2">' + U.btn("Thử lại", "secondary", 'data-act="retry"', "refresh") + "</div></div>"; };
  SW.act.retry = () => { SW.cur.state = "ok"; SW.toast("Đã tải lại (mô phỏng)", "success"); };
  // Bao nội dung theo trạng thái toàn cục đang chọn ở thanh công cụ.
  U.st = (content, o) => {
    o = o || {};
    const s = SW.cur.state;
    if (s === "loading") return U.skeleton(o.skel);
    if (s === "empty") return U.empty(o.empty || { title: "Chưa có dữ liệu", text: "Khi có dữ liệu, nội dung sẽ hiện ở đây." });
    if (s === "error") return U.error(o.error);
    if (s === "offline") return U.alert("warning", "Đang ngoại tuyến", "Hiển thị dữ liệu đã lưu lúc 09:12. Thao tác ghi sẽ chờ khi có mạng.") + '<div class="mt3">' + content + "</div>";
    return content;
  };

  // ---- minh họa: họa tiết đường đồng mức, ảnh giả lập (không dùng ảnh có bản quyền) ----
  function rnd(seed) { let s = 0; for (const c of String(seed)) s = (s * 31 + c.charCodeAt(0)) >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  U.contour = (seed, rings) => {
    const r = rnd(seed), cx = 30 + r() * 40, cy = 30 + r() * 40; let p = "";
    for (let k = 1; k <= (rings || 7); k++) {
      const rx = k * 9 + r() * 3, ry = k * 6.5 + r() * 3; let d = "";
      for (let a = 0; a <= 24; a++) { const t = (a / 24) * Math.PI * 2, w = 1 + 0.08 * Math.sin(t * 3 + k + r()); d += (a ? "L" : "M") + (cx + Math.cos(t) * rx * w).toFixed(1) + " " + (cy + Math.sin(t) * ry * w).toFixed(1); }
      p += '<path d="' + d + 'Z"/>';
    }
    return '<svg class="contour" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" fill="none" stroke="#fff" stroke-width=".5" aria-hidden="true">' + p + "</svg>";
  };
  const PAL = [["#2F7766", "#0B2A24"], ["#B95C30", "#5C2A17"], ["#2B7BA3", "#0D2B3B"], ["#4A9382", "#174B40"], ["#D2774A", "#7A381E"], ["#5E6358", "#1F221C"]];
  U.cover = (seed, h, cap, w) => { const r = rnd(seed), c = PAL[Math.floor(r() * PAL.length)]; return '<div class="c-cover" role="img" aria-label="Ảnh minh họa mẫu: ' + esc(cap || seed) + '" style="--c1:' + c[0] + ";--c2:" + c[1] + ";height:" + (h || 120) + "px" + (w ? ";width:" + w + "px" : "") + '">' + U.contour(seed) + (cap ? '<span class="cap">' + esc(cap) + "</span>" : "") + "</div>"; };
  U.qr = (seed, size) => {
    const r = rnd(seed), n = 25, cell = 4; let rects = "";
    const fin = (x, y) => { rects += '<rect x="' + x * cell + '" y="' + y * cell + '" width="' + 7 * cell + '" height="' + 7 * cell + '" fill="#000"/><rect x="' + (x + 1) * cell + '" y="' + (y + 1) * cell + '" width="' + 5 * cell + '" height="' + 5 * cell + '" fill="#fff"/><rect x="' + (x + 2) * cell + '" y="' + (y + 2) * cell + '" width="' + 3 * cell + '" height="' + 3 * cell + '" fill="#000"/>'; };
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { if ((x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9)) continue; if (r() > 0.52) rects += '<rect x="' + x * cell + '" y="' + y * cell + '" width="' + cell + '" height="' + cell + '" fill="#000"/>'; }
    fin(0, 0); fin(n - 7, 0); fin(0, n - 7);
    return '<div class="c-qr" style="width:' + (size || 180) + "px;height:" + (size || 180) + 'px" role="img" aria-label="Mã QR mô phỏng, không quét được"><svg viewBox="0 0 ' + n * cell + " " + n * cell + '">' + rects + "</svg></div>";
  };
  // pins: [{x,y,t(text),k(kind),id}] ; tọa độ theo %
  U.map = (o) => {
    o = o || {};
    const rings = U.contour(o.seed || "map", 9).replace('stroke="#fff"', 'stroke="var(--sw-color-brand-primary)" opacity=".35"');
    return '<div class="c-map" role="application" aria-label="Bản đồ mô phỏng, không phải bản đồ thật" style="height:' + (o.h || 300) + 'px">' + '<svg class="base" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 62 C 20 55, 30 75, 50 66 S 85 50, 100 58" stroke="var(--sw-color-info-solid)" stroke-width="2" fill="none" opacity=".55"/><path d="M10 100 C 25 70, 40 40, 70 0" stroke="var(--sw-color-border-strong)" stroke-width=".6" stroke-dasharray="2 2" fill="none" opacity=".5"/></svg>' + rings + (o.pins || []).map((p) => '<button class="c-pin ' + (p.k || "") + (p.sel ? " sel" : "") + '" style="left:' + p.x + "%;top:" + p.y + '%" aria-label="' + esc(p.t) + '" ' + (p.attrs || "") + ">" + (p.l || U.ic("pin", "sm")) + "</button>").join("") + '<span class="c-sample" style="position:absolute;left:8px;top:8px">Bản đồ mô phỏng</span></div>';
  };

  // ---- biểu đồ SVG (có bảng/tóm tắt thay thế) ----
  U.line = (series, labels, o) => {
    o = o || {}; const W = 360, H = o.h || 150, pl = 34, pb = 20, pt = 8;
    const max = Math.max(...series.flatMap((s) => s.d)) * 1.1, n = labels.length;
    const X = (i) => pl + (i / (n - 1)) * (W - pl - 8), Y = (v) => H - pb - (v / max) * (H - pb - pt);
    let g = "";
    for (let k = 0; k <= 3; k++) { const y = pt + ((H - pb - pt) * k) / 3; g += '<line class="grid" x1="' + pl + '" x2="' + (W - 8) + '" y1="' + y + '" y2="' + y + '"/><text x="' + (pl - 4) + '" y="' + (y + 4) + '" text-anchor="end">' + Math.round(max * (1 - k / 3)) + "</text>"; }
    const lines = series.map((s, si) => '<path d="' + s.d.map((v, i) => (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(v).toFixed(1)).join("") + '" class="s' + (si + 1) + '" fill="none" stroke-width="2.2" ' + (si ? 'stroke-dasharray="5 3"' : "") + "/>").join("");
    const xl = labels.map((l, i) => (i % Math.ceil(n / 6) === 0 ? '<text x="' + X(i) + '" y="' + (H - 4) + '" text-anchor="middle">' + l + "</text>" : "")).join("");
    return '<figure style="margin:0"><svg class="c-chart" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(o.summary || "Biểu đồ đường") + '">' + g + lines + xl + "</svg>" + '<figcaption class="t-cap muted">' + (o.summary || "") + " " + series.map((s, i) => '<span style="margin-right:10px"><svg width="18" height="6" aria-hidden="true"><line x1="0" x2="18" y1="3" y2="3" class="s' + (i + 1) + '" stroke-width="2.5" ' + (i ? 'stroke-dasharray="5 3"' : "") + "/></svg> " + s.n + "</span>").join("") + "</figcaption></figure>";
  };
  U.bars = (items, o) => {
    o = o || {}; const max = Math.max(...items.map((i) => i.v));
    return '<div class="col gap2" role="list" aria-label="' + esc(o.label || "Biểu đồ cột") + '">' + items.map((i) => '<div role="listitem" class="row gap3"><span style="width:' + (o.lw || 110) + 'px" class="t-cap">' + i.l + '</span><div class="grow c-progress" style="height:14px"><i style="width:' + (i.v / max) * 100 + '%;' + (i.c ? "background:" + i.c : "") + '"></i></div><span class="num t-cap" style="width:64px;text-align:right">' + (i.t || i.v) + "</span></div>").join("") + "</div>";
  };
  U.spark = (d) => { const max = Math.max(...d), min = Math.min(...d); return '<svg viewBox="0 0 80 22" width="80" height="22" aria-hidden="true"><path class="s1" fill="none" stroke-width="2" d="' + d.map((v, i) => (i ? "L" : "M") + (i * 80) / (d.length - 1) + " " + (20 - ((v - min) / (max - min || 1)) * 18)).join("") + '"/></svg>'; };
  U.kpi = (label, val, delta, note, spark) => { const up = delta && delta.charAt(0) === "+"; return '<div class="c-card c-kpi"><div class="t-label muted" style="font-weight:500">' + label + '</div><div class="v">' + val + "</div>" + (delta ? '<div class="d ' + (up ? "up" : "down") + '">' + (up ? "▲ " : "▼ ") + delta.replace(/^[+-]/, "") + ' <span class="muted" style="font-weight:400">so với kỳ trước</span></div>' : "") + (spark ? U.spark(spark) : "") + '<div class="t">' + (note || "Cập nhật 09:12") + "</div></div>"; };

  // ---- ghi chú story hiển thị gọn trong khung ----
  U.storyChips = (ids) => ids.map((i) => '<code title="' + esc(SW.storyTitle(i)) + '">' + i + "</code>").join(" ");
})();
