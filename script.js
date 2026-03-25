// DOM Elements will be defined inside DOMContentLoaded
let navMenu, hamburger, navLinks, recommendationsGrid, menuGrid, categoryBtns, currentDateElement;
let reservationForm, newsletterForm, floatingOrderBtn, whatsappModal, modalOverlay, modalClose;

// Minimized Reservation Elements
let navReservationBtn, reservationModal, reservationModalOverlay, reservationModalClose, modalReservationForm;

// Cart Elements
let cartBadge;

// Category Detail Page Elements
let categoryDetailPage, backButton, categoryTitle, categoryDescription;
let categoryItemCount, categoryPrepTime, categorySpiceLevel, categoryItemsGrid;
let categoryHeroImage, categoryNameInTitle;

// Food Item Detail Page Elements
let foodItemDetailPage, foodItemBackButton, foodItemImage, foodItemName;
let foodItemDescription, foodItemPrepTime, foodItemSpiceLevel, foodItemIngredients;
let foodItemCalories, foodItemProtein, foodItemCarbs, foodItemAllergens;
let foodItemPrice, decreaseQty, increaseQty, addToCartBtn, quantityDisplay;

// Cart Popup Elements
let cartPopup, cartPopupOverlay, cartPopupClose, cartItemsList;
let cartEmptyMessage, cartTotalAmount, cartWhatsAppBtn, floatingCartBtn, floatingCartCount;

// Customer Details Form Elements
let customerName, deliveryTime, deliveryDate, deliveryLocation, specialInstructions;

// Shopping Cart
let cart = [];

// Cart Functions
function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    updateCartBadge();
    updateCartDisplay(); // Update cart button visibility immediately
    showNotification(`${item.name} added to cart!`, 'success');
}

function updateCartBadge() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    if (totalItems > 0) {
        cartBadge.textContent = totalItems;
        cartBadge.classList.remove('empty');
    } else {
        cartBadge.textContent = '0';
        cartBadge.classList.add('empty');
    }
}

function getCartSummary() {
    return cart.map(item => 
        `• ${item.name} (x${item.quantity}) - ${item.price}`
    ).join('\n');
}

// Food Photos from Assets
const foodPhotos = [
    'assets/images/652915904_963659556237240_6309603174102272531_n.jpg',
    'assets/images/653700701_963659522903910_926241426865272640_n.jpg',
    'assets/images/653702552_963659542903908_7015183637697663978_n.jpg',
    'assets/images/653705019_963659506237245_8371187904235938820_n.jpg',
    'assets/images/653705418_963659409570588_4197455826349683040_n.jpg',
    'assets/images/653706075_963659596237236_7545349917405451024_n.jpg',
    'assets/images/636643509_941540581782471_8755384936553117064_n.jpg',
    'assets/images/636679488_941540638449132_7701090060312251468_n.jpg',
    'assets/images/637013469_941540615115801_1322117913686776318_n.jpg',
    'assets/images/637424558_941538855115977_7878569932847660976_n.jpg',
    'assets/images/638401174_941540578449138_5460591836351719171_n.jpg'
];

// Sample Data with Real Photos and Local Business Info
const dailyRecommendations = [
    {
        id: 1,
        name: "Grilled Chicken Special",
        description: "Tender grilled chicken with herbs and spices, served with rice",
        price: "K15,000",
        badge: "Chef's Choice",
        image: foodPhotos[0],
        features: ["Fresh", "High Protein", "House Special"]
    },
    {
        id: 2,
        name: "Beef Stir Fry",
        description: "Sizzling beef with mixed vegetables in savory sauce",
        price: "K18,000",
        badge: "Popular",
        image: foodPhotos[1],
        features: ["Spicy", "Fresh", "Flavorful"]
    },
    {
        id: 3,
        name: "Vegetable Deluxe",
        description: "Fresh seasonal vegetables stir-fried to perfection",
        price: "K10,000",
        badge: "Healthy",
        image: foodPhotos[2],
        features: ["Vegan", "Organic", "Nutritious"]
    },
    {
        id: 4,
        name: "Fish Curry Special",
        description: "Fresh fish in aromatic curry with coconut milk",
        price: "K20,000",
        badge: "Must Try",
        image: foodPhotos[3],
        features: ["Seafood", "Aromatic", "Traditional"]
    },
    {
        id: 5,
        name: "Mixed Grill Plate",
        description: "Assorted grilled meats and vegetables with sides",
        price: "K25,000",
        badge: "Bestseller",
        image: foodPhotos[4],
        features: ["Variety", "Hearty", "Value"]
    },
    {
        id: 6,
        name: "Pasta Special",
        description: "Italian pasta with fresh vegetables and herbs",
        price: "K12,000",
        badge: "Trending",
        image: foodPhotos[5],
        features: ["Italian", "Vegetarian", "Creamy"]
    }
];

