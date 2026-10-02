const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Cấu hình kết nối SQL Server (dùng thông số máy local của bạn)
const dbConfig = {
    server: 'localhost',
    database: 'car_order_db',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true,        // Dùng Windows Authentication
        trustServerCertificate: true,   // Bỏ qua kiểm tra chứng chỉ SSL
        enableArithAbort: true
    }
};

// API nhận yêu cầu Đặt hàng từ Website
app.post('/api/orders', async (req, res) => {
    const { customerId, recipientName, recipientPhone, shippingAddress, items } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Giỏ hàng đang trống.' });
    }

    let pool;
    try {
        pool = await sql.connect(dbConfig);
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // 1. Tự động tính tổng tiền
            const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

            // 2. Tạo mã đơn hàng ngẫu nhiên (Ví dụ: ORD-1727680000000)
            const orderCode = 'ORD-' + Date.now();

            // 3. Thêm đơn hàng vào bảng orders
            const orderRequest = new sql.Request(transaction);
            const orderResult = await orderRequest
                .input('orderCode', sql.VarChar(30), orderCode)
                .input('customerId', sql.Int, customerId)
                .input('recipientName', sql.NVarChar(100), recipientName)
                .input('recipientPhone', sql.VarChar(15), recipientPhone)
                .input('shippingAddress', sql.NVarChar(sql.MAX), shippingAddress)
                .input('totalAmount', sql.Decimal(14, 2), totalAmount)
                .query(`
                    INSERT INTO orders (order_code, customer_id, recipient_name, recipient_phone, shipping_address, total_amount, order_status)
                    OUTPUT INSERTED.id
                    VALUES (@orderCode, @customerId, @recipientName, @recipientPhone, @shippingAddress, @totalAmount, 'pending');
                `);

            const newOrderId = orderResult.recordset[0].id;

            // 4. Thêm từng sản phẩm vào bảng order_items
            for (const item of items) {
                const itemRequest = new sql.Request(transaction);
                await itemRequest
                    .input('orderId', sql.Int, newOrderId)
                    .input('productId', sql.Int, item.productId)
                    .input('quantity', sql.Int, item.quantity)
                    .input('unitPrice', sql.Decimal(12, 2), item.unitPrice)
                    .query(`
                        INSERT INTO order_items (order_id, product_id, quantity, unit_price)
                        VALUES (@orderId, @productId, @quantity, @unitPrice);
                    `);
            }

            // Hoàn tất lưu dữ liệu
            await transaction.commit();
            res.json({
                success: true,
                message: 'Tạo đơn hàng thành công!',
                orderId: newOrderId,
                orderCode: orderCode,
                totalAmount: totalAmount
            });
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    } catch (error) {
        console.error('Lỗi khi lưu đơn hàng:', error);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ khi tạo đơn hàng.' });
    }
});

// Chạy server tại port 5000
app.listen(5000, () => {
    console.log('Backend đang chạy tại: http://localhost:5000');
});