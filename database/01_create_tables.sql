-- 1. Tạo Cơ sở dữ liệu (Nếu chưa có)
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'diecast_car_shop')
BEGIN
    CREATE DATABASE diecast_car_shop;
END
GO

USE diecast_car_shop;
GO

-- 2. Bảng Khách hàng (customers)
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

-- 3. Bảng Sản phẩm (products)
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

-- 4. Bảng Đơn hàng (orders)
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

-- 5. Bảng Chi tiết đơn hàng (order_items)
IF OBJECT_ID('order_items', 'U') IS NULL
CREATE TABLE order_items (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(12, 2) NOT NULL,

    CONSTRAINT fk_items_orders FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_items_products FOREIGN KEY (product_id) REFERENCES products(id)
);
GO