// Example: Mark selected size or color
document.querySelectorAll('.size-options button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.size-options button').forEach(b => b.classList.remove('selected'));
    button.classList.add('selected');
  });
});

document.querySelectorAll('.color-options .circle').forEach(circle => {
  circle.addEventListener('click', () => {
    document.querySelectorAll('.color-options .circle').forEach(c => c.classList.remove('selected'));
    circle.classList.add('selected');
  });
});

document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', function() {
    const section = btn.closest('section[id]');
    if (!section) return;

    const productId = section.id;
    const name = section.querySelector('h1')?.textContent || '';
    let img = section.querySelector('.image-section img')?.getAttribute('src') || '';
    if (img) {
      img = img.split('/').pop();
      img = 'images/' + img;
    }
    const sizeBtn = section.querySelector('.size-options .selected');
    const size = sizeBtn ? sizeBtn.textContent : '';
    const priceMap = {
      linen_shirt: 120,
      organic_tee: 150,
      sustainable_denim: 180,
      polyester_jacket: 160,
      fiber_socks: 110,
      leather_belt: 130,
      leather_loafers: 140,
      summer_hat: 125
    };
    const price = priceMap[productId] || 120;

    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item.id === productId && item.size === size);
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      cart.push({ id: productId, name, img, size, price, qty: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));

    // Show success message on the product detail page
    let msgDiv = document.getElementById('add-to-cart-success');
    if (!msgDiv) {
      msgDiv = document.createElement('div');
      msgDiv.id = 'add-to-cart-success';
      msgDiv.style.background = '#d4edda';
      msgDiv.style.color = '#155724';
      msgDiv.style.padding = '10px';
      msgDiv.style.margin = '15px 0';
      msgDiv.style.borderRadius = '6px';
      msgDiv.style.textAlign = 'center';
      msgDiv.style.fontWeight = 'bold';
      btn.parentNode.insertBefore(msgDiv, btn.nextSibling);
    }
    msgDiv.innerHTML = 'Successfully Add to Cart! <br><button id="goto-cart-btn" style="margin-top:8px;padding:6px 16px;border:none;border-radius:5px;background:#007bff;color:#fff;cursor:pointer;">Go to Cart</button>';

    // Add event for "Go to Cart" button
    document.getElementById('goto-cart-btn').onclick = function() {
      window.location.href = '../../CartPage/cart.html';
    };
  });
});
