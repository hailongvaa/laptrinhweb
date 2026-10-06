-- =============================================================================
-- BÀI TẬP THỰC HÀNH CSDL - CARMODEL STORE
-- File 02: Nạp dữ liệu mẫu khởi tạo (DML - Data Manipulation Language)
-- Thiết lập: Thành viên 03 (Thanh Mai) & Nhóm 01
-- =============================================================================

USE CarModelStoreDB;
GO

-- 1. Thêm người dùng mẫu (Admin & Khách hàng)
IF NOT EXISTS (SELECT 1 FROM users WHERE id = 1)
BEGIN
    SET IDENTITY_INSERT users ON;
    INSERT INTO users (id, username, password, full_name, email, phone, address, role) VALUES
    (1, 'admin', 'admin123', N'Quản trị viên Hệ thống', 'admin@carstore.vn', '0987654321', N'Tòa nhà Landmark 81, TP.HCM', 'admin'),
    (2, 'nguyenvanan', '123456', N'Nguyễn Văn An', 'nguyenvanan@gmail.com', '0901234567', N'123 Nguyễn Huệ, Quận 1, TP.HCM', 'customer'),
    (3, 'tranbinh', '123456', N'Trần Thị Bình', 'tranbinh@gmail.com', '0918765432', N'456 Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM', 'customer');
    SET IDENTITY_INSERT users OFF;
END
GO

-- 2. Thêm các hãng xe đối tác (brands)
IF NOT EXISTS (SELECT 1 FROM brands WHERE id = 1)
BEGIN
    SET IDENTITY_INSERT brands ON;
    INSERT INTO brands (id, brand_code, name, country, description, total_models) VALUES
    (1, 'BR-FERRARI', N'Ferrari', N'Ý', N'Huyền thoại siêu xe thể thao nước Ý với biểu tượng Tuấn mã tung vó.', 6),
    (2, 'BR-LAMBO', N'Lamborghini', N'Ý', N'Thương hiệu siêu xe thể thao biểu tượng Bò tót dũng mãnh xứ Sant Agata.', 7),
    (3, 'BR-PORSCHE', N'Porsche', N'Đức', N'Đỉnh cao kỹ thuật cơ khí nước Đức với dòng xe thể thao bất hủ 911.', 10),
    (4, 'BR-MERCEDES', N'Mercedes-Benz', N'Đức', N'Biểu tượng ngôi sao ba cánh sang trọng và đẳng cấp từ Stuttgart.', 9),
    (5, 'BR-BMW', N'BMW', N'Đức', N'Cảm giác lái thuần khiết và thiết kế thể thao đột phá xứ Bavaria.', 8),
    (6, 'BR-NISSAN', N'Nissan', N'Nhật Bản', N'Huyền thoại xe đua đường phố JDM và dòng xe Godzilla GT-R.', 13),
    (7, 'BR-HONDA', N'Honda', N'Nhật Bản', N'Đại diện cơ khí bền bỉ cùng biểu tượng tốc độ Civic Type R.', 12);
    SET IDENTITY_INSERT brands OFF;
END
GO

