// CarModelStore - tương tác UI phía client (demo, chưa nối server)
// 1) Wishlist: lưu danh sách mô hình yêu thích vào localStorage của trình duyệt
// 2) View toggle: chuyển giữa "Xem dạng lưới" và "Xem dạng bộ sưu tập" trên trang sản phẩm

document.addEventListener("DOMContentLoaded", function () {
  initWishlistButtons();
  initViewToggle();
});

function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem("cms_wishlist") || "[]");
  } catch (e) {
    return [];
  }
}

function saveWishlist(list) {
  localStorage.setItem("cms_wishlist", JSON.stringify(list));
}

function initWishlistButtons() {
  var buttons = document.querySelectorAll(".wishlist-btn");
  var wishlist = getWishlist();

  buttons.forEach(function (btn) {
    var id = btn.getAttribute("data-product-id");
    if (id && wishlist.indexOf(id) !== -1) {
      btn.classList.add("is-active");
      btn.textContent = "♥";
    }
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var list = getWishlist();
      var idx = list.indexOf(id);
      if (idx === -1) {
        list.push(id);
        btn.classList.add("is-active");
        btn.textContent = "♥";
      } else {
        list.splice(idx, 1);
        btn.classList.remove("is-active");
        btn.textContent = "♡";
      }
      saveWishlist(list);
    });
  });
}

function initViewToggle() {
  var toggle = document.querySelector(".view-toggle");
  var grid = document.querySelector("[data-product-grid]");
  if (!toggle || !grid) return;

  toggle.querySelectorAll("button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      toggle.querySelectorAll("button").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      if (btn.dataset.view === "collection") {
        grid.classList.add("grid--collection");
      } else {
        grid.classList.remove("grid--collection");
      }
    });
  });
}
