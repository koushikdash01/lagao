# Lagao.shop - Multi-Page Plant Ecommerce Website

## Project Overview

Lagao.shop has been restructured from a single landing page into a scalable, multi-page ecommerce plant website with a premium, minimal aesthetic. The site maintains the clean Bengali + modern design philosophy while providing a complete shopping experience.

## Project Structure

```
lagao/
├── index.html              # Landing page (minimal, 3 featured plants)
├── plants.html             # Catalog page (filterable grid)
├── plants/                 # Individual plant pages
│   ├── snake-plant.html
│   ├── peace-lily.html
│   ├── jade-plant.html
│   └── areca-palm.html
├── signup.html             # Registration page (Firebase-ready)
├── login.html              # Login page (Firebase-ready)
├── cart.html               # Shopping cart (localStorage-based)
├── style.css               # Shared global styles
├── script.js               # Shared JavaScript functionality
├── images/                 # Plant images
│   ├── snake.jpg
│   ├── peace.jpg
│   ├── jade.jpeg
│   └── areca.jpeg
├── logo.png
├── CNAME
└── README.md
```

## Key Features

### 1. **Landing Page (index.html)**
- Minimal, uncluttered design
- 7 main sections:
  - Hero section with dual CTA buttons
  - Emotion strip
  - Featured plants (exactly 3)
  - Categories preview
  - About section
  - CTA section
  - Footer
- Fixed navbar with search bar
- Smooth scroll navigation

### 2. **Plants Catalog (plants.html)**
- Responsive grid layout
- **Category filters:**
  - All Plants
  - Indoor Plants
  - Low Maintenance
  - Air Purifying
  - Succulents
- Frontend-only search/filter (JavaScript-based)
- Plant cards with images, names, prices, descriptions
- "View Plant" buttons link to individual plant pages

### 3. **Plantpedia System (plants/*.html)**
Individual plant pages with premium editorial design:
- Large hero image with overlay
- English name + Bengali name
- Pricing and "Add to Cart" button
- Detailed description
- Care guide cards:
  - Watering
  - Sunlight
  - Temperature/Humidity/Growth
- Plant details grid (height, light, watering, difficulty, etc.)
- Benefits and story section
- CTA section with links back to catalog

**Current Plants:**
- Snake Plant (সাপের গাছ)
- Peace Lily (শান্তি লিলি)
- Jade Plant (জেড প্লান্ট)
- Areca Palm (আরেকা পাম)

### 4. **Authentication Pages (signup.html, login.html)**
- Clean, minimal form design
- Email and password fields
- Google OAuth UI (placeholder)
- **Firebase integration points commented in code:**
  ```javascript
  // Firebase authentication will connect here:
  // firebase.auth().createUserWithEmailAndPassword(email, password)
  // firebase.auth().signInWithEmailAndPassword(email, password)
  ```
- Link between signup and login pages

### 5. **Shopping Cart (cart.html)**
- **Features:**
  - View all cart items with images
  - Quantity adjustment (+ / -)
  - Remove items
  - Subtotal, tax (5%), and total calculations
  - **LocalStorage-based persistence**
  - Empty cart state with call-to-action
- Sticky summary sidebar on desktop
- Responsive layout on mobile

## Design System

### Color Palette
```css
--bg: #f6f5f1;                  /* Off-white background */
--green: #17351f;               /* Deep green (text/sections) */
--green-light: #3ca55c;         /* Bright green (buttons/accents) */
--green-dark: #102517;          /* Dark green (footer) */
--text: #1d2a1f;                /* Dark text */
--muted: #5a665c;               /* Muted gray-green */
```

### Typography
- **Font:** Poppins (Google Fonts)
- **Weights:** 300, 400, 500, 600, 700
- Large, readable typography
- Clean hierarchy

### Spacing & Borders
- **Border Radius:** 26px (premium rounded corners)
- **Shadow:** `0 10px 35px rgba(0,0,0,0.08)`
- **Transitions:** 0.35s ease (smooth interactions)
- Strong whitespace and breathing room

## JavaScript Functionality

### Shared Scripts (script.js)
1. **Header Scroll Effect** - Dynamic header styling on scroll
2. **Fade-in Animations** - IntersectionObserver for scroll animations
3. **Search Functionality** - Frontend filtering by plant name
4. **Smooth Scroll** - Anchor link navigation
5. **Cart Management** - LocalStorage-based cart system:
   - `Cart` class with add/remove/update methods
   - `addItem()`, `removeItem()`, `updateQuantity()`
   - `getTotalPrice()`, `save()`, `clear()`
6. **Plant Database** - Temporary in-memory database with plant data
7. **Category Filtering** - Dynamic plant grid filtering
8. **Form Validation** - Email and password validation
9. **Add to Cart Button** - Toast notification on add

### How Search Works
```javascript
// Frontend-only search in navbar and plants page
const searchInput = document.querySelector('#navbar-search');
const plants = document.querySelectorAll('.plant-card');

searchInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  plants.forEach(plant => {
    const name = plant.getAttribute('data-name').toLowerCase();
    plant.style.display = name.includes(query) ? 'block' : 'none';
  });
});
```

## CSS Architecture

