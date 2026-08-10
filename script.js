let cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeBtn = document.querySelector('.close-btn');
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotal = document.getElementById('cart-total');

document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    setupProductCardEvents();
});

function setupProductCardEvents() {
    const productCards = document.querySelectorAll('.catig');

    productCards.forEach(card => {
        const decrementBtn = card.querySelector('.decrement');
        const incrementBtn = card.querySelector('.increment');
        const qtyInput = card.querySelector('.qty-input');
        const sizeSelect = card.querySelector('.size-select');
        const colorSelect = card.querySelector('.color-select');
        const addToCartBtn = card.querySelector('.add-to-cart-btn');

        if (decrementBtn && incrementBtn && qtyInput) {
            decrementBtn.addEventListener('click', () => {
                let currentQty = parseInt(qtyInput.value) || 1;
                if (currentQty > 1) {
                    qtyInput.value = currentQty - 1;
                }
            });

            incrementBtn.addEventListener('click', () => {
                let currentQty = parseInt(qtyInput.value) || 1;
                qtyInput.value = currentQty + 1;
            });
        }

        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                const id = card.getAttribute('data-id');
                const name = card.getAttribute('data-name');
                const price = parseFloat(card.getAttribute('data-price'));
                const quantity = parseInt(qtyInput ? qtyInput.value : 1) || 1;
                const size = sizeSelect ? sizeSelect.value : 'M';
                const color = colorSelect ? colorSelect.value : 'Black';

                // Unique ID combining item ID, color, and size
                const itemCartId = `${id}-${color}-${size}`;

                const existingItem = cart.find(item => item.cartId === itemCartId);

                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    cart.push({ cartId: itemCartId, id, name, price, quantity, size, color });
                }

                saveCart();
                updateCartUI();

                if (qtyInput) qtyInput.value = 1;
            });
        }
    });
}

function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalCount;

    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';
    let totalCost = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: var(--text-light);">Your cart is empty.</p>';
    } else {
        cart.forEach((item, index) => {
            totalCost += item.price * item.quantity;
            
            const itemIdentifier = item.cartId || item.id || index;
            const displaySize = item.size ? item.size : 'M';
            const displayColor = item.color ? item.color : 'Black';

            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <div>
                    <strong>${item.name}</strong><br>
                    <small style="color: var(--text-light);">Color: ${displayColor} | Size: ${displaySize}</small><br>
                    ₦${item.price.toLocaleString()} x ${item.quantity}
                </div>
                <button onclick="removeFromCart('${itemIdentifier}')" style="color: #ef4444; border: none; background: none; cursor: pointer; font-weight: bold; font-size: 0.9rem;">Remove</button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    }

    if (cartTotal) cartTotal.textContent = totalCost.toLocaleString();
}

function removeFromCart(targetId) {
    cart = cart.filter((item, index) => item.cartId !== targetId && item.id !== targetId && index.toString() !== targetId.toString());
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Modal View Controls
if (cartBtn && cartModal && closeBtn) {
    cartBtn.addEventListener('click', () => cartModal.style.display = 'flex');
    closeBtn.addEventListener('click', () => cartModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) cartModal.style.display = 'none';
    });
}