const menuItems = [
    {
        id: 1,
        name: "Spring Rolls",
        category: "appetizers",
        description: "Crispy vegetable spring rolls with sweet chili sauce",
        price: "K8,000",
        image: foodPhotos[2]
    },
    {
        id: 2,
        name: "Chicken Wings",
        category: "appetizers",
        description: "Spicy grilled chicken wings with dipping sauce",
        price: "K10,000",
        image: foodPhotos[0]
    },
    {
        id: 3,
        name: "Fresh Salad",
        category: "appetizers",
        description: "Mixed greens with tomatoes, cucumbers and house dressing",
        price: "K6,000",
        image: foodPhotos[5]
    },
    {
        id: 4,
        name: "Beef Steak",
        category: "mains",
        description: "Grilled beef steak with mashed potatoes and vegetables",
        price: "K30,000",
        image: foodPhotos[1]
    },
    {
        id: 5,
        name: "Chicken Curry",
        category: "mains",
        description: "Tender chicken in aromatic curry sauce with rice",
        price: "K18,000",
        image: foodPhotos[3]
    },
    {
        id: 6,
        name: "Vegetable Stir Fry",
        category: "mains",
        description: "Mixed vegetables with tofu and Asian spices",
        price: "K12,000",
        image: foodPhotos[2]
    },
    {
        id: 7,
        name: "Rice & Beans",
        category: "mains",
        description: "Traditional rice and beans with seasoning",
        price: "K10,000",
        image: foodPhotos[6]
    },
    {
        id: 8,
        name: "Nshima Special",
        category: "mains",
        description: "Local favorite with relish and vegetables",
        price: "K15,000",
        image: foodPhotos[7]
    },
    {
        id: 9,
        name: "Fruit Salad",
        category: "desserts",
        description: "Fresh seasonal fruits with honey dressing",
        price: "K5,000",
        image: foodPhotos[5]
    },
    {
        id: 10,
        name: "Ice Cream",
        category: "desserts",
        description: "Vanilla ice cream with chocolate sauce",
        price: "K4,000",
        image: foodPhotos[4]
    },
    {
        id: 11,
        name: "Fresh Juice",
        category: "beverages",
        description: "Freshly squeezed fruit juice of your choice",
        price: "K2,500",
        image: foodPhotos[8]
    },
    {
        id: 12,
        name: "Soft Drinks",
        category: "beverages",
        description: "Assorted cold soft drinks",
        price: "K2,000",
        image: foodPhotos[9]
    },
    {
        id: 13,
        name: "Local Tea",
        category: "beverages",
        description: "Traditional Malawian tea preparation",
        price: "K3,000",
        image: foodPhotos[10]
    }
];

