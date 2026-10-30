/* Lõi prototype: đăng ký màn hình, trạng thái, định tuyến, lớp phủ, sự kiện ủy quyền.
   Không phụ thuộc mạng. Mọi dữ liệu trong prototype là DỮ LIỆU MẪU giả lập. */
(function () {
  const SW = (window.SW = window.SW || {});
  SW.screens = {};
  SW.order = [];
  SW.act = {};
  SW.modals = {};
  SW.S = { tabs: {}, pick: {}, multi: {}, form: {} }; // trạng thái demo bền qua lần vẽ lại
  SW.cur = { surface: "m", persona: "guest", id: "m-onb-welcome", stack: [], state: "ok", role: "admin" };
  SW.layer = null; // {kind:'modal'|'sheet'|'drawer', key}
  SW.notesOn = true;

  // ---- lưu trữ cục bộ an toàn ----
  const ls = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* bỏ qua */ } },
  };
  SW.ls = ls;

  SW.screen = function (d) {
    d.stories = d.stories || [];
    SW.screens[d.id] = d;
    SW.order.push(d.id);
  };

  SW.storyTitle = (id) => (window.SW_STORIES || {})[id] || "";
  SW.tab = (grp, def) => SW.S.tabs[grp] || def;
  SW.pick = (key, def) => (SW.S.pick[key] !== undefined ? SW.S.pick[key] : def);
  SW.has = (key, v) => (SW.S.multi[key] || []).includes(v);
  SW.form = (k, def) => (SW.S.form[k] !== undefined ? SW.S.form[k] : def);

  // ---- định tuyến ----
  SW.go = function (id, opts) {
    const d = SW.screens[id];
    if (!d) { console.warn("Không có màn hình", id); return; }
    opts = opts || {};
    if (opts.root) SW.cur.stack = [];
    else if (SW.cur.id && SW.cur.id !== id && SW.screens[SW.cur.id] && SW.screens[SW.cur.id].surface === d.surface) SW.cur.stack.push(SW.cur.id);
    SW.cur.id = id;
    SW.cur.surface = d.surface;
    if (d.persona) SW.cur.persona = d.persona;
    SW.layer = null;
    SW.draw({ resetScroll: true });
  };
  SW.back = function () {
    const prev = SW.cur.stack.pop();
    if (prev) { SW.cur.id = prev; SW.layer = null; SW.draw({ resetScroll: true }); }
  };
  SW.setState = (s) => { SW.cur.state = s; SW.draw(); };

  // ---- thông báo nổi ----
  SW.toast = function (msg, kind) {
    const box = document.querySelector(".toasts");
    if (!box) return;
    const el = document.createElement("div");
    el.className = "c-toast " + (kind || "");
    el.setAttribute("role", "status");
    el.textContent = msg;
    box.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  };

  // ---- vẽ ----
  function frameSelector() { return SW.cur.surface === "m" ? ".mobile" : ".webapp"; }

  SW.draw = function (opts) {
    opts = opts || {};
    const stage = document.getElementById("stage");
    const def = SW.screens[SW.cur.id];
    if (!def || !stage) return;
    const sc = stage.querySelector(".m-body,.w-main,.sos-screen");
    const top = sc && !opts.resetScroll ? sc.scrollTop : 0;
    const ctx = { state: SW.cur.state, S: SW.S, cur: SW.cur };
    let html;
    try {
      html = SW.shell.wrap(def, ctx);
    } catch (e) {
      console.error("Lỗi vẽ màn hình " + def.id, e);
      html = '<div class="c-empty err"><h3>Lỗi vẽ màn hình</h3><p>' + String(e.message) + "</p></div>";
    }
    stage.innerHTML = html;
    const fr = stage.querySelector(frameSelector());
    if (fr && SW.layer) {
      const m = SW.modals[SW.layer.key];
      if (m) {
        const wrap = document.createElement("div");
        wrap.className = "layer " + SW.layer.kind;
        wrap.setAttribute("data-close-bg", "1");
        wrap.innerHTML = '<div class="c-modal" role="dialog" aria-modal="true">' + m(ctx) + "</div>";
        fr.appendChild(wrap);
      }
    }
    const nsc = stage.querySelector(".m-body,.w-main,.sos-screen");
    if (nsc && top) nsc.scrollTop = top;
    SW.shell.afterDraw && SW.shell.afterDraw();
    document.dispatchEvent(new CustomEvent("sw:drawn"));
  };

  // ---- sự kiện ủy quyền ----
  document.addEventListener("click", function (ev) {
    const t = ev.target;
    if (!t.closest) return;
    const stage = document.getElementById("stage");
    if (!stage || !stage.contains(t)) return;
    const el = t.closest("[data-go],[data-back],[data-act],[data-toast],[data-modal],[data-sheet],[data-drawer],[data-close],[data-tab],[data-pick],[data-multi],[data-set],[data-close-bg]");
    if (!el) return;
    if (el.hasAttribute("data-close-bg")) { if (t === el) { SW.layer = null; SW.draw(); } return; }
    const d = el.dataset;
    if (el.tagName === "A" && el.getAttribute("href") === "#") ev.preventDefault();
    if (d.close !== undefined) { SW.layer = null; SW.draw(); return; }
    if (d.toast) SW.toast(d.toast, d.kind);
    if (d.set) { SW.S.form[d.set] = d.val; SW.draw(); }
    if (d.tab) { const [g, k] = d.tab.split(":"); SW.S.tabs[g] = k; SW.draw(); return; }
    if (d.pick) { const [g, k] = d.pick.split(":"); SW.S.pick[g] = k; SW.draw(); return; }
    if (d.multi) {
      const [g, k] = d.multi.split(":");
      const a = (SW.S.multi[g] = SW.S.multi[g] || []);
      const i = a.indexOf(k);
      if (i >= 0) a.splice(i, 1); else a.push(k);
      SW.draw(); return;
    }
    if (d.modal) { SW.layer = { kind: "modal", key: d.modal }; SW.draw(); return; }
    if (d.sheet) { SW.layer = { kind: "sheet", key: d.sheet }; SW.draw(); return; }
    if (d.drawer) { SW.layer = { kind: "drawer", key: d.drawer }; SW.draw(); return; }
    if (d.act) {
      const f = SW.act[d.act];
      if (f) { const r = f(el, ev); if (r !== false) SW.draw(); } else console.warn("Thiếu act", d.act);
      if (!d.go) return;
    }
    if (d.back !== undefined) { SW.back(); return; }
    if (d.go) SW.go(d.go, { root: d.root !== undefined });
  });

  document.addEventListener("change", function (ev) {
    const t = ev.target;
    if (!t.dataset || !t.dataset.bind) return;
    const v = t.type === "checkbox" ? t.checked : t.value;
    SW.S.form[t.dataset.bind] = v;
    if (t.dataset.redraw !== undefined) SW.draw();
  });

  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape" && SW.layer) { SW.layer = null; SW.draw(); }
  });
})();
