// Developer Signature Console
console.log(
    "%cWebsite developed by Samuel Drea ",
    "color:#ff6600;font-size:16px;font-weight:bold;"
);

console.log(
    "%cFrontend Developer | JavaScript | Web Development",
    "color:gray;font-size:12px;"
);

function setActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const allLinks = document.querySelectorAll('.drawer a, .pc-nav-links a');

    allLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active-link');
        } else {
            link.classList.remove('active-link');
        }
    });
}

function toggleDrawer(open) {
    const drawer = document.querySelector('.drawer');
    const overlay = document.querySelector('.drawer-overlay');
    const toggles = document.querySelectorAll('.toggle-menu');

    if (!drawer || !overlay) return;

    const isOpen = typeof open === 'boolean' ? open : !drawer.classList.contains('active');

    drawer.classList.toggle('active', isOpen);
    overlay.classList.toggle('active', isOpen);
    drawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

    toggles.forEach(btn => {
        btn.setAttribute('aria-expanded', String(isOpen));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const toggles = document.querySelectorAll('.toggle-menu');
    toggles.forEach(btn => {
        btn.addEventListener('click', () => toggleDrawer());
    });

    const overlay = document.querySelector('.drawer-overlay');
    if (overlay) {
        overlay.addEventListener('click', () => toggleDrawer(false));
    }

    setActiveNavLink();
    updateCartCount();
    applyNeuromorphicUI();
});

function applyNeuromorphicUI() {
    const buttonSelectors = [
        '.add-to-cart-btn',
        '.checkout-btn',
        '#orderBtn',
        '.bulk-btn',
        '.contact-btn',
        '.ask-pack-btn',
        '.theme-toggle'
    ];

    buttonSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => el.classList.add('neu-btn'));
    });
}

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedPack = {};

const imageMap = {
    'Palm Oil 1L': 'assets/Img/1l.jpg',
    'Palm Oil 2L': 'assets/Img/2l.jpg',
    'Palm Oil 3L': 'assets/Img/3l.jpg',
    'Palm Oil 5L': 'assets/Img/5l.jpg',
    'Palm Oil 25L': 'assets/Img/25l.jpeg',
    'Cleaning Solutions Small': 'assets/Img/small.jpg',
    'Cleaning Solutions Medium': 'assets/Img/medium.jpg',
    'Cleaning Solutions 5L': 'assets/Img/5l.jpeg',
};

function getImageSrc(name) {
    const normalized = name.trim();
    if (imageMap[normalized]) {
        return imageMap[normalized];
    }

    const foundKey = Object.keys(imageMap).find(key => key.toLowerCase() === normalized.toLowerCase());
    return foundKey ? imageMap[foundKey] : 'assets/Img/1l.jpg';
}

function goToCheckout() {
    window.location.href = 'checkout.html';
}

function disableCheckoutIfEmpty() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if(cart.length === 0) {
        let btn = document.querySelector(".checkout-btn");
        
        if(btn) {
            btn.disabled = true;
            btn.textContent = "Cart is Empty";
        }
    } else {
        let btn = document.querySelector(".checkout-btn");
        
        if(btn) {
            btn.disabled = false;
            btn.textContent = "Checkout";
        }
    }
}

function scrollToProducts() {
    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });
}

function showMessage() {
    document.getElementById("message").innerText = 
    "Thank you for contacting us. We will get back to you shortly!";
}

function addToCart(name, price){
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existing = cart.find(item => item.name === name);

    if(existing){
        existing.quantity += 1;
    }else{
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    showToast(`✓ ${name} added to your cart!`);
}

// Cart Page Functions
function displayCart() {
    const cartItemsDiv = document.getElementById("cartItems");
    cartItemsDiv.innerHTML = "";

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
        updateOrderSummary();
        return;
    }

    cart.forEach((item, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-item");

        const imgSrc = getImageSrc(item.name);

        itemDiv.innerHTML = `
        <div class="cart-item__img">
            <img src="${imgSrc}" alt="${item.name}" />
            <div class="cart-item__qty">
                <button class="qty-btn" onclick="decreaseQty(${index})">−</button>
                <span class="qty-num">${item.quantity}</span>
                <button class="qty-btn" onclick="increaseQty(${index})">+</button>
            </div>
        </div>
        <div class="cart-item__body">
            <div class="cart-item__name">${item.name}</div>
            <div class="cart-item__price">₦${(item.price * item.quantity).toFixed(2)}</div>
        </div>
        <button class="cart-item__remove" onclick="removeFromCart(${index})">✕</button>
        `;

        cartItemsDiv.appendChild(itemDiv);
    });

    updateOrderSummary();
}

