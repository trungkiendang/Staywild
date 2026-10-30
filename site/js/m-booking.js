/* A · Mobile · Khách: chọn dịch vụ, đặt chỗ, thanh toán, vé QR, check-in, đánh giá, hỗ trợ. */
(function () {
  const SW = window.SW, U = SW.ui, D = SW.D, M = SW.M;
  const pax = () => Number(SW.form("pax", 2));
  const svc = () => D.svcs.find((s) => s.id === SW.pick("svc", "s1"));
  const total = () => svc().price * pax() - (SW.form("promo_ok") ? 50000 : 0);
  SW.act.paxInc = () => { SW.S.form.pax = Math.min(pax() + 1, Math.max(svc().left, 1)); };
  SW.act.paxDec = () => { SW.S.form.pax = Math.max(pax() - 1, 1); };
  SW.S.bk = 0; // 0 đã gửi, 1 đã xác nhận (chờ thanh toán), 2 đã thanh toán, 3 hoàn thành
  SW.act.bkNext = () => { SW.S.bk = Math.min(SW.S.bk + 1, 3); };
  SW.act.bkReset = () => { SW.S.bk = 0; };
  SW.act.applyPromo = () => { const v = (document.getElementById("promo") || {}).value || ""; SW.S.form.promo_ok = v.trim().toUpperCase() === "MAU-DEMO"; SW.S.form.promo_try = v; };
  const summary = () => U.card(U.kv([["Dịch vụ", svc().n], ["Ngày", SW.pick("day", "07/11/2026")], ["Khung giờ", SW.pick("slot", svc().slot[0])], ["Số khách", pax()], ["Giảm giá", SW.form("promo_ok") ? "−50.000 ₫" : "—"], ["<b>Tổng cộng</b>", "<b class='num'>" + U.money(total()) + "</b>"]]), "pad flat");

  SW.screen({
    id: "m-svc-pick", surface: "m", persona: "guest", group: "4 · Đặt chỗ và thanh toán", title: "Chọn dịch vụ", back: true, stories: ["US-12-10", "US-09-06", "US-09-07", "US-05-04"], flows: ["K4"],
    foot: () => '<div class="grow"><div class="t-cap muted">Tạm tính</div><b class="num t-h3">' + U.money(total()) + "</b></div>" + U.btn("Tiếp tục", "lg", 'data-go="m-book-review"' + (svc().left === 0 ? " disabled" : "")),
    note: "Kiểm tra sức chứa theo khung giờ (US-12-10): hết chỗ thì nút vô hiệu kèm lý do chữ, không chỉ màu.",
    render() {
      const days = Array.from({ length: 30 }, (_, i) => i + 1);
      const sel = SW.pick("dayn", "7");
      const cal = '<div class="c-cal" role="grid" aria-label="Chọn ngày tháng 11 năm 2026">' + ["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((h) => '<div class="h">' + h + "</div>").join("") + '<div></div><div></div><div></div><div></div><div></div><div></div>' + days.map((d) => '<button class="' + (String(d) === sel ? "on" : d === 14 || d === 15 ? "full" : d === 8 || d === 9 ? "low" : "") + '" data-pick="dayn:' + d + '" data-act="setDay" data-d="' + d + '" ' + (d === 14 || d === 15 ? 'aria-disabled="true" aria-label="Ngày ' + d + ', hết chỗ"' : "") + ">" + d + "</button>").join("") + "</div>";
      return U.st('<div class="col gap3"><div class="t-label">Dịch vụ</div>' + D.svcs.map((s) => '<label class="c-card pad row gap3 click" style="' + (SW.pick("svc", "s1") === s.id ? "border-color:var(--sw-color-brand-primary);border-width:2px" : "") + '"><input type="radio" name="svc" ' + (SW.pick("svc", "s1") === s.id ? "checked" : "") + ' data-pick="svc:' + s.id + '" style="width:20px;height:20px;accent-color:var(--sw-color-brand-primary)"><div class="grow"><div class="t-label">' + s.n + '</div><div class="t-cap muted">' + (s.left ? "Còn " + s.left + " chỗ" : "") + '</div></div><div class="right"><b class="num">' + U.money(s.price) + "</b><br>" + (s.left === 0 ? U.badge("Hết chỗ", "error") : s.left <= 2 ? U.badge("Sắp hết", "warning") : "") + "</div></label>").join("") + '</div><div class="t-label">Ngày · tháng 11/2026</div>' + cal + '<div class="t-cap muted"><span class="c-badge warning">sắp hết</span> <span class="c-badge">gạch ngang = hết chỗ</span></div><div class="t-label">Khung giờ</div>' + U.chips("slot", svc().slot, svc().slot[0]) +
        '<div class="row between c-card pad flat"><div><b>Số khách</b><div class="t-cap muted">Tối đa ' + (svc().left || 0) + " (còn chỗ)</div></div><div class='row gap3'>" + '<button class="c-btn secondary icon" aria-label="Giảm" data-act="paxDec">' + U.ic("minus") + "</button>" + "<b class='num t-h3' aria-live='polite'>" + pax() + "</b>" + '<button class="c-btn secondary icon" aria-label="Tăng" data-act="paxInc">' + U.ic("plus") + "</button></div></div>" + (svc().left === 0 ? U.alert("warning", "Dịch vụ này đã hết chỗ", "Chọn ngày hoặc khung giờ khác, hoặc vào danh sách chờ.") : ""), { empty: { title: "Chưa có dịch vụ để đặt", text: "Provider chưa mở lịch cho trải nghiệm này." } });
    },
  });
  SW.act.setDay = (el) => { SW.S.pick.day = el.dataset.d + "/11/2026"; };

  SW.screen({
    id: "m-book-review", surface: "m", persona: "guest", group: "4 · Đặt chỗ và thanh toán", title: "Xác nhận yêu cầu đặt", back: true, stories: ["US-12-01", "US-16-15", "US-12-13", "US-18-13"], flows: ["K4"],
    foot: () => U.btn("Gửi yêu cầu đặt", "lg block", 'data-act="bkReset" data-go="m-book-status"' + (SW.form("agree", false) ? "" : " disabled")),
    note: "Chưa trừ tiền: Provider xác nhận trước, bạn thanh toán sau trong thời hạn giữ chỗ (CFG-004). Mã thử: MAU-DEMO.",
    render() {
      const tried = SW.form("promo_try", ""), ok = SW.form("promo_ok", false);
      return summary() + U.field("Họ tên người đi", U.input({ val: D.me.name })) + U.field("Số điện thoại liên hệ", U.input({ val: D.me.phone, dis: true }), { hint: "Dùng số đã xác thực." }) + U.field("Ghi chú cho nhà cung cấp", U.textarea("Dị ứng thực phẩm, nhu cầu đặc biệt...", "note")) +
        U.field("Mã giảm giá", '<div class="row gap2"><input id="promo" class="c-input ' + (tried && !ok ? "is-error" : "") + '" placeholder="Nhập mã" value="' + U.esc(tried) + '">' + U.btn("Áp dụng", "secondary", 'data-act="applyPromo"') + "</div>", { err: tried && !ok ? "Mã không hợp lệ hoặc đã hết hạn." : "", hint: ok ? "Đã áp dụng mã mẫu." : "" }) +
        U.alert("info", "Chính sách hủy: Trung bình", "Hoàn 100% nếu hủy trước 48 giờ; 50% từ 24 đến 48 giờ; không hoàn dưới 24 giờ (mẫu theo CFG-020).") + U.check("agree", false, "Tôi đã đọc và đồng ý với <a href='#' data-go='m-policy'>điều khoản đặt chỗ</a> và chính sách hủy.");
    },
  });

  SW.screen({
    id: "m-book-status", surface: "m", persona: "guest", group: "4 · Đặt chỗ và thanh toán", title: "Trạng thái đặt chỗ", back: true, stories: ["US-12-03", "US-12-09", "US-12-02"], flows: ["K4"],
    note: "Bảng “Mô phỏng” là công cụ prototype, không phải màn của sản phẩm. Hết hạn xác nhận / thanh toán xem bằng nút mô phỏng.",
    render() {
      const b = SW.S.bk, exp = SW.form("expired", false);
      const steps = [["Đã gửi yêu cầu", "09:41 · Mã BK-260412"], ["Provider xác nhận", b >= 1 ? "09:55 · Còn giữ chỗ 59 phút" : "Chờ trong tối đa 12 giờ"], ["Thanh toán", b >= 2 ? "Đã thanh toán 10:02" : ""], ["Nhận vé QR", b >= 2 ? "Sẵn sàng" : ""]];
      return U.st((exp ? U.alert("error", "Đã hết hạn thanh toán", "Chỗ giữ cho bạn đã được nhả. Đặt lại nếu vẫn còn chỗ.", U.btn("Đặt lại", "sm", 'data-go="m-svc-pick" data-act="unexp"')) : "") + U.card(U.kv([["Dịch vụ", svc().n], ["Ngày", SW.pick("day", "07/11/2026")], ["Tổng", "<b class='num'>" + U.money(total()) + "</b>"]]), "pad flat") + U.stepper(steps, exp ? 1 : b) +
        (!exp && b === 1 ? U.btn("Thanh toán " + U.money(total()), "lg block", 'data-go="m-pay"') : "") + (!exp && b >= 2 ? U.btn("Xem vé QR", "lg block", 'data-go="m-ticket"') : "") + (!exp && b < 2 ? U.btn("Hủy yêu cầu", "danger outline block", 'data-modal="cancel-bk"') : "") +
        '<div class="c-stub"><b>Mô phỏng (chỉ prototype)</b><div class="row wrap gap2 mt2">' + U.btn("Provider xác nhận", "sm secondary", 'data-act="bkNext"') + U.btn("Hết hạn", "sm secondary", 'data-set="expired" data-val="1"') + "</div></div>", { skel: 3 });
    },
  });
  SW.act.unexp = () => { SW.S.form.expired = ""; SW.S.bk = 0; };
  SW.modals["cancel-bk"] = () => '<h3 class="t-h3">Hủy yêu cầu đặt?</h3><p>Bạn chưa thanh toán nên không bị tính phí. Nhà cung cấp sẽ được báo.</p><div class="actions">' + U.btn("Giữ yêu cầu", "ghost", "data-close") + U.btn("Hủy yêu cầu", "danger", 'data-close data-go="m-bookings" data-toast="Đã hủy yêu cầu"') + "</div>";

  SW.screen({
    id: "m-pay", surface: "m", persona: "guest", group: "4 · Đặt chỗ và thanh toán", title: "Thanh toán", back: true, stories: ["US-16-01", "US-12-09", "US-16-09"], flows: ["K4"],
    foot: () => U.btn("Thanh toán " + U.money(total()), "lg block", 'data-go="m-pay-result"'),
    note: "Sandbox: không trừ tiền thật. Phiên 15 phút nằm trong hạn giữ chỗ (CFG-044/004). Tối đa 3 lần thử lại.",
    render() {
      const m = SW.pick("pm", "card");
      return U.alert("warning", "Môi trường thử nghiệm (sandbox)", "Không có khoản tiền thật nào bị trừ.") + '<div class="c-card pad row between"><div><div class="t-cap muted">Giữ chỗ còn</div><b class="t-h2 num">14:52</b></div>' + U.badge("Hết hạn sẽ nhả chỗ", "warning", "clock") + "</div>" + summary() +
        '<div class="t-label">Phương thức</div>' + [["card", "Thẻ nội địa / quốc tế", "credit"], ["wallet", "Ví điện tử", "wallet"], ["qr", "Chuyển khoản QR ngân hàng", "qr"]].map((x) => '<label class="c-card pad row gap3 click" style="' + (m === x[0] ? "border:2px solid var(--sw-color-brand-primary)" : "") + '"><input type="radio" name="pm" data-pick="pm:' + x[0] + '" ' + (m === x[0] ? "checked" : "") + ' style="width:20px;height:20px;accent-color:var(--sw-color-brand-primary)"><span class="grow t-label">' + x[1] + "</span>" + U.ic(x[2] === "qr" ? "qr" : "money") + "</label>").join("") + '<p class="t-cap muted">Stay Wild thu hộ và chuyển cho nhà cung cấp sau khi hoàn thành (cần xác minh pháp lý về thu hộ). Không lưu số thẻ trên app.</p>';
    },
  });
  SW.screen({
    id: "m-pay-result", surface: "m", persona: "guest", group: "4 · Đặt chỗ và thanh toán", title: "Kết quả thanh toán", stories: ["US-16-01", "US-16-09", "US-14-08"], flows: ["K4"], bare: false, tab: "",
    note: "Chuyển trạng thái “Lỗi” để xem thanh toán thất bại (còn 2 lần thử).",
    render() {
      if (SW.cur.state === "error") return '<div class="c-empty err" role="alert"><svg class="art" viewBox="0 0 96 96" fill="none" stroke="currentColor" stroke-width="2"><circle cx="48" cy="48" r="34"/><path d="M36 36l24 24M60 36L36 60"/></svg><h3>Thanh toán chưa thành công</h3><p>Ngân hàng từ chối giao dịch. Chưa có khoản tiền nào bị trừ. Bạn còn 2 lần thử trong thời hạn giữ chỗ.</p></div>' + U.btn("Thử lại", "lg block", 'data-go="m-pay"') + U.btn("Đổi phương thức", "secondary block", 'data-go="m-pay"') + U.btn("Liên hệ hỗ trợ", "ghost block", 'data-go="m-support"');
      return '<div class="c-empty"><svg class="art" viewBox="0 0 96 96" fill="none" stroke="var(--sw-color-success-solid)" stroke-width="3"><circle cx="48" cy="48" r="34"/><path d="M33 49l11 11 20-22"/></svg><h3>Đã thanh toán</h3><p>Mã giao dịch TX-889214 (mẫu). Vé QR của bạn đã sẵn sàng và được lưu để xem ngoại tuyến.</p></div>' + summary() + U.btn("Xem vé QR", "lg block", 'data-go="m-ticket" data-act="bkPaid"') + U.btn("Về trang chủ", "ghost block", 'data-go="m-home" data-root');
    },
  });
  SW.act.bkPaid = () => { SW.S.bk = Math.max(SW.S.bk, 2); };

  SW.screen({
    id: "m-ticket", surface: "m", persona: "guest", group: "4 · Đặt chỗ và thanh toán", title: "Vé của tôi", back: true, stories: ["US-12-11", "US-12-04", "US-02-11"], flows: ["K4"],
    note: "Mã QR ký bằng khóa thiết bị, đổi theo bước thời gian (CFG-010). Ngoại tuyến: vẫn hiện kèm thời điểm lưu. Độ sáng màn hình tự tăng khi mở.",
    render() {
      const off = SW.cur.state === "offline";
      return '<div class="m-ticket"><div class="top"><div class="t-cap" style="opacity:.85">Vé điện tử · BK-260412</div><div class="t-h3">' + svc().n + '</div></div><div class="mid">' + U.qr("BK-260412-" + (off ? "o" : "n"), 200) + '<div class="t-cap muted">Mã đổi sau <b class="num">24 giây</b> · Chỉ để quét, đừng chụp gửi người khác</div></div><div style="padding:16px">' + U.kv([["Ngày", SW.pick("day", "07/11/2026")], ["Khung giờ", SW.pick("slot", svc().slot[0])], ["Số khách", pax()], ["Điểm hẹn", "Cổng bản Tả Van"]]) + "</div></div>" +
        (off ? U.alert("warning", "Đang ngoại tuyến", "Vé đã lưu lúc 10:02. Bạn vẫn dùng được để check-in.") : "") + U.btn("Hướng dẫn check-in", "secondary block", 'data-go="m-checkin"') + U.btn("Chi tiết đặt chỗ", "ghost block", 'data-go="m-booking-detail"');
    },
  });
  SW.screen({
    id: "m-checkin", surface: "m", persona: "guest", group: "4 · Đặt chỗ và thanh toán", title: "Check-in", back: true, stories: ["US-12-04", "US-12-05"], flows: ["K4"],
    render() {
      const ph = SW.pick("ci", "wait");
      return U.stepper([["Đưa mã QR cho nhà cung cấp quét", "Tại cổng bản Tả Van, 08:00"], ["Đã check-in", ph !== "wait" ? "08:02 · Lò Văn Sáng đã xác nhận" : ""], ["Hoàn thành", ph === "done" ? "Nhà cung cấp xác nhận 14:10" : ""]], ph === "wait" ? 0 : ph === "in" ? 1 : 3) + (ph === "wait" ? U.alert("info", "Đang chờ quét", "Giữ màn hình sáng. Nếu mã không quét được, đọc mã dự phòng cho nhà cung cấp.") + '<div class="c-card pad flat" style="text-align:center"><div class="t-cap muted">Mã dự phòng</div><b class="t-h1 num mono">482 917</b></div>' : "") + (ph === "done" ? U.btn("Viết đánh giá", "lg block", 'data-go="m-review"') : "") + '<div class="c-stub"><b>Mô phỏng</b><div class="row gap2 mt2 wrap">' + U.btn("Đã quét", "sm secondary", 'data-pick="ci:in"') + U.btn("Hoàn thành", "sm secondary", 'data-pick="ci:done"') + U.btn("Đặt lại", "sm ghost", 'data-pick="ci:wait"') + "</div></div>";
    },
  });

  SW.screen({
    id: "m-bookings", surface: "m", persona: "guest", group: "4 · Đặt chỗ và thanh toán", title: "Đặt chỗ của tôi", back: true, tab: "me", stories: ["US-12-03", "US-16-16"], flows: ["K4"],
    render() {
      const t = SW.tab("bk", "up");
      const rows = { up: [["BK-260412", "Tour Tả Van nửa ngày", "07/11 · Chờ Provider xác nhận", "warning"]], done: [["BK-260388", "Xe đưa đón Sa Pa", "30/10 · Hoàn thành", "success"]], cx: [["BK-260377", "Tour Tả Van nửa ngày", "29/10 · Hết hạn thanh toán", "error"]] }[t];
      return U.tabs("bk", [["up", "Sắp tới"], ["done", "Đã xong"], ["cx", "Đã hủy"]], t) + U.st('<div class="c-card"><ul class="c-list">' + rows.map((r) => '<li class="click" data-go="m-booking-detail"><div class="grow"><b>' + r[1] + '</b><div class="t-cap muted">' + r[0] + " · " + r[2] + "</div></div>" + U.ic("chevR") + "</li>").join("") + "</ul></div>", { empty: { title: "Chưa có đặt chỗ", text: "Khi bạn đặt dịch vụ, đơn sẽ hiện ở đây.", cta: U.btn("Khám phá", "sm", 'data-go="m-home" data-root') } });
    },
  });
  SW.screen({
    id: "m-booking-detail", surface: "m", persona: "guest", group: "4 · Đặt chỗ và thanh toán", title: "Chi tiết đặt chỗ", back: true, stories: ["US-12-03", "US-12-08", "US-16-02"], flows: ["K4"],
    render() {
      return U.card(U.kv([["Mã", "BK-260412"], ["Dịch vụ", svc().n], ["Ngày", SW.pick("day", "07/11/2026")], ["Trạng thái", U.badge(SW.S.bk >= 2 ? "Đã thanh toán" : "Chờ xác nhận", SW.S.bk >= 2 ? "success" : "warning")], ["Tổng", "<b>" + U.money(total()) + "</b>"]]), "pad") + U.btn("Xem vé QR", "block", 'data-go="m-ticket"') + U.btn("Liên hệ hỗ trợ", "secondary block", 'data-go="m-support"') + U.btn("Hủy và hoàn tiền", "danger outline block", 'data-modal="refund"');
    },
  });
  SW.modals["refund"] = () => '<h3 class="t-h3">Hủy đặt chỗ này?</h3>' + U.alert("info", "Mức hoàn tạm tính: 50%", "Bạn hủy cách giờ bắt đầu 36 giờ nên hoàn 50% theo chính sách “Trung bình”: " + U.money(total() / 2) + ". Tiền về phương thức đã trả trong 3 đến 7 ngày (mẫu).") + U.field("Lý do (tùy chọn)", U.select(["Đổi kế hoạch", "Thời tiết xấu", "Lý do khác"], { val: "Đổi kế hoạch" })) + '<div class="actions">' + U.btn("Giữ đặt chỗ", "ghost", "data-close") + U.btn("Xác nhận hủy", "danger", 'data-close data-go="m-bookings" data-toast="Đã hủy. Đang xử lý hoàn tiền"') + "</div>";

  SW.screen({
    id: "m-review", surface: "m", persona: "guest", group: "4 · Đặt chỗ và thanh toán", title: "Đánh giá chuyến đi", back: true, stories: ["US-08-05", "US-14-10", "US-06-06"], flows: ["K5"],
    foot: () => U.btn("Gửi đánh giá", "lg block", 'data-go="m-home" data-root data-toast="Cảm ơn bạn đã đánh giá" data-kind="success"'),
    note: "Nhắc đánh giá sau Hoàn thành (US-14-10). Đánh giá đi qua kiểm duyệt (US-06-06) trước khi hiển thị.",
    render() {
      const r = Number(SW.pick("rate", 4));
      return '<div class="c-card pad flat"><b>Trekking bản Tả Van</b><div class="t-cap muted">Hoàn thành 07/11/2026</div></div><div class="t-label">Bạn thấy thế nào?</div><div class="row gap2" role="radiogroup" aria-label="Số sao">' + [1, 2, 3, 4, 5].map((i) => '<button class="c-btn ' + (i <= r ? "" : "secondary") + ' icon" role="radio" aria-checked="' + (i === r) + '" aria-label="' + i + ' sao" data-pick="rate:' + i + '" style="width:48px;height:48px">' + i + "</button>").join("") + "</div>" + U.multiChips("rvtag", ["Hướng dẫn viên tốt", "Đúng mô tả", "Đáng tiền", "An toàn", "Cần cải thiện"]) + U.textarea("Chia sẻ trải nghiệm của bạn (không đăng thông tin cá nhân của người khác)", "rvtxt") + U.btn("Thêm ảnh", "secondary block", 'data-toast="Chọn ảnh (mô phỏng)"', "camera") + '<p class="t-cap muted">Đánh giá hiển thị công khai sau khi được kiểm duyệt. Bạn sửa được trong 7 ngày (tham số).</p>';
    },
  });

  SW.screen({
    id: "m-support", surface: "m", persona: "guest", group: "4 · Đặt chỗ và thanh toán", title: "Hỗ trợ và khiếu nại", back: true, tab: "me", stories: ["US-16-24", "US-16-05"], flows: ["K5", "A3"],
    render() {
      return U.tabs("sp", [["new", "Gửi yêu cầu"], ["list", "Yêu cầu của tôi"]], SW.tab("sp", "new")) + (SW.tab("sp", "new") === "new" ? U.field("Liên quan đến", U.select(["BK-260412 · Tour Tả Van", "Khác"], { val: "BK-260412 · Tour Tả Van" })) + U.field("Loại", U.select(["Khiếu nại dịch vụ", "Yêu cầu hoàn tiền", "Hỏi đáp", "Báo lỗi ứng dụng"], { val: "Khiếu nại dịch vụ" })) + U.field("Mô tả", U.textarea("Mô tả vấn đề...", "sp_txt")) + U.btn("Đính kèm ảnh", "secondary block", 'data-toast="Chọn ảnh (mô phỏng)"', "camera") + U.btn("Gửi", "lg block", 'data-tab="sp:list" data-toast="Đã gửi. Mã yêu cầu SP-2041" data-kind="success"') : U.st('<div class="c-card"><ul class="c-list"><li><div class="grow"><b>SP-2041 · Khiếu nại dịch vụ</b><div class="t-cap muted">Gửi 09:50 · CSKH đang xem xét</div></div>' + U.badge("Đang xử lý", "info") + '</li><li><div class="grow"><b>SP-2007 · Hoàn tiền</b><div class="t-cap muted">Đã giải quyết 12/10</div></div>' + U.badge("Đã đóng", "success") + "</li></ul></div>", { empty: { title: "Bạn chưa gửi yêu cầu nào", text: "Cần giúp đỡ? Gửi yêu cầu ở thẻ bên cạnh." } }));
    },
  });
  SW.screen({
    id: "m-receipts", surface: "m", persona: "guest", group: "4 · Đặt chỗ và thanh toán", title: "Lịch sử giao dịch", back: true, stories: ["US-16-16"], flows: ["K4"],
    render() {
      return U.st('<div class="c-card"><ul class="c-list">' + [["TX-889214", "Tour Tả Van nửa ngày", 900000, "Đã thanh toán"], ["TX-871003", "Xe đưa đón Sa Pa", 500000, "Hoàn thành"], ["RF-110552", "Hoàn tiền 50% BK-260301", 225000, "Đã hoàn"]].map((r) => '<li class="click" data-toast="Biên lai ' + r[0] + ' (mô phỏng)"><div class="grow"><b>' + r[1] + '</b><div class="t-cap muted">' + r[0] + " · " + r[3] + '</div></div><b class="num">' + U.money(r[2]) + "</b></li>").join("") + "</ul></div>", { empty: { title: "Chưa có giao dịch", text: "Giao dịch sẽ hiện sau lần thanh toán đầu tiên." } });
    },
  });
})();
