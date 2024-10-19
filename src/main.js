// Utility functions to manage local storage
export function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

export function setLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Update cart count in the navbar
export function updateCartCount() {
    const cartItems = getLocalStorage('cart') || [];
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
    document.getElementById('cart-count').textContent = cartCount;
}

// Add a product to the cart
export function addToCart(product) {
    const cartItems = getLocalStorage('cart') || [];
    const existingProduct = cartItems.find(item => item.Id === product.name);

    if (existingProduct) {
        existingProduct.quantity += 1; // Increase quantity if product already exists
    } else {
        cartItems.push({ Id: product.name, ...product, quantity: 1 }); // Add new product with quantity 1
    }

    setLocalStorage('cart', cartItems); // Save updated cart to local storage
    updateCartCount(); // Update cart count displayed in the cart icon
}

// Fetch and display products when the page loads
export async function fetchProducts() {
    try {
        const response = await fetch('../assets/products.json'); // Correct path to your products.json
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Function to display products on the page
export function displayProducts(products) {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = ''; // Clear any previous content

    // Get category from URL (if applicable)
    const category = getQueryParam('category');

    // Filter products if a category is specified
    const filteredProducts = category ? products.filter(product => product.category === category) : products;

    filteredProducts.forEach(product => {
        const productCard = document.createElement('li');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <a href="../product-page/product-detail.html?id=${product.name}">
                <img src="${product.image}" alt="${product.name}" />
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>Color: ${product.color}</p>
                <p>Length: ${product.length}</p>
                <p>Material: ${product.material}</p>
                <p>Price: $${product.price.toFixed(2)}</p>
            </a>
        `;
        productGrid.appendChild(productCard);
    });
}

// Function to get the query parameter
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Search functionality
async function searchProducts(query) {
    try {
        const response = await fetch('../assets/products.json'); // Correct path
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const products = await response.json();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(query) || 
            product.description.toLowerCase().includes(query) ||
            product.color.toLowerCase().includes(query) ||
            product.length.toLowerCase().includes(query) ||
            product.material.toLowerCase().includes(query) ||
            product.price.toString().includes(query)
        );
        displayProducts(filteredProducts);
    } catch (error) {
        console.error('Error filtering products:', error);
    }
}

// Combined event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts(); // Fetch products when the page loads

    // Handle search form submission
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const query = document.getElementById('search-input').value.toLowerCase();
            searchProducts(query); // Use async search function
        });
    }

    // Slider functionality
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Start the slider
    showSlide(currentSlide);
    setInterval(nextSlide, 5000); // Change slide every 5 seconds
});

// Initial update to the cart count on page load
updateCartCount();