// Category Data with Details
const categoryData = {
    appetizers: {
        name: 'Appetizers',
        title: 'Appetizers',
        description: 'Start your meal with our delicious appetizers. Perfect for sharing or as a light beginning to your dining experience.',
        prepTime: '10-15 min',
        spiceLevel: 'Mild to Medium',
        icon: 'fas fa-cheese',
        color: '#e74c3c'
    },
    mains: {
        name: 'Main Courses',
        title: 'Main Courses',
        description: 'Hearty and satisfying main courses prepared with fresh ingredients and authentic Malawian flavors.',
        prepTime: '20-35 min',
        spiceLevel: 'Medium to Hot',
        icon: 'fas fa-drumstick-bite',
        color: '#d35400'
    },
    desserts: {
        name: 'Desserts',
        title: 'Desserts',
        description: 'Sweet endings to your perfect meal. Our desserts are made fresh daily with love and care.',
        prepTime: '5-10 min',
        spiceLevel: 'Sweet',
        icon: 'fas fa-ice-cream',
        color: '#9b59b6'
    },
    beverages: {
        name: 'Beverages',
        title: 'Beverages',
        description: 'Refreshing drinks and beverages to complement your meal. From traditional Malawian drinks to modern favorites.',
        prepTime: '5 min',
        spiceLevel: 'None',
        icon: 'fas fa-glass-martini-alt',
        color: '#3498db'
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Loaded - Initializing website...');
    
    // Initialize DOM Elements
    navMenu = document.querySelector('.nav-menu');
    hamburger = document.querySelector('.hamburger');
    navLinks = document.querySelectorAll('.nav-link');
    recommendationsGrid = document.getElementById('recommendationsGrid');
    menuGrid = document.getElementById('menuGrid');
    categoryBtns = document.querySelectorAll('.category-btn');
    currentDateElement = document.getElementById('currentDate');
    reservationForm = document.getElementById('reservationForm');
    newsletterForm = document.querySelector('.newsletter-form');
    floatingOrderBtn = document.getElementById('floatingOrderBtn');
    whatsappModal = document.getElementById('whatsappModal');
    modalOverlay = document.getElementById('modalOverlay');
    modalClose = document.getElementById('modalClose');
    
    console.log('Floating order button element:', floatingOrderBtn);
    
    // Initialize other DOM Elements
    navReservationBtn = document.getElementById('navReservationBtn');
    reservationModal = document.getElementById('reservationModal');
    reservationModalOverlay = document.getElementById('reservationModalOverlay');
    reservationModalClose = document.getElementById('reservationModalClose');
    modalReservationForm = document.getElementById('modalReservationForm');
    cartBadge = document.getElementById('cartBadge');
    
    // Initialize Category Detail Page Elements
    categoryDetailPage = document.getElementById('categoryDetailPage');
    backButton = document.getElementById('backButton');
    categoryTitle = document.getElementById('categoryTitle');
    categoryDescription = document.getElementById('categoryDescription');
    categoryItemCount = document.getElementById('categoryItemCount');
    categoryPrepTime = document.getElementById('categoryPrepTime');
    categorySpiceLevel = document.getElementById('categorySpiceLevel');
    categoryItemsGrid = document.getElementById('categoryItemsGrid');
    categoryHeroImage = document.getElementById('categoryHeroImage');
    categoryNameInTitle = document.getElementById('categoryNameInTitle');
    
    // Initialize Food Item Detail Page Elements
    foodItemDetailPage = document.getElementById('foodItemDetailPage');
    foodItemBackButton = document.getElementById('foodItemBackButton');
    foodItemImage = document.getElementById('foodItemImage');
    foodItemName = document.getElementById('foodItemName');
    foodItemDescription = document.getElementById('foodItemDescription');
    foodItemPrepTime = document.getElementById('foodItemPrepTime');
    foodItemSpiceLevel = document.getElementById('foodItemSpiceLevel');
    foodItemIngredients = document.getElementById('foodItemIngredients');
    foodItemCalories = document.getElementById('foodItemCalories');
    foodItemProtein = document.getElementById('foodItemProtein');
    foodItemCarbs = document.getElementById('foodItemCarbs');
    foodItemAllergens = document.getElementById('foodItemAllergens');
    foodItemPrice = document.getElementById('foodItemPrice');
    decreaseQty = document.getElementById('decreaseQty');
    increaseQty = document.getElementById('increaseQty');
    addToCartBtn = document.getElementById('addToCartBtn');
    quantityDisplay = document.getElementById('quantityDisplay');
    
    // Initialize Cart Popup Elements
    cartPopup = document.getElementById('cartPopup');
    cartPopupOverlay = document.getElementById('cartPopupOverlay');
    cartPopupClose = document.getElementById('cartPopupClose');
    cartItemsList = document.getElementById('cartItemsList');
    cartEmptyMessage = document.getElementById('cartEmptyMessage');
    cartTotalAmount = document.getElementById('cartTotalAmount');
    cartWhatsAppBtn = document.getElementById('cartWhatsAppBtn');
    floatingCartBtn = document.getElementById('floatingCartBtn');
    floatingCartCount = document.getElementById('floatingCartCount');
    
    // Initialize Customer Details Form Elements
    customerName = document.getElementById('customerName');
    deliveryTime = document.getElementById('deliveryTime');
    deliveryDate = document.getElementById('deliveryDate');
    deliveryLocation = document.getElementById('deliveryLocation');
    specialInstructions = document.getElementById('specialInstructions');
    
    // Check if elements exist before using them
    if (currentDateElement) updateCurrentDate();
    if (recommendationsGrid) loadRecommendations();
    if (menuGrid) loadMenuItems('all');
    
    // Setup floating order button - OLD CODE REMOVED
    
    // Setup click handler for minimized hero
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('click', function(e) {
            if (hero.classList.contains('minimized')) {
                e.preventDefault();
                hero.classList.remove('minimized');
                // Scroll back to top smoothly
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    setupCategoryClickHandlers();
    setupBackButtonHandler();
    setupFoodItemHandlers();
    setupCartPopupHandlers();
    setupEventListeners();
    addScrollEffects();
});

// Update Current Date
function updateCurrentDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    currentDateElement.textContent = today.toLocaleDateString('en-US', options);
}

// Load Daily Recommendations
function loadRecommendations() {
    recommendationsGrid.innerHTML = '';
    
    dailyRecommendations.forEach(item => {
        const card = createRecommendationCard(item);
        recommendationsGrid.appendChild(card);
    });
}

// Create Recommendation Card
function createRecommendationCard(item) {
    const card = document.createElement('div');
    card.className = 'recommendation-card fade-in';
    card.innerHTML = `
        <div class="recommendation-badge">${item.badge}</div>
        <div class="recommendation-image">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
        </div>
        <div class="recommendation-content">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <div class="recommendation-price">${item.price}</div>
            <div class="recommendation-features">
                ${item.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
            </div>
            <button class="add-to-cart-btn" onclick="addToCart(${JSON.stringify(item).replace(/"/g, '&quot;')})">
                <i class="fas fa-plus"></i>
                Add to Cart
            </button>
        </div>
    `;
    return card;
}

// Load Menu Items
function loadMenuItems(category) {
    menuGrid.innerHTML = '';
    
    const filteredItems = category === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === category);
    
    filteredItems.forEach(item => {
        const menuItem = createMenuItem(item);
        menuGrid.appendChild(menuItem);
    });
}

// Create Menu Item
function createMenuItem(item) {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item fade-in';
    menuItem.innerHTML = `
        <div class="menu-item-image">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
        </div>
        <div class="menu-item-content">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <div class="menu-item-price">${item.price}</div>
            <button class="add-to-cart-btn" onclick="addToCart(${JSON.stringify(item).replace(/"/g, '&quot;')})">
                <i class="fas fa-plus"></i>
                Add to Cart
            </button>
        </div>
    `;
    return menuItem;
}

// Setup Event Listeners
function setupEventListeners() {
    // Mobile Navigation
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Category Filter
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            // Load filtered menu items
            loadMenuItems(btn.dataset.category);
        });
    });

    // Reservation Form
    if (reservationForm) {
        reservationForm.addEventListener('submit', handleReservation);
    }

    // Newsletter Form
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletter);
    }

    // Shopping Cart
    let cart = [];

    // Cart Functions
    function addToCart(item) {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        
        updateCartBadge();
        showNotification(`${item.name} added to cart!`, 'success');
    }

    function updateCartBadge() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        if (totalItems > 0) {
            cartBadge.textContent = totalItems;
            cartBadge.classList.remove('empty');
        } else {
            cartBadge.textContent = '0';
            cartBadge.classList.add('empty');
        }
    }

    function getCartSummary() {
        return cart.map(item => 
            `• ${item.name} (x${item.quantity}) - ${item.price}`
        ).join('\n');
    }

    // Floating Order Button
    if (floatingOrderBtn) {
        console.log('Floating order button found, setting up click handler...');
        floatingOrderBtn.addEventListener('click', (e) => {
            console.log('Floating button clicked!');
            // Prevent event from bubbling to avoid triggering button clicks inside
            e.stopPropagation();
            
            // Toggle expanded state
            floatingOrderBtn.classList.toggle('expanded');
            console.log('Button expanded:', floatingOrderBtn.classList.contains('expanded'));
            
            // If button is expanded and cart has items, also handle WhatsApp order
            if (floatingOrderBtn.classList.contains('expanded') && cart.length > 0) {
                // Don't automatically open WhatsApp, let user choose
                return;
            }
        });
        
        // Close expanded button when clicking outside
        document.addEventListener('click', (e) => {
            if (floatingOrderBtn && !floatingOrderBtn.contains(e.target)) {
                floatingOrderBtn.classList.remove('expanded');
            }
        });
    } else {
        console.log('Floating order button NOT found!');
    }

    // Setup WhatsApp and Call button functionality
    const whatsappBtn = document.querySelector('.floating-whatsapp-btn');
    const callBtn = document.querySelector('.floating-call-btn');
    
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Create WhatsApp message with cart summary if available
            let whatsappMessage;
            if (cart.length > 0) {
                const cartSummary = getCartSummary();
                whatsappMessage = encodeURIComponent(
                    `🛒 *New Order - Zia's Kitchen*\n\n` +
                    `📋 *Order Details:*\n${cartSummary}\n\n` +
                    `💰 *Total Items:* ${cart.reduce((total, item) => total + item.quantity, 0)}\n\n` +
                    `🔔 *Ready to process your order!*`
                );
            } else {
                whatsappMessage = encodeURIComponent(
                    `🍽️ *Hello Zia's Kitchen!*\n\n` +
                    `I'd like to place an order or inquire about your menu.\n\n` +
                    `📞 *Phone:* 0991418099\n` +
                    `📍 *Location:* Area 25, Lilongwe\n` +
                    `🕐 *Hours:* Monday - Saturday (Open)\n\n` +
                    `Looking forward to hearing from you!`
                );
            }
            
            const whatsappUrl = `https://wa.me/+265991418099?text=${whatsappMessage}`;
            window.open(whatsappUrl, '_blank');
            showNotification('Opening WhatsApp...', 'success');
        });
    }
    
    if (callBtn) {
        callBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.href = 'tel:0991418099';
            showNotification('Calling Zia\'s Kitchen...', 'success');
        });
    }

    // Close modal when Escape key is pressed
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (whatsappModal && whatsappModal.classList.contains('active')) {
                whatsappModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            if (reservationModal && reservationModal.classList.contains('active')) {
                reservationModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
    });
}

    // Handle Reservation Form
