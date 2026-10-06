// Trang chủ: lấy sản phẩm từ API (GET /api/products) rồi vẽ thẻ xe.
// Nếu không gọi được API (mở file trực tiếp, chưa bật server) thì giữ nguyên HTML tĩnh có sẵn.
(function () {
  function esc(s) {
    return String(s || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function stars(r) {
    var n = Math.round(r || 5);
    return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);
  }
  function card(p, preorder) {
    var imgUrl = p.image || "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80";
    var rating = Number(p.rating || 5);
    var reviews = p.reviews || 0;
    var brandName = p.brand || p.car_brand || "Mô hình";
    var desc = p.description || "Hợp kim cao cấp";

    return '<article class="car-card"><div class="car-card__media">' +
      (preorder ? '<span class="badge-preorder">Pre-order</span>' : "") +
      '<button class="wishlist-btn" data-product-id="' + esc(p.id) + '" aria-label="Lưu vào yêu thích" title="Lưu vào yêu thích">♡</button>' +
      '<div class="car-card-img"><img src="' + esc(imgUrl) + '" alt="Mô hình xe ' + esc(brandName + " " + p.name) + '"></div></div>' +
      '<div class="car-card__body"><span class="brand-badge">' + esc(brandName) + "</span>" +
      '<h3 class="car-card__name">' + esc(p.name) + "</h3>" +
      '<p class="scale-label">Tỉ lệ ' + esc(p.scale) + " · " + esc(desc) + "</p>" +
      '<p class="star-rating"><span class="stars">' + stars(rating) + "</span> " + rating.toFixed(1) + " (" + reviews + " đánh giá)</p>" +
      '<p class="price-tag">' + Number(p.price).toLocaleString("vi-VN") + "đ</p>" +
      '<a class="btn btn-primary btn-block" href="product-detail.html?id=' + esc(p.id) + '">' + (preorder ? "Đặt hàng trước" : "Xem chi tiết") + "</a></div></article>";
  }
  function load(status, gridId, preorder) {
    var grid = document.getElementById(gridId);
    if (!grid) return;
    var baseUrl = (typeof window.getApiBaseUrl === "function") ? window.getApiBaseUrl() : (window.API_BASE || "");
    fetch((baseUrl || "") + "/api/products?status=" + status, { headers: { "ngrok-skip-browser-warning": "true" } })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (list) {
        if (!list || !list.length) return;
        grid.innerHTML = list.map(function (p) { return card(p, preorder); }).join("");
        if (typeof initWishlistButtons === "function") initWishlistButtons(); // gắn lại nút ♡ cho thẻ mới
      })
      .catch(function () { /* không có API: giữ nguyên HTML tĩnh có sẵn */ });
  }
  document.addEventListener("DOMContentLoaded", function () {
    load("bestseller", "bestSellerGrid", false);
    load("preorder", "preorderGrid", true);
  });
})();
