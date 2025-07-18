document.addEventListener('DOMContentLoaded', function() {
  // Back button functionality
  document.querySelector('.back-btn').addEventListener('click', function() {
    window.location.href = '../HomePage/index.html';
  });

  // Load cart from localStorage
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const cartItemsDiv = document.getElementById('cart-items');
  const summaryDiv = document.querySelector('.summary');
  const checkoutBtn = document.querySelector('.checkout-btn');

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
    summaryDiv.style.display = 'none';
    checkoutBtn.style.display = 'none';
    return;
  }

  // Render all products
  cartItemsDiv.innerHTML = cart.map((item, idx) => `
    <div class="cart-item" data-idx="${idx}">
      <img src="${item.img}" alt="${item.name}">
      <div class="details">
        <h2>${item.name}</h2>
        ${item.size ? `<p>Size ${item.size}</p>` : ''}
        <div class="quantity">
          <button class="minus">-</button>
          <span>${item.qty || 1}</span>
          <button class="plus">+</button>
        </div>
      </div>
      <span class="item-price">$${item.price}.00</span>
    </div>
  `).join('');

  // Show summary and checkout button
  summaryDiv.style.display = 'block';
  checkoutBtn.style.display = 'block';

  // Update total price
  function updateTotals() {
    cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const subtotal = cart.reduce((total, item) => total + (item.price * (item.qty || 1)), 0);
    document.getElementById('subtotal').textContent = `$${subtotal}.00`;
    document.getElementById('total').textContent = `$${subtotal}.00`;
  }
  updateTotals();

  // Quantity functionality
  cartItemsDiv.querySelectorAll('.cart-item').forEach((cartItem, idx) => {
    const minus = cartItem.querySelector('.minus');
    const plus = cartItem.querySelector('.plus');
    const display = cartItem.querySelector('span');
    minus.addEventListener('click', () => {
      let value = parseInt(display.textContent);
      if (value > 1) {
        display.textContent = value - 1;
        cart[idx].qty = value - 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateTotals();
      } else if (value === 1) {
        display.textContent = 0;
        cart[idx].qty = 0;
        cart.splice(idx, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
      
        location.reload();
      }
    });
    plus.addEventListener('click', () => {
      let value = parseInt(display.textContent);
      display.textContent = value + 1;
      cart[idx].qty = value + 1;
      localStorage.setItem('cart', JSON.stringify(cart));
      updateTotals();
    });
  });

  // Checkout button functionality
  checkoutBtn.addEventListener('click', function() {
    alert('Proceeding to checkout...');
  });

  // Show success message if present
  const cartMessage = localStorage.getItem('cartMessage');
  if (cartMessage) {
    const msgDiv = document.createElement('div');
    msgDiv.textContent = cartMessage;
    msgDiv.style.background = '#d4edda';
    msgDiv.style.color = '#155724';
    msgDiv.style.padding = '10px';
    msgDiv.style.marginBottom = '15px';
    msgDiv.style.borderRadius = '6px';
    msgDiv.style.textAlign = 'center';
    document.querySelector('.cart-container').prepend(msgDiv);
   
    
    localStorage.removeItem('cartMessage');
  }
});
