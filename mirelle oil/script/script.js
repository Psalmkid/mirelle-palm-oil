/* Mirelle Oils — small, dependency-free storefront interactions */
const PRODUCT_IMAGES = {
    "Palm Oil 1L": "assets/Img/1l.jpg",
    "Palm Oil 2L": "assets/Img/2l.jpg",
    "Palm Oil 3L": "assets/Img/3l.jpg",
    "Palm Oil 5L": "assets/Img/5l.jpg",
    "Palm Oil 25L": "assets/Img/25l.jpeg"
};

let cart = readCart();

function readCart() {
    try { return JSON.parse(localStorage.getItem("cart") || "[]"); }
    catch (error) { return []; }
}
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}
function naira(value) {
    return `₦${Number(value || 0).toLocaleString("en-NG")}`;
}
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    document.querySelectorAll(".cart-count, #cart-count").forEach(el => el.textContent = count);
}
function showToast(message) {
    let toast = document.querySelector(".toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.className = "toast";
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}
function setActiveNavLink() {
    const current = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("a[href]").forEach(link => {
        if (link.getAttribute("href") === current) link.classList.add("active-link");
    });
}

function normalizeNavigationIcons() {
    const icons = {
        home: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
        products: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>',
        about: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
        cart: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>'
    };
    document.querySelectorAll(".pc-nav-links a, .bottom-nav a, .drawer nav a").forEach(link => {
        const href = link.getAttribute("href") || "";
        const key = href === "index.html" ? "home" : href === "products.html" ? "products" : href === "about.html" ? "about" : href === "cart.html" ? "cart" : "";
        if (!key) return;
        const count = link.querySelector(".cart-count");
        const label = key === "home" ? "Home" : key === "products" ? (link.closest(".bottom-nav") ? "Shop" : "Products") : key === "about" ? "About" : "Basket";
        link.innerHTML = `${icons[key]}${count ? '<span class="cart-count">0</span>' : ""}<span>${label}</span>`;
    });
    document.querySelectorAll(".toggle-menu").forEach(button => {
        button.innerHTML = '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
    });
}

function toggleDrawer(force) {
    const drawer = document.querySelector(".drawer");
    const overlay = document.querySelector(".drawer-overlay");
    if (!drawer || !overlay) return;
    const open = typeof force === "boolean" ? force : !drawer.classList.contains("active");
    drawer.classList.toggle("active", open);
    overlay.classList.toggle("active", open);
    drawer.setAttribute("aria-hidden", String(!open));
    document.querySelectorAll(".toggle-menu").forEach(button => button.setAttribute("aria-expanded", String(open)));
}

function addProductToCart(name, price, button, image) {
    const existing = cart.find(item => item.name === name);
    if (existing) existing.quantity += 1;
    else cart.push({ name, price: Number(price), quantity: 1, image: image || PRODUCT_IMAGES[name] || "assets/Img/1l.jpg" });
    saveCart();
    if (button) {
        button.textContent = "Added ✓";
        button.classList.add("added");
        const card = button.closest(".product-card");
        if (card) card.classList.add("added");
        setTimeout(() => { button.textContent = "Add to basket"; button.classList.remove("added"); }, 1300);
        flyToCart(button);
    }
    showToast(`${name} added to your basket`);
}
function addToCart(name, price) { addProductToCart(name, price); }
function goToCheckout() { window.location.href = "checkout.html"; }
function scrollToProducts() {
    const target = document.getElementById("products");
    if (target) target.scrollIntoView({ behavior: "smooth" });
}

function flyToCart(button) {
    const image = button.closest(".product-card")?.querySelector("img") || document.querySelector(".product-image img");
    const target = document.querySelector(".cart-link") || document.querySelector(".bottom-nav a[href='cart.html']");
    if (!image || !target) return;
    const from = image.getBoundingClientRect(), to = target.getBoundingClientRect();
    const flyer = image.cloneNode(true);
    flyer.className = "flying-image";
    Object.assign(flyer.style, { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px`, opacity: "1" });
    document.body.appendChild(flyer);
    flyer.getBoundingClientRect();
    flyer.style.transform = `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(.18)`;
    flyer.style.opacity = "0";
    setTimeout(() => flyer.remove(), 900);
}

function renderCart() {
    const container = document.getElementById("cartItems");
    if (!container) return;
    if (!cart.length) {
        container.innerHTML = `<div class="empty-state"><p>Your basket is ready for something good.</p><a class="primary-btn" href="products.html">Browse palm oil</a></div>`;
        updateCartSummary();
        return;
    }
    container.innerHTML = cart.map((item, index) => `
        <article class="cart-item">
            <div class="product-name">${item.name}<small class="muted"> • ${naira(item.price)} each</small></div>
            <div class="quantity-controls"><button aria-label="Decrease quantity" onclick="changeCartQty(${index}, -1)">−</button><strong>${item.quantity}</strong><button aria-label="Increase quantity" onclick="changeCartQty(${index}, 1)">+</button></div>
            <span class="price">${naira(item.price * item.quantity)}</span>
            <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
        </article>`).join("");
    updateCartSummary();
}
function updateCartSummary() {
    const total = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
    const totalEl = document.getElementById("cartTotal");
    if (totalEl) totalEl.textContent = naira(total);
    const checkout = document.querySelector(".checkout-btn");
    if (checkout) { checkout.disabled = !cart.length; checkout.textContent = cart.length ? "Continue to checkout" : "Basket is empty"; }
}
function changeCartQty(index, amount) {
    if (!cart[index]) return;
    cart[index].quantity += amount;
    if (cart[index].quantity < 1) cart.splice(index, 1);
    saveCart(); renderCart(); renderCheckout();
}
function increaseQty(index) { changeCartQty(index, 1); }
function decreaseQty(index) { changeCartQty(index, -1); }
function removeFromCart(index) { cart.splice(index, 1); saveCart(); renderCart(); renderCheckout(); showToast("Item removed"); }
function updateCart() { saveCart(); renderCart(); renderCheckout(); }
function displayCart() { renderCart(); }

function renderCheckout() {
    const container = document.getElementById("checkoutItems");
    if (!container) return;
    const total = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
    const totalEl = document.getElementById("total");
    if (totalEl) totalEl.textContent = naira(total);
    if (!cart.length) {
        container.innerHTML = `<div class="empty-state"><p>Add palm oil to your basket before checking out.</p><a class="primary-btn" href="products.html">Shop products</a></div>`;
    } else {
        container.innerHTML = cart.map((item, index) => `
            <article class="checkout-item">
                <strong>${item.name}</strong>
                <div class="quantity-controls"><button onclick="changeCartQty(${index}, -1)">−</button><span>${item.quantity}</span><button onclick="changeCartQty(${index}, 1)">+</button></div>
                <span class="subtotal">${naira(item.price * item.quantity)}</span>
                <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
            </article>`).join("");
    }
    const orderButton = document.getElementById("orderBtn");
    if (orderButton) orderButton.disabled = !cart.length;
}
function displayCheckout() { renderCheckout(); }
function updateCheckoutDisplay() { saveCart(); renderCheckout(); }
function openWhatsApp() {
    if (!cart.length) return;
    const lines = cart.map(item => `${item.name} x${item.quantity} — ${naira(item.price * item.quantity)}`);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const message = `Hello Mirelle Palm oil Limited, I would like to order:%0A${encodeURIComponent(lines.join("\n"))}%0A%0ATotal: ${encodeURIComponent(naira(total))}`;
    window.open(`https://wa.me/2347064509776?text=${message}`, "_blank", "noopener");
}

function initCatalog() {
    const pills = document.querySelectorAll(".filter-pill");
    const cards = document.querySelectorAll(".product-card");
    pills.forEach(pill => pill.addEventListener("click", () => {
        pills.forEach(item => item.classList.remove("active"));
        pill.classList.add("active");
        const filter = pill.dataset.filter;
        cards.forEach(card => card.hidden = filter !== "all" && card.dataset.category !== filter);
    }));
    const sort = document.getElementById("sortProducts");
    if (sort) sort.addEventListener("change", () => {
        const grid = document.querySelector(".product-grid");
        [...grid.children].sort((a, b) => sort.value === "price-low" ? a.dataset.price - b.dataset.price : sort.value === "price-high" ? b.dataset.price - a.dataset.price : a.dataset.name.localeCompare(b.dataset.name)).forEach(card => grid.appendChild(card));
    });
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".toggle-menu").forEach(button => button.addEventListener("click", () => toggleDrawer()));
    document.querySelector(".drawer-overlay")?.addEventListener("click", () => toggleDrawer(false));
    document.querySelector(".drawer-close")?.addEventListener("click", () => toggleDrawer(false));
    document.querySelectorAll(".contact-form").forEach(form => form.addEventListener("submit", event => {
        event.preventDefault();
        const data = new FormData(form);
        const name = String(data.get("name") || "").trim();
        const contact = String(data.get("contact") || "").trim();
        const body = String(data.get("message") || "").trim();
        if (!name || !contact || !body) return;

        const text = [
            "Hello Mirelle Palm oil Limited, I would like to make an enquiry.",
            "",
            `Name: ${name}`,
            `Contact: ${contact}`,
            `Message: ${body}`
        ].join("\n");

        const url = `https://wa.me/2347064509776?text=${encodeURIComponent(text)}`;
        window.open(url, "_blank", "noopener,noreferrer");

        const message = document.getElementById("message");
        if (message) message.textContent = "Your message is ready in WhatsApp.";
    }));
    normalizeNavigationIcons();
    setActiveNavLink();
    updateCartCount();
    renderCart();
    renderCheckout();
    initCatalog();
});