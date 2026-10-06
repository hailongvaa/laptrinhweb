-- =============================================================================
-- BÀI TẬP THỰC HÀNH CSDL - CARMODEL STORE
-- File 03: Truy vấn kiểm tra và Báo cáo tổng hợp (DQL)
-- Xây dựng: Thành viên 03 (Thanh Mai) & Nhóm 01
-- =============================================================================

USE CarModelStoreDB;
GO

-- 1. Xem danh sách toàn bộ Người dùng & Khách hàng
SELECT * FROM users;

-- 2. Xem danh sách Thương hiệu xe đối tác
SELECT * FROM brands;

-- 3. Xem danh sách Sản phẩm xe mô hình tĩnh
SELECT * FROM products;

-- 4. Xem danh sách Phụ kiện trưng bày
SELECT * FROM accessories;

-- 5. Xem danh sách Đơn đặt hàng
SELECT * FROM orders;

-- 6. Xem Chi tiết đơn hàng
SELECT * FROM order_items;

-- 7. Báo cáo Chi tiết đơn hàng kết nối đa bảng (JOIN: orders + users + order_items + products)
SELECT 
    o.order_code AS [Mã đơn hàng],
    u.full_name AS [Tên khách hàng],
    u.phone AS [SĐT liên hệ],
    p.name AS [Tên xe],
    p.scale AS [Tỉ lệ],
    i.quantity AS [Số lượng mua],
    i.unit_price AS [Đơn giá mua],
    o.total_amount AS [Tổng tiền đơn hàng],
    o.order_status AS [Trạng thái đơn],
    o.created_at AS [Ngày tạo]
FROM orders o
JOIN users u ON o.customer_id = u.id
JOIN order_items i ON o.id = i.order_id
JOIN products p ON i.product_id = p.id
ORDER BY o.created_at DESC;
GO