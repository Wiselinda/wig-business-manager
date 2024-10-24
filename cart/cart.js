import ShoppingCart from './shoppingCart.mjs';

// Utility functions for localStorage operations
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Update the cart count and display it next to the cart icon
export function updateCartCount() {
  const cartItems = getLocalStorage('cart');
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // Update only the number inside the item-count span
  document.querySelector('#cart-count .item-count').textContent = totalQuantity;
}

// Initialize cart
document.addEventListener('DOMContentLoaded', () => {
  const cart = new ShoppingCart('cart');
  updateCartCount(); // Ensure the cart count updates when the page loads
});