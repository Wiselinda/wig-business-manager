// Helper function to convert form data to JSON
function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};

  formData.forEach((value, key) => {
      convertedJSON[key] = value;
  });

  return convertedJSON;
}

// Package cart items for order submission
function packageItems(items) {
  return items.map(item => ({
      id: item.id,
      price: item.price,
      name: item.name,
      quantity: item.quantity,
  }));
}

class CheckoutProcess {
  constructor(cartKey) {
      this.cartKey = cartKey;
      this.cartItems = this.getCartItems();
      this.orderTotal = 0; // Initialize order total
      this.init();
  }

  getCartItems() {
      return JSON.parse(localStorage.getItem(this.cartKey)) || [];
  }

  // Calculate total values and update UI
  calculateOrderSummary() {
      let subtotal = 0;
      this.cartItems.forEach(item => {
          subtotal += item.price * item.quantity;
      });

      const tax = subtotal * 0.08; // Assume an 8% tax rate
      const shippingCost = document.querySelector("#shipping").value === "express" ? 15.00 : 5.00;
      const total = subtotal + tax + shippingCost;

      // Update UI elements
      document.getElementById("num-items").textContent = this.cartItems.length;
      document.getElementById("subtotal").textContent = subtotal.toFixed(2);
      document.getElementById("tax").textContent = tax.toFixed(2);
      document.getElementById("shipping-cost").textContent = shippingCost.toFixed(2);
      document.getElementById("order-total").textContent = total.toFixed(2);

      // Store total for confirmation during checkout
      this.orderTotal = total;
  }

  init() {
      this.calculateOrderSummary();
      this.setupPaymentOptions();
      this.setupOrderSubmission();
  }

  setupPaymentOptions() {
      const creditCardInfo = document.getElementById("credit-card-info");
      const paypalInfo = document.getElementById("paypal-info");

      document.getElementById("credit-card-btn").addEventListener("click", () => {
          creditCardInfo.style.display = "block";
          paypalInfo.style.display = "none";

          // Make Credit Card fields required
          this.setPaymentFieldsRequired(true);
      });

      document.getElementById("paypal-btn").addEventListener("click", () => {
          creditCardInfo.style.display = "none";
          paypalInfo.style.display = "block";

          // Make PayPal field required
          document.getElementById("paypal-email").setAttribute("required", true);

          // Remove required attributes from Credit Card fields
          this.setPaymentFieldsRequired(false);
      });

      document.getElementById("shipping").addEventListener("change", () => {
          this.calculateOrderSummary();
      });
  }

  setPaymentFieldsRequired(isCreditCard) {
      const creditCardFields = [
          "card-name",
          "card-number",
          "exp-date",
          "cvv"
      ];

      creditCardFields.forEach(field => {
          if (isCreditCard) {
              document.getElementById(field).setAttribute("required", true);
          } else {
              document.getElementById(field).removeAttribute("required");
          }
      });

      // For PayPal, we only set the PayPal email required
      if (!isCreditCard) {
          document.getElementById("paypal-email").setAttribute("required", true);
      }
  }

  setupOrderSubmission() {
      const checkoutForm = document.getElementById("checkout-form");
      checkoutForm.addEventListener("submit", (event) => {
          event.preventDefault();

          // Validate the cart has items
          if (this.cartItems.length === 0) {
              alert("Your cart is empty. Please add items to proceed.");
              return;
          }

          // Confirm the order total
          const confirmed = confirm(`Your order total is $${this.orderTotal.toFixed(2)}. Confirm to place your order.`);
          if (!confirmed) return;

          // Convert form data to JSON and package cart items
          const formData = formDataToJSON(checkoutForm);
          const orderData = {
              customerInfo: formData,
              items: packageItems(this.cartItems),
              total: this.orderTotal,
          };

          // Save orderData to local storage for record-keeping (or simulate sending to server)
          localStorage.setItem("lastOrder", JSON.stringify(orderData));

          // Clear cart after successful checkout
          this.clearCart();

          alert("Order placed successfully! Thank you for your purchase.");
          window.location.href = "../index.html"; // Redirect to homepage or order confirmation page
      });
  }

  clearCart() {
      localStorage.removeItem(this.cartKey);
      document.querySelector('#cart-count .item-count').textContent = '0'; // Reset cart count
  }
}

// Initialize checkout process
document.addEventListener('DOMContentLoaded', () => {
  new CheckoutProcess('cart');
});
