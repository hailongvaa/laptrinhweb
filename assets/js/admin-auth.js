/**
 * admin-auth.js - Quản lý phân quyền và kiểm soát truy cập (RBAC)
 * Dành riêng cho hệ thống Quản trị CarModel Store (Chương 1 & Chương 2 - Thuần JS/localStorage)
 */

(function () {
  'use strict';

  // Khóa lưu trữ session trong localStorage
  var AUTH_STORAGE_KEY = 'cms_auth_user';

  // Tài khoản Admin hợp lệ duy nhất theo quy định
  var ADMIN_CREDENTIALS = {
    email: 'admin@gmail.com',
    password: '123456',
    role: 'admin',
    name: 'Quản trị viên Hệ thống'
  };

  var AdminAuth = {
    /**
     * Lấy thông tin người dùng hiện tại từ localStorage
     */
    getCurrentUser: function () {
      try {
        var data = localStorage.getItem(AUTH_STORAGE_KEY);
        return data ? JSON.parse(data) : null;
      } catch (e) {
        console.error('Lỗi đọc auth data từ localStorage:', e);
        return null;
      }
    },

    /**
     * Lưu thông tin người dùng đăng nhập vào localStorage
     */
    setCurrentUser: function (user) {
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } catch (e) {
        console.error('Lỗi ghi auth data vào localStorage:', e);
      }
    },

    /**
     * Kiểm tra người dùng hiện tại có phải là Admin hợp lệ hay không
     */
    isAdmin: function () {
      var user = this.getCurrentUser();
      return !!(user && user.role === 'admin' && user.email === ADMIN_CREDENTIALS.email);
    },

    /**
     * Thực hiện đăng nhập
     * Trả về object { success: boolean, message: string, user: object }
     */
    login: function (email, password) {
      email = (email || '').trim().toLowerCase();
      password = (password || '').trim();

      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        var adminUser = {
          email: ADMIN_CREDENTIALS.email,
          name: ADMIN_CREDENTIALS.name,
          role: 'admin',
          loginAt: new Date().toISOString()
        };
        this.setCurrentUser(adminUser);
        return {
          success: true,
          role: 'admin',
          message: 'Đăng nhập thành công với quyền Quản trị viên!',
          user: adminUser
        };
      }

      // Mọi tài khoản khác mặc định 100% có role là customer
      var customerUser = {
        email: email,
        name: email.split('@')[0] || 'Khách hàng',
        role: 'customer',
        loginAt: new Date().toISOString()
      };
      this.setCurrentUser(customerUser);
      return {
        success: true,
        role: 'customer',
        message: 'Đăng nhập tài khoản khách hàng thành công!',
        user: customerUser
      };
    },

    /**
     * Đăng xuất khỏi hệ thống: xóa session và chuyển hướng về login.html
     */
    logout: function () {
      try {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } catch (e) {
        console.error('Lỗi khi xóa session:', e);
      }
      var isInsideAdmin = window.location.pathname.indexOf('/admin/') !== -1;
      var redirectPath = isInsideAdmin ? '../login.html' : 'login.html';
      window.location.href = redirectPath;
    },

    /**
     * Kiểm tra xem trang hiện tại có thuộc thư mục admin/ không
     */
    isInsideAdminArea: function () {
      var fullUrl = (window.location.href || '').toLowerCase();
      var path = (window.location.pathname || '').toLowerCase();
      return fullUrl.indexOf('/admin/') !== -1 || path.indexOf('/admin/') !== -1;
    },

    /**
     * Hàm tự động bảo vệ các trang trong thư mục admin/
     * Nếu không có quyền admin: alert và redirect ngay lập tức
     */
    protectAdminPage: function () {
      if (!this.isAdmin()) {
        alert('Bạn không có quyền truy cập khu vực Quản trị viên!');
        var redirectUrl = this.isInsideAdminArea() ? '../login.html' : 'login.html';
        window.location.replace(redirectUrl);
        return false;
      }
      return true;
    },

    /**
     * Cập nhật thông tin hiển thị của Admin lên Navbar/Topbar
     */
    renderAdminInfo: function () {
      var user = this.getCurrentUser();
      if (!user) return;

      var emailNodes = document.querySelectorAll('.js-admin-email');
      emailNodes.forEach(function (node) {
        node.textContent = user.email || ADMIN_CREDENTIALS.email;
      });

      var nameNodes = document.querySelectorAll('.js-admin-name');
      nameNodes.forEach(function (node) {
        node.textContent = user.name || 'Quản trị viên';
      });

      var badgeNodes = document.querySelectorAll('.js-admin-badge');
      badgeNodes.forEach(function (node) {
        node.textContent = 'Quản trị viên';
      });

      // Gắn sự kiện click cho các nút Đăng xuất
      var logoutButtons = document.querySelectorAll('.js-admin-logout');
      logoutButtons.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi trang Quản trị?')) {
            AdminAuth.logout();
          }
        });
      });
    },

    /**
     * Khởi tạo logic cho trang login (nếu đang ở trang login.html)
     */
    initLoginPage: function () {
      var loginForm = document.querySelector('form[action="account.html"], form#login-form');
      if (!loginForm) return;

      loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var emailInput = loginForm.querySelector('input[type="email"]');
        var passInput = loginForm.querySelector('input[type="password"]');

        var email = emailInput ? emailInput.value : '';
        var password = passInput ? passInput.value : '';

        var res = AdminAuth.login(email, password);
        if (res.role === 'admin') {
          alert('Xin chào Quản trị viên! Đang chuyển hướng vào bảng điều khiển...');
          window.location.href = 'admin/dashboard.html';
        } else {
          alert('Đăng nhập thành công với vai trò Khách hàng!');
          window.location.href = 'index.html';
        }
      });

      // Hỗ trợ nút click đăng nhập nhanh cho tester / giảng viên chấm bài
      var quickAdminBtn = document.getElementById('quick-login-admin');
      if (quickAdminBtn) {
        quickAdminBtn.addEventListener('click', function () {
          var emailInput = loginForm.querySelector('input[type="email"]');
          var passInput = loginForm.querySelector('input[type="password"]');
          if (emailInput) emailInput.value = ADMIN_CREDENTIALS.email;
          if (passInput) passInput.value = ADMIN_CREDENTIALS.password;

          var res = AdminAuth.login(ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password);
          alert('Đã thiết lập tài khoản Quản trị: admin@gmail.com / 123456. Đang chuyển hướng...');
          window.location.href = 'admin/dashboard.html';
        });
      }
    },

    /**
     * Khởi tạo logic cho trang đăng ký (nếu đang ở trang register.html)
     */
    initRegisterPage: function () {
      var regForm = document.querySelector('form[action="login.html"]');
      if (!regForm) return;

      regForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var emailInput = regForm.querySelector('input[type="email"]');
        var nameInput = regForm.querySelector('input[name="fullname"]');
        var email = emailInput ? emailInput.value : '';
        var name = nameInput ? nameInput.value : '';

        // Quy tắc phân quyền: Mọi tài khoản mới đăng ký mặc định 100% là customer
        var newUser = {
          email: email,
          name: name || 'Khách hàng',
          role: 'customer',
          registeredAt: new Date().toISOString()
        };
        AdminAuth.setCurrentUser(newUser);
        alert('Đăng ký tài khoản thành công với vai trò Khách hàng (Customer)! Vui lòng đăng nhập.');
        window.location.href = 'login.html';
      });
    },

    /**
     * Tự động khởi tạo responsive sidebar toggle cho mobile
     */
    initSidebarToggle: function () {
      var toggleBtn = document.querySelector('.js-sidebar-toggle');
      var sidebar = document.querySelector('.admin-sidebar');
      var overlay = document.querySelector('.admin-sidebar-overlay');

      if (!toggleBtn || !sidebar) return;

      function toggleSidebar() {
        sidebar.classList.toggle('is-open');
        if (overlay) overlay.classList.toggle('is-visible');
      }

      toggleBtn.addEventListener('click', toggleSidebar);

      if (overlay) {
        overlay.addEventListener('click', function () {
          sidebar.classList.remove('is-open');
          overlay.classList.remove('is-visible');
        });
      }
    }
  };

  // Xuất ra global scope
  window.AdminAuth = AdminAuth;

  // Thực thi kiểm tra bảo vệ ngay khi script được nạp vào trang trong thư mục admin
  if (AdminAuth.isInsideAdminArea()) {
    AdminAuth.protectAdminPage();
  }

  // Khởi tạo giao diện khi DOM sẵn sàng
  document.addEventListener('DOMContentLoaded', function () {
    if (AdminAuth.isInsideAdminArea()) {
      AdminAuth.renderAdminInfo();
      AdminAuth.initSidebarToggle();
    } else {
      AdminAuth.initLoginPage();
      AdminAuth.initRegisterPage();
    }
  });
})();
