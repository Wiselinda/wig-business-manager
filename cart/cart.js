import ShoppingCart from './shoppingCart.mjs';

// Utility functions for localStorage operations
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function updateCartCount() {
  const cartItems = getLocalStorage('cart');
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelector('#cart-count .item-count').textContent = totalQuantity;
}

// Update subtotal and store in localStorage
function updateCartTotals() {
  const cartItems = getLocalStorage('cart');
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  localStorage.setItem('cartSubtotal', JSON.stringify(subtotal));
}

// Run this whenever an item is added, removed, or quantity changes
document.addEventListener('DOMContentLoaded', () => {
  const cart = new ShoppingCart('cart');
  updateCartCount();
  updateCartTotals();
});