function handleReservation(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const reservation = {
        name: e.target[0].value,
        phone: e.target[1].value,
        date: e.target[2].value,
        time: e.target[3].value,
        guests: e.target[4].value,
        requests: e.target[5].value
    };

    // Create WhatsApp message
    const whatsappMessage = encodeURIComponent(
        `🍽️ *New Reservation Request - Zia's Kitchen*\n\n` +
        `📛 *Name:* ${reservation.name}\n` +
        `📱 *Phone:* ${reservation.phone}\n` +
        `📅 *Date:* ${reservation.date}\n` +
        `⏰ *Time:* ${reservation.time}\n` +
        `👥 *Number of Guests:* ${reservation.guests}\n` +
        `${reservation.requests ? `💬 *Special Requests:* ${reservation.requests}\n` : ''}` +
        `\n🔔 *Please confirm this reservation ASAP!*`
    );

    // Open WhatsApp with the message
    const whatsappUrl = `https://wa.me/265991418099?text=${whatsappMessage}`;
    window.open(whatsappUrl, '_blank');
    
    // Show success message
    showNotification('Opening WhatsApp to send your reservation...', 'success');
    
    // Reset form
    e.target.reset();
}

// Handle Newsletter Form
function handleNewsletter(e) {
    e.preventDefault();
    
    const email = e.target.querySelector('input[type="email"]').value;
    
    // Show success message
    showNotification('Thank you for subscribing! You will receive our daily recommendations.', 'success');
    
    // Reset form
    e.target.reset();
}