function updateOrderSummary() {
    const summaryDiv = document.getElementById("orderSummaryDetails");
    if (!summaryDiv) return;

    if (cart.length === 0) {
        summaryDiv.innerHTML = "<p>No items in cart</p>";
        return;
    }

    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    let totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    summaryDiv.innerHTML = `
        <div style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Total Items:</span>
                <span>${totalItems}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 1.1em;">
                <span>Total Price:</span>
                <span>₦${totalPrice.toFixed(2)}</span>
            </div>
        </div>
    `;
}

function increaseQty(index) {
    cart[index].quantity += 1;
    updateCart();
}

function decreaseQty(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    }
    updateCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    disableCheckoutIfEmpty();
    updateCartCount();
}

// Checkout Page Functions
function displayCheckout(){
    const checkoutItems = document.getElementById("checkoutItems");
    const totalSpan = document.getElementById("total");
    const orderBtn = document.getElementById("orderBtn");

    checkoutItems.innerHTML = "";

    let total = 0;
    let message = "Hello, I want to order:%0A";

    if(cart.length === 0){
        checkoutItems.innerHTML = "<p>Your cart is empty</p>";
        if(totalSpan) totalSpan.textContent = "₦0";
        validateSoapRequirement();
        return;
    }

    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;
        const imgSrc = getImageSrc(item.name);

        checkoutItems.innerHTML += `
        <div class="checkout-item">
            <div class="checkout-item__img">
                <img src="${imgSrc}" alt="${item.name}" />
            </div>
            <div class="checkout-item__details">
                <span>${item.name} - ₦${item.price}</span>
                <div class="qty-selector">
                    <button onclick="decreaseCheckoutQty(${index})">−</button>
                    <input type="number" min="1" value="${item.quantity}" onchange="updateCheckoutQty(${index}, this.value)">
                    <button onclick="increaseCheckoutQty(${index})">+</button>
                </div>
            </div>
            <span class="subtotal">₦${itemTotal}</span>
            <button class="remove-btn" onclick="removeFromCheckout(${index})">Remove</button>
        </div>
        `;

        total += itemTotal;
        message += `${item.name} x${item.quantity} - ₦${itemTotal}%0A`;
    });

    totalSpan.textContent = `₦${total}`;

    // Validate soap requirement
    validateSoapRequirement();
}

function increaseCheckoutQty(index) {
    cart[index].quantity += 1;
    updateCheckoutDisplay();
}

function decreaseCheckoutQty(index) {
    if(cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    }
    updateCheckoutDisplay();
}

function updateCheckoutQty(index, value) {
    let qty = parseInt(value);
    if(qty < 1) qty = 1;
    cart[index].quantity = qty;
    updateCheckoutDisplay();
}

function removeFromCheckout(index) {
    cart.splice(index, 1);
    updateCheckoutDisplay();
}

function updateCheckoutDisplay() {
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCheckout();
    updateCartCount();
}

function clearCartAfterCheckout() {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    disableCheckoutIfEmpty();
}

function validateSoapRequirement() {
    const soapItems = cart.filter(item => 
        item.name.includes("Cleaning Solutions Small") || 
        item.name.includes("Cleaning Solutions Medium")
    );
    
    let soapTotal = 0;
    soapItems.forEach(item => {
        soapTotal += item.price * item.quantity;
    });

    const soapWarning = document.getElementById("soapWarning");
    const orderBtn = document.getElementById("orderBtn");
    if(soapItems.length > 0 && soapTotal < 3000) {
        soapWarning.style.display = "block";
        orderBtn.disabled = true;
        orderBtn.textContent = "Soap must be ₦3000+";
    } else {
        soapWarning.style.display = "none";
        orderBtn.disabled = false;
        orderBtn.textContent = "Order on WhatsApp";
    }
}

