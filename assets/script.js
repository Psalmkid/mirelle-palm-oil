// Developer Signature Console
console.log(
    "%cWebsite developed by Samuel Abioro 🚀",
    "color:#ff6600;font-size:16px;font-weight:bold;"
);

console.log(
    "%cFrontend Developer | JavaScript | Web Development",
    "color:gray;font-size:12px;"
);

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedPack = {};

function updateCartCounter() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;

    cart.forEach(item => {
        total += item.quantity;
    });

    let counter = document.getElementById("cart-count");

    if(counter) {
        counter.textContent = total;

        counter.classList.add("bump");

        setTimeout(() => {
            counter.classList.remove("bump");
        }, 300);
    }
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
}

// Cart Page Functions
function displayCart() {
    const cartItemsDiv = document.getElementById("cartItems");
    cartItemsDiv.innerHTML = "";

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    cart.forEach((item, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-item");

        itemDiv.innerHTML = `
        <span class="product-name">${item.name}</span>

        <div class="quantity-controls">
            <button onclick="decreaseQty(${index})">−</button>
            <span>${item.quantity}</span>
            <button onclick="increaseQty(${index})">+</button>
        </div>

        <span class="price">₦${item.price * item.quantity}</span>

        <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
        `;

        cartItemsDiv.appendChild(itemDiv);
    });
}

function increaseQty(index) {
    cart[index].quantity += 1;
    updateCart();
}

function decreaseQty(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
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
    updateCartCounter();
    disableCheckoutIfEmpty();
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
        return;
    }

    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;

        checkoutItems.innerHTML += `
        <div class="checkout-item">
            <span>${item.name} - ₦${item.price}</span>
            <div class="qty-selector">
                <button onclick="decreaseCheckoutQty(${index})">−</button>
                <input type="number" min="1" value="${item.quantity}" onchange="updateCheckoutQty(${index}, this.value)">
                <button onclick="increaseCheckoutQty(${index})">+</button>
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
    } else {
        cart.splice(index, 1);
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
    updateCartCounter();
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
    if((soapSmall || soapMedium) && soapTotal < 3000) {
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
    
    const whatsappUrl = "https://wa.me/2347064509776?text=" + message;
    window.open(whatsappUrl, "_blank");
}

// Initialize on page load
window.addEventListener('load', function() {
    updateCartCounter();
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

    updateCartCounter();

    /* Button animation */
    button.textContent = "Added ✓";
    button.classList.add("added");

    let card = button.closest(".product-card");
    card.classList.add("added");

    setTimeout(() => {
        button.textContent = "Add to Cart";
        button.classList.remove("added");
        card.classList.remove("added");
    }, 1000);

    /* Cart shake */
    let cartIcon = document.querySelector(".cart-icon");

    if(cartIcon) {
        cartIcon.classList.add("shake");

        setTimeout(() => {
            cartIcon.classList.remove("shake");
        }, 400);
    }
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
    updateCartCounter();

    /* Button animation */
    button.textContent = "Added ✓";
    button.classList.add("added");

    setTimeout(() => {
        button.textContent = "Add to Cart";
        button.classList.remove("added");
    }, 1000);

    /* Cart shake */
    let cartIcon = document.querySelector(".cart-icon");
    if(cartIcon) {
        cartIcon.classList.add("shake");
        setTimeout(() => { cartIcon.classList.remove("shake"); }, 400);
    }
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

    window.location.href = `mailto:misadenike@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
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
