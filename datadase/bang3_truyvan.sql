USE diecast_car_shop;
GO

-- Xem toàn bộ danh sách Khách hàng
SELECT * FROM customers;

-- Xem danh sách Sản phẩm xe mô hình
SELECT * FROM products;

-- Xem danh sách Đơn hàng
SELECT * FROM orders;

-- Xem Chi tiết đơn hàng đầy đủ (Kết nối Đơn hàng + Khách hàng + Sản phẩm)
SELECT 
    o.order_code AS [Mã đơn hàng],
    c.full_name AS [Tên khách hàng],
    p.name AS [Tên xe],
    i.quantity AS [Số lượng mua],
    i.unit_price AS [Đơn giá mua],
    o.total_amount AS [Tổng tiền đơn hàng],
    o.order_status AS [Trạng thái]
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN order_items i ON o.id = i.order_id
JOIN products p ON i.product_id = p.id;
GO