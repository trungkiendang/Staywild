/* A · Mobile · Khách: trợ lý AI, Trip Planner, My Trip. */
(function () {
  const SW = window.SW, U = SW.ui, D = SW.D, M = SW.M;
  const chat = (SW.S.chat = [
    { r: "ai", t: "Chào Khánh Linh, mình là trợ lý du lịch Stay Wild. Mình trả lời dựa trên nội dung đã được duyệt và luôn nêu nguồn.", c: [] },
    { r: "me", t: "Cuối tuần này đi Sa Pa có nên đi Cát Cát không?" },
    { r: "ai", t: "Cuối tuần này Sa Pa có mưa nhỏ, đường xuống bản Cát Cát hơi trơn. Nếu đi, nên đi buổi sáng và mang áo mưa. Trải nghiệm nhuộm chàm trong nhà là phương án thay thế.", c: ["1", "2"] },
  ]);
  SW.S.quota = 17;
  const cite = (n) => '<button class="c-cite" data-sheet="cite-' + n + '" aria-label="Nguồn ' + n + '">[' + n + "]</button>";
  SW.modals["cite-1"] = SW.modals["cite-2"] = SW.modals["cite-3"] = () => '<div class="grab"></div><h3 class="t-h3">Nguồn trích dẫn</h3><div class="col gap2"><div class="c-card pad flat"><div class="row between"><b>[1] Cảnh báo thời tiết Sa Pa 31/10</b>' + U.badge("Nội dung đã duyệt", "success") + '</div><div class="t-cap muted">Cập nhật 08:30 · Địa phương Lào Cai</div></div><div class="c-card pad flat"><div class="row between"><b>[2] Trải nghiệm: Lớp nhuộm chàm và thêu thổ cẩm</b>' + U.badge("Đã duyệt", "success") + '</div><div class="t-cap muted">Nhà cung cấp: Hợp tác xã Chàm Xanh · Xem chi tiết</div></div></div><div class="actions">' + U.btn("Đóng", "secondary", "data-close") + "</div>";

  SW.act.send = () => {
    const el = document.getElementById("chatq"); const t = (el && el.value || "").trim(); if (!t) return false;
    if (SW.S.quota <= 0) { SW.toast("Bạn đã dùng hết lượt AI hôm nay", "error"); return false; }
    chat.push({ r: "me", t }); SW.S.quota--; SW.S.busy = true;
    setTimeout(() => {
      SW.S.busy = false;
      const x = t.toLowerCase();
      let m;
      if (/sos|cấp cứu|nguy hiểm|cứu/.test(x)) m = { r: "ai", t: "Nếu bạn đang gặp nguy hiểm, hãy mở nút SOS hoặc gọi 112 ngay. Mình không thay thế dịch vụ cứu hộ.", c: [], sos: 1 };
      else if (/giá rẻ nhất|giá vé máy bay|chuyến bay/.test(x)) m = { r: "ai", t: "Mình chưa có dữ liệu giá đáng tin cậy cho nội dung này nên không đưa ra con số để tránh sai lệch. Bạn có thể xem giá dịch vụ đã đăng trong trang chi tiết.", c: [], gap: 1 };
      else if (/lịch trình|kế hoạch|ngày/.test(x)) m = { r: "ai", t: "Mình có thể lập lịch trình theo sở thích của bạn. Mở Trip Planner để chọn ngày, ngân sách và sở thích.", c: ["3"], plan: 1 };
      else m = { r: "ai", t: "Theo nội dung đã duyệt, mùa lúa chín ở Sa Pa đẹp nhất từ cuối tháng 9 đến giữa tháng 10; sau đó là mùa mận và hoa đào.", c: ["1"] };
      chat.push(m); SW.draw();
    }, 1000);
  };
  SW.screen({
    id: "m-ai", surface: "m", persona: "guest", group: "3 · AI và My Trip", title: "Trợ lý AI", tab: "ai", fab: true, stories: ["US-07-04", "US-07-06", "US-07-09", "US-07-12"], flows: ["K3"],
    barRight: U.badge("Còn " + 17 + "/20 lượt", "accent"),
    note: "Nhãn AI, trích nguồn [n], từ chối khi thiếu dữ liệu, hạn mức lượt (CFG-070). Thử nhắn: “giá rẻ nhất”, “lịch trình”, “SOS”.",
    foot: () => (SW.S.quota <= 0 ? '<div class="c-alert warning grow">' + U.ic("alert") + "<div>Bạn đã dùng hết lượt hôm nay. Lượt mới có sau 00:00. Bạn vẫn xem được lịch sử.</div></div>" : '<div class="m-chatin" style="padding:0;border:0;width:100%"><input id="chatq" aria-label="Nhập câu hỏi" placeholder="Hỏi về điểm đến, thời tiết, lịch trình..." ' + (SW.cur.state === "error" ? "disabled" : "") + ">" + U.btn("", "icon", 'data-act="send" aria-label="Gửi"', "send") + "</div>"),
    render() {
      const bub = chat.map((m) => m.r === "me" ? '<div class="c-bubble me">' + U.esc(m.t) + "</div>" : '<div class="c-bubble ai"><div class="row gap1" style="margin-bottom:4px">' + U.badge("AI", "ai", "sparkle") + '</div>' + U.esc(m.t) + (m.c && m.c.length ? '<div class="mt2 row gap1">' + m.c.map(cite).join("") + "</div>" : "") + (m.gap ? '<div class="mt2">' + U.badge("Thiếu dữ liệu, không ước đoán", "warning", "info") + "</div>" : "") + (m.plan ? '<div class="mt2">' + U.btn("Mở Trip Planner", "sm ai", 'data-go="m-ai-plan"', "sparkle") + "</div>" : "") + (m.sos ? '<div class="mt2">' + U.btn("Mở màn SOS", "sm danger", 'data-go="m-sos"') + "</div>" : "") + '<div class="mt2 t-cap muted">AI có thể sai. Hãy kiểm tra thông tin quan trọng.</div></div>').join("");
      let state = "";
      if (SW.S.busy || SW.cur.state === "loading") state = '<div class="c-bubble ai" aria-busy="true"><span class="c-dots" aria-label="AI đang soạn"><i></i><i></i><i></i></span></div>';
      if (SW.cur.state === "error") state = U.alert("error", "AI tạm thời không phản hồi", "Tin nhắn của bạn được giữ lại. Thử lại sau ít phút.", U.btn("Thử lại", "sm secondary", 'data-act="retry"'));
      if (SW.cur.state === "empty") return '<div class="m-chat">' + U.empty({ title: "Hỏi mình bất cứ điều gì về chuyến đi", text: "Ví dụ: “Sa Pa tháng 11 mặc gì?”, “Lập lịch 3 ngày Hà Giang”.", cta: U.chips("ex", ["Thời tiết Sa Pa", "Món ngon Hội An"]) }) + "</div>";
      return '<div class="m-chat">' + bub + state + (SW.cur.state === "offline" ? U.alert("warning", "Cần mạng để hỏi AI", "Lịch sử hội thoại xem được ngoại tuyến.") : "") + '<div class="m-hint" style="text-align:center">Hội thoại được lưu để bạn xem lại; bạn xóa được trong Hồ sơ.</div></div>';
    },
  });

  SW.screen({
    id: "m-ai-plan", surface: "m", persona: "guest", group: "3 · AI và My Trip", title: "Lập lịch với AI", back: true, stories: ["US-07-05", "US-02-03"], flows: ["K3"],
    foot: () => U.btn("Tạo lịch trình", "lg block ai", 'data-act="genPlan"', "sparkle"),
    render() {
      return U.field("Điểm đến", U.select(D.dests.map((d) => d.n), { bind: "pl_dest", val: "Sa Pa" })) + '<div class="row gap2"><div class="grow">' + U.field("Ngày đi", U.input({ type: "date", bind: "pl_from", val: "2026-11-07" })) + '</div><div class="grow">' + U.field("Số ngày", U.select(["2", "3", "4", "5"], { bind: "pl_days", val: "3" })) + "</div></div>" + U.field("Số người", U.select(["1", "2", "3 đến 4", "5 trở lên"], { bind: "pl_pax", val: "2" })) +
        U.field("Ngân sách mỗi người (tùy chọn)", U.input({ bind: "pl_bud", ph: "Ví dụ: 3.000.000 ₫" }), { hint: "Để trống nếu chưa muốn nêu. AI chỉ ước tính khi có dữ liệu giá." }) + U.field("Sở thích", U.multiChips("plprefs", ["Trekking nhẹ", "Ẩm thực địa phương", "Làng nghề", "Săn mây", "Gia đình có trẻ nhỏ"])) +
        '<div class="c-stub">Quyền riêng tư: chỉ gửi sở thích đã ẩn danh hóa cho AI, không gửi tên hay số điện thoại (US-07-07).</div>';
    },
  });
  SW.act.genPlan = () => { SW.go("m-ai-plan-wait"); setTimeout(() => { if (SW.cur.id === "m-ai-plan-wait" && SW.cur.state === "ok") SW.go("m-ai-plan-result"); }, 2600); return false; };
  SW.screen({
    id: "m-ai-plan-wait", surface: "m", persona: "guest", group: "3 · AI và My Trip", title: "Đang lập lịch trình", stories: ["US-07-05", "US-07-09"], flows: ["K3"], hidden: false,
    note: "Chờ tối đa ~30 giây (NFR-01). Cho phép hủy. Hết lượt AI: hiện thông báo giới hạn.",
    render() {
      if (SW.cur.state === "error") return U.error({ title: "AI chưa lập được lịch trình", text: "Dịch vụ AI đang bận. Yêu cầu của bạn chưa bị trừ lượt." }) + U.btn("Thử lại", "block", 'data-go="m-ai-plan-wait"');
      return '<div class="c-empty"><svg class="art" viewBox="0 0 96 96" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="48" cy="50" rx="40" ry="30"/><ellipse cx="48" cy="50" rx="28" ry="20"/><ellipse cx="48" cy="50" rx="16" ry="10"/></svg><h3>Đang lập lịch trình 3 ngày…</h3><p>Đang đọc nội dung đã duyệt và kiểm tra thời tiết. Thường mất khoảng 20 đến 30 giây.</p></div>' + U.progress(65) + U.stepper([["Tìm trải nghiệm phù hợp", "Xong"], ["Sắp xếp theo ngày và quãng đường", "Đang làm"], ["Kiểm tra nguồn và thời tiết", ""]], 1) + U.btn("Hủy", "secondary block", 'data-back') + U.btn("Xem kết quả mẫu ngay", "ghost block", 'data-go="m-ai-plan-result"');
    },
  });

  const plan = [
    { d: "Ngày 1 · Thứ Bảy 07/11", s: [["08:00", "Xe lên Sa Pa, nhận phòng", "Homestay Suối Vàng", "380.000 ₫", ["1"], "m-svc-pick"], ["14:00", "Trekking bản Tả Van cùng người Giáy", "Bản Tả Van · 6 giờ", "450.000 ₫", ["2"], "m-exp"], ["19:00", "Bữa tối tại homestay", "Chưa có dữ liệu giá", "", [], ""]] },
    { d: "Ngày 2 · Chủ Nhật 08/11", s: [["08:30", "Lớp nhuộm chàm và thêu thổ cẩm", "Hợp tác xã Chàm Xanh · 3 giờ", "320.000 ₫", ["2"], "m-exp"], ["14:00", "Thác Bạc và chợ Sa Pa", "Tự do", "", ["1"], ""]] },
    { d: "Ngày 3 · Thứ Hai 09/11", s: [["07:00", "Săn mây buổi sáng", "Điểm ngắm mây (tùy thời tiết)", "", ["3"], ""], ["10:30", "Trả phòng, về lại", "Xe khách", "", [], ""]] },
  ];
  SW.screen({
    id: "m-ai-plan-result", surface: "m", persona: "guest", group: "3 · AI và My Trip", title: "Lịch trình gợi ý", back: true, stories: ["US-07-05", "US-07-06", "US-07-11", "US-08-01"], flows: ["K3"],
    foot: () => U.btn("Chỉnh qua chat", "secondary grow", 'data-sheet="edit-chat"') + U.btn("Lưu vào My Trip", "grow", 'data-go="m-trips" data-toast="Đã lưu vào My Trip" data-kind="success"'),
    note: "Mỗi mục có nguồn [n]; mục thiếu dữ liệu nói rõ thay vì bịa. Lưu My Trip không cần booking (K3). Nhãn “AI gợi ý” gắn trên toàn kết quả.",
    render() {
      return U.st('<div class="row between">' + '<div><h2 class="t-h2">3 ngày ở Sa Pa</h2><div class="t-cap muted">2 người · 07/11 đến 09/11</div></div>' + U.badge("AI gợi ý", "ai", "sparkle") + "</div>" + U.alert("warning", "Một vài mục chưa chắc chắn", "Bữa tối ngày 1 thiếu dữ liệu giá nên chưa ước tính. Thời tiết ngày 1 có mưa nhỏ.") +
        plan.map((p) => '<div class="c-day"><header><span>' + p.d + "</span>" + U.ic("cloud") + "</header>" + p.s.map((s) => '<div class="c-slot"><div class="tm">' + s[0] + '</div><div class="grow"><div class="t-label">' + s[1] + '</div><div class="t-cap muted">' + s[2] + (s[3] ? " · <b>" + s[3] + "</b>" : "") + '</div><div class="row gap1 mt2">' + s[4].map(cite).join("") + (s[5] ? U.btn("Đặt", "sm secondary", 'data-go="' + s[5] + '"') : "") + "</div></div></div>").join("") + "</div>").join("") +
        '<div class="m-hint">Lịch trình do AI gợi ý từ nội dung đã duyệt. Hãy kiểm tra giờ mở cửa, thời tiết và chính sách của Provider trước khi đi.</div>', { skel: 4, empty: { title: "AI chưa có đủ dữ liệu", text: "Điểm đến này chưa có đủ nội dung đã duyệt để lập lịch an toàn. Thử điểm đến khác hoặc hỏi trợ lý." }, error: { title: "Không tạo được lịch trình" } });
    },
  });
  SW.modals["edit-chat"] = () => '<div class="grab"></div><h3 class="t-h3">Chỉnh lịch trình bằng chat</h3><p class="muted">Chọn một gợi ý hoặc tự nhập. AI giữ nguyên phần bạn không nhắc tới.</p>' + U.chips("edc", ["Giảm bớt đi bộ", "Thêm ẩm thực địa phương", "Dời ngày 2 sang buổi sáng", "Phương án khi mưa"]) + U.input({ ph: "Ví dụ: bỏ thác Bạc, thêm chợ phiên" }) + '<div class="actions">' + U.btn("Hủy", "ghost", "data-close") + U.btn("Cập nhật", "ai", 'data-close data-toast="Đã cập nhật lịch trình (mô phỏng)"', "sparkle") + "</div>";

  SW.screen({
    id: "m-trips", surface: "m", persona: "guest", group: "3 · AI và My Trip", title: "My Trip", tab: "trip", stories: ["US-08-02", "US-08-01"], flows: ["K3"],
    barRight: U.ibtn("plus", "Tạo chuyến mới", 'data-go="m-ai-plan"'),
    render() {
      return U.segment("tr", [["up", "Sắp đi"], ["past", "Đã đi"]], SW.tab("tr", "up")) + U.st(SW.tab("tr", "up") === "up" ? '<div class="col gap3"><div class="c-card click" data-go="m-trip-detail" role="button" tabindex="0">' + U.cover("trip1", 100, "Sa Pa") + '<div class="pad" style="padding:12px"><div class="row between"><b>3 ngày ở Sa Pa</b>' + U.badge("Bản nháp AI", "ai") + '</div><div class="t-cap muted">07/11 đến 09/11/2026 · 2 người · còn 9 ngày</div></div></div><div class="c-card click" data-go="m-trip-detail" role="button" tabindex="0">' + U.cover("trip2", 100, "Đà Lạt") + '<div style="padding:12px"><div class="row between"><b>Cuối tuần Đà Lạt</b>' + U.badge("Đã đặt 1 dịch vụ", "success") + '</div><div class="t-cap muted">21/11 đến 23/11/2026</div></div></div></div>' : '<div class="c-card"><ul class="c-list"><li class="click" data-go="m-review">' + U.ic("star") + '<div class="grow"><b>Hội An 2 ngày</b><div class="t-cap muted">Hoàn thành 12/09 · Chưa đánh giá</div></div>' + U.badge("Đánh giá", "accent") + "</li></ul></div>", { empty: { title: "Chưa có chuyến đi", text: "Lập lịch với AI hoặc tự tạo chuyến đầu tiên. Không cần đặt chỗ vẫn lưu được.", cta: U.btn("Lập lịch với AI", "ai", 'data-go="m-ai-plan"', "sparkle") } });
    },
  });
  SW.screen({
    id: "m-trip-detail", surface: "m", persona: "guest", group: "3 · AI và My Trip", title: "Chi tiết chuyến đi", back: true, stories: ["US-08-03", "US-08-04", "US-08-02"], flows: ["K3"],
    barRight: U.ibtn("share", "Chia sẻ", 'data-toast="Đã sao chép liên kết chia sẻ (mô phỏng)"'),
    render() {
      return U.alert("info", "Chuyến đi còn 9 ngày", "Dự báo Sa Pa 07/11: mưa nhỏ, 14°C. Mang áo mưa.") + plan.slice(0, 2).map((p) => '<div class="c-day"><header><span>' + p.d + '</span><button class="c-btn ghost sm" data-modal="edit-item">' + U.ic("edit", "sm") + "Sửa</button></header>" + p.s.map((s) => '<div class="c-slot"><div class="tm">' + s[0] + '</div><div class="grow"><div class="t-label">' + s[1] + '</div><div class="t-cap muted">' + s[2] + "</div></div></div>").join("") + "</div>").join("") + U.btn("Thêm hoạt động", "secondary block", 'data-modal="edit-item"', "plus") + U.btn("Bắt đầu theo dõi hành trình", "block", 'data-go="m-trip-follow"');
    },
  });
  SW.modals["edit-item"] = () => '<h3 class="t-h3">Sửa hoạt động</h3>' + U.field("Tên hoạt động", U.input({ val: "Trekking bản Tả Van" })) + '<div class="row gap2"><div class="grow">' + U.field("Giờ", U.input({ type: "time", val: "14:00" })) + '</div><div class="grow">' + U.field("Ngày", U.select(["Ngày 1", "Ngày 2", "Ngày 3"], { val: "Ngày 1" })) + "</div></div>" + '<div class="actions">' + U.btn("Xóa", "danger outline", 'data-close data-toast="Đã xóa hoạt động"') + U.btn("Hủy", "ghost", "data-close") + U.btn("Lưu", "", 'data-close data-toast="Đã lưu" data-kind="success"') + "</div>";
  SW.screen({
    id: "m-trip-follow", surface: "m", persona: "guest", group: "3 · AI và My Trip", title: "Theo dõi hành trình", back: true, stories: ["US-08-04"], flows: ["K3"],
    render() {
      return U.st('<div class="c-card pad"><div class="row between"><b>Hôm nay · Ngày 1</b>' + U.badge("2/3 xong", "brand") + "</div>" + U.progress(66) + "</div>" + U.stepper([["08:00 Xe lên Sa Pa", "Đã đến 08:20"], ["14:00 Trekking Tả Van", "Đang diễn ra"], ["19:00 Bữa tối homestay", "Sắp tới"]], 1) + U.btn("Đánh dấu hoàn thành", "block", 'data-toast="Đã đánh dấu"') + U.btn("Tôi cần giúp (Trung tâm an toàn)", "secondary block", 'data-go="m-safety"', "shield"), { empty: { title: "Hôm nay chưa có hoạt động", text: "Chuyến đi chưa tới ngày bắt đầu." } });
    },
  });
})();