function openWhatsApp() {
    if(document.getElementById("orderBtn").disabled) {
        return;
    }
    
    let total = 0;
    let message = "Hello, I want to order:%0A";

    cart.forEach(item => {
        let itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `${item.name} x${item.quantity} - ₦${itemTotal}%0A`;
    });

    message += `%0ATotal: ₦${total}`;
    
    const phone = "2347064509776";
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        window.location.href = `whatsapp://send?phone=${phone}&text=${message}`;
    } else {
        window.open(`https://web.whatsapp.com/send?phone=${phone}&text=${message}`, "_blank");
    }

    // clear cart after checkout and update counter
    clearCartAfterCheckout();
}

// Initialize on page load
window.addEventListener('load', function() {
    disableCheckoutIfEmpty();
    if(document.getElementById("cartItems")) {
        displayCart();
    }
    if(document.getElementById("checkoutItems")) {
        displayCheckout();
    }

    // attach sort listener if dropdown exists on this page
    const sortDropdown = document.getElementById("sortProducts");
    if(sortDropdown) {
        sortDropdown.addEventListener("change", sortProducts);
    }

    // Initialize selected pack on product detail pages
    const firstPackCard = document.querySelector('.pack-card.active');
    if (firstPackCard) {
        firstPackCard.click();
    }
});

function addProductToCart(name, price, button) {
    let qty = 1;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existing = cart.find(item => item.name === name);

    if(existing) {
        existing.quantity += qty;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: qty
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    
    button.textContent = "Added ✓";
    button.classList.add("added");
    
    let card = button.closest(".product-card");
    if(card) {
        card.classList.add("added");
        setTimeout(() => { card.classList.remove("added"); }, 1000);
    }
    showToast(`✓ ${name} added to your cart!`);
    
    setTimeout(() => {
        button.textContent = "Add to Cart";
        button.classList.remove("added");
    }, 1000);

    updateCartCount();
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count, .mobile-cart-count').forEach(countEl => {
        countEl.textContent = totalItems;
        countEl.classList.toggle('visible', totalItems > 0);
    });
}

function selectPack(element, name, price) {
    selectedPack.name = name;
    selectedPack.price = price;

    const priceDisplay = document.getElementById('priceDisplay');
    if (priceDisplay) {
        priceDisplay.textContent = `₦${price}`;
    }

    const packOptions = document.querySelector('.pack-options');
    if (packOptions) {
        const packCards = packOptions.querySelectorAll('.pack-card');
        packCards.forEach(card => card.classList.remove('active'));
        element.classList.add('active');
    }
}

