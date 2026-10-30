/* A · Mobile · Khách: giới thiệu, đăng nhập OTP, sở thích, đồng ý theo mục đích. */
(function () {
  const SW = window.SW, U = SW.ui, D = SW.D;
  const M = (SW.M = {});
  M.body = (h, cls) => '<main class="m-body ' + (cls || "") + '">' + h + "</main>";
  M.head = (t, link, attrs) => '<div class="m-h"><h2>' + t + "</h2>" + (link ? '<a href="#" ' + (attrs || "") + ">" + link + "</a>" : "") + "</div>";
  M.destCard = (d) => '<div class="c-card click m-dest" data-go="m-dest" data-act="pickDest" data-id="' + d.id + '" role="button" tabindex="0" aria-label="' + U.esc(d.n) + '">' + U.cover(d.id, 120, "Ảnh minh họa mẫu") + '<div class="b"><div class="t-label">' + d.n + '</div><div class="t-cap muted">' + d.p + " · " + d.tag + '</div><div class="mt2">' + U.stars(d.r, d.rc) + "</div></div></div>";
  M.expRow = (e) => '<div class="c-card click m-svc" data-go="m-exp" data-act="pickExp" data-id="' + e.id + '" role="button" tabindex="0">' + U.cover(e.id, 84, "", 84) + '<div class="grow"><div class="t-label">' + e.n + '</div><div class="t-cap muted">' + e.by + " · " + e.dur + '</div><div class="row between mt2"><b class="num">' + U.money(e.price) + "</b>" + (e.label ? U.badge("Đã xác minh bởi Địa phương", "success", "check") : "") + "</div></div></div>";
  M.curDest = () => D.dests.find((d) => d.id === SW.pick("dest", "sapa"));
  M.curExp = () => D.exps.find((e) => e.id === SW.pick("exp", "e1"));
  SW.act.pickDest = (el) => { SW.S.pick.dest = el.dataset.id; return false; };
  SW.act.pickExp = (el) => { SW.S.pick.exp = el.dataset.id; return false; };

  // 1. Chào mừng
  SW.screen({
    id: "m-onb-welcome", surface: "m", persona: "guest", group: "1 · Onboarding", title: "Chào mừng", stories: ["US-02-01"], flows: ["K1"], bare: true,
    note: "Một hành động chính. Có thể khám phá không cần tài khoản; đăng nhập khi cần đặt chỗ hoặc lưu My Trip.",
    render() {
      return '<main class="m-body m-onb flush" style="background:linear-gradient(170deg,var(--sw-ref-forest-700),var(--sw-ref-forest-950));color:#fff;position:relative">' + '<div style="position:absolute;inset:0;opacity:.3">' + U.contour("w2", 11) + '</div><div style="position:relative;padding:24px 20px;display:flex;flex-direction:column;flex:1;justify-content:space-between">' +
        '<div class="t-disp" style="font-size:20px">Stay Wild</div><div class="col gap3"><h1 class="t-disp" style="font-size:34px;line-height:1.2">Đi để biết,<br>ở lại để hiểu.</h1><p style="opacity:.9;font-size:16px">Khám phá vùng cao cùng người địa phương. AI giúp bạn lên lịch trình, bạn chọn điều bạn thích.</p></div>' +
        '<div class="col gap3">' + U.btn("Bắt đầu với số điện thoại", "accent lg block", 'data-go="m-onb-login"') + U.btn("Xem thử không cần đăng nhập", "ghost block", 'data-go="m-home" data-root style="color:#fff"') + '<p class="t-cap" style="opacity:.8;text-align:center">Tiếp tục nghĩa là bạn đã đọc <a href="#" data-go="m-policy" style="color:#fff">Điều khoản</a> và <a href="#" data-go="m-policy" style="color:#fff">Chính sách quyền riêng tư</a>.</p></div></div></main>';
    },
  });

  // 2. Đăng nhập
  SW.screen({
    id: "m-onb-login", surface: "m", persona: "guest", group: "1 · Onboarding", title: "Đăng nhập", back: true, stories: ["US-02-01", "US-02-12", "US-02-10"], flows: ["K1"],
    note: "Số điện thoại mặc định +84; CAPTCHA chỉ hiện khi hệ thống nghi ngờ (US-02-12). Khóa thiết bị P-256 đăng ký ngầm sau đăng nhập (US-02-11), không hiển thị.",
    render() {
      const err = SW.cur.state === "error";
      return U.field("Số điện thoại", '<div class="row gap2"><span class="c-select" style="width:84px;display:flex;align-items:center;justify-content:center">+84</span>' + U.input({ type: "tel", ph: "9•• ••• •••", bind: "phone", err }) + "</div>", { req: 1, hint: "Chúng tôi gửi mã OTP 6 số qua SMS. Mã có hiệu lực 5 phút (tham số CFG-100).", err: err ? "Số điện thoại không hợp lệ. Nhập 9 hoặc 10 chữ số." : "" }) +
        U.check("ageok", false, "Tôi đủ độ tuổi tối thiểu theo quy định để dùng dịch vụ.") +
        U.alert("info", "Vì sao cần số điện thoại?", "Để xác thực tài khoản và gửi vé/thông báo đặt chỗ. Bạn có thể dùng email thay thế ở màn kế tiếp.") +
        U.btn("Gửi mã OTP", "lg block", 'data-go="m-onb-otp"') + '<div class="c-divider"></div>' + U.btn("Dùng email thay thế", "ghost block", 'data-toast="Đăng nhập bằng email (mô phỏng)"') +
        '<div class="c-stub">Bảo vệ: giới hạn 3 yêu cầu OTP mỗi số mỗi giờ. Vượt giới hạn: “Bạn đã yêu cầu quá nhiều lần, thử lại sau 42 phút.”</div>';
    },
  });

  // 3. OTP
  SW.screen({
    id: "m-onb-otp", surface: "m", persona: "guest", group: "1 · Onboarding", title: "Nhập mã OTP", back: true, stories: ["US-02-01", "US-02-08"], flows: ["K1"],
    note: "Chuyển trạng thái “Lỗi” ở thanh công cụ để xem mã sai; mã đúng trong prototype: bất kỳ 6 số.",
    render() {
      const err = SW.cur.state === "error";
      return '<p>Mã gồm 6 số đã gửi tới <b>+84 9•• ••• 482</b>. <a href="#" data-go="m-onb-login">Đổi số</a></p><div class="m-otp" role="group" aria-label="Mã OTP 6 số">' + [1, 2, 3, 4, 5, 6].map((i) => '<input inputmode="numeric" maxlength="1" aria-label="Chữ số ' + i + '" value="' + (err ? "" : i < 4 ? "•" : "") + '"' + (err ? ' style="border-color:var(--sw-color-error-solid);border-width:2px"' : "") + ">").join("") + "</div>" +
        (err ? '<div class="err c-field" style="align-items:center"><div class="err">' + U.ic("alert", "sm") + "Mã không đúng. Còn 2 lần thử.</div></div>" : '<p class="t-cap muted" style="text-align:center">Gửi lại mã sau <b class="num">00:42</b></p>') +
        U.btn("Xác nhận", "lg block", 'data-go="m-onb-prefs"') + U.btn("Gửi lại mã", "ghost block", 'data-toast="Đã gửi lại mã (mô phỏng)"');
    },
  });

  // 4. Sở thích
  SW.screen({
    id: "m-onb-prefs", surface: "m", persona: "guest", group: "1 · Onboarding", title: "Sở thích du lịch", back: true, stories: ["US-02-03", "US-02-12"], flows: ["K1"],
    note: "Thẻ sở thích dùng cho gợi ý và AI; có thể bỏ qua. Không bắt buộc nhập hồ sơ đầy đủ ở bước này.",
    render() {
      return '<h2 class="t-h2">Bạn thích kiểu chuyến đi nào?</h2><p class="muted">Chọn vài thẻ để gợi ý đúng gu. Bạn đổi được sau trong Hồ sơ.</p>' +
        U.multiChips("prefs", ["Trekking nhẹ", "Ẩm thực địa phương", "Làng nghề", "Săn mây", "Homestay", "Chụp ảnh", "Gia đình có trẻ nhỏ", "Tiết kiệm", "Nghỉ dưỡng", "Lễ hội"]) +
        U.field("Ngân sách thường dùng mỗi người mỗi ngày", U.select([["", "Chọn mức"], ["<1", "Dưới 1 triệu"], ["1-2", "1 đến 2 triệu"], [">2", "Trên 2 triệu"]], { bind: "budget", val: "" })) +
        U.btn("Tiếp tục", "lg block", 'data-go="m-onb-consent"') + U.btn("Bỏ qua", "ghost block", 'data-go="m-onb-consent"');
    },
  });

  // 5. Đồng ý theo mục đích
  SW.screen({
    id: "m-onb-consent", surface: "m", persona: "guest", group: "1 · Onboarding", title: "Quyền riêng tư của bạn", back: true, stories: ["US-19-09", "US-19-14", "US-01-26"], flows: ["K1"],
    note: "Hai mục đích tách riêng, KHÔNG chọn sẵn (DL-BA-057). Hai nút cùng cấp độ nổi bật, không mẫu tối. SOS không bị chặn (tiêu chí 5). Cần xác minh pháp lý NĐ 13/2023.",
    render() {
      const row = (k, t, d) => '<div class="m-consent"><label class="c-switch" style="margin-top:2px"><input type="checkbox" data-bind="' + k + '" ' + (SW.form(k, false) ? "checked" : "") + ' aria-label="' + t + '"><i></i></label><div class="grow"><div class="t-label">' + t + '</div><p class="t-cap muted">' + d + "</p></div></div>";
      return '<h2 class="t-h2">Bạn quyết định dữ liệu nào được dùng</h2><p class="muted">Việc dùng app, đặt chỗ và SOS luôn hoạt động đầy đủ dù bạn chọn gì.</p>' +
        row("c_phantich", "Phân tích để cải thiện app", "Ghi nhận cách bạn dùng màn hình và tính năng (ví dụ bước nào bị bỏ dở) để cải thiện. Không đọc nội dung tin nhắn hay vị trí chính xác của bạn.") +
        row("c_tiepthi", "Tiếp thị và ưu đãi phù hợp", "Cho phép gợi ý ưu đãi và thông báo theo sở thích. Bạn có thể tắt bất cứ lúc nào.") +
        U.card('<div class="row gap3">' + U.ic("shield") + '<div class="t-cap"><b>Thiết yếu, không cần đồng ý riêng:</b> xác thực, đặt chỗ, thanh toán, thông báo giao dịch, an toàn và SOS.</div></div>', "pad flat") +
        '<p class="t-cap muted">Rút lại ở Hồ sơ → Quyền riêng tư. Khi rút, app dừng thu ngay và dữ liệu đã thu được xóa theo chính sách. <a href="#" data-go="m-policy">Đọc chính sách (phiên bản 1.0)</a></p>' +
        '<div class="col gap2">' + U.btn("Lưu lựa chọn của tôi", "lg block", 'data-go="m-home" data-root data-toast="Đã lưu lựa chọn quyền riêng tư"') + U.btn("Tiếp tục không đồng ý", "secondary lg block", 'data-go="m-home" data-root data-toast="Bạn vẫn dùng app đầy đủ"') + "</div>";
    },
  });
})();
