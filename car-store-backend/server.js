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
// Ưu tiên CSDL CarModelStoreDB, tự động dự phòng sang car_order_db
const dbConfigs = [
    { name: 'CarModelStoreDB (ODBC 17)', conn: 'Driver={ODBC Driver 17 for SQL Server};Server=localhost;Database=CarModelStoreDB;Trusted_Connection=yes;' },
    { name: 'CarModelStoreDB (ODBC 18)', conn: 'Driver={ODBC Driver 18 for SQL Server};Server=localhost;Database=CarModelStoreDB;Trusted_Connection=yes;TrustServerCertificate=yes;' },
    { name: 'car_order_db (ODBC 17)', conn: 'Driver={ODBC Driver 17 for SQL Server};Server=localhost;Database=car_order_db;Trusted_Connection=yes;' },
    { name: 'car_order_db (ODBC 18)', conn: 'Driver={ODBC Driver 18 for SQL Server};Server=localhost;Database=car_order_db;Trusted_Connection=yes;TrustServerCertificate=yes;' }
];

let dbPool = null;

async function getDbPool() {
    if (dbPool && dbPool.connected) {
        return dbPool;
    }
    for (const cfg of dbConfigs) {
        try {
            dbPool = await new sql.ConnectionPool({ connectionString: cfg.conn }).connect();
            console.log(`✅ Đã kết nối SQL Server thành công (${cfg.name})`);
            return dbPool;
        } catch (e) {
            // Thử tiếp cấu hình kế tiếp
        }
    }
    console.error('❌ Không thể kết nối tới cơ sở dữ liệu SQL Server');
    throw new Error('Không thể kết nối SQL Server với bất kỳ cấu hình nào');
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

// 3. API Lấy danh sách Sản phẩm (hỗ trợ lọc status: bestseller, preorder, in_stock)
app.get('/api/products', async (req, res) => {
    try {
        const pool = await getDbPool();
        const { status } = req.query;
        let query = `
            SELECT id, product_code, name, scale, manufacturer, car_brand as brand, 
                   price, stock_quantity, status, image_url as image, 
                   description, rating, reviews
            FROM products
        `;
        if (status) {
            query += ` WHERE status = '${status.replace(/'/g, "''")}'`;
        }
        query += ` ORDER BY id ASC`;
        const result = await pool.request().query(query);
        res.json(result.recordset);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
        res.status(500).json({ error: error.message });
    }
});

// 4. API Lấy danh sách Thương hiệu
app.get('/api/brands', async (req, res) => {
    try {
        const pool = await getDbPool();
        const result = await pool.request().query('SELECT * FROM brands ORDER BY id ASC');
        res.json(result.recordset);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách thương hiệu:', error);
        res.status(500).json({ error: error.message });
    }
});

// 5. API Lấy danh sách Phụ kiện
app.get('/api/accessories', async (req, res) => {
    try {
        const pool = await getDbPool();
        const result = await pool.request().query('SELECT * FROM accessories ORDER BY id ASC');
        res.json(result.recordset);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách phụ kiện:', error);
        res.status(500).json({ error: error.message });
    }
});

// 6. API Tiếp nhận Liên hệ (phục vụ form contact.html)
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Vui lòng điền đủ thông tin liên hệ.' });
    }
    console.log(`📩 Nhận liên hệ từ: ${name} (${email}): ${message}`);
    res.json({ success: true, message: 'Đã nhận liên hệ thành công!' });
});


// Chạy server tại port 5000 (hoặc PORT trong biến môi trường)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend đang chạy tại: http://localhost:${PORT}`);
    // Kết nối thử DB ngay khi start server
    getDbPool().catch(() => {});
});