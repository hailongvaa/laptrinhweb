const express = require('express');
const sql = require('mssql/msnodesqlv8');
const cors = require('cors');

const app = express();

// Cấu hình CORS cho phép kết nối từ Vercel, localhost và ngrok
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning', 'x-requested-with']
}));

app.use(express.json());

// Cấu hình kết nối SQL Server máy tính cá nhân bằng Windows Authentication qua ODBC Driver
const dbConfig = {
    connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=localhost;Database=car_order_db;Trusted_Connection=yes;'
};

// Fallback configuration nếu Driver 17 không khả dụng thì dùng Driver 18
const dbConfigFallback = {
    connectionString: 'Driver={ODBC Driver 18 for SQL Server};Server=localhost;Database=car_order_db;Trusted_Connection=yes;TrustServerCertificate=yes;'
};

let dbPool = null;

async function getDbPool() {
    if (dbPool && dbPool.connected) {
        return dbPool;
    }
    try {
        dbPool = await new sql.ConnectionPool(dbConfig).connect();
        console.log('✅ Đã kết nối SQL Server thành công (ODBC Driver 17)');
        return dbPool;
    } catch (err17) {
        console.warn('⚠️ Thử lại với ODBC Driver 18:', err17.message);
        try {
            dbPool = await new sql.ConnectionPool(dbConfigFallback).connect();
            console.log('✅ Đã kết nối SQL Server thành công (ODBC Driver 18)');
            return dbPool;
        } catch (err18) {
            console.error('❌ Lỗi kết nối CSDL SQL Server:', err18.message);
            throw err18;
        }
    }
}

// 0. API Kiểm tra sức khỏe (Health check) - Dùng để test kết nối từ Vercel qua ngrok
app.get('/api/health', async (req, res) => {
    let dbStatus = 'disconnected';
    try {
        const pool = await getDbPool();
        const testQuery = await pool.request().query('SELECT 1 as test');
        if (testQuery.recordset) {
            dbStatus = 'connected';
        }
    } catch (e) {
        dbStatus = 'error: ' + e.message;
    }

    res.json({
        success: true,
        status: 'online',
        message: 'Backend CarModelStore đang hoạt động!',
        database: dbStatus,
        timestamp: new Date().toISOString()
    });
});

// 1. API Lấy danh sách Đơn hàng (dùng cho trang quản trị Admin)
app.get('/api/orders', async (req, res) => {
    try {
        const pool = await getDbPool();
        const result = await pool.request().query(`
            SELECT o.id, o.order_code, o.customer_id, o.recipient_name, 
                   o.recipient_phone, o.shipping_address, o.total_amount, 
                   o.order_status, o.created_at,
                   COUNT(i.id) as total_items
            FROM orders o
            LEFT JOIN order_items i ON o.id = i.order_id
            GROUP BY o.id, o.order_code, o.customer_id, o.recipient_name, 
                     o.recipient_phone, o.shipping_address, o.total_amount, 
                     o.order_status, o.created_at
            ORDER BY o.created_at DESC
        `);

        res.json({
            success: true,
            orders: result.recordset
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách đơn hàng:', error);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy dữ liệu đơn hàng.', error: error.message });
    }
});

// 2. API nhận yêu cầu Đặt hàng từ Website
app.post('/api/orders', async (req, res) => {
    const { customerId = 1, recipientName, recipientPhone, shippingAddress, items } = req.body;

    if (!recipientName || !recipientPhone || !shippingAddress) {
        return res.status(400).json({ 
            success: false, 
            message: 'Vui lòng cung cấp đầy đủ: Tên người nhận, Số điện thoại và Địa chỉ giao hàng.' 
        });
    }

    if (!items || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Giỏ hàng đang trống.' });
    }

    try {
        const pool = await getDbPool();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // Tự động tính tổng tiền
            const totalAmount = items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice)), 0);

            // Tạo mã đơn hàng ngẫu nhiên (Ví dụ: ORD-1727680000000)
            const orderCode = 'ORD-' + Date.now();

            // Thêm đơn hàng vào bảng orders
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

            // Thêm từng sản phẩm vào bảng order_items
            for (const item of items) {
                const itemRequest = new sql.Request(transaction);
                await itemRequest
                    .input('orderId', sql.Int, newOrderId)
                    .input('productId', sql.Int, item.productId || 1)
                    .input('quantity', sql.Int, item.quantity)
                    .input('unitPrice', sql.Decimal(12, 2), item.unitPrice)
                    .query(`
                        INSERT INTO order_items (order_id, product_id, quantity, unit_price)
                        VALUES (@orderId, @productId, @quantity, @unitPrice);
                    `);
            }

            // Hoàn tất lưu dữ liệu
            await transaction.commit();
            console.log(`🎉 Tạo đơn hàng thành công: ${orderCode}, Tổng: ${totalAmount} VND`);
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
        res.status(500).json({ success: false, message: 'Lỗi máy chủ khi tạo đơn hàng.', error: error.message });
    }
});

// Chạy server tại port 5000 (hoặc PORT trong biến môi trường)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend đang chạy tại: http://localhost:${PORT}`);
    // Kết nối thử DB ngay khi start server
    getDbPool().catch(() => {});
});