### Global Styles (style.css)
- **Organized sections:**
  - CSS Variables
  - Reset/Base Styles
  - Header/Navbar
  - Search Bar
  - Buttons (primary, secondary, outline, small)
  - Hero Section
  - Emotion Strip
  - Section Styles
  - Plants Grid
  - Card Styles
  - Categories
  - Plantpedia Styling
  - Forms
  - Cart Layout
  - Animations
  - Mobile Responsive Breakpoints

### Responsive Design
- **Breakpoints:**
  - Desktop: No constraints
  - Tablet: `@media (max-width: 900px)`
  - Mobile: `@media (max-width: 600px)`
  - Hide search bar on mobile
  - Stacked layouts on small screens
  - Adjusted typography sizes

## Expanding the Project

### Adding New Plants

1. **Create a new plant HTML file** in `/plants/`:
```html
<!-- plants/monstera-deliciosa.html -->
<!-- Follow the structure of existing plant pages -->
```

2. **Add plant to database** in `script.js`:
```javascript
const plantsDatabase = {
  // ... existing plants
  "monstera-deliciosa": {
    id: "monstera-deliciosa",
    name: "Monstera Deliciosa",
    bengaliName: "মনস্টেরা",
    price: 499,
    description: "Swiss Cheese Plant with iconic split leaves",
    image: "images/monstera.jpg",
    category: "indoor",
    difficulty: "Beginner",
    benefits: "Air purifying, fast growing",
    watering: "Every 1-2 weeks",
    sunlight: "Bright indirect light",
  }
};
```

3. **Add to plants.html** grid:
```html
<div class="plant-card" data-category="indoor" data-name="Monstera Deliciosa">
  <img src="images/monstera.jpg" alt="Monstera Deliciosa">
  <div class="plant-content">
    <h3>Monstera Deliciosa</h3>
    <div class="price">₹499</div>
    <p>Swiss Cheese Plant with iconic split leaves</p>
    <a href="plants/monstera-deliciosa.html" class="btn btn-primary btn-small">View Plant</a>
  </div>
</div>
```

### Connecting Firebase Authentication

**In `signup.html` and `login.html`**, replace form submissions with Firebase:

```javascript
// Replace the form validation with:
firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(userCredential => {
    console.log('User created:', userCredential.user);
    // Redirect to account page or dashboard
  })
  .catch(error => {
    alert('Signup failed: ' + error.message);
  });
```

### Backend Integration

**For database storage, add:**
- Firestore for plant catalog
- Real-time order management
- User profiles and order history
- Analytics tracking

## Mobile Responsiveness

✅ **Mobile-first approach implemented:**
- Header adapts (height, padding)
- Search bar hides on mobile
- Navigation font sizes scale
- Plant cards stack to 1 column
- Forms are touch-friendly
- Cart layout becomes single column
- All buttons are tap-friendly (min 44px)

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox support required
- CSS Variables support required
- IntersectionObserver API for animations
- LocalStorage for cart persistence

## Performance Optimizations

- No frameworks (lightweight, fast)
- Minimal dependencies (only Google Fonts)
- Lazy animations (IntersectionObserver)
- CSS-only hover effects
- Image optimization ready (alt text included)
- LocalStorage for cart (no server round-trips)

## Future Enhancements

### Phase 1 (Current)
- ✅ Multi-page structure
- ✅ Frontend search/filter
- ✅ Cart with localStorage
- ✅ Plant Plantpedia pages
- ✅ Authentication UI

### Phase 2
- Firebase Authentication
- Firestore database
- Order management
- User accounts
- Payment integration (Stripe/Razorpay)

### Phase 3
- Admin dashboard
- Inventory management
- Email notifications
- Wishlist feature
- Reviews and ratings

### Phase 4
- Blog section
- Plant care tips
- Community forum
- Mobile app (React Native)
- Advanced analytics

## File Size Reference

- `style.css` - ~18 KB (comprehensive, reusable)
- `script.js` - ~8 KB (lightweight, modular)
- HTML pages - 2-4 KB each (clean, semantic)
- Total CSS/JS: ~26 KB (excellent for page load)

## Development Notes

### Best Practices Used
1. **Semantic HTML** - Proper heading hierarchy, form labels, alt text
2. **Mobile-First CSS** - Start with base, enhance with media queries
3. **DRY Principle** - Shared CSS classes, reusable components
4. **Accessibility** - Proper contrast, semantic HTML, keyboard navigation
5. **Performance** - No unnecessary frameworks, optimized assets
6. **Maintainability** - Clear comments, organized file structure

### Code Organization
- Each page imports the same `style.css` and `script.js`
- CSS organized by component/section
- JavaScript organized by functionality
- Plant data centralized in `plantsDatabase`

## Troubleshooting

### Search Not Working
- Ensure plant cards have `data-name` attribute
- Check input selector in `initSearch()` matches your HTML

### Cart Not Persisting
- Verify browser allows LocalStorage
- Check browser console for storage quota errors

### Styles Not Loading
- Verify relative paths (use `../` from subdirectories)
- Check CSS file is in root directory

## Contact & Support

For questions or issues:
- Check the inline code comments
- Review the Plantpedia pages for reference implementations
- Ensure all file paths are correct
- Test in multiple browsers

---

**Lagao.shop** - Bringing nature back into everyday Bengali spaces through clean design and mindful plants. 🌿

Made with ❤️ and minimal code.
