import { getLocalStorage, updateCartCount } from '../cart.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('checkout-form');
  const cartItems = getLocalStorage('cart') || [];

  // Calculate subtotal
  let subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let shipping = 5.00; // Flat rate shipping
  let taxRate = 0.08; // 8% tax rate
  let tax = subtotal * taxRate;
  let total = subtotal + shipping + tax;

  // Update the order summary in the DOM
  document.querySelector('.summary p:nth-child(2)').textContent = `Subtotal: $${subtotal.toFixed(2)}`;
  document.querySelector('.summary p:nth-child(3)').textContent = `Tax: $${tax.toFixed(2)}`;
  document.querySelector('.summary p:nth-child(4)').textContent = `Shipping: $${shipping.toFixed(2)}`;
  document.querySelector('.summary .total').textContent = `Order Total: $${total.toFixed(2)}`; // Fixed this line

  updateCartCount(); // Update the cart icon count on the page

  // Handle payment method switching
  const paymentMethodSelect = document.getElementById('payment-method');
  const creditCardInfo = document.getElementById('credit-card-info');
  const paypalInfo = document.getElementById('paypal-info');

  paymentMethodSelect.addEventListener('change', function () {
    if (this.value === 'credit-card') {
      creditCardInfo.style.display = 'block';
      paypalInfo.style.display = 'none';
      document.getElementById('card-name').required = true;
      document.getElementById('card-number').required = true;
      document.getElementById('exp-date').required = true;
      document.getElementById('cvv').required = true;
      document.getElementById('paypal-email').required = false;
    } else if (this.value === 'paypal') {
      creditCardInfo.style.display = 'none';
      paypalInfo.style.display = 'block';
      document.getElementById('card-name').required = false;
      document.getElementById('card-number').required = false;
      document.getElementById('exp-date').required = false;
      document.getElementById('cvv').required = false;
      document.getElementById('paypal-email').required = true;
    }
  });

  // Default to showing the credit card fields
  paymentMethodSelect.dispatchEvent(new Event('change'));

  // Handle form submission
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent form from refreshing the page

    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zip = document.getElementById('zip').value;
    const paymentMethod = document.getElementById('payment-method').value;
    let paymentDetails;

    if (paymentMethod === 'credit-card') {
      paymentDetails = {
        cardName: document.getElementById('card-name').value,
        cardNumber: document.getElementById('card-number').value,
        expDate: document.getElementById('exp-date').value,
        cvv: document.getElementById('cvv').value,
      };
    } else if (paymentMethod === 'paypal') {
      paymentDetails = {
        paypalEmail: document.getElementById('paypal-email').value,
      };
    }

    // Order object to send to server
    const order = {
      name,
      address,
      city,
      state,
      zip,
      paymentMethod,
      paymentDetails,
      items: cartItems,
      subtotal,
      shipping,
      tax,
      total,
    };

    // Mock order submission (in reality, you would send it to a server)
    console.log('Order submitted:', order);
    alert('Order successfully submitted!');

    // Clear cart after submission
    localStorage.removeItem('cart');
    updateCartCount();

    // Redirect to a success page or home page
    window.location.href = '../index.html';
  });
});
