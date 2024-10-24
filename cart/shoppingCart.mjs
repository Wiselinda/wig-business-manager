import { getLocalStorage, setLocalStorage, updateCartCount } from './cart.js';

function cartItemTemplate(item) {
  return `
    <li class='cart-card'>
      <span class='remove-btn' data-id="${item.id}">❌</span>
      <img src='${item.image}' alt='${item.name}' class='cart-card__image' />
      <div class='cart-card__details'>
        <h2>${item.name}</h2>
        <p>Color: ${item.color || 'N/A'}</p>
        <div class="quantity-control">
          <button class='reduce-btn' data-id="${item.id}">&minus;</button>
          <span>${item.quantity}</span>
          <button class='increase-btn' data-id="${item.id}">&plus;</button>
        </div>
        <p class='cart-card__price'>$${(item.price * item.quantity).toFixed(2)}</p>
      </div>
    </li>
  `;
}

export default class ShoppingCart {
  constructor(key) {
    this.key = key;
    this.productGrid = '#product-grid';
    this.cartFooter = '.cart-footer';
    this.initCart();
  }

  initCart() {
    this.renderCartContents();
    updateCartCount();
  }

  renderCartContents() {
    const cartItems = getLocalStorage(this.key) || [];
    const productGrid = document.querySelector(this.productGrid);
    
    if (cartItems.length === 0) {
      productGrid.innerHTML = "<li>Your cart is empty.</li>";
      this.hideFooter();
    } else {
      productGrid.innerHTML = cartItems.map(cartItemTemplate).join('');
      this.showFooter(cartItems);
      this.setupEventListeners();
    }
  }

  setupEventListeners() {
    document.querySelectorAll('.remove-btn').forEach(button => {
      button.addEventListener('click', (e) => this.removeItem(e.target.dataset.id));
    });

    document.querySelectorAll('.increase-btn').forEach(button => {
      button.addEventListener('click', (e) => this.increaseItem(e.target.dataset.id));
    });

    document.querySelectorAll('.reduce-btn').forEach(button => {
      button.addEventListener('click', (e) => this.decreaseItem(e.target.dataset.id));
    });
  }

  removeItem(id) {
    const cartItems = getLocalStorage(this.key).filter(item => item.id !== id);
    setLocalStorage(this.key, cartItems);
    this.renderCartContents();
    updateCartCount();
  }

  increaseItem(id) {
    const cartItems = getLocalStorage(this.key).map(item => {
      if (item.id === id) item.quantity++;
      return item;
    });
    setLocalStorage(this.key, cartItems);
    this.renderCartContents();
  }

  decreaseItem(id) {
    const cartItems = getLocalStorage(this.key).map(item => {
      if (item.id === id && item.quantity > 1) item.quantity--;
      return item;
    });
    setLocalStorage(this.key, cartItems);
    this.renderCartContents();
  }

  showFooter(cartItems) {
    const footer = document.querySelector(this.cartFooter);
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.querySelector('.cart-total').textContent = `Total: $${total.toFixed(2)}`;
    footer.classList.remove('hide');
  }

  hideFooter() {
    document.querySelector(this.cartFooter).classList.add('hide');
  }
}
