# Website Ôn Tập & Sát Hạch Lý Thuyết Lái Xe (600 Câu Hỏi GPLX)

Ứng dụng web được xây dựng bằng **React** và **Node.js (Express)**, mô phỏng chân thực **giao diện và cơ chế phần mềm thi sát hạch lý thuyết của Cục Đường Bộ Việt Nam**.

---

## 🌟 Tính năng nổi bật

### 1. Phòng thi sát hạch chuẩn Cục Đường Bộ
* **Giao diện đặc trưng của phần mềm thi chính thức**: Banner Cục Đường Bộ, bảng thẻ thí sinh (ảnh 3x4, SBD, họ tên, khóa thi, hạng xe), đồng hồ đếm ngược số to LED điện tử.
* **Bảng câu hỏi kiểu truyền thống**: Hiển thị lưới câu hỏi kèm trạng thái `[ 1 ]`, `[ 2 ]`, `[   ]` chuẩn như máy tính phòng thi.
* **Hỗ trợ đầy đủ phím tắt bàn phím**:
  * Phím số `1`, `2`, `3`, `4`: Chọn / bỏ chọn nhanh đáp án.
  * Phím `↑`, `←`: Quay lại câu trước.
  * Phím `↓`, `→` hoặc `Enter`: Chuyển sang câu kế tiếp.
  * Nút chuyển chế độ **Toàn màn hình (F11)** để tạo trải nghiệm giống hệt máy thi thật.
* **Hỗ trợ thi các hạng**: B1 (30 câu - 20p), B2 (35 câu - 22p), C (40 câu - 24p), A1 & A2 (25 câu - 19p), D-E-F (45 câu - 26p).
* **Quy chế chấm điểm chính thức**: Tự động tính điểm đạt/trượt và kiểm tra điều kiện câu điểm liệt (sai 1 câu điểm liệt sẽ trượt ngay).
* **Màn hình xem lại bài thi**: Hiển thị câu thí sinh chọn vs đáp án đúng của Cục Đường Bộ, kèm giải thích chi tiết theo Luật Trật tự ATGT đường bộ.

### 2. Ôn tập 600 câu hỏi toàn diện
* Phân chia theo 6 chương chuẩn:
  1. Chương 1: Quy tắc giao thông đường bộ (180 câu)
  2. Chương 2: Đạo đức & Văn hóa lái xe (25 câu)
  3. Chương 3: Kỹ thuật lái xe (58 câu)
  4. Chương 4: Cấu tạo & Sửa chữa xe (37 câu)
  5. Chương 5: Báo hiệu đường bộ (185 câu)
  6. Chương 6: Giải thế sa hình & xử lý tình huống (115 câu)
* Hiển thị đáp án và lời giải thích chi tiết ngay khi chọn.
* Hỗ trợ tìm kiếm theo từ khóa hoặc mã câu hỏi.
* Phóng to hình ảnh sa hình, biển báo sắc nét (LightBox).

### 3. Ôn riêng 60 câu điểm liệt
* Chuyên mục dành riêng cho 60 câu hỏi tình huống mất an toàn giao thông nghiêm trọng.

---

## 📁 Cấu trúc thư mục

```
Website_THI_LT_ONLINE/
├── data/
│   ├── questions.json      # Dataset 600 câu hỏi GPLX chuẩn kèm lời giải thích
│   └── images/             # 318 hình ảnh sa hình, biển báo (.webp)
├── server/
│   ├── server.js           # Node.js Express API server
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx             # Banner Cục Đường Bộ & thanh điều hướng
│   │   │   ├── ExamScreen.jsx         # Giao diện phòng thi chuẩn Cục Đường Bộ
│   │   │   ├── ExamResultModal.jsx    # Bảng chứng chỉ điểm thi Đạt / Không đạt
│   │   │   ├── ExamReview.jsx         # Giao diện xem lại chi tiết bài làm
│   │   │   ├── StudyScreen.jsx        # Giao diện ôn tập theo 6 chương
│   │   │   ├── HelpModal.jsx          # Bảng hướng dẫn phím tắt sát hạch
│   │   │   └── ImageLightboxModal.jsx # Modal phóng to hình ảnh sa hình/biển báo
│   │   ├── App.jsx
│   │   ├── index.css                  # Bảng màu và kiểu dáng phần mềm sát hạch
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
└── package.json
```

---

## 🚀 Hướng dẫn khởi chạy

### Bước 1: Khởi động Backend Server
Mở một cửa sổ dòng lệnh (Terminal / PowerShell) tại thư mục dự án và chạy:
```bash
npm run server
```
Server sẽ chạy tại: `http://localhost:5000`

### Bước 2: Khởi động Frontend Client (React)
Mở một cửa sổ dòng lệnh thứ hai tại thư mục dự án và chạy:
```bash
npm run client
```
Giao diện web sẽ sẵn sàng tại: `http://localhost:3000`
