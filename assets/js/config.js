/**
 * CarModelStore - Cấu hình kết nối API
 * Hỗ trợ chuyển đổi linh hoạt giữa Localhost và URL ngrok khi deploy lên Vercel.
 */

// 1. URL Mặc định của Backend
// Đã tự động cập nhật URL ngrok đang hoạt động trên máy bạn:
window.DEFAULT_API_URL = 'https://unhook-shrink-escalate.ngrok-free.dev';

// 2. Lấy API URL từ localStorage nếu đã được cấu hình trước đó, ngược lại dùng mặc định
function getApiBaseUrl() {
    const savedUrl = localStorage.getItem('CMS_BACKEND_URL');
    if (savedUrl && savedUrl.trim() !== '') {
        return savedUrl.trim().replace(/\/+$/, '');
    }
    return window.DEFAULT_API_URL.replace(/\/+$/, '');
}

// 3. Hàm lưu URL Backend mới
function setApiBaseUrl(url) {
    if (!url) {
        localStorage.removeItem('CMS_BACKEND_URL');
    } else {
        localStorage.setItem('CMS_BACKEND_URL', url.trim().replace(/\/+$/, ''));
    }
}

// 4. Wrapper gọi API chuyên dụng, tự động bỏ qua màn hình chặn của ngrok miễn phí
async function apiFetch(endpoint, options = {}) {
    const baseUrl = getApiBaseUrl();
    const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true', // BẮT BUỘC: Giúp ngrok free không trả về trang HTML cảnh báo
        ...(options.headers || {})
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers
        });
        const data = await response.json();
        return { ok: response.ok, status: response.status, data };
    } catch (err) {
        console.error('API Fetch Error:', err);
        return { ok: false, status: 0, error: err.message, data: null };
    }
}

window.getApiBaseUrl = getApiBaseUrl;
window.setApiBaseUrl = setApiBaseUrl;
window.apiFetch = apiFetch;
