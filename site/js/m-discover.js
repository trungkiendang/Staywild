/* A · Mobile · Khách: khám phá, chi tiết điểm đến/trải nghiệm, bản đồ + bottom sheet, tìm kiếm, cảnh báo. */
(function () {
  const SW = window.SW, U = SW.ui, D = SW.D, M = SW.M;
  const noAcc = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();

  SW.screen({
    id: "m-home", surface: "m", persona: "guest", group: "2 · Khám phá", title: "Khám phá", tab: "home", stories: ["US-04-04", "US-04-06", "US-04-05", "US-13-06", "US-04-10"], flows: ["K2"], flush: true,
    barRight: U.ibtn("bell", "Thông báo", 'data-go="m-notifs"') ,
    note: "Màn đầu của Khách. Cảnh báo an toàn dùng màu cảnh báo, không dùng đỏ SOS. Nút SOS luôn ở góc dưới phải.",
    render() {
      const list = U.st('<div class="m-hscroll">' + D.dests.map(M.destCard).join("") + "</div>", { skel: 2, empty: { title: "Chưa có điểm đến ở tỉnh này", text: "Bộ dữ liệu tối thiểu của tỉnh đang được biên tập.", cta: U.btn("Chọn tỉnh khác", "secondary sm", 'data-go="m-region"') } });
      const exps = U.st('<div class="col gap3">' + D.exps.slice(0, 3).map(M.expRow).join("") + "</div>", { skel: 3, empty: { title: "Chưa có trải nghiệm phù hợp", text: "Thử bỏ bớt bộ lọc hoặc đổi điểm đến." } });
      return '<section class="m-hero"><div style="position:absolute;inset:0;opacity:.25">' + U.contour("home-hero", 9) + '</div><p class="t-cap" style="opacity:.85;position:relative">Xin chào, Khánh Linh</p><h1>Hôm nay bạn muốn đi đâu?</h1><div class="m-search mt4" data-go="m-search" role="search" tabindex="0" style="position:relative">' + U.ic("search") + "<span>Tìm điểm đến, trải nghiệm (gõ không dấu cũng được)</span></div></section>" +
        '<div style="padding:16px;display:flex;flex-direction:column;gap:20px">' +
        '<div class="m-qa">' + [["sparkle", "Lập lịch AI", "m-ai-plan"], ["map", "Bản đồ", "m-map"], ["compass", "Theo vùng", "m-region"], ["heart", "Yêu thích", "m-favs"]].map((q) => '<button data-go="' + q[2] + '"><span class="bubble">' + U.ic(q[0], "lg") + "</span>" + q[1] + "</button>").join("") + "</div>" +
        '<div class="safe-alert" role="status" data-go="m-alerts" style="cursor:pointer">' + U.ic("rain", "lg") + '<div class="grow"><b>Mưa lớn tại Sa Pa 31/10</b><div class="t-cap">Cảnh báo cấp vừa · Nguồn: Cơ quan khí tượng (mẫu) · Cập nhật 08:30</div></div>' + U.ic("chevR") + "</div>" +
        M.head("Điểm đến nổi bật", "Xem tất cả", 'data-go="m-region"') + list + M.head("Trải nghiệm gợi ý cho bạn") + exps + "</div>";
    },
  });

  SW.screen({
    id: "m-region", surface: "m", persona: "guest", group: "2 · Khám phá", title: "Vùng miền và tỉnh", back: true, tab: "home", stories: ["US-04-04", "US-04-01"], flows: ["K2"],
    render() {
      const reg = SW.pick("region", "bac");
      return U.segment("rg", [["bac", "Bắc"], ["trung", "Trung"], ["nam", "Nam"]], SW.tab("rg", "bac")).replace(/data-tab="rg:/g, 'data-pick="region:') +
        U.st('<div class="c-card"><ul class="c-list">' + D.dests.map((d) => '<li class="click" data-go="m-dest" data-act="pickDest" data-id="' + d.id + '">' + U.cover(d.id, 48, "", 48).replace("<div", '<div style="border-radius:8px;flex:none"') + '<div class="grow"><div class="t-label">' + d.n + '</div><div class="t-cap muted">' + d.p + " · " + d.w + "</div></div>" + U.ic("chevR") + "</li>").join("") + "</ul></div>", { empty: { title: "Vùng này chưa có tỉnh đang bật", text: "Tỉnh mới được thêm bằng cấu hình khi sẵn sàng." } }) +
        U.alert("info", "Tỉnh chưa bật", "Một số tỉnh chưa công bố. Bạn vẫn xem được thông tin cơ bản và số khẩn cấp quốc gia.");
    },
  });

  SW.screen({
    id: "m-dest", surface: "m", persona: "guest", group: "2 · Khám phá", title: "Chi tiết điểm đến", back: true, stories: ["US-04-06", "US-04-05", "US-13-06", "US-04-08"], flows: ["K2"], flush: true, fab: true,
    barRight: "",
    render() {
      const d = M.curDest(), fav = SW.form("fav_" + d.id, false);
      const tab = SW.tab("dd", "ov");
      let c = "";
      if (tab === "ov") c = '<p>' + d.d + '</p><div class="c-card pad flat row gap3">' + U.ic("cloud", "lg") + '<div><b>' + d.w + '</b><div class="t-cap muted">Dự báo 3 ngày tới: có mưa nhỏ 31/10. Nguồn: nhà cung cấp thời tiết (adapter), cập nhật 08:30.</div></div></div>' + U.alert("warning", "Cảnh báo an toàn khu vực", "Đường lên Fansipan trơn trượt sau mưa. Mang áo mưa, đi theo nhóm.") + U.sample();
      else if (tab === "ex") c = U.st('<div class="col gap3">' + D.exps.filter((e) => e.dest === d.id).map(M.expRow).join("") + "</div>", { empty: { title: "Chưa có trải nghiệm ở đây", text: "Nội dung đang được Provider và người dân bổ sung.", cta: U.btn("Hỏi trợ lý AI", "secondary sm", 'data-go="m-ai"', "sparkle") } });
      else c = '<div class="col gap2"><div class="c-card pad flat"><b>Mùa đẹp nhất</b><div class="muted">Tháng 9 đến tháng 11 (lúa chín), tháng 3 đến 4 (hoa đào, mận).</div></div><div class="c-card pad flat"><b>Di chuyển</b><div class="muted">Xe khách từ Hà Nội khoảng 5 đến 6 giờ.</div></div></div>';
      return '<div style="position:relative">' + U.cover(d.id, 200, "Ảnh minh họa mẫu") + '<button class="c-btn icon" style="position:absolute;right:12px;top:12px;background:var(--sw-color-bg-surface);color:var(--sw-color-text-primary);border-radius:50%;width:44px;height:44px" aria-pressed="' + fav + '" aria-label="' + (fav ? "Bỏ yêu thích" : "Yêu thích") + '" data-set="fav_' + d.id + '" data-val="' + (fav ? "" : "1") + '">' + U.ic("heart") + "</button></div>" +
        '<div style="padding:16px;display:flex;flex-direction:column;gap:14px"><div><h2 class="t-h1 t-disp">' + d.n + '</h2><div class="muted">' + d.p + " · " + U.stars(d.r, d.rc) + "</div></div>" +
        '<div class="row gap2">' + U.btn("Lập lịch với AI", "grow", 'data-go="m-ai-plan"', "sparkle") + U.btn("Bản đồ", "secondary", 'data-go="m-map"', "map") + "</div>" +
        U.tabs("dd", [["ov", "Tổng quan"], ["ex", "Trải nghiệm"], ["tp", "Thông tin"]], tab) + c + "</div>";
    },
  });

  SW.screen({
    id: "m-exp", surface: "m", persona: "guest", group: "2 · Khám phá", title: "Chi tiết trải nghiệm", back: true, stories: ["US-05-03", "US-09-06", "US-15-03", "US-12-10"], flows: ["K2", "K4"], flush: true, fab: true,
    foot: () => '<div class="grow"><div class="t-cap muted">Từ</div><b class="num t-h3">' + U.money(M.curExp().price) + '</b></div>' + U.btn("Chọn dịch vụ", "lg", 'data-go="m-svc-pick"'),
    note: "Nhãn “Đã xác minh bởi Địa phương” do cán bộ gắn (US-15-03). Giá và chính sách hủy hiển thị trước khi đặt.",
    render() {
      const e = M.curExp();
      return U.cover(e.id, 190, "Ảnh minh họa mẫu") + '<div style="padding:16px;display:flex;flex-direction:column;gap:12px"><h2 class="t-h2">' + e.n + '</h2><div class="row wrap gap2">' + (e.label ? U.badge(e.label, "success", "check") : "") + U.badge(e.dur, "") + U.badge(e.kind === "resident" ? "Người dân" : e.kind === "creator" ? "Creator" : "Provider", "accent") + "</div>" + '<div class="row gap3">' + U.ava(e.by.split("·")[0]) + '<div class="grow"><b>' + e.by + '</b><div class="t-cap muted">' + U.stars(e.r, e.rc) + '</div></div></div><p>Đi bộ nhẹ qua bản làng, ăn trưa tại nhà dân, tìm hiểu nghề thủ công. Nhóm nhỏ, có hướng dẫn viên địa phương.</p>' + U.alert("info", "Chính sách hủy: Trung bình", "Hoàn 100% nếu hủy trước 48 giờ, 50% từ 24 đến 48 giờ (mẫu theo CFG-020).") +
        '<div class="m-h"><h2>Đánh giá</h2><a href="#">Xem tất cả</a></div>' + U.st('<div class="col gap2">' + [["Lê Thu Trang", 5, "Hướng dẫn viên nhiệt tình, đường đi đẹp."], ["Phạm Quốc Huy", 4, "Hơi mưa nhưng vẫn rất vui."]].map((r) => '<div class="c-card pad flat"><div class="row between"><b>' + r[0] + "</b>" + U.stars(r[1]) + '</div><p class="mt2">' + r[2] + "</p></div>").join("") + "</div>", { empty: { title: "Chưa có đánh giá", text: "Hãy là người đầu tiên đánh giá sau chuyến đi." } }) + "</div>";
    },
  });

  SW.screen({
    id: "m-map", surface: "m", persona: "guest", group: "2 · Khám phá", title: "Bản đồ", tab: "map", stories: ["US-04-08", "US-13-06", "US-04-06"], flows: ["K2"], flush: true,
    barRight: U.ibtn("filter", "Bộ lọc", 'data-sheet="map-filter"'),
    note: "Bản đồ mô phỏng bằng SVG (không tải bản đồ thật). Bottom sheet hiện khi chọn marker. Marker dày/cụm là màn ngoài story (OQ-UX-03).",
    render() {
      const sel = SW.pick("pin", "p1");
      const pins = [{ id: "p1", x: 42, y: 40, t: "Bản Tả Van", l: "1" }, { id: "p2", x: 62, y: 28, t: "Thác Bạc", l: "2", k: "clay" }, { id: "p3", x: 28, y: 62, t: "Cảnh báo sạt lở", l: "!", k: "warn" }, { id: "p4", x: 72, y: 66, t: "Homestay Suối Vàng", l: "3" }].map((p) => ({ ...p, sel: p.id === sel, attrs: 'data-pick="pin:' + p.id + '"' }));
      const sheet = { p1: ["Bản Tả Van", "Trekking · 4,7 sao · cách 9 km", "m-exp"], p2: ["Thác Bạc", "Điểm tham quan · 4,5 sao · cách 12 km", "m-dest"], p3: ["Cảnh báo: sạt lở nhẹ", "Cập nhật 07:40 bởi Địa phương. Tránh đoạn đường này.", "m-alerts"], p4: ["Homestay Suối Vàng", "Lưu trú · từ 380.000 ₫", "m-svc-pick"] }[sel];
      return '<div class="m-map" style="position:relative;height:100%;flex:1">' + U.map({ pins, h: 560, seed: "sapa-map" }).replace('style="height:560px"', 'style="height:100%"') + '<div class="row gap2 wrap" style="position:absolute;left:8px;right:8px;top:36px;z-index:3">' + U.chip("Tất cả", "data-pick=\"mf:all\"", SW.pick("mf", "all") === "all") + U.chip("Trải nghiệm", "data-pick=\"mf:ex\"", SW.pick("mf") === "ex") + U.chip("Lưu trú", "data-pick=\"mf:st\"", SW.pick("mf") === "st") + U.chip("Cảnh báo", "data-pick=\"mf:al\"", SW.pick("mf") === "al") + "</div>" +
        '<div class="m-sheet"><div class="c-modal" style="all:unset"></div><div class="grab" style="width:40px;height:4px;border-radius:2px;background:var(--sw-color-border-default);margin:0 auto 10px"></div><div class="row gap3"><div class="grow"><h3 class="t-h3">' + sheet[0] + '</h3><div class="t-cap muted">' + sheet[1] + "</div></div>" + U.btn("Xem", "sm", 'data-go="' + sheet[2] + '"') + "</div></div></div>";
    },
  });

  SW.sheetFilter = 1;
  SW.modals["map-filter"] = () => '<div class="grab"></div><h3 class="t-h3">Lọc bản đồ</h3>' + U.field("Loại", U.multiChips("mapf", ["Trải nghiệm", "Lưu trú", "Ẩm thực", "Cảnh báo an toàn", "Điểm yêu thích"])) + U.field("Bán kính", U.select(["5 km", "10 km", "25 km", "50 km"], { bind: "rad", val: "10 km" })) + '<div class="actions">' + U.btn("Đặt lại", "ghost", 'data-close') + U.btn("Áp dụng", "", 'data-close data-toast="Đã áp dụng bộ lọc"') + "</div>";

  SW.screen({
    id: "m-search", surface: "m", persona: "guest", group: "2 · Khám phá", title: "Tìm kiếm", back: true, stories: ["US-04-07"], flows: ["K2"],
    note: "Tìm không dấu: gõ “sa pa”, “ha giang”, “tra que” để thử. Kết quả lọc thật trên dữ liệu mẫu.",
    render() {
      const q = noAcc(SW.form("q", ""));
      const rs = q ? D.dests.filter((d) => noAcc(d.n + " " + d.p).includes(q)).map((d) => ({ t: d.n, s: d.p + " · Điểm đến", id: d.id, go: "m-dest", act: "pickDest" })).concat(D.exps.filter((e) => noAcc(e.n + " " + e.by + " " + D.dests.find((x) => x.id === e.dest).n).includes(q)).map((e) => ({ t: e.n, s: e.by + " · Trải nghiệm", id: e.id, go: "m-exp", act: "pickExp" }))) : [];
      let h = '<div class="m-search" style="color:var(--sw-color-text-primary)">' + U.ic("search") + '<input data-bind="q" data-redraw aria-label="Tìm kiếm" placeholder="Ví dụ: sa pa, tra que, nhuom cham" value="' + U.esc(SW.form("q", "")) + '" style="border:0;background:transparent;flex:1;min-height:44px;outline:none"></div>';
      if (!q) h += M.head("Tìm gần đây") + U.chips("rs", ["Sa Pa", "Hà Giang", "Nấu ăn", "Homestay"]) .replace(/data-pick="rs:/g, 'data-pick="rs:') + '<div class="c-stub">Gợi ý: nhập “sa pa” rồi nhấn Enter hoặc chạm ra ngoài ô để xem kết quả (tìm không dấu).</div>';
      else h += rs.length ? '<div class="t-cap muted" role="status">' + rs.length + ' kết quả</div><div class="c-card"><ul class="c-list">' + rs.map((r) => '<li class="click" data-go="' + r.go + '" data-act="' + r.act + '" data-id="' + r.id + '">' + U.ic("pin") + '<div class="grow"><div class="t-label">' + r.t + '</div><div class="t-cap muted">' + r.s + "</div></div></li>").join("") + "</ul></div>" : U.empty({ title: "Không tìm thấy “" + U.esc(SW.form("q")) + "”", text: "Kiểm tra chính tả hoặc thử từ khóa ngắn hơn. Bạn cũng có thể hỏi trợ lý AI.", cta: U.btn("Hỏi trợ lý AI", "secondary sm", 'data-go="m-ai"', "sparkle") });
      return U.st(h, { empty: { title: "Chưa có gì để tìm", text: "Nội dung đang được cập nhật." } });
    },
  });

  SW.screen({
    id: "m-alerts", surface: "m", persona: "guest", group: "2 · Khám phá", title: "Cảnh báo an toàn", back: true, stories: ["US-13-06", "US-13-23", "US-13-05"], flows: ["K2"],
    note: "Cảnh báo nghiêm trọng không gạt đi vĩnh viễn. Màu cảnh báo/lỗi, không dùng đỏ SOS để tránh nhầm với khẩn cấp.",
    render() {
      return U.st('<div class="col gap3"><div class="safe-alert sev" role="alert">' + U.ic("alert", "lg") + '<div><b>Mưa cực đoan, nguy cơ sạt lở · Sa Pa</b><div class="t-cap">Hiệu lực 31/10 06:00 đến 01/11 18:00. Tránh đường đèo. Nguồn: cảnh báo tự động theo tỉnh (US-13-23).</div><div class="mt2">' + U.btn("Tôi đã đọc", "sm secondary", 'data-toast="Đã ghi nhận. Cảnh báo nghiêm trọng vẫn được ghim."') + '</div></div></div><div class="safe-alert">' + U.ic("rain", "lg") + '<div><b>Mưa lớn · Hà Giang</b><div class="t-cap">Cập nhật bởi Địa phương lúc 07:40.</div></div></div><div class="c-card pad flat">' + U.badge("Thông tin", "info") + '<p class="mt2">Sương mù dày trên đèo Ô Quy Hồ buổi sáng. Lái xe chậm, bật đèn.</p></div></div>', { empty: { title: "Không có cảnh báo", text: "Khu vực bạn chọn đang an toàn theo dữ liệu hiện có." } });
    },
  });

  SW.screen({
    id: "m-favs", surface: "m", persona: "guest", group: "2 · Khám phá", title: "Yêu thích", back: true, tab: "home", stories: ["US-04-08"], flows: ["K2"],
    render() {
      return U.st('<div class="col gap3">' + D.exps.slice(0, 2).map(M.expRow).join("") + "</div>", { empty: { title: "Chưa có mục yêu thích", text: "Chạm biểu tượng trái tim để lưu nơi bạn muốn đi.", cta: U.btn("Khám phá ngay", "sm", 'data-go="m-home" data-root') } });
    },
  });
})();
