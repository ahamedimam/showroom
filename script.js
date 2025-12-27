// Cart functionality
let cart = [];
let cartTotal = 0;

// DOM Elements
const cartIcon = document.getElementById('cartIcon');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.querySelector('.nav-menu');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const checkoutBtn = document.querySelector('.checkout-btn');

// Open/Close Cart
cartIcon.addEventListener('click', (e) => {
  e.preventDefault();
  cartSidebar.classList.add('active');
});

closeCart.addEventListener('click', () => {
  cartSidebar.classList.remove('active');
});

// Close cart when clicking outside
document.addEventListener('click', (e) => {
  if (!cartSidebar.contains(e.target) && !cartIcon.contains(e.target)) {
    cartSidebar.classList.remove('active');
  }
});

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});

// Add to cart functionality
addToCartButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    const productName = button.getAttribute('data-product');
    const productPrice = parseInt(button.getAttribute('data-price'));
    
    // Find product card to get image
    const productCard = button.closest('.product-card');
    const productImage = productCard.querySelector('.product-image img').src;
    const productInfo = productCard.querySelector('.product-info');
    const priceText = productInfo.querySelector('.price').textContent;
    
    // Add to cart
    const cartItem = {
      name: productName,
      price: productPrice,
      image: productImage,
      priceText: priceText
    };
    
    cart.push(cartItem);
    updateCart();
    
    // Show notification
    showNotification(`${productName} added to cart!`);
    
    // Animate cart icon
    cartIcon.style.transform = 'scale(1.2)';
    setTimeout(() => {
      cartIcon.style.transform = 'scale(1)';
    }, 200);
  });
});

// Update cart display
function updateCart() {
  cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
  cartCount.textContent = cart.length;
  cartTotalElement.textContent = cartTotal.toLocaleString('en-IN');
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    return;
  }
  
  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-item" style="display: flex; align-items: center; gap: 15px; padding: 15px; border-bottom: 1px solid #eee;">
      <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
      <div style="flex: 1;">
        <h4 style="margin-bottom: 5px;">${item.name}</h4>
        <p style="color: #666; font-size: 0.9rem;">${item.priceText}</p>
      </div>
      <button class="remove-item" data-index="${index}" style="background: #ff4444; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer;">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `).join('');
  
  // Add remove functionality
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = parseInt(e.target.closest('.remove-item').getAttribute('data-index'));
      cart.splice(index, 1);
      updateCart();
      showNotification('Item removed from cart');
    });
  });
}

// Checkout button
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  
  // Create WhatsApp message
  let message = 'Hello! I would like to place an order:\n\n';
  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name} - ${item.priceText}\n`;
  });
  message += `\nTotal: ₹${cartTotal.toLocaleString('en-IN')}`;
  
  const whatsappUrl = `https://wa.me/919999999999?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Notification function
function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: #25D366;
    color: white;
    padding: 15px 25px;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    z-index: 3000;
    animation: slideIn 0.3s ease-out;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 2000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe product cards
document.querySelectorAll('.product-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(card);
});

// Initialize cart
updateCart();