-- 3. Thêm các mẫu xe mô hình (products)
IF NOT EXISTS (SELECT 1 FROM products WHERE id = 1)
BEGIN
    SET IDENTITY_INSERT products ON;
    INSERT INTO products (id, product_code, name, scale, brand_id, manufacturer, car_brand, price, stock_quantity, status, image_url, description, rating, reviews) VALUES
    (1, 'FE-F40-118', N'Ferrari F40 (1987)', '1:18', 1, 'Bburago', 'Ferrari', 2450000.00, 15, 'in_stock', 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80', N'Hợp kim diecast cao cấp mở full cửa, capo và khoang động cơ V8.', 5.0, 18),
    (2, 'LB-HURA-124', N'Lamborghini Huracán STO', '1:24', 2, 'Bburago', 'Lamborghini', 980000.00, 20, 'in_stock', 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80', N'Phiên bản xe đua thương mại khí động học, màu sơn xanh nhám thể thao.', 4.8, 12),
    (3, 'NS-GTR-118', N'Nissan GT-R Skyline R34', '1:18', 6, 'AutoArt', 'Nissan', 1750000.00, 8, 'in_stock', 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80', N'Huyền thoại JDM Godzilla V-Spec II, độ chi tiết siêu thực từ AutoArt.', 4.9, 25),
    (4, 'PO-GT3RS-118', N'Porsche 911 GT3 RS 2023', '1:18', 3, 'AutoArt', 'Porsche', 4500000.00, 10, 'in_stock', 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80', N'Cánh gió thể thao điều chỉnh góc nghiêng, vô-lăng đánh lái chuyển hướng.', 5.0, 31),
    (5, 'MB-G63-118', N'Mercedes-AMG G63 2024', '1:18', 4, 'AutoArt', 'Mercedes-Benz', 5200000.00, 5, 'pre_order', 'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=800&q=80', N'Mô hình SUV biểu tượng sang trọng, nội thất bọc da nhân tạo tinh xảo.', 4.9, 14),
    (6, 'HD-CIVIC-164', N'Honda Civic Type R FL5', '1:64', 7, 'Tomica', 'Honda', 220000.00, 0, 'out_of_stock', 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80', N'Tỉ lệ 1:64 bỏ túi tiện lợi, chi tiết sắc nét từ nhà sản xuất Tomica Limited.', 4.7, 9);
    SET IDENTITY_INSERT products OFF;
END
GO

-- 4. Thêm phụ kiện mẫu (accessories)
IF NOT EXISTS (SELECT 1 FROM accessories WHERE id = 1)
BEGIN
    SET IDENTITY_INSERT accessories ON;
    INSERT INTO accessories (id, accessory_code, name, category, compatible_scale, price, stock_quantity, image_url, description) VALUES
    (1, 'ACC-MICA-01', N'Hộp Mica Cao Cấp Đế Gỗ Cẩm Lai', N'Trưng bày', N'Tương thích: Tỉ lệ 1:18 & 1:24', 450000.00, 30, 'assets/images/accessory-1.jpg', N'Mica Đài Loan siêu trong suốt chống tia UV, đế gỗ sang trọng chống bám bụi.'),
    (2, 'ACC-TURNTABLE-02', N'Đế Xoay Tự Động 360° Có Đèn LED Gương', N'Thiết bị', N'Đường kính 20cm | Tải trọng 2kg', 380000.00, 25, 'assets/images/accessory-2.jpg', N'Đế xoay 2 chiều êm ái dùng pin hoặc cáp USB, bề mặt gương phản chiếu sắc nét.'),
    (3, 'ACC-CLEAN-03', N'Bộ Dung Dịch Lau Bóng & Chổi Phủ Bụi Mô Hình', N'Bảo dưỡng', N'Dùng cho mọi tỉ lệ xe tĩnh', 190000.00, 50, 'assets/images/accessory-3.jpg', N'Chổi lông mềm mịn len lỏi khe hẹp và dung dịch Nano bảo vệ lớp sơn tĩnh điện.'),
    (4, 'ACC-DIORAMA-04', N'Mô Hình Garage RWB Nhật Bản LED 1:64', N'Diorama', N'Tương thích: Chứa được 4 xe 1:64', 620000.00, 15, 'assets/images/accessory-4.jpg', N'Sa bàn bãi đỗ xe phong cách xưởng độ RWB Nhật Bản có hệ thống đèn LED chiếu sáng ban đêm.');
    SET IDENTITY_INSERT accessories OFF;
END
GO

-- 5. Thêm đơn hàng mẫu
IF NOT EXISTS (SELECT 1 FROM orders WHERE order_code = 'ORD-2026-0001')
BEGIN
    INSERT INTO orders (order_code, customer_id, recipient_name, recipient_phone, shipping_address, total_amount, order_status) VALUES
    ('ORD-2026-0001', 2, N'Nguyễn Văn An', '0901234567', N'123 Nguyễn Huệ, Quận 1, TP.HCM', 3430000.00, 'confirmed');

    DECLARE @SampleOrderId INT = SCOPE_IDENTITY();
    INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
    (@SampleOrderId, 1, 1, 2450000.00),
    (@SampleOrderId, 2, 1, 980000.00);
END
GO