// Show Notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add Scroll Effects
function addScrollEffects() {
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            }
        }
        
        // Floating order button - ALWAYS VISIBLE, never hides on scroll
        if (floatingOrderBtn) {
            floatingOrderBtn.style.transform = 'translateY(0)';
        }
    });

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

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
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
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Smooth scroll for anchor links
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

// Category Detail Page Functions
function setupCategoryClickHandlers() {
    // Add click handlers to category buttons
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const category = button.getAttribute('data-category');
            if (category && category !== 'all') {
                showCategoryDetail(category);
            }
        });
    });
    
    // Add click handlers to menu item cards
    const menuItemCards = document.querySelectorAll('.menu-card');
    menuItemCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            if (category) {
                showCategoryDetail(category);
            }
        });
    });
}

function setupBackButtonHandler() {
    if (backButton) {
        backButton.addEventListener('click', () => {
            hideCategoryDetail();
        });
    }
}

function showCategoryDetail(category) {
    const categoryInfo = categoryData[category];
    if (!categoryInfo) return;
    
    // Update category header information
    categoryTitle.textContent = categoryInfo.title;
    categoryDescription.textContent = categoryInfo.description;
    categoryItemCount.textContent = `${getCategoryItemCount(category)} Items`;
    categoryPrepTime.textContent = categoryInfo.prepTime;
    categorySpiceLevel.textContent = categoryInfo.spiceLevel;
    categoryNameInTitle.textContent = categoryInfo.name;
    
    // Update hero image
    categoryHeroImage.innerHTML = `<i class="${categoryInfo.icon}" style="font-size: 4rem; color: rgba(255,255,255,0.3);"></i>`;
    categoryHeroImage.style.background = `linear-gradient(135deg, ${categoryInfo.color}, ${categoryInfo.color}dd)`;
    
    // Load category items
    loadCategoryItems(category);
    
    // Show the category detail page
    categoryDetailPage.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Scroll to top
    categoryDetailPage.scrollTop = 0;
}

