USE car_order_db;
GO

-- 1. Bảng Đơn hàng (đã gỡ khóa ngoại FK_Orders_Customers)
CREATE TABLE orders (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_code VARCHAR(30) UNIQUE NOT NULL,
    customer_id INT NOT NULL,              -- Lưu ID của khách hàng
    recipient_name NVARCHAR(100) NOT NULL,
    recipient_phone VARCHAR(15) NOT NULL,
    shipping_address NVARCHAR(MAX) NOT NULL,
    total_amount DECIMAL(14, 2) NOT NULL,
    order_status VARCHAR(20) DEFAULT 'pending', -- pending, shipping, completed, cancelled
    created_at DATETIME2 DEFAULT GETDATE()
);
GO

-- 2. Bảng Chi tiết đơn hàng (giữ khóa ngoại nối với orders của bạn, gỡ nối với products)
CREATE TABLE order_items (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,               -- Lưu ID sản phẩm xe
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(12, 2) NOT NULL,
    CONSTRAINT FK_OrderItems_Orders FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
GO