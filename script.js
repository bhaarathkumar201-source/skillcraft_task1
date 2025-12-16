/* =========================
     Navbar scroll behavior & smooth navigation
     ========================= */

const navbar = document.getElementById('navbar');
const SCROLL_THRESHOLD = 80; // px before navbar enters scrolled state

// Toggle scrolled class for background/shrink effect
function handleScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}
window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();

// Smooth in-page navigation for links with hashes
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        // Default anchor scrolling
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // update active styles
            document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
            link.classList.add('active');
            // small delay to ensure class applied after scroll
            setTimeout(() => handleScroll(), 300);
        }
    });
});

// Backwards-compatible helpers (original HTML used these names)
function showHome() { document.querySelector('#homeSection')?.scrollIntoView({behavior:'smooth'}); }
function showLogin() { document.querySelector('#loginSection')?.scrollIntoView({behavior:'smooth'}); }

/* Optional: reduce motion for users who prefer reduced motion */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // remove animations by disabling relevant CSS classes (simple approach)
    document.documentElement.style.setProperty('--reduce-motion', '1');
}

/* =========================
     Create animated orbs and parallax effect
     ========================= */
(function createBgOrbs(){
    const bg = document.getElementById('bgOrbs');
    if (!bg) return;
    const colors = ['rgba(0,255,240,0.18)', 'rgba(255,0,200,0.14)', 'rgba(120,160,255,0.12)', 'rgba(255,200,90,0.10)'];
    const count = 6;
    for (let i=0;i<count;i++){
        const el = document.createElement('div');
        el.className = 'orb ' + ['orb--s','orb--m','orb--l','orb--xl'][Math.floor(Math.random()*4)];
        const left = Math.random()*100;
        const top = Math.random()*100;
        el.style.left = left + '%';
        el.style.top = top + '%';
        const color = colors[Math.floor(Math.random()*colors.length)];
        el.style.background = `radial-gradient(circle at 30% 30%, ${color}, transparent 40%)`;
        // animation duration and delay for natural float
        const dur = 10 + Math.random()*18;
        el.style.animation = `orbFloat ${dur}s ease-in-out ${Math.random()*-dur}s infinite`;
        el.style.opacity = (0.35 + Math.random()*0.65).toFixed(2);
        bg.appendChild(el);
    }

    // small parallax on mouse move
    let mx = 0, my = 0;
    window.addEventListener('mousemove', (ev)=>{
        const w = window.innerWidth, h = window.innerHeight;
        mx = (ev.clientX - w/2)/w;
        my = (ev.clientY - h/2)/h;
    }, {passive:true});

    function tick(){
        const nodes = bg.querySelectorAll('.orb');
        nodes.forEach((n, idx)=>{
            const depth = (idx % 4) / 8 + 0.05; // shallower to deeper
            const tx = mx * 40 * depth;
            const ty = my * 40 * depth;
            n.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
        });
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
})();

/* =========================
     Shopping Cart Functionality
     ========================= */

// Product data
const products = [
    { id: 1, name: 'Dumbbell', price: 49.99, image: 'IMAGE/p1.jpg' },
    { id: 2, name: 'Gym Towel', price: 19.99, image: 'IMAGE/p2.jpg' },
    { id: 3, name: 'Wristband', price: 9.99, image: 'IMAGE/p3.jpg' },
    { id: 4, name: 'Gym Bag', price: 39.99, image: 'IMAGE/p4.jpg' },
    { id: 5, name: 'Sports Shoes', price: 89.99, image: 'IMAGE/p5.jpg' },
    { id: 6, name: 'Tracksuit', price: 79.99, image: 'IMAGE/p6.jpg' },
    { id: 7, name: 'T-Shirt', price: 24.99, image: 'IMAGE/p7.jpg' }
];

// Cart state
let cart = [];

// DOM elements
const productsGrid = document.getElementById('productsGrid');
const cartSidebar = document.getElementById('cartSidebar');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const cartBtn = document.getElementById('cartBtn');
const closeCart = document.getElementById('closeCart');

// Render products
function renderProducts() {
    productsGrid.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;
        productsGrid.appendChild(card);
    });
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

// Update cart UI
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="cart-item-quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    // Update total
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = total.toFixed(2);
}

// Toggle cart sidebar
function toggleCart() {
    cartSidebar.classList.toggle('open');
    document.body.classList.toggle('cart-open'); // Optional: prevent body scroll
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();

    // Pre-populate cart with some items (for demo)
    addToCart(1); // Dumbbell
    addToCart(7); // T-Shirt

    // Add to cart buttons
    productsGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        }
    });

    // Cart button
    cartBtn.addEventListener('click', toggleCart);

    // Close cart
    closeCart.addEventListener('click', toggleCart);

    // Close cart when clicking outside (optional)
    document.addEventListener('click', (e) => {
        if (!cartSidebar.contains(e.target) && !cartBtn.contains(e.target)) {
            cartSidebar.classList.remove('open');
            document.body.classList.remove('cart-open');
        }
    });
});