function hideCategoryDetail() {
    categoryDetailPage.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function getCategoryItemCount(category) {
    return menuItems.filter(item => item.category === category).length;
}

function loadCategoryItems(category) {
    const categoryItems = menuItems.filter(item => item.category === category);
    
    categoryItemsGrid.innerHTML = '';
    
    categoryItems.forEach(item => {
        const itemCard = createCategoryItemCard(item);
        categoryItemsGrid.appendChild(itemCard);
    });
}

function createCategoryItemCard(item) {
    const card = document.createElement('div');
    card.className = 'category-item-card';
    
    const imageHtml = item.image 
        ? `<img src="${item.image}" alt="${item.name}">`
        : `<i class="fas fa-utensils"></i>`;
    
    card.innerHTML = `
        <div class="category-item-image">
            ${imageHtml}
        </div>
        <div class="category-item-content">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <div class="category-item-footer">
                <span class="category-item-price">${item.price}</span>
                <button class="category-item-action" onclick="addToCartFromCategory(${JSON.stringify(item).replace(/"/g, '&quot;')})">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function addToCartFromCategory(item) {
    addToCart(item);
    showNotification(`${item.name} added to cart!`, 'success');
}

// Food Item Detail Page Functions
function setupFoodItemHandlers() {
    // Add click handlers to menu item cards and recommendation cards
    const allItemCards = document.querySelectorAll('.menu-card, .recommendation-card');
    allItemCards.forEach(card => {
        card.addEventListener('click', () => {
            const itemData = {
                id: card.getAttribute('data-id') || Date.now(),
                name: card.querySelector('h3')?.textContent || 'Food Item',
                description: card.querySelector('p')?.textContent || 'Delicious food item',
                price: card.querySelector('.price')?.textContent || 'K15,000',
                image: card.querySelector('img')?.src || null,
                category: card.getAttribute('data-category') || 'mains'
            };
            showFoodItemDetail(itemData);
        });
    });
    
    // Setup back button handler
    if (foodItemBackButton) {
        foodItemBackButton.addEventListener('click', () => {
            hideFoodItemDetail();
        });
    }
    
    // Setup quantity buttons
    if (decreaseQty) {
        decreaseQty.addEventListener('click', () => {
            updateQuantity(-1);
        });
    }
    
    if (increaseQty) {
        increaseQty.addEventListener('click', () => {
            updateQuantity(1);
        });
    }
    
    // Setup add to cart button
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const currentItem = {
                id: Date.now(),
                name: foodItemName?.textContent || 'Food Item',
                price: foodItemPrice?.textContent || 'K15,000',
                quantity: parseInt(quantityDisplay?.textContent || '1')
            };
            addToCart(currentItem);
            showNotification('Item added to cart!', 'success');
        });
    }
}

function showFoodItemDetail(item) {
    if (!foodItemDetailPage) return;
    
    // Update food item details
    foodItemName.textContent = item.name;
    foodItemDescription.textContent = item.description;
    foodItemPrice.textContent = item.price;
    foodItemPrepTime.textContent = '20-30 min';
    foodItemSpiceLevel.textContent = 'Medium';
    foodItemIngredients.textContent = 'Fresh, locally sourced ingredients prepared with authentic Malawian spices and cooking techniques.';
    foodItemCalories.textContent = '350-450';
    foodItemProtein.textContent = '25g';
    foodItemCarbs.textContent = '40g';
    foodItemAllergens.textContent = 'May contain nuts, dairy, and gluten. Please inform us of any allergies.';
    
    // Update food item image
    if (item.image) {
        foodItemImage.innerHTML = `<img src="${item.image}" alt="${item.name}">`;
    } else {
        foodItemImage.innerHTML = '<i class="fas fa-utensils"></i>';
    }
    
    // Reset quantity
    quantityDisplay.textContent = '1';
    
    // Show food item detail page
    foodItemDetailPage.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Scroll to top
    foodItemDetailPage.scrollTop = 0;
}

function hideFoodItemDetail() {
    if (foodItemDetailPage) {
        foodItemDetailPage.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function updateQuantity(change) {
    const currentQty = parseInt(quantityDisplay.textContent) || 1;
    const newQty = Math.max(1, currentQty + change);
    quantityDisplay.textContent = newQty;
}

// Cart Popup Functions
function setupCartPopupHandlers() {
    // Setup floating cart button
    if (floatingCartBtn) {
        floatingCartBtn.addEventListener('click', () => {
            toggleCartPopup();
        });
    }
    
    // Setup cart popup close
    if (cartPopupClose) {
        cartPopupClose.addEventListener('click', () => {
            hideCartPopup();
        });
    }
    
    // Setup cart popup overlay
    if (cartPopupOverlay) {
        cartPopupOverlay.addEventListener('click', () => {
            hideCartPopup();
        });
    }
    
    // Setup WhatsApp button
    if (cartWhatsAppBtn) {
        cartWhatsAppBtn.addEventListener('click', () => {
            sendCartToWhatsApp();
        });
    }
}

function toggleCartPopup() {
    if (!cartPopup) return;
    
    if (cartPopup.classList.contains('active')) {
        hideCartPopup();
    } else {
        showCartPopup();
    }
}

function showCartPopup() {
    if (!cartPopup) return;
    
    updateCartDisplay();
    cartPopup.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideCartPopup() {
    if (!cartPopup) return;
    
    cartPopup.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function updateCartDisplay() {
    if (!cartItemsList || !cartEmptyMessage || !cartTotalAmount) return;
    
    // Update floating cart button visibility
    if (floatingCartBtn) {
        if (cart.length > 0) {
            floatingCartBtn.style.display = 'flex';
        } else {
            floatingCartBtn.style.display = 'none';
        }
    }
    
    if (cart.length === 0) {
        cartItemsList.style.display = 'none';
        cartEmptyMessage.style.display = 'block';
        cartTotalAmount.textContent = 'K0';
        
        // Hide customer details form when cart is empty
        const customerDetailsForm = document.getElementById('customerDetailsForm');
        if (customerDetailsForm) {
            customerDetailsForm.style.display = 'none';
        }
    } else {
        cartItemsList.style.display = 'block';
        cartEmptyMessage.style.display = 'none';
        
        // Show customer details form when cart has items
        const customerDetailsForm = document.getElementById('customerDetailsForm');
        if (customerDetailsForm) {
            customerDetailsForm.style.display = 'block';
        }
        
        // Update cart items list
        cartItemsList.innerHTML = '';
        let totalPrice = 0;
        
        cart.forEach(item => {
            const cartItem = createCartItemElement(item);
            cartItemsList.appendChild(cartItem);
            
            // Calculate total price (remove K and convert to number)
            const priceText = item.price.replace('K', '').replace(',', '');
            const price = parseFloat(priceText) * item.quantity;
            totalPrice += price;
        });
        
        // Update total amount
        cartTotalAmount.textContent = `K${totalPrice.toLocaleString()}`;
    }
    
    // Update floating cart count
    if (floatingCartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        floatingCartCount.textContent = totalItems;
    }
}

function createCartItemElement(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.setAttribute('data-item-id', item.id);
    
    cartItem.innerHTML = `
        <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">${item.price}</div>
        </div>
        <div class="cart-item-actions">
            <div class="cart-item-quantity">x${item.quantity}</div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    return cartItem;
}

function removeFromCart(itemId) {
    // Find and remove item from cart
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        const removedItem = cart[itemIndex];
        cart.splice(itemIndex, 1);
        
        // Update displays
        updateCartBadge();
        updateCartDisplay();
        
        // Show notification
        showNotification(`${removedItem.name} removed from cart!`, 'info');
    }
}

