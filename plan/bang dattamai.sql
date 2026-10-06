-- =============================================================================
-- XEM DANH SÁCH DỮ LIỆU CÁC BẢNG TRONG HỆ THỐNG CARMODEL STORE (BẢN MAI ĐÃ ĐỒNG BỘ)
-- Tự động chọn CSDL CarModelStoreDB (hoặc car_order_db)
-- =============================================================================

IF EXISTS (SELECT 1 FROM sys.databases WHERE name = 'CarModelStoreDB')
    USE CarModelStoreDB;
ELSE IF EXISTS (SELECT 1 FROM sys.databases WHERE name = 'car_order_db')
    USE car_order_db;
GO

-- 1. Xem danh sách Tài khoản & Khách hàng
SELECT * FROM users;

-- 2. Xem danh sách Thương hiệu xe
SELECT * FROM brands;

-- 3. Xem danh sách Mô hình xe
SELECT * FROM products;

-- 4. Xem danh sách Phụ kiện trưng bày
SELECT * FROM accessories;

-- 5. Xem danh sách Đơn hàng
SELECT * FROM orders;

-- 6. Xem Chi tiết đơn hàng
SELECT * FROM order_items;
GO