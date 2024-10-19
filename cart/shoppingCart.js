import { getLocalStorage, setLocalStorage, updateCartCount } from '../src/main.js';

function cartItemTemplate(item) {
    return `<li class='cart-card divider'>
        <span class='remove-btn' data-id="${item.Id}">❌</span>
        <a href='#' class='cart-card__image'>
          <img src='${item.Images.PrimarySmall}' alt='${item.Name}' />
        </a>
        <a href='#'>
          <h2 class='card__name'>${item.Name}</h2>
        </a>
        <p class='cart-card__color'>${item.Colors ? item.Colors[0].ColorName : 'N/A'}</p>
        <p class='cart-card__quantity'>
          <span class='reduce-btn' data-id="${item.Id}">&minus;</span> qty: ${item.quantity} 
          <span class='increase-btn' data-id="${item.Id}">&plus;</span>
        </p> 
        <p class='cart-card__price'>$${(item.FinalPrice * item.quantity).toFixed(2)}</p>
    </li>`;
}

export default class ShoppingCart {
    constructor(key, productGrid, cartFooterDOM) {  
        this.key = key;
        this.productGrid = productGrid;
        this.cartFooterDOM = cartFooterDOM;
        this.renderCartContents();
    }

    renderCartContents() {
        const cartItems = getLocalStorage(this.key) || [];
        
        // Check if there are any items in the cart
        if (cartItems.length === 0) {
            document.querySelector(this.productGrid).innerHTML = "<li>Your cart is empty.</li>";
            document.querySelector(this.cartFooterDOM).classList.add('hide'); // Hide footer if cart is empty
            return;
        }

        const htmlItems = cartItems.map(item => cartItemTemplate(item)).join('');
        document.querySelector(this.productGrid).innerHTML = htmlItems;
        this.updateCartEvents();
        this.displayTotal(cartItems);
        updateCartCount(); 
    }

    updateCartEvents() {
        this.removeFromCart(this.key);
        this.increaseInCart(this.key);
        this.decreaseInCart(this.key);
    }

    removeFromCart(key) {
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.dataset.id;
                this.removeItem(key, productId);
            });
        });
    }

    removeItem(key, productId) {
        const cartItems = getLocalStorage(key);
        const updatedCart = cartItems.filter(item => item.Id !== productId);
        setLocalStorage(key, updatedCart);
        this.renderCartContents(); // Refresh the cart UI
    }

    increaseInCart(key) {
        document.querySelectorAll('.increase-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.dataset.id;
                this.increaseItem(key, productId);
            });
        });
    }

    increaseItem(key, productId) {
        const cartItems = getLocalStorage(key);
        const item = cartItems.find(item => item.Id === productId);
        if (item) {
            item.quantity += 1;
            setLocalStorage(key, cartItems);
            this.renderCartContents(); // Refresh the cart UI
        }
    }

    decreaseInCart(key) {
        document.querySelectorAll('.reduce-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.dataset.id;
                this.decreaseItem(key, productId);
            });
        });
    }

    decreaseItem(key, productId) {
        const cartItems = getLocalStorage(key);
        const item = cartItems.find(item => item.Id === productId);
        if (item && item.quantity > 1) {
            item.quantity -= 1;
            setLocalStorage(key, cartItems);
            this.renderCartContents(); // Refresh the cart UI
        }
    }

    displayTotal(cart) {
        const cartFootDOM = document.querySelector(this.cartFooterDOM);
        const totalDOM = document.querySelector('.cart-total');
        if (cart.length === 0) {
            cartFootDOM.classList.add('hide');
            totalDOM.innerHTML = 'Total: $0.00';
        } else {
            cartFootDOM.classList.remove('hide');
            const total = cart.reduce((sum, item) => sum + item.FinalPrice * item.quantity, 0);
            totalDOM.innerHTML = `Total: $${total.toFixed(2)}`;
        }

        // Checkout button event
        document.getElementById('checkout-btn').addEventListener('click', () => {
            window.location.href = '../checkout/index.html';  // Redirect to checkout page
        });
    }
}