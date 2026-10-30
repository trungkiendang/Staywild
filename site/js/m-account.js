/* A · Mobile · Khách: thông báo, hồ sơ, cài đặt, quyền riêng tư (rút đồng ý), trang chính sách. */
(function () {
  const SW = window.SW, U = SW.ui, D = SW.D;

  SW.screen({
    id: "m-notifs", surface: "m", persona: "guest", group: "6 · Hồ sơ và cài đặt", title: "Thông báo", back: true, tab: "home", stories: ["US-14-03", "US-14-04", "US-14-08"], flows: ["K4"],
    barRight: U.ibtn("settings", "Tùy chọn thông báo", 'data-go="m-notif-prefs"'),
    render() {
      return U.st('<div class="c-card"><ul class="c-list">' + D.notifs.map((n) => '<li class="click" data-toast="Mở nội dung (mô phỏng)">' + U.ic(n.ic, "lg") + '<div class="grow"><div class="t-label" style="' + (n.un ? "" : "font-weight:400") + '">' + n.t + '</div><div class="t-cap muted">' + n.d + "</div></div>" + (n.un ? U.badge("Mới", "accent") : "") + "</li>").join("") + "</ul></div>" + U.btn("Đánh dấu đã đọc tất cả", "ghost block", 'data-toast="Đã đánh dấu"'), { empty: { title: "Chưa có thông báo", text: "Cập nhật về đặt chỗ, cảnh báo và ưu đãi sẽ hiện ở đây." } });
    },
  });
  SW.screen({
    id: "m-notif-prefs", surface: "m", persona: "guest", group: "6 · Hồ sơ và cài đặt", title: "Tùy chọn thông báo", back: true, stories: ["US-14-05", "US-14-06"], flows: ["K4"],
    note: "Thông báo giao dịch và an toàn là thiết yếu, không tắt được. Ưu đãi chỉ gửi khi có đồng ý tiếp thị.",
    render() {
      return '<div class="c-card pad col gap3">' + U.sw("np1", true, "Đặt chỗ và thanh toán<div class='t-cap muted'>Bắt buộc để nhận vé</div>", { dis: true }) + U.sw("np2", true, "Cảnh báo an toàn khu vực") + U.sw("np3", true, "Nhắc đánh giá sau chuyến đi") + U.sw("np4", false, "Ưu đãi và gợi ý<div class='t-cap muted'>Cần đồng ý “tiếp thị” ở Quyền riêng tư</div>") + "</div>" + U.field("Kênh dự phòng", U.select(["Push", "Push và SMS (tin quan trọng)", "Email"], { val: "Push" }), { hint: "SMS chỉ cho tin quan trọng; OTP và SOS luôn gửi." });
    },
  });
  SW.screen({
    id: "m-profile", surface: "m", persona: "guest", group: "6 · Hồ sơ và cài đặt", title: "Hồ sơ", tab: "me", stories: ["US-02-04", "US-02-03", "US-19-09", "US-02-02"], flows: ["K1"],
    barRight: U.ibtn("bell", "Thông báo", 'data-go="m-notifs"'),
    render() {
      const row = (ic, t, go, extra) => '<li class="click" data-go="' + go + '">' + U.ic(ic) + '<span class="grow">' + t + "</span>" + (extra || "") + U.ic("chevR") + "</li>";
      return '<div class="row gap3">' + U.ava(D.me.name, "") .replace("c-ava ", "c-ava ") + '<div class="grow"><div class="t-h3">' + D.me.name + '</div><div class="t-cap muted">' + D.me.phone + '</div></div>' + U.btn("Sửa", "secondary sm", 'data-go="m-profile-edit"') + '</div><div class="c-card"><ul class="c-list">' + row("ticket", "Đặt chỗ của tôi", "m-bookings") + row("money", "Lịch sử giao dịch", "m-receipts") + row("shield", "Trung tâm an toàn", "m-safety", U.badge("2 liên hệ", "brand")) + row("heart", "Yêu thích", "m-favs") + row("lock", "Quyền riêng tư và đồng ý", "m-privacy") + row("bell", "Thông báo", "m-notif-prefs") + row("settings", "Cài đặt ứng dụng", "m-settings") + row("info", "Hỗ trợ và khiếu nại", "m-support") + row("book", "Điều khoản và chính sách", "m-policy") + '</ul></div>' + U.btn("Đăng xuất", "ghost block", 'data-go="m-onb-welcome" data-root data-toast="Đã đăng xuất, token đã thu hồi"');
    },
  });
  SW.screen({
    id: "m-profile-edit", surface: "m", persona: "guest", group: "6 · Hồ sơ và cài đặt", title: "Sửa hồ sơ", back: true, stories: ["US-02-04", "US-02-10"], flows: ["K1"],
    foot: () => U.btn("Lưu thay đổi", "lg block", 'data-back data-toast="Đã lưu hồ sơ" data-kind="success"'),
    render() {
      return U.field("Họ tên", U.input({ val: D.me.name })) + U.field("Email", U.input({ val: D.me.email, type: "email" })) + U.field("Ngày sinh", U.input({ type: "date", val: "1995-04-12" }), { hint: "Dùng để xác nhận độ tuổi tối thiểu theo quy định." }) + U.field("Giới tính (tùy chọn)", U.select(["Không nêu", "Nữ", "Nam", "Khác"], { val: "Không nêu" })) + U.field("Thẻ sở thích", U.multiChips("prefs", ["Trekking nhẹ", "Ẩm thực địa phương", "Làng nghề", "Homestay"]));
    },
  });
  SW.screen({
    id: "m-privacy", surface: "m", persona: "guest", group: "6 · Hồ sơ và cài đặt", title: "Quyền riêng tư", back: true, stories: ["US-19-09", "US-19-14", "US-19-20", "US-07-12"], flows: ["K1"],
    note: "Rút đồng ý có hiệu lực cục bộ tức thì, kể cả ngoại tuyến (lệnh rút được giữ và gửi khi có mạng). Cần xác minh pháp lý NĐ 13/2023.",
    render() {
      const a = SW.form("c_phantich", false), b = SW.form("c_tiepthi", false);
      return U.st('<div class="c-card pad col gap3">' + U.sw("c_phantich", false, "<b>Phân tích để cải thiện app</b><div class='t-cap muted'>Mức hiện tại: " + (b ? "marketing" : a ? "analytics" : "none") + "</div>", { redraw: true }) + U.sw("c_tiepthi", false, "<b>Tiếp thị và ưu đãi phù hợp</b>", { redraw: true }) + "</div>" + (a || b ? U.alert("info", "Khi bạn tắt", "App dừng thu ngay, xóa hàng đợi chưa gửi và xóa dữ liệu đã thu theo chính sách.") : U.alert("success", "Đang ở mức thiết yếu", "Không thu dữ liệu hành vi. Mọi tính năng vẫn hoạt động.")) + U.card('<b>Dữ liệu của tôi</b><p class="t-cap muted">Yêu cầu bản sao hoặc xóa dữ liệu; phản hồi trong 72 giờ.</p><div class="row gap2 mt2">' + U.btn("Tải bản sao", "secondary sm", 'data-toast="Đã ghi nhận yêu cầu (mô phỏng)"') + U.btn("Xóa dữ liệu hội thoại AI", "secondary sm", 'data-modal="del-ai"') + U.btn("Xóa tài khoản", "danger outline sm", 'data-modal="del-acc"') + "</div>", "pad flat") + '<p class="t-cap muted">Phiên bản chính sách 1.0 · chấp thuận lúc 09:36 29/10/2026. SOS luôn hoạt động bất kể lựa chọn.</p>', { skel: 3 });
    },
  });
  SW.modals["del-ai"] = () => '<h3 class="t-h3">Xóa lịch sử hội thoại AI?</h3><p>Không thể hoàn tác. Lịch trình đã lưu trong My Trip được giữ.</p><div class="actions">' + U.btn("Hủy", "ghost", "data-close") + U.btn("Xóa", "danger", 'data-close data-toast="Đã xóa hội thoại"') + "</div>";
  SW.modals["del-acc"] = () => '<h3 class="t-h3">Xóa tài khoản?</h3>' + U.alert("warning", "Hậu quả", "Bạn mất My Trip, vé chưa dùng và lịch sử. Giao dịch tài chính được giữ theo quy định pháp luật (chỉ ẩn danh).") + U.field("Nhập XOA để xác nhận", U.input({ ph: "XOA" })) + '<div class="actions">' + U.btn("Hủy", "ghost", "data-close") + U.btn("Xóa tài khoản", "danger", "data-close disabled") + "</div>";

  SW.screen({
    id: "m-settings", surface: "m", persona: "guest", group: "6 · Hồ sơ và cài đặt", title: "Cài đặt ứng dụng", back: true, stories: ["US-02-04"], flows: [],
    note: "Chế độ sáng/tối và cỡ chữ (OQ-UX-05: chế độ tối phát hành ở Go-live?). Khu vực SOS không đổi theo giao diện.",
    render() {
      return '<div class="c-card pad col gap3"><div class="t-label">Giao diện</div>' + U.segment("th", [["light", "Sáng"], ["dark", "Tối"], ["auto", "Hệ thống"]], SW.tab("th", "light")).replace(/data-tab="th:(\w+)"/g, 'data-act="setTheme" data-v="$1"') + '<div class="t-label">Cỡ chữ</div>' + U.segment("fs", [["s", "Nhỏ"], ["m", "Vừa"], ["l", "Lớn"]], SW.tab("fs", "m")) + '<div class="t-label">Ngôn ngữ</div>' + U.select([["vi", "Tiếng Việt"], ["en", "English (chưa hỗ trợ)"]], { val: "vi" }) + "</div>" + U.alert("info", "Khu vực SOS", "Màn SOS luôn dùng bộ màu và chữ hệ thống cố định, không đổi theo giao diện hay cỡ chữ của app.") + U.sw("lowdata", false, "Tiết kiệm dữ liệu");
    },
  });
  SW.act.setTheme = (el) => { SW.S.tabs.th = el.dataset.v; SW.shell.setTheme(el.dataset.v); };

  SW.screen({
    id: "m-policy", surface: "m", persona: "guest", group: "6 · Hồ sơ và cài đặt", title: "Điều khoản và chính sách", back: true, stories: ["US-05-07", "US-01-26"], flows: [],
    note: "Nội dung do CMS trang chính sách quản lý (US-05-07), có phiên bản; đổi phiên bản sẽ hỏi lại đồng ý.",
    render() {
      return U.tabs("po", [["tos", "Điều khoản"], ["pv", "Quyền riêng tư"], ["faq", "Hỏi đáp"]], SW.tab("po", "tos")) + U.st('<article class="col gap3"><div class="row between"><h2 class="t-h2">' + ({ tos: "Điều khoản sử dụng", pv: "Chính sách quyền riêng tư", faq: "Câu hỏi thường gặp" }[SW.tab("po", "tos")]) + "</h2>" + U.badge("Phiên bản 1.0", "") + "</div><p>Nội dung mẫu: Bạn đồng ý sử dụng dịch vụ đúng mục đích du lịch hợp pháp. Stay Wild kết nối bạn với nhà cung cấp, không thay thế dịch vụ cứu hộ hay cấp cứu.</p><p>Chúng tôi chỉ xử lý dữ liệu cá nhân theo mục đích bạn đồng ý; bạn có thể rút lại bất cứ lúc nào.</p>" + U.sample() + "</article>", { skel: 4 });
    },
  });
})();