function sendCartToWhatsApp() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // Validate customer details
    if (!customerName?.value || !deliveryTime?.value || !deliveryDate?.value || !deliveryLocation?.value) {
        showNotification('Please fill in all required delivery details!', 'error');
        return;
    }
    
    // Create WhatsApp message with cart details and customer information
    const cartSummary = cart.map(item => 
        `• ${item.name} (x${item.quantity}) - ${item.price}`
    ).join('\n');
    
    const totalPrice = cart.reduce((total, item) => {
        const price = parseFloat(item.price.replace('K', '').replace(',', ''));
        return total + (price * item.quantity);
    }, 0);
    
    const whatsappMessage = encodeURIComponent(
        `🛒 *New Order - Zia's Kitchen*\n\n` +
        `👤 *Customer Details:*\n` +
        `• Name: ${customerName.value}\n` +
        `• Date: ${deliveryDate.value}\n` +
        `• Time: ${deliveryTime.value}\n` +
        `• Location: ${deliveryLocation.value}\n\n` +
        `📋 *Order Details:*\n${cartSummary}\n\n` +
        `💰 *Total Amount:* K${totalPrice.toLocaleString()}\n\n` +
        `${specialInstructions?.value ? `� *Special Instructions:* ${specialInstructions.value}\n\n` : ''}` +
        `�🔔 *Ready to process your order!*`
    );
    
    // Open WhatsApp
    const whatsappUrl = `https://wa.me/+265991418099?text=${whatsappMessage}`;
    window.open(whatsappUrl, '_blank');
    showNotification('Opening WhatsApp with your order...', 'success');
    
    // Clear cart after successful order
    cart = [];
    updateCartDisplay();
    hideCartPopup();
}
