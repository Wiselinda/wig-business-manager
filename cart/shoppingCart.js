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
        
        if (cartItems.length === 0) {
            document.querySelector(this.productGrid).innerHTML = "<li>Your cart is empty.</li>";
            document.querySelector(this.cartFooterDOM).classList.add('hide');
        } else {
            const htmlItems = cartItems.map(item => cartItemTemplate(item)).join('');
            document.querySelector(this.productGrid).innerHTML = htmlItems;
            document.querySelector(this.cartFooterDOM).classList.remove('hide');
            this.updateCartEvents();
            this.displayTotal(cartItems);
        }

        updateCartCount(); 
    }

    updateCartEvents() {
        // Add event listeners after the elements are rendered
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
        this.renderCartContents();
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
            this.renderCartContents();
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
            this.renderCartContents();
        }
    }

    displayTotal(cart) {
        const totalDOM = document.querySelector('.cart-total');
        const total = cart.reduce((sum, item) => sum + item.FinalPrice * item.quantity, 0);
        totalDOM.innerHTML = `Total: $${total.toFixed(2)}`;

        document.getElementById('checkout-btn').addEventListener('click', () => {
            window.location.href = '../checkout/index.html';
        });
    }
}