function addProductPackToCart(button) {
    if (!selectedPack.name || !selectedPack.price) {
        const firstPackCard = document.querySelector('.pack-card.active');
        if (firstPackCard) {
            // This will trigger selectPack and populate selectedPack
            firstPackCard.click(); 
        } else {
            console.error('Could not determine product to add.');
            alert('An error occurred. Please refresh and try again.');
            return;
        }
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let existing = cart.find(item => item.name === selectedPack.name);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            name: selectedPack.name,
            price: selectedPack.price,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    button.textContent = "Added ✓";
    button.classList.add("added");
    showToast(`✓ ${selectedPack.name} added to your cart!`);

    setTimeout(() => {
        button.textContent = "Add to Cart";
        button.classList.remove("added");
    }, 1000);
}

function sendEmail() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Basic validation
    if (!name || !email || !message) {
        alert("Please fill in all fields before sending your message.");
        return; 
    }

    // Email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    const subject = `Customer Inquiry from ${name}`;
    const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;

    window.location.href = `mailto:missadenike@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

    // Clear the form and show toast notification
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("message").value = "";
    showToast("✓ Form processed! Opening your email client.");
}

// Toast Notification function
function showToast(message) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.className = 'toast-notification';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// Category Filter function
function filterCategory(category, btnElement) {
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    if(btnElement) btnElement.classList.add('active');

    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        card.style.display = (category === 'All' || card.dataset.category === category) ? 'flex' : 'none';
    });
}

// sort products function //
// initialization happens on page load below

function sortProducts(){

const grid = document.querySelector(".product-grid");

const products =
Array.from(grid.querySelectorAll(".product-card"));

const sortValue =
document.getElementById("sortProducts").value;

let sortedProducts;

if(sortValue === "low"){

sortedProducts =
products.sort((a,b)=>
a.dataset.price - b.dataset.price);

}

else if(sortValue === "high"){

sortedProducts =
products.sort((a,b)=>
b.dataset.price - a.dataset.price);

}

else if(sortValue === "name"){

sortedProducts =
products.sort((a,b)=>
a.dataset.name.localeCompare(b.dataset.name));

}

else{

sortedProducts = products;

}

grid.innerHTML = "";

sortedProducts.forEach(product=>{
grid.appendChild(product);
});

}

function switchTab(event, tabId) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}


// 1. Back Button Logic
const btnBack = document.getElementById('btn-back');
if (btnBack) {
    btnBack.addEventListener('click', () => {
        window.history.back();
    });
}

// 2. Drawer Menu Logic (Mobile & Desktop)
const drawer = document.querySelector('.drawer');
const overlay = document.querySelector('.drawer-overlay');
// 3. Flying Cart Animation
function getCartTarget() {
    const candidates = [
        document.getElementById('cart-icon'),
        document.querySelector('.cart-link'),
        document.querySelector('.desktop-menu-btn'),
    ];

    for (const el of candidates) {
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            return el;
        }
    }

    // Fallback: return the first available element
    return candidates.find(Boolean);
}

function flyToCart(event) {
    const button = event.target.closest('.add-to-cart-btn');
    const targetElement = getCartTarget();
    if (!targetElement) return;

    const targetRect = targetElement.getBoundingClientRect();

    // Try to find a product image to animate
    const card = button ? button.closest('.product-card') : null;
    const sourceImg = (card && card.querySelector('img')) || document.querySelector('.product-image img');

    let flyer;
    const startRect = sourceImg ? sourceImg.getBoundingClientRect() : targetRect;

    if (sourceImg) {
        flyer = sourceImg.cloneNode(true);
        flyer.classList.add('flying-image');
        flyer.style.width = `${startRect.width}px`;
        flyer.style.height = `${startRect.height}px`;
    } else {
        flyer = document.createElement('div');
        flyer.classList.add('flying-item');
        flyer.style.width = '26px';
        flyer.style.height = '26px';
    }

    flyer.style.left = `${startRect.left}px`;
    flyer.style.top = `${startRect.top}px`;
    flyer.style.opacity = '1';
    flyer.style.transform = 'scale(1.1)';

    document.body.appendChild(flyer);

    // Force a reflow so the transition starts properly
    flyer.getBoundingClientRect();

    const endX = (targetRect.left + targetRect.width / 2) - (startRect.left + startRect.width / 2);
    const endY = (targetRect.top + targetRect.height / 2) - (startRect.top + startRect.height / 2);

    flyer.style.transform = `translate(${endX}px, ${endY}px) scale(0.25)`;
    flyer.style.opacity = '0';

    setTimeout(() => {
        flyer.remove();

        // Bump animation on the target icon
        targetElement.style.transform = 'scale(1.2)';
        targetElement.style.transition = 'transform 0.2s';
        setTimeout(() => {
            targetElement.style.transform = 'scale(1)';
        }, 200);
    }, 1000);
}

// Attach animation to all "Add to Cart" buttons using event delegation
// (works even if buttons are added dynamically)
document.body.addEventListener('click', event => {
    const button = event.target.closest('.add-to-cart-btn');
    if (!button) return;
    flyToCart(event);
});

// 4. Dark Mode Logic
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    updateThemeIcon(savedTheme === 'dark');
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
    const icons = document.querySelectorAll('.theme-toggle svg');
    icons.forEach(icon => {
        if (isDark) {
            icon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
        } else {
            icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
        }
    });
}

// Initialize theme on load
initTheme();