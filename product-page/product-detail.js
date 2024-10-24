// Utility functions to manage local storage
function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function setLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Update cart count in the navbar
function updateCartCount() {
    const cartItems = getLocalStorage('cart');
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
    document.getElementById('cart-count').textContent = cartCount; // Update cart count in the navbar
}

// Add a product to the cart
function addToCart(product) {
    const cartItems = getLocalStorage('cart');
    const existingProduct = cartItems.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += product.quantity; // Increase quantity if the product already exists in the cart
    } else {
        cartItems.push({ ...product, quantity: product.quantity }); // Add new product to the cart
    }

    setLocalStorage('cart', cartItems); // Save the updated cart in local storage
    updateCartCount(); // Update cart count in the navbar
    showSuccessMessage(); // Show success message after adding the product to the cart
}

// Fetch product details based on the ID from the URL
async function fetchProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id'); // Get the 'id' from the URL

    try {
        const response = await fetch('../assets/products.json'); // Adjust path as necessary
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const products = await response.json();
        const product = products.find(item => item.id.toLowerCase() === productId.toLowerCase());

        if (product) {
            displayProductDetails(product);
        } else {
            displayProductNotFound();
        }
    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}

// Display product details on the page
function displayProductDetails(product) {
    document.getElementById('productImage').src = product.image || '../assets/images/default_wig.jpg'; // Use default if no image
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productDescription').textContent = product.description;
    document.getElementById('productPrice').textContent = `$${product.price.toFixed(2)}`;

    // Add event listener for the "Add to Cart" button
    const addToCartButton = document.getElementById('add-to-cart-button');
    addToCartButton.onclick = () => {
        const quantity = parseInt(document.getElementById('productQuantity').value) || 1; // Get the selected quantity

        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            description: product.description,
            quantity: quantity
        });
    };
}

// Display a message when a product is not found
function displayProductNotFound() {
    document.getElementById('productName').textContent = 'Product not found';
    document.getElementById('productDescription').textContent = '';
    document.getElementById('productPrice').textContent = '';
    document.getElementById('add-to-cart-button').style.display = 'none';
}

// Show success message when a product is added to the cart
function showSuccessMessage() {
    const message = document.getElementById('successMessage');
    message.classList.add('show');

    // Hide the success message after 3 seconds
    setTimeout(() => {
        message.classList.remove('show');
    }, 3000);
}

// Go back to the previous page
function goBack() {
    window.history.back();
}

// Initialize the page once DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    fetchProductDetails(); // Fetch product details when the page loads
    updateCartCount(); // Update cart count in the navbar
});