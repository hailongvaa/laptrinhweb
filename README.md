# DỰ ÁN WEBSITE THƯƠNG MẠI ĐIỆN TỬ BÁN MÔ HÌNH XE Ô TÔ (CARMODEL STORE)
> **Học phần:** Lập trình Web & Ứng dụng Cơ sở Dữ liệu  
> **Giai đoạn:** Bài tập thực hành & Đồ án môn học (Chương 1 & Chương 2)  
> **Nhóm thực hiện:** Nhóm 01  

---

## 📌 I. GIỚI THIỆU KHÁI QUÁT VỀ CHƯƠNG TRÌNH

### 1. Bối cảnh & Mục tiêu đề tài
**CarModel Store** là nền tảng thương mại điện tử chuyên giới thiệu, trưng bày và kinh doanh các dòng mô hình xe ô tô thu nhỏ tĩnh (Scale Model Cars) cao cấp với các tỉ lệ tiêu chuẩn quốc tế: **1:18**, **1:24**, và **1:64**.

Hệ thống được thiết kế hướng tới phân khúc khách hàng đam mê sưu tầm xe mô hình, người yêu thích siêu xe, hoặc người tìm kiếm quà tặng trang trí bàn làm việc cao cấp. Dự án xây dựng một giải pháp hoàn chỉnh từ giao diện mua sắm trực tuyến dành cho khách hàng (Public Store) đến bảng điều khiển quản lý nghiệp vụ kho và bán hàng dành cho chủ cửa hàng (Admin Dashboard).

