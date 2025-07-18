document.querySelector('.clear-btn').addEventListener('click', () => {
  document.querySelector('.search-box input').value = '';
});

let lastScrollY = window.scrollY;
let nav = document.querySelector('.bottom-nav');
window.addEventListener('scroll', function() {
  if (window.scrollY > lastScrollY) {
   
    nav.style.transform = 'translateY(100%)';
  } else {
    nav.style.transform = 'translateY(0)';
  }
  lastScrollY = window.scrollY;
});

// Map product names (or alt text) to product IDs used in product-detail.html
const productMap = {
  "Linen Blend Shirt": "linen_shirt",
  "Organic Cotton Tee": "organic_tee",
  "Sustainable Denim Jeans": "sustainable_denim",
  "Recycled Polyester Jacket": "polyester_jacket",
  "Bamboo Fiber Socks": "fiber_socks",
  "Vegan Leather Belt": "leather_belt",
  "Leather Loafers": "leather_loafers",
  "Summer Hat": "summer_hat"
};

document.querySelectorAll('.results-grid .product').forEach(productDiv => {
  productDiv.addEventListener('click', function() {
    // Get the product name from the <p> tag inside the product div
    const name = productDiv.querySelector('p')?.textContent.trim();
    const productId = productMap[name];
    if (productId) {
      window.location.href = `../HomePage/ProductDetailPage/product-detail.html?product=${productId}`;
    }
  });
});

const searchInput = document.querySelector('.search-box input');
const products = document.querySelectorAll('.results-grid .product');

function filterProducts() {
  const query = searchInput.value.trim().toLowerCase();
  let anyVisible = false;
  products.forEach(product => {
    const name = product.querySelector('p')?.textContent.trim().toLowerCase() || '';
    if (query && name.includes(query)) {
      product.style.display = '';
      anyVisible = true;
    } else {
      product.style.display = 'none';
    }
  });

  if (!query) {
    products.forEach(product => product.style.display = 'none');
  }
}

searchInput.addEventListener('input', filterProducts);

// Hide all products 
filterProducts();
