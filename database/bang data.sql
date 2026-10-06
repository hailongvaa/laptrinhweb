-- =============================================================================
-- XEM DANH SÁCH DỮ LIỆU CÁC BẢNG TRONG HỆ THỐNG CARMODEL STORE
-- File truy vấn kiểm tra dữ liệu đồng bộ với toàn bộ chương trình
-- Bao gồm: Người dùng, Hãng xe, Xe mô hình, Phụ kiện, Đơn hàng & Chi tiết
-- =============================================================================

-- Tự động chọn CSDL CarModelStoreDB (hoặc car_order_db nếu đang dùng tên cũ)
IF EXISTS (SELECT 1 FROM sys.databases WHERE name = 'CarModelStoreDB')
    USE CarModelStoreDB;
ELSE IF EXISTS (SELECT 1 FROM sys.databases WHERE name = 'car_order_db')
    USE car_order_db;
GO

-- 1. Bảng Người dùng & Khách hàng (users) - Phục vụ login, register, admin
PRINT '=== 1. DANH SÁCH TÀI KHOẢN NGƯỜI DÙNG (USERS) ===';
SELECT 
    id AS [ID],
    username AS [Tên đăng nhập],
    full_name AS [Họ và tên],
    email AS [Email],
    phone AS [Số điện thoại],
    address AS [Địa chỉ],
    role AS [Vai trò],
    created_at AS [Ngày tạo]
FROM users;
GO

-- 2. Bảng Thương hiệu đối tác (brands) - Phục vụ trang brands.html & brand-detail.html
PRINT '=== 2. DANH SÁCH THƯƠNG HIỆU XE (BRANDS) ===';
SELECT 
    id AS [ID],
    brand_code AS [Mã hãng],
    name AS [Tên thương hiệu],
    country AS [Quốc gia],
    total_models AS [Số mẫu xe],
    description AS [Mô tả ngắn]
FROM brands;
GO

-- 3. Bảng Sản phẩm xe mô hình (products) - Phục vụ trang products.html, product-detail.html
PRINT '=== 3. DANH SÁCH SẢN PHẨM MÔ HÌNH XE (PRODUCTS) ===';
SELECT 
    p.id AS [ID],
    p.product_code AS [Mã SKU],
    p.name AS [Tên mô hình xe],
    p.scale AS [Tỉ lệ],
    p.manufacturer AS [Nhà sản xuất],
    p.car_brand AS [Hãng xe],
    FORMAT(p.price, 'N0') + ' đ' AS [Giá bán],
    p.stock_quantity AS [Tồn kho],
    p.status AS [Trạng thái],
    p.rating AS [Đánh giá sao]
FROM products p;
GO

-- 4. Bảng Phụ kiện trưng bày (accessories) - Phục vụ trang accessories.html
PRINT '=== 4. DANH SÁCH PHỤ KIỆN TRƯNG BÀY (ACCESSORIES) ===';
SELECT 
    id AS [ID],
    accessory_code AS [Mã phụ kiện],
    name AS [Tên phụ kiện],
    category AS [Phân loại],
    compatible_scale AS [Tỉ lệ tương thích],
    FORMAT(price, 'N0') + ' đ' AS [Đơn giá],
    stock_quantity AS [Tồn kho]
FROM accessories;
GO

-- 5. Bảng Đơn đặt hàng (orders) - Phục vụ lưu đơn từ cart.html & admin/orders.html
PRINT '=== 5. DANH SÁCH ĐƠN ĐẶT HÀNG (ORDERS) ===';
SELECT 
    id AS [ID],
    order_code AS [Mã đơn hàng],
    customer_id AS [ID Khách],
    recipient_name AS [Người nhận],
    recipient_phone AS [SĐT nhận],
    shipping_address AS [Địa chỉ giao],
    FORMAT(total_amount, 'N0') + ' đ' AS [Tổng tiền],
    order_status AS [Trạng thái],
    created_at AS [Thời gian đặt]
FROM orders;
GO

-- 6. Bảng Chi tiết đơn hàng (order_items) - Nối giữa Đơn hàng và Xe mô hình
PRINT '=== 6. DANH SÁCH CHI TIẾT ĐƠN HÀNG (ORDER_ITEMS) ===';
SELECT 
    i.id AS [ID],
    i.order_id AS [Mã ID Đơn],
    o.order_code AS [Mã đơn hàng],
    p.name AS [Tên sản phẩm xe],
    i.quantity AS [Số lượng],
    FORMAT(i.unit_price, 'N0') + ' đ' AS [Đơn giá mua],
    FORMAT(i.quantity * i.unit_price, 'N0') + ' đ' AS [Thành tiền]
FROM order_items i
JOIN orders o ON i.order_id = o.id
LEFT JOIN products p ON i.product_id = p.id;
GO

-- 7. Truy vấn Tổng hợp Báo cáo: Kết nối Khách hàng + Đơn hàng + Chi tiết sản phẩm
PRINT '=== 7. BÁO CÁO TOÀN DIỆN: KHÁCH HÀNG - ĐƠN HÀNG - SẢN PHẨM ===';
SELECT 
    o.order_code AS [Mã đơn],
    u.full_name AS [Khách đặt],
    o.recipient_name AS [Người nhận hàng],
    o.recipient_phone AS [SĐT liên hệ],
    p.name AS [Sản phẩm chọn mua],
    p.scale AS [Tỉ lệ],
    i.quantity AS [SL],
    FORMAT(i.unit_price, 'N0') + ' đ' AS [Đơn giá],
    FORMAT(o.total_amount, 'N0') + ' đ' AS [Tổng đơn hàng],
    o.order_status AS [Trạng thái đơn],
    o.created_at AS [Ngày đặt hàng]
FROM orders o
JOIN users u ON o.customer_id = u.id
JOIN order_items i ON o.id = i.order_id
LEFT JOIN products p ON i.product_id = p.id
ORDER BY o.created_at DESC;
GO