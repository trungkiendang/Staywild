/* DỮ LIỆU MẪU GIẢ LẬP. Tên người, tên doanh nghiệp, số điện thoại, số tiền đều bịa ra cho prototype.
   Không chứa thông tin cá nhân thật; địa danh là tên địa lý công khai. */
(function () {
  const SW = window.SW;
  SW.D = {
    me: { name: "Nguyễn Khánh Linh", phone: "09•• ••• 482", email: "khanh.linh@example.test" },
    dests: [
      { id: "sapa", n: "Sa Pa", p: "Lào Cai", r: 4.7, rc: 312, tag: "Núi", w: "14°C · Nhiều mây", d: "Ruộng bậc thang, bản làng người Mông và Dao, mùa lúa chín vàng từ cuối tháng 9 đến tháng 10." },
      { id: "hagiang", n: "Hà Giang", p: "Hà Giang", r: 4.8, rc: 205, tag: "Cung đường", w: "17°C · Có mưa nhỏ", d: "Cao nguyên đá, đèo Mã Pí Lèng, mùa hoa tam giác mạch tháng 11." },
      { id: "dalat", n: "Đà Lạt", p: "Lâm Đồng", r: 4.5, rc: 418, tag: "Rừng thông", w: "19°C · Quang đãng", d: "Đồi thông, hồ và vườn hoa; khí hậu mát quanh năm." },
      { id: "hoian", n: "Hội An", p: "Quảng Nam", r: 4.6, rc: 377, tag: "Phố cổ", w: "27°C · Nắng nhẹ", d: "Phố cổ, làng nghề gốm và rau Trà Quế, đèn lồng về đêm." },
      { id: "mcc", n: "Mù Cang Chải", p: "Yên Bái", r: 4.8, rc: 96, tag: "Ruộng bậc thang", w: "16°C · Nhiều mây", d: "Ruộng bậc thang được công nhận di tích quốc gia đặc biệt." },
    ],
    exps: [
      { id: "e1", n: "Trekking bản Tả Van cùng người Giáy", dest: "sapa", price: 450000, dur: "6 giờ", by: "Lò Văn Sáng · Người dân", r: 4.9, rc: 58, kind: "resident", label: "Đã xác minh bởi Địa phương" },
      { id: "e2", n: "Lớp nhuộm chàm và thêu thổ cẩm", dest: "sapa", price: 320000, dur: "3 giờ", by: "Hợp tác xã Chàm Xanh", r: 4.7, rc: 41, kind: "provider" },
      { id: "e3", n: "Cung đường Hà Giang 3 ngày 2 đêm (xe máy có tài xế)", dest: "hagiang", price: 3200000, dur: "3 ngày", by: "Công ty Lữ hành Đá Xám", r: 4.8, rc: 102, kind: "provider" },
      { id: "e4", n: "Đạp xe làng rau và lớp nấu ăn", dest: "hoian", price: 590000, dur: "4 giờ", by: "Bếp Nhà Bà Tư", r: 4.6, rc: 77, kind: "provider" },
      { id: "e5", n: "Săn mây Đà Lạt bình minh", dest: "dalat", price: 380000, dur: "4 giờ", by: "Trần Gia Bảo · Creator", r: 4.4, rc: 33, kind: "creator" },
    ],
    svcs: [
      { id: "s1", n: "Tour Tả Van nửa ngày (nhóm tối đa 8)", price: 450000, left: 5, slot: ["08:00", "13:30"] },
      { id: "s2", n: "Homestay bản Tả Van, 1 đêm, bữa tối", price: 380000, left: 2, slot: ["Nhận phòng 14:00"] },
      { id: "s3", n: "Xe đưa đón Sa Pa – bản (khứ hồi)", price: 250000, left: 0, slot: ["07:30"] },
    ],
    bookings: [
      { id: "BK-260412", who: "Nguyễn Khánh Linh", svc: "Tour Tả Van nửa ngày", date: "07/11/2026", pax: 2, amt: 900000, st: "Chờ xác nhận", k: "warning" },
      { id: "BK-260409", who: "Phạm Quốc Huy", svc: "Homestay bản Tả Van", date: "08/11/2026", pax: 3, amt: 1140000, st: "Đã xác nhận", k: "info" },
      { id: "BK-260401", who: "Lê Thu Trang", svc: "Tour Tả Van nửa ngày", date: "02/11/2026", pax: 4, amt: 1800000, st: "Đã thanh toán", k: "success" },
      { id: "BK-260388", who: "Đỗ Hải Nam", svc: "Xe đưa đón Sa Pa", date: "30/10/2026", pax: 2, amt: 500000, st: "Hoàn thành", k: "success" },
      { id: "BK-260377", who: "Vũ Mai Phương", svc: "Tour Tả Van nửa ngày", date: "29/10/2026", pax: 1, amt: 450000, st: "Hết hạn thanh toán", k: "error" },
    ],
    mod: [
      { id: "MD-1041", type: "Trải nghiệm", title: "Nấu cơm lam và bánh ngô cùng mẹ Páo", by: "Giàng A Páo (Người dân)", prov: "Lào Cai", sla: "Còn 5 giờ", slak: "success", step: "Chờ Địa phương" },
      { id: "MD-1040", type: "Dịch vụ", title: "Homestay Suối Vàng, phòng đôi", by: "Homestay Suối Vàng", prov: "Lào Cai", sla: "Còn 1 giờ", slak: "warning", step: "Chờ Kiểm duyệt" },
      { id: "MD-1038", type: "Bài viết", title: "5 điểm săn mây Mù Cang Chải", by: "Trần Gia Bảo (Creator)", prov: "Yên Bái", sla: "Quá SLA 2 giờ", slak: "error", step: "Chờ Kiểm duyệt" },
      { id: "MD-1036", type: "Đánh giá", title: "Đánh giá 1 sao: “Hướng dẫn viên đến muộn”", by: "Khách ẩn danh", prov: "Hà Giang", sla: "Còn 8 giờ", slak: "success", step: "Chờ Kiểm duyệt" },
      { id: "MD-1033", type: "Điểm đến", title: "Thác Bạc (cập nhật mô tả)", by: "Cán bộ Lào Cai", prov: "Lào Cai", sla: "Còn 20 giờ", slak: "success", step: "Chờ Admin duyệt" },
    ],
    users: [
      { n: "Nguyễn Thị Hồng Hạnh", role: "Admin tỉnh", prov: "Lào Cai", mfa: true, st: "Hoạt động" },
      { n: "Trần Đức Long", role: "Kiểm duyệt", prov: "Lào Cai, Hà Giang", mfa: true, st: "Hoạt động" },
      { n: "Phan Thu Hiền", role: "Kế toán / Đối soát", prov: "Toàn quốc", mfa: true, st: "Hoạt động" },
      { n: "Bùi Quang Vinh", role: "CSKH", prov: "Lâm Đồng", mfa: false, st: "Chờ bật MFA" },
      { n: "Hoàng Lan Chi", role: "Safety Center (lead)", prov: "Lào Cai", mfa: true, st: "Đang trực" },
    ],
    kyc: [
      { id: "KYC-318", n: "Công ty TNHH Lữ hành Đá Xám", type: "Doanh nghiệp", prov: "Hà Giang", st: "Chờ xác minh", docs: ["Giấy ĐKKD", "Giấy phép lữ hành", "Tài khoản ngân hàng"] },
      { id: "KYC-317", n: "Homestay Suối Vàng", type: "Cá nhân kinh doanh", prov: "Lào Cai", st: "Cần bổ sung", docs: ["CCCD (che)", "Giấy xác nhận lưu trú"] },
      { id: "KYC-312", n: "Bếp Nhà Bà Tư", type: "Cá nhân kinh doanh", prov: "Quảng Nam", st: "Đã xác minh", docs: ["CCCD (đã xóa theo chính sách)", "ATVSTP"] },
    ],
    notifs: [
      { t: "Booking BK-260412 chờ Provider xác nhận", d: "5 phút trước", ic: "ticket", un: true },
      { t: "Cảnh báo thời tiết: mưa lớn tại Sa Pa 31/10", d: "1 giờ trước", ic: "rain", un: true },
      { t: "Trải nghiệm “Trekking Tả Van” đã được duyệt", d: "Hôm qua", ic: "check" },
      { t: "Nhắc đánh giá chuyến Đà Lạt", d: "2 ngày trước", ic: "star" },
    ],
    sos: [
      { id: "SOS-0087", prov: "Lào Cai", who: "Khách “M.A.”", loc: "Cách Sa Pa 6 km", age: "cập nhật 8 giây trước", wait: "00:42", st: "Chưa tiếp nhận", mode: "tiep_nhan", fell: false },
      { id: "SOS-0086", prov: "Hà Giang", who: "Khách “T.H.”", loc: "Đèo Mã Pí Lèng", age: "vị trí cũ 12 phút", wait: "03:10", st: "Rơi về chuyển tiếp", mode: "chuyen_tiep", fell: true },
      { id: "SOS-0085", prov: "Lào Cai", who: "Khách “Q.H.”", loc: "Bản Cát Cát", age: "cập nhật 20 giây trước", wait: "—", st: "Đang xử lý", mode: "tiep_nhan", fell: false },
      { id: "SOS-0081", prov: "Lâm Đồng", who: "Khách “L.T.”", loc: "Hồ Tuyền Lâm", age: "—", wait: "—", st: "Đã đóng", mode: "chuyen_tiep", fell: false },
    ],
    cfg: [
      { c: "CFG-004", n: "Hạn thanh toán sau khi Provider xác nhận (giữ chỗ)", dom: "Booking", v: "60 phút", sc: "Toàn hệ thống", st: "Hiện hành", flags: ["M"] },
      { c: "CFG-087", n: "Chu kỳ gửi lại SOS ngoại tuyến", dom: "SOS", v: "15 giây, giãn dần tới 2 phút", sc: "Toàn hệ thống", st: "Hiện hành", flags: ["D2"] },
      { c: "CFG-083", n: "Số liên hệ khẩn cấp tối đa", dom: "SOS", v: "3", sc: "Toàn hệ thống", st: "Hiện hành", flags: ["D2"] },
      { c: "CFG-084", n: "Danh sách số khẩn cấp quốc gia", dom: "SOS", v: "112, 113, 114, 115", sc: "Toàn hệ thống", st: "Hiện hành", flags: ["Khóa pháp lý"] },
      { c: "CFG-100", n: "Độ dài và hiệu lực OTP", dom: "Xác thực", v: "6 số · 5 phút", sc: "Toàn hệ thống", st: "Hiện hành", flags: ["D2"] },
      { c: "CFG-143", n: "Mức hoàn tối đa CSKH cấp 1", dom: "Hủy / hoàn", v: "30% giá booking", sc: "Toàn hệ thống", st: "Chờ duyệt", flags: ["D2", "M"] },
      { c: "CFG-189", n: "Chế độ duyệt trải nghiệm người dân của tỉnh", dom: "Kiểm duyệt", v: "dia_phuong_roi_admin", sc: "Lào Cai", st: "Hiện hành", flags: ["D2"] },
    ],
  };
  SW.D.fmtDate = (d) => d;
})();
