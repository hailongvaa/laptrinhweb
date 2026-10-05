USE diecast_car_shop;
GO

-- 1. Thêm khách hàng mẫu
INSERT INTO customers (full_name, email, phone, address) VALUES
(N'Nguyễn Văn An', 'nguyenvanan@gmail.com', '0901234567', N'123 Nguyễn Huệ, Quận 1, TP.HCM'),
(N'Trần Thị Bình', 'tranbinh@gmail.com', '0918765432', N'456 Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM');

-- 2. Thêm sản phẩm xe mô hình mẫu
INSERT INTO products (product_code, name, scale, manufacturer, car_brand, price, stock_quantity, status) VALUES
('AA-GT3RS-118', N'Porsche 911 GT3 RS 2023', '1:18', 'AutoArt', 'Porsche', 4500000.00, 10, 'in_stock'),
('BB-AVENT-124', N'Lamborghini Aventador SVJ', '1:24', 'Bburago', 'Lamborghini', 850000.00, 25, 'in_stock'),
('TC-CIVIC-164', N'Honda Civic Type R FL5', '1:64', 'Tomica', 'Honda', 220000.00, 0, 'out_of_stock'),
('AA-G63-118', N'Mercedes-AMG G63 2024', '1:18', 'AutoArt', 'Mercedes-Benz', 5200000.00, 5, 'pre_order');

-- 3. Thêm đơn hàng mẫu
INSERT INTO orders (order_code, customer_id, recipient_name, recipient_phone, shipping_address, total_amount, order_status) VALUES
('ORD-2026-0001', 1, N'Nguyễn Văn An', '0901234567', N'123 Nguyễn Huệ, Quận 1, TP.HCM', 5350000.00, 'confirmed');

-- 4. Thêm chi tiết đơn hàng mẫu (Đơn ORD-2026-0001 mua 1 Porsche + 1 Lamborghini)
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(1, 1, 1, 4500000.00),
(1, 2, 1, 850000.00);
GO