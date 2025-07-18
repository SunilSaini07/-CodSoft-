 // Update total price
  function updateTotals() {
    cart = JSON.parse(localStorage.getItem('cart') || '[]');
    document.getElementById('total').textContent = `$${subtotal}.00`;
  }
  updateTotals();
