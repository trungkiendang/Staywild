/* Vỏ prototype: thanh công cụ, danh sách màn hình, khung điện thoại, khung web, ghi chú story. */
(function () {
  const SW = window.SW, U = SW.ui, esc = U.esc;
  const shell = (SW.shell = {});

  const SURF = { m: "A · Mobile", p: "B · Portal web", a: "C · CMS / Admin" };
  const PERSONAS = {
    m: [["guest", "Khách du lịch"], ["provider", "Provider"], ["creator", "Creator (KOL/KOC)"], ["resident", "Người dân"]],
    p: [["provider", "Provider doanh nghiệp"], ["local", "Địa phương (cán bộ)"], ["kol", "KOL/KOC"]],
    a: [["admin", "CMS / Admin"]],
  };
  const ROLES = [["admin", "Admin hệ thống"], ["mod", "Kiểm duyệt viên"], ["acc", "Kế toán / Đối soát"], ["cskh", "CSKH"], ["sos", "Safety Center (lead)"], ["ai", "Admin AI"], ["mkt", "Marketing / DA"]];
  SW.ROLES = ROLES;
  const MNAV = {
    guest: [["home", "Khám phá", "compass", "m-home"], ["map", "Bản đồ", "map", "m-map"], ["ai", "Trợ lý AI", "sparkle", "m-ai"], ["trip", "My Trip", "trip", "m-trips"], ["me", "Hồ sơ", "user", "m-profile"]],
    provider: [["home", "Tổng quan", "home", "mp-home"], ["orders", "Đơn đặt", "list", "mp-orders"], ["cal", "Lịch", "cal", "mp-cal"], ["rev", "Đánh giá", "star", "mp-reviews"], ["more", "Thêm", "menu", "mp-more"]],
    creator: [["home", "Tổng quan", "home", "mc-home"], ["posts", "Nội dung", "book", "mc-posts"], ["links", "Link", "link", "mc-links"], ["comm", "Hoa hồng", "money", "mc-comm"], ["me", "Hồ sơ", "user", "mc-profile"]],
    resident: [["home", "Trải nghiệm", "mountain", "mr-home"], ["book", "Đặt chỗ", "ticket", "mr-bookings"], ["inc", "Thu nhập", "money", "mr-income"], ["me", "Hồ sơ", "user", "mr-profile"]],
  };
  const PSURF_LABEL = { provider: "Portal Provider", local: "Portal Địa phương", kol: "Portal KOL/KOC" };

  function stateLabel(s) { return { ok: "Bình thường", loading: "Đang tải", empty: "Rỗng", error: "Lỗi", offline: "Ngoại tuyến" }[s]; }

  function noteHtml(d, cls) {
    const st = d.stories || [];
    const li = st.map((s) => "<li><code>" + s + "</code> " + esc(SW.storyTitle(s) || "") + "</li>").join("");
    const fl = d.flows && d.flows.length ? '<li>Luồng vận hành cơ bản: ' + d.flows.map((f) => "<code>" + f + "</code>").join(" ") + "</li>" : "";
    return '<aside class="' + cls + '" aria-label="Ghi chú thiết kế"><h4>Ghi chú thiết kế · ' + esc(d.id) + "</h4><ul style=\"margin:0;padding-left:16px\">" + (li || "<li>Không gắn story (xem OQ)</li>") + fl + "</ul>" + (d.note ? '<p class="mt2">' + d.note + "</p>" : "") + '<p class="mt2 muted">Trạng thái: <b>Đã đề xuất</b>, chờ PO duyệt. Dữ liệu là mẫu giả lập.</p></aside>';
  }

  function noteBar(d) {
    const st = d.stories || [];
    const li = st.map((x) => "<li><code>" + x + "</code> " + esc(SW.storyTitle(x) || "") + "</li>").join("");
    return '<aside class="note-bar" aria-label="Ghi chú thiết kế"><b>Ghi chú thiết kế</b> ' + st.map((x) => '<code title="' + esc(SW.storyTitle(x)) + '">' + x + "</code>").join(" ") + (d.flows && d.flows.length ? ' <span class="muted">Luồng:</span> ' + d.flows.map((f) => "<code>" + f + "</code>").join(" ") : "") + '<details><summary>Tên story và ghi chú</summary><ul>' + li + "</ul>" + (d.note ? "<p>" + d.note + "</p>" : "") + '<p class="muted">Trạng thái: Đã đề xuất, chờ PO duyệt. Dữ liệu là mẫu giả lập.</p></details></aside>';
  }

  // ---- khung điện thoại ----
  function mobileWrap(d, ctx) {
    const persona = d.persona || "guest";
    const nav = MNAV[persona] || [];
    const st = ctx.state;
    const inner = d.render(ctx);
    const showNav = !!d.tab;
    const fab = d.fab !== undefined ? d.fab : persona === "guest" && showNav;
    let bar = "";
    if (!d.bare) {
      bar = '<header class="m-bar">' + (d.back ? U.ibtn("back", "Quay lại", "data-back") : "") + "<h1>" + esc(d.title) + "</h1>" + (d.barRight || "") + "</header>";
    }
    const body = d.bare ? inner : '<main class="m-body ' + (d.flush ? "flush " : "") + (fab ? "has-fab" : "") + '">' + inner + "</main>";
    const offBanner = st === "offline" && !d.bare ? '<div class="m-banner-off" role="status">' + U.ic("wifioff", "sm") + "Ngoại tuyến · dữ liệu lưu lúc 09:12</div>" : "";
    const navHtml = showNav ? '<nav class="m-nav" aria-label="Điều hướng chính">' + nav.map((n) => '<button data-go="' + n[3] + '" data-root aria-current="' + (n[0] === d.tab) + '">' + U.ic(n[2]) + "<span>" + n[1] + "</span></button>").join("") + "</nav>" : "";
    const fabHtml = fab ? '<button class="sos-fab ' + (showNav ? (d.foot ? "up" : "") : d.foot ? "" : "noNav") + '" data-go="m-sos" aria-label="SOS, mở màn khẩn cấp">SOS</button>' : "";
    const foot = d.foot ? '<div class="m-act">' + d.foot(ctx) + "</div>" : "";
    return '<div class="stage-mobile"><div class="phone"><div class="mobile">' +
      '<div class="m-status" aria-hidden="true"><span>09:41</span><span class="' + (st === "offline" ? "off" : "") + '">' + (st === "offline" ? "Ngoại tuyến" : "4G ▮▮▮") + "</span></div>" +
      bar + offBanner + body + foot + navHtml + fabHtml + '<div class="toasts" aria-live="polite"></div></div></div>' +
      noteHtml(d, "note-panel") + "</div>";
  }

  // ---- khung web ----
  function webWrap(d, ctx) {
    const surf = d.surface, persona = d.persona || "admin", role = SW.cur.role;
    const list = SW.order.map((id) => SW.screens[id]).filter((x) => x.surface === surf && (x.persona || "admin") === persona && !x.hidden);
    const allowed = (x) => surf !== "a" || role === "admin" || !x.roles || x.roles.includes(role);
    const groups = [];
    list.filter(allowed).forEach((x) => { let g = groups.find((y) => y.n === x.group); if (!g) groups.push((g = { n: x.group, items: [] })); g.items.push(x); });
    const nav = groups.map((g) => "<h5>" + esc(g.n) + "</h5>" + g.items.filter((x) => x.nav !== false).map((x) => '<button data-go="' + x.id + '" data-root aria-current="' + (x.id === d.id || x.parent === d.id || d.parent === x.id) + '">' + U.ic(x.icon || "list", "sm") + "<span>" + esc(x.navTitle || x.title) + "</span>" + (x.badge ? '<span class="cnt">' + x.badge + "</span>" : "") + "</button>").join("")).join("");
    const roleSel = surf === "a" ? '<label class="tb-sel">Vai trò: <select aria-label="Vai trò đang xem" data-bind="__role" data-redraw>' + ROLES.map((r) => '<option value="' + r[0] + '"' + (r[0] === role ? " selected" : "") + ">" + r[1] + "</option>").join("") + "</select></label>" : "";
    const scope = surf === "a" ? '<label class="tb-sel">Phạm vi tỉnh: <select aria-label="Phạm vi tỉnh">' + ["Toàn quốc", "Lào Cai", "Hà Giang", "Lâm Đồng"].map((p) => "<option>" + p + "</option>").join("") + "</select></label>" : persona === "local" ? '<span class="c-badge brand">Tỉnh được gán: Lào Cai</span>' : "";
    const brandLabel = surf === "a" ? "CMS / Admin" : PSURF_LABEL[persona];
    let body;
    if (!allowed(d)) {
      body = '<div class="c-empty err" role="alert"><h3>403 · Không có quyền truy cập</h3><p>Vai trò “' + esc((ROLES.find((r) => r[0] === role) || [])[1]) + "” không được cấp màn hình này theo ma trận phân quyền (docs/ba/ma-tran-phan-quyen.md). Thao tác bị từ chối và ghi audit.</p>" + "<div class=\"mt2\">" + U.btn("Về màn hình được phép", "secondary", 'data-go="' + (groups[0] ? groups[0].items[0].id : d.id) + '"') + "</div></div>";
    } else {
      body = '<div class="w-head"><div><div class="crumb">' + esc(brandLabel) + " / " + esc(d.group) + "</div><h1>" + esc(d.title) + "</h1></div><div class=\"row gap2 wrap\">" + (d.headRight ? d.headRight(ctx) : "") + "</div></div>" + d.render(ctx);
    }
    return '<div class="web-wrap">' + noteBar(d) + '<div class="webapp web-stage ' + (surf === "p" ? "portal" : "") + '">' +
      '<header class="w-top"><span class="logo">Stay Wild<small>' + esc(brandLabel) + '</small></span><span class="grow"></span>' + scope + roleSel + U.ibtn("bell", "Thông báo", 'data-toast="Không có thông báo mới (mô phỏng)"', "") + '<span class="row gap2">' + U.ava(surf === "a" ? "Quản trị viên" : persona === "local" ? "Cán bộ Lào Cai" : "Sơn Hà") + "</span></header>" +
      '<nav class="w-nav" aria-label="Điều hướng">' + nav + "</nav>" +
      '<main class="w-main">' + body + "</main>" +
      '<div class="toasts" aria-live="polite"></div></div></div>';
  }

  shell.wrap = function (d, ctx) {
    return d.surface === "m" ? mobileWrap(d, ctx) : webWrap(d, ctx);
  };

  // ---- thanh công cụ + danh sách màn hình ----
  let filter = "";
  function renderTop() {
    const c = SW.cur;
    document.getElementById("surf").innerHTML = Object.keys(SURF).map((k) => '<button aria-pressed="' + (c.surface === k) + '" data-surf="' + k + '">' + SURF[k] + "</button>").join("");
    const ps = PERSONAS[c.surface];
    document.getElementById("persona").innerHTML = ps.map((p) => '<option value="' + p[0] + '"' + (p[0] === c.persona ? " selected" : "") + ">" + p[1] + "</option>").join("");
    document.getElementById("persona").parentElement.style.display = ps.length > 1 ? "" : "none";
    document.getElementById("state").value = c.state;
    document.getElementById("state").style.outline = c.state !== "ok" ? "2px solid var(--sw-color-accent-solid)" : "";
    document.getElementById("theme").textContent = "Giao diện: " + ({ light: "Sáng", dark: "Tối", auto: "Theo hệ thống" }[shell.theme]);
    const n = document.getElementById("notes");
    n.setAttribute("aria-pressed", String(SW.notesOn));
  }
  function renderSide() {
    const c = SW.cur, q = filter.toLowerCase();
    const list = SW.order.map((id) => SW.screens[id]).filter((x) => x.surface === c.surface && (x.persona || (c.surface === "a" ? "admin" : "guest")) === c.persona);
    const groups = [];
    list.forEach((x) => { if (q && !(x.title + " " + x.stories.join(" ") + " " + x.group).toLowerCase().includes(q)) return; let g = groups.find((y) => y.n === x.group); if (!g) groups.push((g = { n: x.group, items: [] })); g.items.push(x); });
    document.getElementById("sidelist").innerHTML = '<div class="t-cap muted" style="margin:0 6px 4px">' + list.length + " màn hình</div>" + groups.map((g) => '<div class="side-g"><h4>' + esc(g.n) + "</h4>" + g.items.map((x) => '<button class="side-i" data-jump="' + x.id + '" aria-current="' + (x.id === c.id) + '"><span>' + esc(x.title) + '</span><span class="t-cap muted">' + (x.stories[0] || "") + "</span></button>").join("") + "</div>").join("");
  }
  shell.afterDraw = function () { renderTop(); renderSide(); try { history.replaceState(null, "", "#" + SW.cur.id); } catch (e) { /* bỏ qua */ } };

  shell.setTheme = function (t) {
    shell.theme = t;
    const r = document.documentElement;
    if (t === "auto") r.removeAttribute("data-theme"); else r.setAttribute("data-theme", t);
    SW.ls.set("sw-proto-theme", t);
  };

  function firstOf(surface, persona) {
    return SW.order.map((id) => SW.screens[id]).find((x) => x.surface === surface && (x.persona || (surface === "a" ? "admin" : "guest")) === persona);
  }

  shell.init = function () {
    document.body.insertAdjacentHTML("afterbegin", ""); // giữ chỗ
    document.getElementById("surf").addEventListener("click", (e) => {
      const b = e.target.closest("[data-surf]"); if (!b) return;
      const s = b.dataset.surf, p = PERSONAS[s][0][0];
      SW.cur.surface = s; SW.cur.persona = p; SW.cur.stack = [];
      const f = firstOf(s, p); if (f) SW.go(f.id, { root: true });
    });
    document.getElementById("persona").addEventListener("change", (e) => {
      SW.cur.persona = e.target.value; SW.cur.stack = [];
      const f = firstOf(SW.cur.surface, SW.cur.persona); if (f) SW.go(f.id, { root: true });
    });
    document.getElementById("state").addEventListener("change", (e) => SW.setState(e.target.value));
    document.getElementById("theme").addEventListener("click", () => { const o = ["light", "dark", "auto"]; shell.setTheme(o[(o.indexOf(shell.theme) + 1) % 3]); renderTop(); });
    document.getElementById("notes").addEventListener("click", () => { SW.notesOn = !SW.notesOn; document.body.classList.toggle("notes-off", !SW.notesOn); SW.ls.set("sw-proto-notes", SW.notesOn ? "1" : "0"); renderTop(); });
    document.getElementById("side-toggle").addEventListener("click", () => document.body.classList.toggle("side-open"));
    document.getElementById("sidesearch").addEventListener("input", (e) => { filter = e.target.value; renderSide(); });
    document.getElementById("sidelist").addEventListener("click", (e) => {
      const b = e.target.closest("[data-jump]"); if (!b) return;
      const t = SW.screens[b.dataset.jump]; SW.cur.stack = []; SW.cur.persona = t.persona || SW.cur.persona;
      SW.go(t.id, { root: true }); document.body.classList.remove("side-open");
    });
    // vai trò Admin (ô chọn nằm trong khung web)
    document.addEventListener("change", (e) => { if (e.target.dataset && e.target.dataset.bind === "__role") { SW.cur.role = e.target.value; SW.draw(); } });
    const t = SW.ls.get("sw-proto-theme"); shell.setTheme(t === "dark" || t === "auto" ? t : "light");
    SW.notesOn = SW.ls.get("sw-proto-notes") !== "0"; document.body.classList.toggle("notes-off", !SW.notesOn);
    function fromHash() {
      const h = (location.hash || "").replace("#", "");
      const p = new URLSearchParams(h.includes("=") ? h : "");
      const id = h.includes("=") ? p.get("screen") : h;
      if (p.get("theme")) shell.setTheme(p.get("theme"));
      if (p.get("state")) SW.cur.state = p.get("state");
      if (p.get("role")) SW.cur.role = p.get("role");
      if (id && SW.screens[id]) { const d = SW.screens[id]; SW.cur.surface = d.surface; SW.cur.persona = d.persona || (d.surface === "a" ? "admin" : "guest"); SW.cur.id = id; }
    }
    fromHash();
    window.addEventListener("hashchange", () => { const id = location.hash.replace("#", ""); if (SW.screens[id] && id !== SW.cur.id) { fromHash(); SW.cur.stack = []; SW.draw({ resetScroll: true }); } });
    SW.draw({ resetScroll: true });
  };
})();
