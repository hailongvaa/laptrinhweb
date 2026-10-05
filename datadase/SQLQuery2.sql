-- =============================================================================
-- HỆ THỐNG CƠ SỞ DỮ LIỆU BÁN MÔ HÌNH XE Ô TÔ (CARMODEL STORE)
-- Thiết kế hoàn chỉnh 4 bảng chuẩn hóa: Bạn Mai (Thanh Mai)
-- Tích hợp vào hệ thống máy chủ Backend Node.js / SQL Server
-- =============================================================================

-- 1. Tạo Cơ sở dữ liệu (Nếu chưa có)
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'car_order_db')
BEGIN
    CREATE DATABASE car_order_db;
END
GO

USE car_order_db;
GO

-- 2. Bảng Khách hàng (customers) - Thiết kế bởi Mai
IF OBJECT_ID('customers', 'U') IS NULL
CREATE TABLE customers (
    id INT IDENTITY(1,1) PRIMARY KEY,
    full_name NVARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15) UNIQUE,
    address NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE()
);
GO

-- 3. Bảng Sản phẩm xe mô hình (products) - Thiết kế bởi Mai
IF OBJECT_ID('products', 'U') IS NULL
CREATE TABLE products (
    id INT IDENTITY(1,1) PRIMARY KEY,
    product_code VARCHAR(50) NOT NULL UNIQUE,
    name NVARCHAR(255) NOT NULL,
    scale VARCHAR(10) NOT NULL,
    manufacturer NVARCHAR(100) NOT NULL,
    car_brand NVARCHAR(100) NOT NULL,
    price DECIMAL(12, 2) NOT NULL DEFAULT 0,
    stock_quantity INT NOT NULL DEFAULT 0,
    status NVARCHAR(20) CHECK (status IN ('in_stock', 'pre_order', 'out_of_stock')) DEFAULT 'in_stock',
    created_at DATETIME DEFAULT GETDATE()
);
GO

-- 4. Bảng Đơn hàng (orders) - Khóa ngoại nối với bảng customers
IF OBJECT_ID('orders', 'U') IS NULL
CREATE TABLE orders (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_code VARCHAR(30) NOT NULL UNIQUE,
    customer_id INT NOT NULL,
    recipient_name NVARCHAR(100) NOT NULL,
    recipient_phone VARCHAR(15) NOT NULL,
    shipping_address NVARCHAR(MAX) NOT NULL,
    total_amount DECIMAL(14, 2) NOT NULL DEFAULT 0,
    order_status NVARCHAR(20) CHECK (order_status IN ('pending', 'confirmed', 'shipping', 'delivered', 'cancelled')) DEFAULT 'pending',
    created_at DATETIME DEFAULT GETDATE(),
    
    CONSTRAINT fk_orders_customers FOREIGN KEY (customer_id) REFERENCES customers(id)
);
GO

-- 5. Bảng Chi tiết đơn hàng (order_items) - Khóa ngoại nối orders & products
IF OBJECT_ID('order_items', 'U') IS NULL
CREATE TABLE order_items (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0) DEFAULT 1,
    unit_price DECIMAL(12, 2) NOT NULL,

    CONSTRAINT fk_items_orders FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_items_products FOREIGN KEY (product_id) REFERENCES products(id)
);
GO

-- =============================================================================
-- DỮ LIỆU MẪU KHỞI TẠO (MOCK DATA) - Do Mai thiết lập
-- =============================================================================

-- Thêm khách hàng mẫu (đảm bảo customer_id = 1 cho Backend API)
IF NOT EXISTS (SELECT 1 FROM customers WHERE id = 1)
BEGIN
    SET IDENTITY_INSERT customers ON;
    INSERT INTO customers (id, full_name, email, phone, address) VALUES
    (1, N'Nguyễn Văn An', 'nguyenvanan@gmail.com', '0901234567', N'123 Nguyễn Huệ, Quận 1, TP.HCM'),
    (2, N'Trần Thị Bình', 'tranbinh@gmail.com', '0918765432', N'456 Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM');
    SET IDENTITY_INSERT customers OFF;
END
GO

-- Thêm các mẫu xe mô hình
IF NOT EXISTS (SELECT 1 FROM products WHERE id = 1)
BEGIN
    SET IDENTITY_INSERT products ON;
    INSERT INTO products (id, product_code, name, scale, manufacturer, car_brand, price, stock_quantity, status) VALUES
    (1, 'FE-F40-118', N'Ferrari F40 (1987)', '1:18', 'Bburago', 'Ferrari', 2450000.00, 15, 'in_stock'),
    (2, 'LB-HURA-124', N'Lamborghini Huracán STO', '1:24', 'Bburago', 'Lamborghini', 980000.00, 20, 'in_stock'),
    (3, 'NS-GTR-118', N'Nissan GT-R Skyline R34', '1:18', 'AutoArt', 'Nissan', 1750000.00, 8, 'in_stock'),
    (4, 'PO-GT3RS-118', N'Porsche 911 GT3 RS 2023', '1:18', 'AutoArt', 'Porsche', 4500000.00, 10, 'in_stock'),
    (5, 'MB-G63-118', N'Mercedes-AMG G63 2024', '1:18', 'AutoArt', 'Mercedes-Benz', 5200000.00, 5, 'pre_order'),
    (6, 'HD-CIVIC-164', N'Honda Civic Type R FL5', '1:64', 'Tomica', 'Honda', 220000.00, 0, 'out_of_stock');
    SET IDENTITY_INSERT products OFF;
END
GO

-- Thêm đơn hàng mẫu
IF NOT EXISTS (SELECT 1 FROM orders WHERE order_code = 'ORD-2026-0001')
BEGIN
    INSERT INTO orders (order_code, customer_id, recipient_name, recipient_phone, shipping_address, total_amount, order_status) VALUES
    ('ORD-2026-0001', 1, N'Nguyễn Văn An', '0901234567', N'123 Nguyễn Huệ, Quận 1, TP.HCM', 3430000.00, 'confirmed');

    DECLARE @SampleOrderId INT = SCOPE_IDENTITY();
    INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
    (@SampleOrderId, 1, 1, 2450000.00),
    (@SampleOrderId, 2, 1, 980000.00);
END
GO

-- =============================================================================
-- TRUY VẤN KIỂM TRA TOÀN DIỆN (JOIN 4 BẢNG) - Kịch bản của Mai
-- =============================================================================
SELECT 
    o.order_code AS [Mã đơn hàng],
    c.full_name AS [Tên khách hàng],
    c.phone AS [SĐT],
    p.name AS [Tên xe],
    p.scale AS [Tỉ lệ],
    i.quantity AS [Số lượng],
    i.unit_price AS [Đơn giá],
    o.total_amount AS [Tổng tiền đơn hàng],
    o.order_status AS [Trạng thái đơn],
    o.created_at AS [Ngày tạo]
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN order_items i ON o.id = i.order_id
JOIN products p ON i.product_id = p.id
ORDER BY o.created_at DESC;
GO