### 2. Định vị thẩm mỹ & Trải nghiệm (UI/UX Design Concept)
- **Tone màu chủ đạo:** Phong cách *Luxury Charcoal & Platinum* (Than chì kết hợp Bạc kim trang sức và điểm nhấn Vàng kim ánh kim).
- **Tiêu chuẩn công nghệ:**
  - **HTML5 Semantic** chuẩn W3C (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`).
  - **CSS3 hiện đại:** Sử dụng thuần CSS Variables (Design Tokens), Flexbox và CSS Grid Layout linh hoạt, hỗ trợ hiển thị mượt mà trên mọi thiết bị (Responsive).
  - **Vanilla JavaScript & Web Storage:** Tương tác giỏ hàng động, tính tiền tức thì, lưu danh sách yêu thích và tài khoản qua `localStorage` (không phụ thuộc thư viện nặng).
  - **RDBMS SQL Server & REST API:** Thiết kế cơ sở dữ liệu quan hệ chuẩn 3NF và dịch vụ Backend Node.js/Express.

---

## 🗂️ II. CÔNG DỤNG VÀ CHỨC NĂNG CỦA TỪNG BỘ PHẬN TRONG HỆ THỐNG

Hệ thống mã nguồn được tổ chức phân tầng rõ ràng, đảm bảo tính mô-đun hóa, dễ bảo trì và dễ chấm điểm:

```text
d:\laptrinhweb\
│
├── 🌐 Giao diện Khách hàng (Public Store - 12 Trang HTML tại Thư mục gốc)
├── 🏢 Phân hệ Quản trị viên (Admin Module - Thư mục /admin/)
├── 🎨 Tài nguyên Dùng chung (Assets - Thư mục /assets/)
├── 🗄️ Cơ sở Dữ liệu Quan hệ (Database - Thư mục /database/)
├── ⚙️ Máy chủ Dịch vụ Backend (Backend REST API - Thư mục /car-store-backend/)
├── 📦 Lưu trữ Đóng góp Thành viên (Members Contributions - Thư mục /members_contributions/)
└── 📄 Kế hoạch & Nhật ký Hệ thống (Planning & System Logs - /plan/, README.md, logsytem.txt)
```

---

### 1. Giao diện Khách hàng (Public Store)
Nằm trực tiếp tại thư mục gốc, phục vụ trực tiếp người dùng cuối truy cập trải nghiệm và mua sắm:

* [`index.html`](file:///d:/laptrinhweb/index.html) - **Trang chủ:** Banner Slider 4 bộ sưu tập, thương hiệu đối tác nổi bật, khối sản phẩm bán chạy, khu vực xe sắp ra mắt (Pre-order) và chân trang chuẩn hóa.
* [`products.html`](file:///d:/laptrinhweb/products.html) - **Danh mục sản phẩm:** Toàn bộ kho xe mô hình với bộ lọc đa năng Sidebar (theo hãng, tỉ lệ, mức giá) và nút chuyển đổi chế độ hiển thị (Lưới ↔ Bộ sưu tập).
* [`product-detail.html`](file:///d:/laptrinhweb/product-detail.html) - **Chi tiết sản phẩm:** Trưng bày hình ảnh chi tiết, bảng thông số kỹ thuật (hãng sản xuất, chất liệu hợp kim, tỉ lệ, kích thước), đánh giá sao và form gửi bình luận.
* [`accessories.html`](file:///d:/laptrinhweb/accessories.html) - **Phụ kiện mô hình:** Cung cấp tủ trưng bày mica chống bụi, đế xoay tự động, đèn LED chiếu sáng và sa bàn diorama tỉ lệ.
* [`brands.html`](file:///d:/laptrinhweb/brands.html) - **Danh sách thương hiệu:** Giới thiệu các đối tác sản xuất mô hình danh tiếng (Ferrari, Lamborghini, Porsche, Rolls-Royce, Mercedes-Maybach...).
* [`brand-detail.html`](file:///d:/laptrinhweb/brand-detail.html) - **Chi tiết hãng xe:** Trang trưng bày chuyên sâu các mẫu xe thuộc một hãng cụ thể (tiêu biểu là Ferrari Collection).
* [`preorder.html`](file:///d:/laptrinhweb/preorder.html) - **Đặt hàng trước (Pre-order):** Dành riêng cho các phiên bản xe giới hạn (Limited Edition), có huy hiệu riêng và thời gian dự kiến về kho.
* [`cart.html`](file:///d:/laptrinhweb/cart.html) - **Giỏ hàng:** Bảng thống kê mặt hàng chọn mua, cho phép tăng/giảm số lượng bằng nút `[+]`/`[-]`, tự động tính toán lại tạm tính, phí vận chuyển và tổng tiền, kèm nút đặt hàng.
* [`wishlist.html`](file:///d:/laptrinhweb/wishlist.html) - **Danh sách yêu thích:** Lưu trữ và hiển thị các mẫu xe người dùng đã nhấn thả tim `♡`, hỗ trợ xóa trực tiếp từng món khỏi danh sách.
* [`login.html`](file:///d:/laptrinhweb/login.html) - **Đăng nhập:** Hỗ trợ kiểm tra tài khoản khách hàng từ `localStorage` và chuyển tiếp tài khoản Quản trị viên sang Admin.
* [`register.html`](file:///d:/laptrinhweb/register.html) - **Đăng ký:** Tiếp nhận thông tin tài khoản người dùng mới, kiểm tra hợp lệ mật khẩu và lưu vào bộ nhớ trình duyệt.
* [`contact.html`](file:///d:/laptrinhweb/contact.html) - **Liên hệ:** Bản đồ chỉ đường tới Showroom, thông tin hotline hỗ trợ và form gửi thắc mắc đặt mẫu hiếm.

---

### 2. Phân hệ Quản trị viên (Admin Module - `/admin/`)
Dành riêng cho Quản trị viên (Administrator) và Nhân viên vận hành kho (Store Staff) kiểm soát toàn bộ hoạt động kinh doanh:

* [`admin/index.html`](file:///d:/laptrinhweb/admin/index.html) (hoặc `dashboard.html`) - **Bảng điều khiển (Dashboard):** Thống kê nhanh các chỉ số KPI trọng yếu (Doanh thu hôm nay, tổng xe trong kho, hãng hợp tác, đơn hàng mới cần xử lý) và biểu đồ phân tích Pure CSS.
* [`admin/products.html`](file:///d:/laptrinhweb/admin/products.html) - **Quản lý kho mô hình:** Bảng dữ liệu tra cứu tập trung; hỗ trợ tìm kiếm và lọc mô hình; nút chuyển hướng thêm mới hoặc xóa sản phẩm.
* [`admin/product-add.html`](file:///d:/laptrinhweb/admin/product-add.html) - **Thêm/Sửa mô hình:** Biểu mẫu nhập liệu đầy đủ trường (tên xe, mã SKU, hãng, tỉ lệ, giá bán, số lượng tồn kho, link ảnh).
* [`admin/brands.html`](file:///d:/laptrinhweb/admin/brands.html) - **Quản lý thương hiệu:** Danh sách và trạng thái hợp tác của các hãng xe đối tác.
* [`admin/orders.html`](file:///d:/laptrinhweb/admin/orders.html) - **Quản lý đơn hàng:** Theo dõi vòng đời đơn đặt hàng của khách hàng (Đang xử lý, Đang giao, Hoàn thành, Đã hủy).
* [`admin/customers.html`](file:///d:/laptrinhweb/admin/customers.html) - **Quản lý khách hàng:** Danh bạ khách hàng đăng ký mua sản phẩm trên website.
* [`admin/reports.html`](file:///d:/laptrinhweb/admin/reports.html) - **Báo cáo kinh doanh:** Phân tích biểu đồ doanh thu và xu hướng khách hàng.
* [`admin/admin.css`](file:///d:/laptrinhweb/admin/admin.css) - **Stylesheet Quản trị:** Bộ CSS độc lập chuẩn phong cách Dashboard chuyên nghiệp.
* [`admin/admin-auth.js`](file:///d:/laptrinhweb/admin/admin-auth.js) - **Bảo mật phân quyền (RBAC):** Chặn người dùng chưa đăng nhập hoặc khách vãng lai cố tình truy cập khu vực quản trị.

---

### 3. Tài nguyên Dùng chung (Assets - `/assets/`)
* [`assets/css/style.css`](file:///d:/laptrinhweb/assets/css/style.css): File stylesheet gốc định nghĩa toàn bộ bảng màu (Design Tokens), kiểu chữ (Typography), hệ thống nút bấm, thẻ Card xe và bố cục Responsive cho toàn trang.
* [`assets/js/main.js`](file:///d:/laptrinhweb/assets/js/main.js): Xử lý các logic tương tác chung: lưu trữ/xóa sản phẩm yêu thích (Wishlist), chuyển đổi chế độ xem Grid/List, hiển thị thông báo popup Toast.
* [`assets/js/products.js`](file:///d:/laptrinhweb/assets/js/products.js): Nguồn dữ liệu sản phẩm mẫu dự phòng phục vụ duyệt web offline không cần bật máy chủ Backend.

---

### 4. Cơ sở Dữ liệu Quan hệ (Database - `/database/`)
Hệ thống cơ sở dữ liệu quan hệ được thiết kế chuẩn 3NF trên Microsoft SQL Server:
* [`database/00_full_setup.sql`](file:///d:/laptrinhweb/database/00_full_setup.sql): **Kịch bản 1-Click trọn gói** — Tự động tạo Database `CarStoreDB`, thiết lập 4 bảng quan hệ, nạp dữ liệu mẫu và chạy truy vấn báo cáo liên bảng trong 1 lần nhấn F5.
* [`database/01_create_tables.sql`](file:///d:/laptrinhweb/database/01_create_tables.sql): Định nghĩa cấu trúc DDL cho 4 bảng quan hệ:
  1. `customers`: Thông tin khách hàng, số điện thoại, địa chỉ nhận hàng.
  2. `products`: Thông tin sản phẩm xe mô hình, tỉ lệ, giá niêm yết, tồn kho, link ảnh CDN.
  3. `orders`: Đơn đặt hàng, ngày đặt, trạng thái đơn, hình thức thanh toán.
  4. `order_items`: Chi tiết từng sản phẩm trong đơn, số lượng và đơn giá tại thời điểm mua.
* [`database/02_insert_mock_data.sql`](file:///d:/laptrinhweb/database/02_insert_mock_data.sql): Dữ liệu mẫu phong phú với các dòng xe nổi tiếng (Ferrari SF90, Porsche 911 GT3, Rolls-Royce Phantom...) với giá VNĐ thực tế.
* [`database/03_queries_and_reports.sql`](file:///d:/laptrinhweb/database/03_queries_and_reports.sql): Kịch bản truy vấn DQL thực hiện phép `JOIN` 4 bảng để lập báo cáo doanh thu bán hàng chi tiết.

---

### 5. Máy chủ Dịch vụ Backend (Backend REST API - `/car-store-backend/`)
* Xây dựng trên nền tảng **Node.js** và **Express.js**.
* Cung cấp các tuyến API RESTful phục vụ kết nối dữ liệu:
  - `POST /api/auth/login`: Xác thực đăng nhập bằng JWT Token.
  - `GET /api/products`: Trả về danh sách xe mô hình và thông số.
  - `POST /api/orders`: Tiếp nhận đơn đặt hàng từ giỏ hàng.
  - `GET /api/reports`: Cung cấp số liệu thống kê cho Admin Dashboard.
* Hỗ trợ lưu trữ linh hoạt cả tệp JSON (`car-store-backend/data/`) lẫn kết nối trực tiếp đến SQL Server qua ODBC Driver.

---

### 6. Lưu trữ Minh chứng Đóng góp Thành viên (`/members_contributions/`)
Khu vực bảo toàn nguyên vẹn mã nguồn nộp riêng lẻ của từng thành viên để phục vụ chấm điểm và kiểm tra đối chiếu:
* `members_contributions/01_han_cart_and_auth/`: Mã nguồn đóng góp của bạn Hân.
* `members_contributions/02_mai_database_sql/`: Các file kịch bản SQL đóng góp của bạn Mai.
* `members_contributions/03_minh_navigation_and_accessories/`: Mã nguồn đóng góp của bạn Minh.

---

## 👥 III. BẢNG PHÂN CÔNG NHIỆM VỤ CHI TIẾT THEO KẾ HOẠCH NHÓM
*(Căn cứ theo tài liệu phân công chính thức `bangphancong.docx` và các báo cáo cá nhân tại thư mục `plan/`)*

> **Nguyên tắc phân chia:** Mỗi thành viên phụ trách từ 3–5 trang màn hình với độ khó và khối lượng tương đương. Từng thành viên chịu trách nhiệm thiết kế giao diện, đảm bảo liên kết không bị gãy (broken link) và giải thích được chức năng của mình.

| STT / Vai trò | Họ và tên | Trang / Bộ phận phụ trách | Đối tượng phục vụ (Actor) | Công việc cụ thể đã hoàn thành theo phân công |
| :--- | :--- | :--- | :--- | :--- |
| **TV1** *(Trưởng nhóm)* | **Đỗ Thị Phương Linh**<br>*(MSSV: 2531540529)* | • `index.html`<br>• `contact.html`<br>• Khung dùng chung (`header`, `nav`, `footer`)<br>• `assets/css/style.css` | Khách vãng lai (Người yêu thích sưu tầm mô hình) | - Xây dựng khung style gốc (`style.css`), quy chuẩn Design Token bảng màu Charcoal & Platinum dùng chung cho cả nhóm.<br>- Thiết kế Trang chủ (`index.html`) với Slider 4 trang bộ sưu tập, khối thương hiệu đối tác, mô hình bán chạy và xe sắp ra mắt.<br>- Thiết kế Trang liên hệ (`contact.html`) có thông tin showroom, hotline và biểu mẫu tư vấn.<br>- Đảm bảo tính nhất quán của Header, Navigation và Footer trên toàn site. |
| **TV2** | **Quang Minh** | • `brands.html`<br>• `brand-detail.html`<br>• `accessories.html` | Khách vãng lai | - Xây dựng trang danh mục các thương hiệu xe đối tác (`brands.html`) dạng lưới Grid hiện đại.<br>- Thiết kế trang chi tiết 1 hãng chuyên sâu (`brand-detail.html` - Bộ sưu tập Ferrari).<br>- Thiết kế trang phụ kiện mô hình (`accessories.html`) trưng bày tủ mica, đế xoay, đèn LED kèm đánh giá sao và nút yêu thích `♡`.<br>- Chuẩn hóa Header phong cách Luxury cho các trang phụ trách. |
| **TV3** | **Thanh Mai** | • `products.html`<br>• `product-detail.html`<br>• `preorder.html`<br>• Cơ sở dữ liệu (`/database/`) | Khách vãng lai & Khách tìm kiếm sản phẩm | - Xây dựng trang tất cả sản phẩm (`products.html`) với thanh Sidebar lọc đa tiêu chí (theo hãng, tỉ lệ, giá) và nút chuyển chế độ Xem lưới ↔ Xem bộ sưu tập.<br>- Thiết kế trang chi tiết mô hình (`product-detail.html`) có bảng thông số kỹ thuật, đánh giá sao và review.<br>- Thiết kế trang đặt hàng trước (`preorder.html`) với huy hiệu Limited Edition riêng.<br>- Phối hợp với TV4 xây dựng `main.js` (xử lý wishlist & toggle).<br>- Phụ trách thiết kế và lập trình 4 bảng Cơ sở dữ liệu quan hệ SQL Server chuẩn 3NF. |
| **TV4** | **Gia Hân** | • `cart.html`<br>• `login.html`<br>• `register.html`<br>• `wishlist.html` | Khách đã đăng ký & Khách mua hàng | - Thiết kế bảng giỏ hàng (`cart.html`) và khối tóm tắt thanh toán; tích hợp nút tăng giảm số lượng `[+]`/`[-]` tự động tính lại tổng tiền tức thì.<br>- Thiết kế form Đăng nhập (`login.html`) và Đăng ký (`register.html`) chuẩn ngữ nghĩa `<label>` - `<input>`, tích hợp lưu trữ tài khoản vào `localStorage`.<br>- Thiết kế trang Danh sách yêu thích (`wishlist.html`) đọc dữ liệu động từ nút thả tim `♡` kèm tính năng xóa nhanh sản phẩm.<br>- Phối hợp với TV3 hoàn thiện file kịch bản `main.js`. |
| **TV5** | **Nguyễn Hải Long**<br>*(MSSV: 2531540654)* | • Toàn bộ phân hệ `/admin/` (5 trang)<br>• `assets/css/admin.css`<br>• `assets/js/admin-auth.js`<br>• Máy chủ `/car-store-backend/` | Quản trị viên (Admin / Chủ shop / Quản lý kho) | - Xây dựng toàn bộ giao diện phân hệ Quản trị: `dashboard.html`, `products.html`, `product-add.html`, `brands.html`, `orders.html`.<br>- Viết bộ stylesheet độc lập `admin.css` hỗ trợ biểu đồ Pure CSS Bar Chart và Responsive hoàn chỉnh.<br>- Lập trình script kiểm soát phân quyền RBAC (`admin-auth.js`) ngăn chặn khách vãng lai xâm nhập trái phép.<br>- Phát triển máy chủ Backend Node.js / Express RESTful API kết nối cơ sở dữ liệu.<br>- Tổng hợp, rà soát liên kết toàn bộ dự án, tái cấu trúc cây thư mục sạch đẹp và viết tài liệu hệ thống `logsytem.txt` & `README.md`. |

---

## 🚀 IV. HƯỚNG DẪN CÀI ĐẶT VÀ VẬN HÀNH

### 1. Khởi chạy Giao diện Khách hàng (Frontend)
- **Cách đơn giản nhất:** Mở trực tiếp file [`index.html`](file:///d:/laptrinhweb/index.html) bằng bất kỳ trình duyệt nào (Google Chrome, Microsoft Edge, Firefox, Cốc Cốc).
- **Cách chuyên nghiệp:** Cài đặt Extension **Live Server** trên Visual Studio Code, chuột phải vào `index.html` và chọn **"Open with Live Server"**.

### 2. Cài đặt Cơ sở Dữ liệu (Microsoft SQL Server)
1. Khởi động ứng dụng **SQL Server Management Studio (SSMS)**.
2. Kết nối tới SQL Server Instance của bạn (ví dụ: `localhost` hoặc `.` hoặc `SQLEXPRESS`).
3. Mở file kịch bản: [`database/00_full_setup.sql`](file:///d:/laptrinhweb/database/00_full_setup.sql).
4. Nhấn phím **F5** (hoặc bấm nút **Execute**). Kịch bản sẽ tự động khởi tạo cơ sở dữ liệu `CarStoreDB`, tạo 4 bảng chuẩn 3NF, chèn dữ liệu mẫu và chạy truy vấn báo cáo liên bảng.

### 3. Vận hành Máy chủ Dịch vụ Backend (Tùy chọn nâng cao)
1. Mở cửa sổ Terminal / PowerShell tại thư mục backend:
   ```bash
   cd d:\laptrinhweb\car-store-backend
   ```
2. Cài đặt các gói thư viện cần thiết:
   ```bash
   npm install
   ```
3. Khởi động máy chủ:
   ```bash
   npm start
   ```
   *Máy chủ API sẽ sẵn sàng lắng nghe tại địa chỉ: `http://localhost:5000`*

### 4. Đăng nhập và Kiểm tra Phân hệ Quản trị (Admin)
- Truy cập trực tiếp: [`admin/index.html`](file:///d:/laptrinhweb/admin/index.html) hoặc đăng nhập thông qua trang [`login.html`](file:///d:/laptrinhweb/login.html).
- **Tài khoản quản trị viên mặc định:**
  - **Email:** `admin@carstore.vn`
  - **Mật khẩu:** `admin123`

---

## 📑 V. TÀI LIỆU VÀ NHẬT KÝ LIÊN QUAN

* [`logsytem.txt`](file:///d:/laptrinhweb/logsytem.txt) *(hoặc [`logsystem.txt`](file:///d:/laptrinhweb/logsystem.txt))*: Nhật ký tổng thể hệ thống, chi tiết toàn bộ các lần tinh gọn mã nguồn, bảng đối chiếu trước - sau và các giải pháp kỹ thuật đã áp dụng.
* [`log.txt`](file:///d:/laptrinhweb/log.txt)*: Nhật ký tích hợp chi tiết các đóng góp của Hân, Mai, Minh.
* [`plan/bangphancong.docx`](file:///d:/laptrinhweb/plan/bangphancong.docx)*: Bảng phân chia công việc chính thức có chữ ký và kế hoạch của Nhóm 01.
* [`plan/BaoCao_CaNhan_TV5_NguyenHaiLong_2531540654.docx`](file:///d:/laptrinhweb/plan/BaoCao_CaNhan_TV5_NguyenHaiLong_2531540654.docx)*: Báo cáo cá nhân chi tiết của Thành viên 05.
