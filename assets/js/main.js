// CarModelStore - tương tác UI phía client (demo, chưa nối server)
// 1) Wishlist: lưu danh sách mô hình yêu thích vào localStorage của trình duyệt
// 2) View toggle: chuyển giữa "Xem dạng lưới" và "Xem dạng bộ sưu tập" trên trang sản phẩm

document.addEventListener("DOMContentLoaded", function () {
  initWishlistButtons();
  initViewToggle();
  initContactForm();
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

// Trang liên hệ: HTML5 (required, type=email) kiểm tra trước; khi hợp lệ gửi POST /api/contact.
// Nếu chưa bật server (mở file trực tiếp) thì chạy chế độ demo: vẫn hiện thông báo nhưng ghi rõ chưa gửi.
function initContactForm() {
  var form = document.getElementById("contactForm");
  var box = document.getElementById("contactSuccess");
  if (!form || !box) return;
  var text = document.getElementById("contactSuccessText");
  var title = box.querySelector("strong");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = {
      name: form.elements["name"].value.trim(),
      email: form.elements["email"].value.trim(),
      message: form.elements["message"].value.trim()
    };
    function done(t, msg) {
      title.textContent = t;
      text.textContent = msg;
      form.reset();
      box.hidden = false;
      box.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    var baseUrl = "";
    if (typeof window.getApiBaseUrl === "function") {
      baseUrl = window.getApiBaseUrl();
    } else if (window.API_BASE) {
      baseUrl = window.API_BASE;
    }

    fetch((baseUrl || "") + "/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
      body: JSON.stringify(data)
    })
      .then(function (r) {
        if (r.ok) return done("Đã gửi thành công!", "Cảm ơn " + data.name + " đã liên hệ. Chúng tôi sẽ phản hồi qua email trong thời gian sớm nhất.");
        return r.json().then(function (j) { alert(j.message || j.error || "Gửi không thành công, vui lòng thử lại."); });
      })
      .catch(function () {
        done("Chế độ demo", "Chưa kết nối máy chủ nên liên hệ của bạn chưa được lưu. Hãy bật backend: cd car-store-backend rồi node server.js");
      });
  });

  form.addEventListener("input", function () { box.hidden = true; });
}

