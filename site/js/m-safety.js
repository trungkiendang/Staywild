/* A · Mobile · Khách: Trung tâm an toàn, liên hệ khẩn cấp, SOS (giữ để kích hoạt), theo dõi, ngoại tuyến.
   Khu vực an toàn (docs/design/05): màu --sw-sos-* cố định, chữ hệ thống, không toast, không tracking, không phụ thuộc theme/mạng. */
(function () {
  const SW = window.SW, U = SW.ui;
  const S = SW.S;
  S.sos = { phase: "ready", gps: "ok", at: "09:41" };
  S.holdMs = 1500; // giá trị thiết kế mặc định (token motion.duration.hold); thật đọc từ Registry (OQ-UX-04)
  const mode = () => SW.pick("sosmode", "tiep_nhan");
  const MODE_TXT = {
    tat: "Tỉnh này chưa bật tiếp nhận SOS. Hãy gọi số khẩn cấp bên dưới và nhắn cho người thân.",
    chuyen_tiep: "Stay Wild chỉ tiếp nhận và chuyển tiếp thông tin tới đầu mối địa phương và người thân, không phải dịch vụ cứu hộ hay cấp cứu. Khi nguy hiểm hãy gọi 112.",
    tiep_nhan: "Nhóm trực Safety Center của tỉnh nhận tín hiệu khi có người trực. Nếu chưa có ai nhận kịp, thông tin được chuyển tới đầu mối địa phương. Khi nguy hiểm hãy gọi 112.",
  };
  const nums = () => '<div class="sos-nums" role="group" aria-label="Số khẩn cấp">' + [["112", "Khẩn cấp chung"], ["113", "Công an"], ["114", "Cứu hỏa cứu nạn"], ["115", "Cấp cứu y tế"]].map((n) => '<a href="#" data-act="callSim" data-n="' + n[0] + '" aria-label="Gọi ' + n[0] + ", " + n[1] + '">' + n[0] + "<small>" + n[1] + "</small></a>").join("") + "</div>";
  SW.act.callSim = (el) => { S.callMsg = "Đang mở trình gọi " + el.dataset.n + " (mô phỏng)"; };
  const callMsg = () => (S.callMsg ? '<div class="sos-card" role="status">' + S.callMsg + "</div>" : "");
  const bar = (back, title) => '<div class="sos-bar">' + (back ? '<button data-back aria-label="Quay lại">←</button>' : '<span style="width:12px"></span>') + "<span>" + title + "</span></div>";
  const live = (t) => '<div class="sr-only" aria-live="assertive">' + t + "</div>";

  // ---- Giữ để kích hoạt (không dùng rerender khi đang giữ) ----
  let raf = 0, t0 = 0, holding = false;
  function ring(p) { const c = document.querySelector("#sos-ring"); if (c) c.setAttribute("stroke-dashoffset", String(565 * (1 - p))); }
  function startHold(ev) {
    const b = ev.target.closest && ev.target.closest("#sos-hold button"); if (!b) return;
    if (holding) return; holding = true; t0 = performance.now(); document.getElementById("sos-hold").classList.add("holding");
    const hint = document.getElementById("sos-hint"); if (hint) hint.textContent = "Đang giữ… tiếp tục giữ";
    const step = (t) => { if (!holding) return; const p = Math.min((t - t0) / S.holdMs, 1); ring(p); if (p >= 1) { holding = false; activate("giữ"); } else raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
  }
  function endHold() {
    if (!holding) return; holding = false; cancelAnimationFrame(raf); ring(0);
    const h = document.getElementById("sos-hold"); if (h) h.classList.remove("holding");
    const hint = document.getElementById("sos-hint"); if (hint) hint.textContent = "Chưa đủ lâu. Giữ nút để gửi SOS.";
  }
  document.addEventListener("pointerdown", startHold);
  document.addEventListener("pointerup", endHold);
  document.addEventListener("pointercancel", endHold);
  function activate(how) {
    const off = SW.cur.state === "offline";
    S.sos = { phase: off ? "fail" : mode() === "chuyen_tiep" ? "sent" : "sent", gps: S.sos.gps || "ok", at: "09:41", how, off };
    S.callMsg = "";
    SW.go("m-sos-track");
  }
  SW.act.sosConfirm = () => { SW.layer = null; activate("xác nhận 1 chạm"); return false; };
  const sosBox = (x) => '<div style="background:#fff;color:var(--sw-sos-on-surface);margin:-20px;padding:20px;border-radius:inherit;border:3px solid var(--sw-sos-border)">' + x + "</div>";
  SW.modals["sos-confirm"] = () => sosBox('<h3 class="t-h3" style="font-family:system-ui,sans-serif">Gửi SOS ngay?</h3><p style="font-family:system-ui,sans-serif">Vị trí của bạn sẽ được gửi tới Safety Center và người thân đã xác nhận.</p><div class="actions"><button class="sos-btn" data-close style="width:auto;padding:0 20px">Không gửi</button><button class="sos-btn solid" data-act="sosConfirm" style="width:auto;padding:0 20px">Gửi SOS ngay</button></div>');

  SW.screen({
    id: "m-sos", surface: "m", persona: "guest", group: "5 · An toàn và SOS", title: "SOS (sẵn sàng)", bare: true, stories: ["US-13-02", "US-13-07", "US-13-16", "US-13-01", "US-19-34"], flows: [],
    note: "KHU VỰC AN TOÀN: bộ màu --sw-sos-* cố định (không theo sáng/tối), vòng trắng 4px, chữ hệ thống, một nút chính, không toast, không tracking, không bắt đăng nhập. Giữ nút ~1,5 giây (Registry: OQ-UX-04). Đổi chế độ tỉnh ở bảng mô phỏng.",
    render() {
      const m = mode(), off = SW.cur.state === "offline", noC = SW.pick("nocontact", "0") === "1";
      let h = bar(true, "SOS · Khẩn cấp") + '<main class="sos-screen">';
      h += '<div class="sos-card">' + MODE_TXT[m] + "</div>";
      if (m !== "tat") {
        h += '<div id="sos-hold" class="sos-hold"><svg viewBox="0 0 200 200" aria-hidden="true"><circle class="trk" cx="100" cy="100" r="90"/><circle id="sos-ring" class="prg" cx="100" cy="100" r="90" stroke-dasharray="565" stroke-dashoffset="565"/></svg><button type="button" aria-label="Nút SOS. Nhấn giữ để gửi. Nếu không giữ được, dùng nút xác nhận bên dưới." data-sos="hold">SOS<small>Giữ để gửi</small></button></div>';
        h += '<p id="sos-hint" class="t-cap" style="text-align:center;font-weight:700;color:var(--sw-sos-on-surface)" role="status">Giữ nút khoảng 1,5 giây để gửi.</p>';
        h += '<button class="sos-btn" data-modal="sos-confirm">Không giữ được? Gửi bằng xác nhận</button>';
      } else {
        h += '<div class="sos-st fail">Không có nút gửi ở tỉnh này</div><button class="sos-btn call" data-go="m-sos-sms">Soạn tin nhắn cho người thân</button>';
      }
      if (off) h += '<div class="sos-st fail">Không có mạng dữ liệu. SOS sẽ tự gửi lại khi có mạng.</div>';
      h += "<div><div style=\"font-weight:700;margin-bottom:6px\">Gọi số khẩn cấp</div>" + nums() + "</div>" + callMsg();
      h += '<div class="sos-card">' + (noC ? "<b>Chưa có người thân nhận SMS.</b> Bạn vẫn gửi được SOS tới Safety Center." : "<b>Người thân sẽ nhận tin:</b> Nguyễn Văn Bình (đã xác nhận), Lê Thị Hoa (chờ xác nhận)") + '<br><a href="#" data-go="m-contacts" style="color:var(--sw-sos-on-surface);font-weight:700">Quản lý liên hệ khẩn cấp</a></div>';
      h += '<div class="sos-card">Vị trí: ' + (S.sos.gps === "lost" ? "Dùng vị trí gần nhất, cũ 12 phút" : "đang chia sẻ, cập nhật 5 giây trước") + "</div>";
      h += '<div style="border:2px dashed var(--sw-sos-neutral);border-radius:12px;padding:10px;background:#fff;font-size:13px"><b>Mô phỏng (chỉ prototype)</b><br>Chế độ tỉnh: ' + ["tat", "chuyen_tiep", "tiep_nhan"].map((x) => '<button class="c-chip' + (m === x ? " on" : "") + '" data-pick="sosmode:' + x + '" style="margin:3px">' + x + "</button>").join("") + '<br><button class="c-chip' + (noC ? " on" : "") + '" data-pick="nocontact:' + (noC ? 0 : 1) + '" style="margin:3px">Chưa có liên hệ</button><button class="c-chip' + (S.sos.gps === "lost" ? " on" : "") + '" data-act="gpsToggle" style="margin:3px">Mất GPS</button><span class="muted"> Ngoại tuyến: dùng ô “Trạng thái” trên thanh công cụ.</span></div>';
      return h + "</main>" + live("Màn SOS");
    },
  });
  SW.act.gpsToggle = () => { S.sos.gps = S.sos.gps === "lost" ? "ok" : "lost"; };

  SW.act.sosSim = (el) => {
    const k = el.dataset.k;
    if (k === "recv") S.sos.phase = "recv";
    else if (k === "fwd") S.sos.phase = "fwd";
    else if (k === "closed") S.sos.phase = "closed";
    else if (k === "online") { S.sos.phase = "sent"; S.sos.off = false; S.sos.late = true; }
    else if (k === "reset") { S.sos = { phase: "ready", gps: "ok", at: "09:41" }; SW.go("m-sos"); return false; }
  };
  SW.act.sosCancel = () => { S.sos.phase = "cancel"; SW.layer = null; return true; };
  SW.modals["sos-cancel"] = () => sosBox('<h3 class="t-h3" style="font-family:system-ui,sans-serif">Báo bấm nhầm?</h3><p style="font-family:system-ui,sans-serif">Trung tâm vẫn sẽ liên lạc lại để xác nhận bạn an toàn. Người thân sẽ nhận tin đính chính. Bạn không thể tự đóng sự cố.</p><div class="actions"><button class="sos-btn" data-close style="width:auto;padding:0 20px">Quay lại</button><button class="sos-btn call" data-act="sosCancel" style="width:auto;padding:0 20px">Báo bấm nhầm</button></div>');

  SW.screen({
    id: "m-sos-track", surface: "m", persona: "guest", group: "5 · An toàn và SOS", title: "SOS (theo dõi)", bare: true, stories: ["US-13-10", "US-13-07", "US-13-02", "US-13-16", "US-13-20"], flows: [],
    note: "Các trạng thái: Đã gửi, Đã được tiếp nhận, Chuyển tiếp (rơi về), Chưa gửi được (ngoại tuyến), Báo bấm nhầm, Đã đóng. Không hứa “cứu hộ sẽ đến ngay” (docs/design/05, S9).",
    render() {
      const p = S.sos.phase === "ready" ? (SW.cur.state === "offline" ? "fail" : "sent") : S.sos.phase, m = mode();
      const idx = { sent: 0, fwd: 0, recv: 1, closed: 3, cancel: 0, fail: 0 }[p];
      const stBox = {
        sent: '<div class="sos-st sent">Đã gửi · ' + S.sos.at + "</div>",
        recv: '<div class="sos-st recv">Đã được tiếp nhận · 09:43</div>',
        fwd: '<div class="sos-st fwd">Đã chuyển tiếp tới đầu mối của tỉnh và người thân. Chưa có người trực nhận.</div>',
        fail: '<div class="sos-st fail">Chưa gửi được. Đang thử lại…</div>',
        cancel: '<div class="sos-st fwd">Bạn đã báo bấm nhầm. Trung tâm vẫn sẽ liên lạc lại.</div>',
        closed: '<div class="sos-st fwd">Sự cố đã đóng lúc 10:05 bởi Safety Center.</div>',
      }[p];
      const steps = ["Đã gửi", "Đã có người nhận", "Đang xử lý", "Đã đóng"].map((s, i) => '<li class="' + (i < idx ? "done" : i === idx && p !== "fail" ? "now" : "") + '"><span class="d"></span><span>' + s + (i === 0 && p !== "fail" ? " · " + S.sos.at : i === 1 && idx >= 1 ? " · 09:43" : "") + "</span></li>").join("");
      let h = bar(false, "SOS · Theo dõi") + '<main class="sos-screen">' + stBox;
      if (S.sos.late) h += '<div class="sos-card">Đã gửi SOS lúc ' + S.sos.at + " (thời điểm bạn bấm).</div>";
      h += '<a href="#" data-act="callSim" data-n="112" class="sos-btn solid" aria-label="Gọi 112">Gọi 112</a>';
      if (p === "fail") {
        h += '<div class="sos-card">Không có mạng dữ liệu. Ứng dụng tự gửi lại mỗi 15 giây, giãn dần tới 2 phút (CFG-087). <b>Không có sóng điện thoại thì không gửi được.</b></div>' + nums() + '<button class="sos-btn" data-go="m-sos-sms">Soạn SMS SOS</button>';
      } else {
        h += '<ol class="sos-steps" aria-label="Tiến trình">' + steps + "</ol>" + '<div class="sos-card">Mã sự cố: <b>SOS-0087</b><br>Vị trí: ' + (S.sos.gps === "lost" ? "dùng vị trí gần nhất, cũ 12 phút" : "đang chia sẻ, cập nhật 5 giây trước") + (m === "chuyen_tiep" && p !== "fwd" ? "<br>Thông tin được chuyển tiếp tới đầu mối của tỉnh." : "") + "</div>";
      }
      h += callMsg();
      if (p !== "closed" && p !== "cancel") h += '<button class="sos-btn" data-modal="sos-cancel">Báo bấm nhầm</button>';
      if (p === "closed") h += '<button class="sos-btn call" data-go="m-support">Liên hệ hỗ trợ sau sự cố</button>';
      h += '<div style="border:2px dashed var(--sw-sos-neutral);border-radius:12px;padding:10px;background:#fff;font-size:13px"><b>Mô phỏng phía Safety Center (chỉ prototype)</b><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">' + [["recv", "Tiếp nhận"], ["fwd", "Không ai nhận, rơi về chuyển tiếp"], ["closed", "Đóng sự cố"], ["online", "Có mạng lại"], ["reset", "Làm lại"]].map((x) => '<button class="c-chip" data-act="sosSim" data-k="' + x[0] + '">' + x[1] + "</button>").join("") + "</div></div>";
      return h + "</main>" + live("Trạng thái SOS: " + p);
    },
  });

  SW.screen({
    id: "m-sos-sms", surface: "m", persona: "guest", group: "5 · An toàn và SOS", title: "Tin nhắn SOS mở sẵn", bare: true, stories: ["US-13-13", "US-13-14", "US-13-15", "US-13-07"], flows: [],
    note: "Tin soạn sẵn định dạng cố định, khách chỉ bấm Gửi trong ứng dụng nhắn tin của máy (không tự gửi SMS).",
    render() {
      return bar(true, "Nhắn cho người thân") + '<main class="sos-screen"><div class="sos-card" style="white-space:pre-line;font-family:ui-monospace,monospace">SOS Stay Wild\nTôi cần giúp đỡ.\nVị trí: 22.336, 103.843 (cũ 12 phút)\nGiờ: 09:41 29/10</div>' + ["Nguyễn Văn Bình", "Lê Thị Hoa"].map((n) => '<button class="sos-btn call" data-act="callSim" data-n="' + n + '">Mở tin nhắn tới ' + n + "</button>").join("") + callMsg() + '<div class="sos-card">Ứng dụng không tự gửi SMS thay bạn. Nếu không có sóng điện thoại, tin sẽ không đi được.</div></main>';
    },
  });

  SW.screen({
    id: "m-safety", surface: "m", persona: "guest", group: "5 · An toàn và SOS", title: "Trung tâm an toàn", tab: "me", stories: ["US-13-01", "US-13-06", "US-13-08", "US-13-16"], flows: [], fab: true,
    render() {
      return U.alert("info", "Lào Cai · chế độ " + mode(), MODE_TXT[mode()]) + '<div class="c-card pad" style="border:2px solid var(--sw-sos-border);background:var(--sw-sos-surface);color:var(--sw-sos-on-surface)"><div class="row gap3"><div class="grow"><b style="font-family:system-ui,sans-serif;font-size:18px">Khẩn cấp?</b><div style="font-family:system-ui,sans-serif">Mở màn SOS để gửi vị trí hoặc gọi 112.</div></div><button class="sos-btn solid" style="width:auto;padding:0 20px" data-go="m-sos">Mở SOS</button></div></div>' +
        M_head("Liên hệ khẩn cấp") + '<div class="c-card"><ul class="c-list"><li><div class="grow"><b>Nguyễn Văn Bình</b><div class="t-cap muted">Anh trai</div></div>' + U.badge("Đã xác nhận", "success") + '</li><li><div class="grow"><b>Lê Thị Hoa</b><div class="t-cap muted">Bạn</div></div>' + U.badge("Chờ người thân xác nhận", "warning") + '</li></ul></div>' + U.btn("Quản lý liên hệ", "secondary block", 'data-go="m-contacts"') +
        M_head("Cảnh báo gần bạn") + '<div class="safe-alert" data-go="m-alerts" style="cursor:pointer">' + U.ic("rain", "lg") + '<div class="grow"><b>Mưa lớn tại Sa Pa 31/10</b><div class="t-cap">Cấp vừa</div></div></div>' + M_head("Đầu mối cứu hộ của tỉnh (24/7)") + U.card(U.kv([["Công an tỉnh Lào Cai", "02•• ••• 113"], ["Trạm y tế Sa Pa", "02•• ••• 115"]]), "pad flat") + U.sample();
    },
  });
  function M_head(t) { return '<div class="m-h"><h2>' + t + "</h2></div>"; }

  SW.screen({
    id: "m-contacts", surface: "m", persona: "guest", group: "5 · An toàn và SOS", title: "Liên hệ khẩn cấp", back: true, stories: ["US-13-01", "US-13-14", "US-13-15"], flows: [],
    note: "Tối đa theo CFG-083 (seed 3). Mời người thân bằng liên kết để khách tự chuyển, app không tự gửi SMS.",
    render() {
      const n = 2, max = 3;
      return U.st('<div class="c-card"><ul class="c-list"><li><div class="grow"><b>Nguyễn Văn Bình</b><div class="t-cap muted">09•• ••• 117 · Anh trai</div></div>' + U.badge("Đã xác nhận", "success") + '</li><li><div class="grow"><b>Lê Thị Hoa</b><div class="t-cap muted">09•• ••• 553 · Bạn</div></div>' + U.badge("Chờ xác nhận", "warning") + U.btn("Mời", "sm secondary", 'data-toast="Đã sao chép liên kết mời (mô phỏng)"') + '</li><li><div class="grow"><b>Trần Quang</b><div class="t-cap muted">Từ chối nhận tin</div></div>' + U.badge("Từ chối", "error") + "</li></ul></div>" + '<p class="t-cap muted">' + n + "/" + max + " liên hệ đang hoạt động. Chưa có liên hệ đã xác nhận vẫn gửi được SOS.</p>" + U.btn("Thêm liên hệ", "block", 'data-go="m-contact-add"', "plus"), { empty: { title: "Chưa có liên hệ khẩn cấp", text: "Thêm người thân để họ nhận tin khi bạn gửi SOS. Bạn vẫn gửi được SOS khi chưa có ai.", cta: U.btn("Thêm liên hệ", "sm", 'data-go="m-contact-add"') } });
    },
  });
  SW.screen({
    id: "m-contact-add", surface: "m", persona: "guest", group: "5 · An toàn và SOS", title: "Thêm liên hệ", back: true, stories: ["US-13-01", "US-13-15"], flows: [],
    foot: () => U.btn("Tạo liên kết mời", "lg block", 'data-go="m-contacts" data-toast="Đã tạo liên kết mời, hãy gửi cho người thân" data-kind="success"'),
    render() {
      return U.field("Họ tên người thân", U.input({ bind: "ct_n" }), { req: 1 }) + U.field("Số điện thoại", U.input({ type: "tel", bind: "ct_p", ph: "09•• ••• •••" }), { req: 1 }) + U.field("Quan hệ", U.select(["Người thân", "Bạn", "Đồng nghiệp"], { val: "Người thân" })) + U.alert("info", "Người thân phải đồng ý", "Họ nhận liên kết do bạn gửi và tự xác nhận. Chỉ khi xác nhận, họ mới nhận tin SOS của bạn.");
    },
  });
})();
