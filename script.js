/* ============================================
   LAGAO.SHOP - GLOBAL SCRIPTS
   ============================================ */

// ============================================
// HEADER SCROLL EFFECT
// ============================================

window.addEventListener("scroll", () => {
  const header = document.querySelector("header");

  if (window.scrollY > 40) {
    header.style.background = "rgba(255,255,255,0.98)";
    header.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)";
  } else {
    header.style.background = "rgba(255,255,255,0.95)";
    header.style.boxShadow = "none";
  }
});

// ============================================
// FADE IN ANIMATIONS
// ============================================

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

document.querySelectorAll(".fade-in").forEach((el) => {
  observer.observe(el);
});

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

function initSearch(searchInputSelector, itemsSelector, nameAttribute = "data-name") {
  const searchInput = document.querySelector(searchInputSelector);
  const items = document.querySelectorAll(itemsSelector);

  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();

    items.forEach((item) => {
      const name = item.getAttribute(nameAttribute).toLowerCase();
      if (name.includes(query)) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  });
}

// ============================================
// SMOOTH SCROLL TO SECTION
// ============================================

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href === "#") return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// ============================================
// CART FUNCTIONALITY (LOCAL STORAGE)
// ============================================

class Cart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem("cart")) || [];
  }

  addItem(plant) {
    const existingItem = this.items.find((item) => item.id === plant.id);

    if (existingItem) {
      existingItem.quantity += plant.quantity || 1;
    } else {
      this.items.push(plant);
    }

    this.save();
  }

  removeItem(plantId) {
    this.items = this.items.filter((item) => item.id !== plantId);
    this.save();
  }

  updateQuantity(plantId, quantity) {
    const item = this.items.find((item) => item.id === plantId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeItem(plantId);
      } else {
        this.save();
      }
    }
  }

  getTotalPrice() {
    return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  save() {
    localStorage.setItem("cart", JSON.stringify(this.items));
  }

  clear() {
    this.items = [];
    this.save();
  }
}

const cart = new Cart();

// ============================================
// PLANT DATABASE (TEMPORARY)
// ============================================

const plantsDatabase = {
  "snake-plant": {
    id: "snake-plant",
    name: "Snake Plant",
    bengaliName: "সাপের গাছ",
    price: 299,
    description: "Survives neglect better than most friendships.",
    image: "images/snake.jpg",
    category: "Low Maintenance",
    difficulty: "Beginner",
    benefits: "Air purifying, low maintenance",
    watering: "Every 3-4 weeks",
    sunlight: "Low to bright indirect light",
  },
  "peace-lily": {
    id: "peace-lily",
    name: "Peace Lily",
    bengaliName: "শান্তি লিলি",
    price: 349,
    description: "Brings instant calm to any corner.",
    image: "images/peace.jpg",
    category: "Air Purifying",
    difficulty: "Beginner",
    benefits: "Air purifying, pet friendly",
    watering: "Keep soil moist",
    sunlight: "Low to medium light",
  },
  "jade-plant": {
    id: "jade-plant",
    name: "Jade Plant",
    bengaliName: "জেড প্লান্ট",
    price: 399,
    description: "Plump, glossy leaves that store water.",
    image: "images/jade.jpeg",
    category: "Succulents",
    difficulty: "Beginner",
    benefits: "Low maintenance, long-lived",
    watering: "Every 2-3 weeks",
    sunlight: "Bright indirect light",
  },
  "areca-palm": {
    id: "areca-palm",
    name: "Areca Palm",
    bengaliName: "আরেকা পাম",
    price: 499,
    description: "Tropical elegance that filters the air.",
    image: "images/areca.jpeg",
    category: "Indoor Plants",
    difficulty: "Intermediate",
    benefits: "Air purifying, tropical vibe",
    watering: "Keep soil moist",
    sunlight: "Bright indirect light",
  },
};

// ============================================
// PLANTS PAGE - FILTER BY CATEGORY
// ============================================

function initCategoryFilter() {
  const categoryButtons = document.querySelectorAll(".category-btn");
  const plantCards = document.querySelectorAll(".plant-card");

  categoryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.getAttribute("data-category");

      categoryButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      plantCards.forEach((card) => {
        const cardCategory = card.getAttribute("data-category");
        if (category === "all" || cardCategory === category) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

// ============================================
// ADD TO CART BUTTON
// ============================================

document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();

    const plantId = btn.getAttribute("data-plant-id");
    const plant = plantsDatabase[plantId];

    if (plant) {
      cart.addItem({ ...plant, quantity: 1 });
      showCartNotification();
    }
  });
});

function showCartNotification() {
  const notification = document.createElement("div");
  notification.textContent = "Added to cart! 🌱";
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #3ca55c;
    color: white;
    padding: 16px 24px;
    border-radius: 50px;
    font-weight: 600;
    z-index: 2000;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

// ============================================
// FORM VALIDATION
// ============================================

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm(formSelector) {
  const form = document.querySelector(formSelector);
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = form.querySelector('input[type="email"]');
    const password = form.querySelector('input[type="password"]');

    if (email && !validateEmail(email.value)) {
      alert("Please enter a valid email address");
      return;
    }

    if (password && password.value.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    // Firebase authentication would connect here
    console.log("Form submitted:", {
      email: email?.value,
      password: password?.value,
    });

    alert("Form submitted successfully!");
  });
}

// ============================================
// SLIDESHOW ANIMATION
// ============================================

const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;
document.head.appendChild(style);

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  initCategoryFilter();
  validateForm("form");
});
