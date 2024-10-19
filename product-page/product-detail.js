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
    document.getElementById('cart-count').textContent = cartCount; // Ensure you have an element with id 'cart-count' in your navbar
}

// Add a product to the cart
function addToCart(product) {
    const cartItems = getLocalStorage('cart') || [];
    const existingProduct = cartItems.find(item => item.name === product.name);

    if (existingProduct) {
        existingProduct.quantity += 1; // Increase quantity if product already exists
    } else {
        cartItems.push({ ...product, quantity: 1 }); // Add new product with quantity 1
    }

    setLocalStorage('cart', cartItems); // Save updated cart to local storage
    updateCartCount(); // Update cart count displayed in the cart icon
}

// Fetch product details based on ID from URL
async function fetchProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id'); // Using 'id' to match with the JSON property

    try {
        const response = await fetch('../assets/products.json'); // Correct path to your products.json
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const products = await response.json(); // Parse the JSON data into a variable
        const product = products.find(item => item.id.toLowerCase() === productId.toLowerCase()); // Find the product by id

        if (product) {
            displayProductDetails(product);
        } else {
            console.error('Product not found');
        }
    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}

// Function to display the product details
function displayProductDetails(product) {
    document.getElementById('productImage').src = product.image || '../assets/images/default_wig.jpg'; // Use 'image' property
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productDescription').textContent = product.description;
    document.getElementById('productPrice').textContent = `$${product.price.toFixed(2)}`;

    // Add event listener for the "Add to Cart" button
    const addToCartButton = document.getElementById('add-to-cart-button');
    addToCartButton.onclick = () => {
        addToCart({
            name: product.name,
            price: product.price,
            image: product.image,
            description: product.description
        });
    };
}

// Back button functionality
function goBack() {
    window.history.back(); // Go back to the previous page
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    fetchProductDetails(); // Fetch product details when the page loads
    updateCartCount(); // Update cart count displayed in the navbar
});