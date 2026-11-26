# DVA-C02 English

Web tĩnh học cụm từ tiếng Anh cho kỳ thi AWS Certified Developer – Associate (DVA-C02), có nghĩa tiếng Việt.

## Chạy
Mở trực tiếp `index.html` bằng trình duyệt (Chrome/Edge/Safari). Không cần cài đặt gì.
Tùy chọn: `npx serve .` hoặc `python3 -m http.server` rồi mở `http://localhost:8000`.

## Cấu trúc
- `js/data.js`: toàn bộ nội dung (cụm từ, công thức câu, tín hiệu đề). Thêm từ = thêm 1 dòng.
- `js/srs.js`: thuật toán lặp lại ngắt quãng (hộp Leitner 1→2→4→7→15→30 ngày).
- `js/app.js`: giao diện và các dạng bài tập.
- `css/style.css`: giao diện (tự động sáng/tối).

Tiến độ lưu trong localStorage của trình duyệt; vào ⚙️ Cài đặt để xuất/nhập file sao lưu.
