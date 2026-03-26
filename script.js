// Firebase Configuration and Real-time Database
const firebaseConfig = {
    apiKey: "AIzaSyDummyKeyForDemo-ReplaceWithRealKey",
    authDomain: "ziah-kitchen.firebaseapp.com",
    databaseURL: "https://ziah-kitchen-default-rtdb.firebaseio.com",
    projectId: "ziah-kitchen",
    storageBucket: "ziah-kitchen.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
let database;
let isFirebaseConnected = false;

function initializeFirebase() {
    try {
        firebase.initializeApp(firebaseConfig);
        database = firebase.database();
        isFirebaseConnected = true;
        console.log('Firebase initialized successfully');
        
        // Set up real-time listener
        setupRealtimeListener();
    } catch (error) {
        console.error('Firebase initialization failed:', error);
        isFirebaseConnected = false;
        // Fallback to localStorage
        loadFoodDataFromStorage();
    }
}

// Setup real-time database listener
function setupRealtimeListener() {
    if (!database) return;
    
    const foodDataRef = database.ref('foodData');
    
    // Listen for real-time updates
    foodDataRef.on('value', (snapshot) => {
        const remoteData = snapshot.val();
        if (remoteData && typeof remoteData === 'object') {
            // Update local foodData with remote changes
            Object.keys(remoteData).forEach(category => {
                if (foodData[category]) {
                    foodData[category] = remoteData[category];
                }
            });
            
            // Add new categories from remote
            Object.keys(remoteData).forEach(category => {
                if (!foodData[category]) {
                    foodData[category] = remoteData[category];
                }
            });
            
            // Update 'all' category
            updateAllCategory();
            
            // Refresh UI for current user
            refreshMenuForUsers();
            
            console.log('Real-time update received from Firebase:', remoteData);
        }
    }, (error) => {
        console.error('Firebase listener error:', error);
        // Fallback to localStorage if Firebase fails
        loadFoodDataFromStorage();
    });
}

// Save data to Firebase (with fallback to localStorage)
async function saveFoodDataToCloud() {
    if (isFirebaseConnected && database) {
        try {
            await database.ref('foodData').set(foodData);
            console.log('Data saved to Firebase successfully');
            return true;
        } catch (error) {
            console.error('Firebase save failed:', error);
            // Fallback to localStorage
            saveFoodDataToStorage();
            return false;
        }
    } else {
        // Fallback to localStorage
        saveFoodDataToStorage();
        return false;
    }
}

// Load data from Firebase (with fallback to localStorage)
async function loadFoodDataFromCloud() {
    if (isFirebaseConnected && database) {
        try {
            const snapshot = await database.ref('foodData').once('value');
            const remoteData = snapshot.val();
            
            if (remoteData && typeof remoteData === 'object') {
                // Merge remote data with local data
                Object.keys(remoteData).forEach(category => {
                    if (foodData[category]) {
                        foodData[category] = remoteData[category];
                    }
                });
                
                // Add new categories
                Object.keys(remoteData).forEach(category => {
                    if (!foodData[category]) {
                        foodData[category] = remoteData[category];
                    }
                });
                
                // Update 'all' category
                updateAllCategory();
                console.log('Data loaded from Firebase successfully');
                return true;
            }
        } catch (error) {
            console.error('Firebase load failed:', error);
        }
    }
    
    // Fallback to localStorage
    loadFoodDataFromStorage();
    return false;
}

// Food data with localStorage persistence
let foodData = {
    special: [
        { name: 'Chips & Chicken', price: 'MK 10,000', img: 'all/636643509_941540581782471_8755384936553117064_n.jpg', description: 'Crispy chips served with grilled chicken' },
        { name: 'Chicken Rice', price: 'MK 13,000', img: 'all/636679488_941540638449132_7701090060312251468_n.jpg', description: 'Flavorful rice dish with tender chicken' },
        { name: 'Beef Platter', price: 'MK 15,000', img: 'all/637013469_941540615115801_1322117913686776318_n.jpg', description: 'Grilled beef with special spices' },
        { name: 'Mixed Grill', price: 'MK 18,000', img: 'all/637424558_941538855115977_7878569932847660976_n.jpg', description: 'Assorted grilled meats and vegetables' }
    ],
    daily: [
        { name: 'Nsima with Chicken', price: 'MK 8,000', img: 'daily/638401174_941540578449138_5460591836351719171_n.jpg', description: 'Traditional nsima with tender chicken stew' },
        { name: 'Rice & Beans', price: 'MK 7,000', img: 'daily/653700701_963659522903910_9262414268652726400_n.jpg', description: 'Steamed rice with flavorful beans' },
        { name: 'Vegetable Wrap', price: 'MK 6,000', img: 'daily/653702552_963659542903908_7015183637697663978_n.jpg', description: 'Fresh vegetables wrapped in soft bread' },
        { name: 'Fish & Chips', price: 'MK 9,000', img: 'daily/653706075_963659596237236_7545349917405451024_n.jpg', description: 'Crispy fried fish with golden chips' }
    ],
    custom: [
        { name: 'Family Platter', price: 'MK 25,000', img: 'other/1.jpeg', description: 'Large platter for 4-5 people with variety of dishes' },
        { name: 'Couple Special', price: 'MK 18,000', img: 'other/653705019_963659506237245_8371187904235938820_n.jpg', description: 'Perfect portion for 2 people with assorted items' },
        { name: 'Party Pack', price: 'MK 35,000', img: 'other/653706075_963659596237236_7545349917405451024_n.jpg', description: 'Large party package with variety of dishes for 8-10 people' }
    ],
    other: [
        { name: 'Fresh Juice', price: 'MK 3,000', img: 'custom/placeholder.jpg', description: 'Freshly squeezed fruit juice' },
        { name: 'Salad Bowl', price: 'MK 5,000', img: 'custom/placeholder.jpg', description: 'Mixed fresh salad with dressing' },
        { name: 'Fruit Dessert', price: 'MK 4,000', img: 'custom/placeholder.jpg', description: 'Seasonal fresh fruits with sweet cream' }
    ]
};

// Load food data from localStorage on page load
function loadFoodDataFromStorage() {
    const savedData = localStorage.getItem('ziahKitchenFoodData');
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            // Merge saved data with default data (preserves new items, updates existing)
            Object.keys(parsedData).forEach(category => {
                if (foodData[category]) {
                    foodData[category] = parsedData[category];
                }
            });
            // Add any new categories from saved data
            Object.keys(parsedData).forEach(category => {
                if (!foodData[category]) {
                    foodData[category] = parsedData[category];
                }
            });
            // Update the 'all' category
            updateAllCategory();
            console.log('Food data loaded from localStorage');
        } catch (error) {
            console.error('Error loading food data from localStorage:', error);
        }
    }
}

// Save food data to localStorage
function saveFoodDataToStorage() {
    try {
        localStorage.setItem('ziahKitchenFoodData', JSON.stringify(foodData));
        console.log('Food data saved to localStorage');
    } catch (error) {
        console.error('Error saving food data to localStorage:', error);
    }
}

// Initialize food data on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase first
    initializeFirebase();
    
    // Load data from Firebase (with fallback to localStorage)
    loadFoodDataFromCloud();
});

// Combine all food items for "All" category
foodData.all = [
    ...foodData.special,
    ...foodData.daily,
    ...foodData.custom,
    ...foodData.other
];

// Cart functionality
let cart = [];
let currentFoodItem = null;

// Page navigation
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
        page.classList.add('slideOut');
    });
    
    setTimeout(() => {
        pages.forEach(page => {
            page.classList.remove('slideOut');
            page.style.display = 'none';
        });
        
        const targetPage = document.getElementById(pageId);
        targetPage.style.display = 'flex';
        setTimeout(() => {
            targetPage.classList.add('active');
        }, 10);
    }, 300);
}

// Category selection
function showCategory(category) {
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (category === 'custom') {
        openCustomModal();
        closeCategoriesModal(); // Close modal after selection
    } else if (category === 'other') {
        showOtherPlates();
        closeCategoriesModal(); // Close modal after selection
    } else {
        loadFoodItems(category);
        closeCategoriesModal(); // Close modal after selection
    }
}

// Categories modal functions
function openCategoriesModal() {
    document.getElementById('categoriesModal').classList.add('active');
}

function closeCategoriesModal() {
    document.getElementById('categoriesModal').classList.remove('active');
}

function selectCategory(category) {
    if (category === 'reservation') {
        showReservationModal();
        closeCategoriesModal();
    } else if (category === 'custom') {
        openCustomModal();
        closeCategoriesModal();
    } else {
        loadFoodItems(category);
        closeCategoriesModal();
    }
}

// Remove old sidebar functions since we're using modal now
function toggleCategorySidebar() {
    openCategoriesModal();
}

function showCategorySidebar() {
    openCategoriesModal();
}

function hideCategorySidebar() {
    closeCategoriesModal();
}

// Load food items
function loadFoodItems(category) {
    const foodGrid = document.getElementById('foodGrid');
    const items = foodData[category] || [];
    
    // Show loading skeletons
    showLoadingSkeletons();
    
    // Simulate loading delay for better UX
    setTimeout(() => {
        foodGrid.innerHTML = items.map((food, index) => `
            <div class="food-card" data-food-id="${index}">
                <div class="food-card-wrapper">
                    <div class="food-image-container">
                        <img src="${food.img}" alt="${food.name}" class="food-img" loading="lazy">
                        <div class="food-overlay">
                            <button class="zoom-btn" onclick="openImageModal('${food.img}', '${food.name}')">
                                <i class="fas fa-search-plus"></i>
                            </button>
                            <button class="share-photo-btn" onclick="shareFoodPhoto('${food.name}', '${food.img}')">
                                <i class="fas fa-camera"></i>
                            </button>
                        </div>
                        <div class="gradient-overlay"></div>
                        ${food.stock <= 3 ? `<div class="scarcity-badge">Only ${food.stock} left!</div>` : ''}
                        ${food.isPopular ? '<div class="popular-badge"><i class="fas fa-fire"></i> Popular</div>' : ''}
                    </div>
                    <div class="food-info">
                        <div class="food-header">
                            <div class="food-name">${food.name}</div>
                            <div class="food-price">${food.price}</div>
                        </div>
                        <div class="food-meta">
                            <span class="prep-time"><i class="fas fa-clock"></i> ${food.prepTime || '15-20 min'}</span>
                            <span class="calories"><i class="fas fa-fire"></i> ${food.calories || '250-350 cal'}</span>
                        </div>
                        <div class="food-actions">
                            <button class="add-to-cart-btn" onclick="addToCart('${food.name}', '${food.price}', '${food.img}')">
                                <i class="fas fa-shopping-cart"></i> Add
                            </button>
                            <button class="customize-btn" onclick="openCustomizeModal('${food.name}', '${food.price}', '${food.img}')">
                                <i class="fas fa-sliders-h"></i>
                            </button>
                            <button class="details-btn" onclick="showFoodDetails('${food.name}', '${food.price}', '${food.img}', '${food.description}')">
                                <i class="fas fa-info-circle"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Initialize touch interactions
        initializeTouchInteractions();
    }, 300);
}

// Show loading skeletons
function showLoadingSkeletons() {
    const foodGrid = document.getElementById('foodGrid');
    const skeletonCount = 6;
    
    foodGrid.innerHTML = Array(skeletonCount).fill(0).map(() => `
        <div class="food-card skeleton-card">
            <div class="skeleton skeleton-image"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-price"></div>
            <div class="skeleton skeleton-button"></div>
        </div>
    `).join('');
}

// Add to cart
function addToCart(name, price, img) {
    cart.push({ name, price, img });
    updateCartBadge();
    updateCartDisplay();
}

// Update cart badge
function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    const floatingBtn = document.getElementById('floatingOrderBtn');
    
    if (badge) {
        badge.textContent = cart.length;
    }
    
    // Show/hide floating order button based on cart content
    if (floatingBtn) {
        if (cart.length > 0) {
            floatingBtn.style.display = 'flex';
        } else {
            floatingBtn.style.display = 'none';
        }
    }
}

// Update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Your cart is empty</p>';
        } else {
            cartItems.innerHTML = cart.map((item, index) => `
                <div class="food-card" style="margin-bottom: 15px;">
                    <img src="${item.img}" alt="${item.name}" class="food-img">
                    <div class="food-info">
                        <div class="food-name">${item.name}</div>
                        <div class="food-price">${item.price}</div>
                        <button class="add-to-cart-btn" onclick="removeFromCart(${index})">Remove</button>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartBadge();
    updateCartDisplay();
}

// Show food details
function showFoodDetails(name, price, img, description) {
    currentFoodItem = { name, price, img, description };
    document.getElementById('foodDetailsName').textContent = name;
    document.getElementById('foodDetailsPrice').textContent = price;
    document.getElementById('foodDetailsImg').src = img;
    document.getElementById('foodDetailsDescription').textContent = description;
    openModal('foodDetailsModal');
}

// Add to cart from details
function addToCartFromDetails() {
    if (currentFoodItem) {
        addToCart(currentFoodItem.name, currentFoodItem.price, currentFoodItem.img);
        closeModal('foodDetailsModal');
    }
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function openCustomModal() {
    openModal('customModal');
}

function showReservationModal() {
    openModal('reservationModal');
    closeCategoriesModal();
}

function showOtherPlates() {
    loadFoodItems('other');
}

// Side menu functions
function openSideMenu() {
    document.getElementById('sideMenu').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

function closeSideMenu() {
    document.getElementById('sideMenu').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

// WhatsApp functions
function sendCustomWhatsApp() {
    const name = document.getElementById('customName').value;
    const location = document.getElementById('customLocation').value;
    
    if (name && location) {
        const message = `Hello! I'm interested in customized food platters.\n\nName: ${name}\nLocation: ${location}\n\nPlease contact me to discuss options.`;
        window.open(`https://wa.me/265991418099?text=${encodeURIComponent(message)}`, '_blank');
        closeModal('customModal');
    } else {
        alert('Please fill in all required fields');
    }
}

function sendReservationWhatsApp() {
    const name = document.getElementById('resName').value;
    const location = document.getElementById('resLocation').value;
    const date = document.getElementById('resDate').value;
    const time = document.getElementById('resTime').value;
    const description = document.getElementById('resDescription').value;
    
    if (name && location && date && time) {
        const message = `Reservation Request:\n\nName: ${name}\nLocation: ${location}\nDate: ${date}\nTime: ${time}\nDescription: ${description}\n\nPlease confirm my reservation.`;
        window.open(`https://wa.me/265991418099?text=${encodeURIComponent(message)}`, '_blank');
        closeModal('reservationModal');
    } else {
        alert('Please fill in all required fields');
    }
}

function sendOrderWhatsApp() {
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    
    const orderDetails = cart.map(item => `${item.name} - ${item.price}`).join('\n');
    const message = `Order Request:\n\n${orderDetails}\n\nTotal Items: ${cart.length}\n\nPlease confirm my order.`;
    window.open(`https://wa.me/265991418099?text=${encodeURIComponent(message)}`, '_blank');
}

// Call function
function callUs() {
    window.open(`tel:0991418099`, '_blank');
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen after page loads
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 1500);
    
    // Load "All" category by default when entering menu page
    loadFoodItems('all');
    updateCartBadge();
    updateCartDisplay();
    
    // Auto screen size detection and adaptive layout
    detectScreenSize();
    window.addEventListener('resize', detectScreenSize);
    
    // Optimize for mobile devices
    optimizeForMobile();
    
    // Initialize sidebar state
    initializeSidebar();
    
    // Setup sticky header behavior
    setupStickyHeader();
});

// Setup sticky header behavior
function setupStickyHeader() {
    const welcomeHeader = document.querySelector('.welcome-header');
    if (!welcomeHeader) return;
    
    // Store original position
    const originalTop = welcomeHeader.offsetTop;
    
    // Handle scroll events
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > originalTop) {
            // Scrolled past original position - make sticky
            welcomeHeader.classList.add('sticky');
            welcomeHeader.classList.add('spaced');
        } else {
            // Back to original position - remove sticky
            welcomeHeader.classList.remove('sticky');
            welcomeHeader.classList.remove('spaced');
        }
    });
}

// Sidebar functionality
let sidebarExpanded = true;
let sidebarAutoCollapsed = false;

function initializeSidebar() {
    // Check if user has been here before
    const hasVisited = localStorage.getItem('ziaKitchenVisited');
    const sidebar = document.getElementById('sideMenu');
    const overlay = document.getElementById('overlay');
    
    if (!hasVisited) {
        // First visit - keep sidebar expanded
        sidebarExpanded = true;
        sidebar.classList.remove('collapsed');
        sidebar.classList.add('expanded');
        overlay.classList.remove('active');
        localStorage.setItem('ziaKitchenVisited', 'true');
    } else {
        // Returning visitor - start collapsed
        sidebarExpanded = false;
        sidebar.classList.add('collapsed');
        sidebar.classList.remove('expanded');
        overlay.classList.add('active');
        sidebarAutoCollapsed = true;
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('menuSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebarExpanded) {
        // Collapse sidebar
        sidebarExpanded = false;
        sidebar.classList.remove('expanded');
        sidebar.classList.add('collapsed');
        overlay.classList.add('active');
        sidebarAutoCollapsed = true;
    } else {
        // Expand sidebar
        sidebarExpanded = true;
        sidebar.classList.remove('collapsed');
        sidebar.classList.add('expanded');
        overlay.classList.remove('active');
        sidebarAutoCollapsed = false;
    }
}

function expandSidebar() {
    const sidebar = document.getElementById('menuSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    sidebarExpanded = true;
    sidebar.classList.remove('collapsed');
    sidebar.classList.add('expanded');
    overlay.classList.remove('active');
    sidebarAutoCollapsed = false;
}

function collapseSidebarAfterSelection() {
    // Auto-collapse after category selection (only if it was auto-collapsed before)
    if (sidebarAutoCollapsed) {
        setTimeout(() => {
            const sidebar = document.getElementById('menuSidebar');
            const overlay = document.getElementById('sidebarOverlay');
            
            sidebarExpanded = false;
            sidebar.classList.remove('expanded');
            sidebar.classList.add('collapsed');
            overlay.classList.add('active');
        }, 500);
    }
}

// Enhanced showCategory function with auto-collapse
function showCategory(category) {
    // Remove active class from all buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Load food items for the selected category
    loadFoodItems(category);
    
    // Auto-collapse sidebar after selection if it was previously auto-collapsed
    if (sidebarAutoCollapsed) {
        collapseSidebarAfterSelection();
    }
}

// Handle browser back button for sidebar
window.addEventListener('popstate', function(event) {
    const activePage = document.querySelector('.page.active');
    const sidebar = document.getElementById('menuSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (activePage && activePage.id !== 'welcomePage') {
        showPage('welcomePage');
    }
    
    // Expand sidebar when going back to menu page
    if (activePage && activePage.id === 'menuPage') {
        expandSidebar();
    }
});

// Override showPage to handle menu page initialization
const originalShowPage = showPage;
showPage = function(pageId) {
    originalShowPage(pageId);
    
    if (pageId === 'menuPage') {
        // When entering menu page, load "All" category by default
        loadFoodItems('all');
    }
};

// Screen size detection and adaptive layout
function detectScreenSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const body = document.body;
    
    // Remove existing screen size classes
    body.classList.remove('screen-large', 'screen-tablet', 'screen-mobile', 'screen-mini');
    
    // Add appropriate screen size class
    if (width <= 360) {
        body.classList.add('screen-mini');
        optimizeForMiniScreen();
    } else if (width <= 480) {
        body.classList.add('screen-mobile');
        optimizeForMobile();
    } else if (width <= 768) {
        body.classList.add('screen-tablet');
        optimizeForTablet();
    } else {
        body.classList.add('screen-large');
        optimizeForLarge();
    }
    
    // Adjust viewport height for mobile browsers
    if (height <= 600) {
        body.classList.add('short-screen');
        adjustForShortScreen();
    }
}

// Optimizations for different screen sizes
function optimizeForMiniScreen() {
    // Mini portrait screen optimizations (≤360px)
    const menuSidebar = document.querySelector('.menu-sidebar');
    const foodGrid = document.getElementById('foodGrid');
    
    if (menuSidebar) {
        menuSidebar.style.width = '75px';
    }
    
    // Reduce grid columns for very small screens
    if (foodGrid && window.innerWidth <= 320) {
        foodGrid.style.gridTemplateColumns = '1fr';
    }
    
    // Optimize font sizes
    document.querySelectorAll('.food-name').forEach(el => {
        el.style.fontSize = '14px';
    });
    
    document.querySelectorAll('.food-price').forEach(el => {
        el.style.fontSize = '16px';
    });
}

function optimizeForMobile() {
    // Mobile screen optimizations (≤480px)
    const menuSidebar = document.querySelector('.menu-sidebar');
    
    if (menuSidebar) {
        menuSidebar.style.width = '85px';
    }
    
    // Ensure single column layout on mobile
    const foodGrid = document.getElementById('foodGrid');
    if (foodGrid) {
        foodGrid.style.gridTemplateColumns = '1fr';
    }
}

function optimizeForTablet() {
    // Tablet optimizations (≤768px)
    const menuSidebar = document.querySelector('.menu-sidebar');
    
    if (menuSidebar) {
        menuSidebar.style.width = '110px';
    }
    
    // Allow 2 columns on tablet
    const foodGrid = document.getElementById('foodGrid');
    if (foodGrid) {
        foodGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
    }
}

function optimizeForLarge() {
    // Large screen optimizations (>768px)
    const menuSidebar = document.querySelector('.menu-sidebar');
    
    if (menuSidebar) {
        menuSidebar.style.width = '130px';
    }
    
    // Restore original grid layout
    const foodGrid = document.getElementById('foodGrid');
    if (foodGrid) {
        foodGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(220px, 1fr))';
    }
}

function adjustForShortScreen() {
    // Adjust for screens with limited height
    const header = document.querySelector('.header');
    const welcomeContent = document.querySelector('.welcome-content');
    
    if (header) {
        header.style.padding = '8px 10px';
    }
    
    if (welcomeContent) {
        welcomeContent.style.padding = '8px';
    }
}

// Touch optimization for mobile devices
function optimizeTouchInteractions() {
    // Add touch-friendly hover states
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Prevent double-tap zoom on buttons
    buttons.forEach(button => {
        button.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.click();
        });
    });
}

// Initialize touch optimizations
if ('ontouchstart' in window) {
    document.addEventListener('DOMContentLoaded', optimizeTouchInteractions);
}

// Handle device back button
window.addEventListener('popstate', function(event) {
    const activePage = document.querySelector('.page.active');
    if (activePage && activePage.id !== 'welcomePage') {
        showPage('welcomePage');
    }
});

// Add history state for back button functionality
history.pushState({page: 'welcomePage'}, '', '');
history.pushState({page: 'welcomePage'}, '', '');

// Admin functionality
let isAdminLoggedIn = false;

// Admin login
function loginToAdmin() {
    const password = document.getElementById('adminPassword').value;
    if (password === 'zia123') { // Simple password - change as needed
        isAdminLoggedIn = true;
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadAdminInterface();
        
        // Check Firebase connection and show setup guide if needed
        checkFirebaseConnection();
    } else {
        alert('Incorrect password');
    }
}

// Load admin interface
function loadAdminInterface() {
    const menuEditor = document.getElementById('menuEditor');
    let html = '';
    
    Object.keys(foodData).forEach(category => {
        if (category !== 'all') { // Skip the 'all' category as it's auto-generated
            html += `
                <div class="category-section">
                    <div class="category-header">
                        <h3>${category.charAt(0).toUpperCase() + category.slice(1)} Category</h3>
                        <div class="category-actions">
                            <button class="admin-btn-small" onclick="addItem('${category}')">+ Add Item</button>
                            ${category !== 'special' && category !== 'daily' && category !== 'custom' && category !== 'other' ? 
                                `<button class="admin-btn-small delete" onclick="deleteCategory('${category}')">🗑️ Delete Category</button>` : ''}
                        </div>
                    </div>
                    <div class="items-grid">
                        ${generateCategoryItems(category)}
                    </div>
                </div>
            `;
        }
    });
    
    menuEditor.innerHTML = html;
}

// Generate category items for admin
function generateCategoryItems(category) {
    let html = '';
    foodData[category].forEach((item, index) => {
        html += `
            <div class="admin-item-card">
                <div class="item-preview">
                    <img src="${item.img}" alt="${item.name}" class="item-thumb">
                </div>
                <div class="item-fields">
                    <input type="text" value="${item.name}" 
                           onchange="updateItem('${category}', ${index}, 'name', this.value)"
                           placeholder="Item name" class="admin-input">
                    <input type="text" value="${item.price}" 
                           onchange="updateItem('${category}', ${index}, 'price', this.value)"
                           placeholder="Price" class="admin-input">
                    <input type="text" value="${item.img}" 
                           onchange="updateItem('${category}', ${index}, 'img', this.value)"
                           placeholder="Image path" class="admin-input">
                    <textarea onchange="updateItem('${category}', ${index}, 'description', this.value)"
                              placeholder="Description" class="admin-textarea">${item.description}</textarea>
                </div>
                <div class="item-actions">
                    <button class="admin-btn-small delete" onclick="deleteItem('${category}', ${index})">🗑️</button>
                </div>
            </div>
        `;
    });
    return html;
}

// Update item
function updateItem(category, index, field, value) {
    foodData[category][index][field] = value;
    
    // Update the 'all' category
    updateAllCategory();
    
    // Save to Firebase for real-time sync (with fallback)
    saveFoodDataToCloud();
    
    // Refresh menu if user is on menu page
    refreshMenuForUsers();
    
    // Show save indicator
    showSaveIndicator();
}

// Add new item
function addItem(category) {
    showAddItemModal(category);
}

// Show add item modal
function showAddItemModal(category) {
    const modalHtml = `
        <div id="addItemModal" class="modal active">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Add New Item to ${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                    <button class="close-btn" onclick="closeAddItemModal()">
                        <svg viewBox="0 0 24 24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                </div>
                <form id="addItemForm">
                    <div class="form-group">
                        <label class="form-label">ITEM NAME</label>
                        <input type="text" class="form-input" id="newItemName" required placeholder="Enter item name">
                    </div>
                    <div class="form-group">
                        <label class="form-label">PRICE</label>
                        <input type="text" class="form-input" id="newItemPrice" required placeholder="e.g., MK 15,000">
                    </div>
                    <div class="form-group">
                        <label class="form-label">IMAGE</label>
                        <div class="image-upload-area">
                            <input type="file" id="newItemImage" accept="image/*" style="display: none;" onchange="previewImage(event)">
                            <div class="image-upload-placeholder" onclick="document.getElementById('newItemImage').click()">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <p>Click to upload image</p>
                                <small>or drag and drop</small>
                            </div>
                            <div id="imagePreview" class="image-preview" style="display: none;">
                                <img id="previewImg" src="" alt="Preview">
                                <button type="button" class="remove-image-btn" onclick="removeImage()">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">DESCRIPTION (optional)</label>
                        <textarea class="form-textarea" id="newItemDescription" placeholder="Enter item description"></textarea>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn-whatsapp" onclick="saveNewItem('${category}')">
                            <i class="fas fa-save"></i>
                            Add Item
                        </button>
                        <button type="button" class="btn-call" onclick="closeAddItemModal()">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Add modal to body
    const modalDiv = document.createElement('div');
    modalDiv.innerHTML = modalHtml;
    document.body.appendChild(modalDiv.firstElementChild);
    
    // Setup drag and drop
    setupDragAndDrop();
}

// Preview image
function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('previewImg').src = e.target.result;
            document.getElementById('imagePreview').style.display = 'block';
            document.querySelector('.image-upload-placeholder').style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
}

// Remove image
function removeImage() {
    document.getElementById('newItemImage').value = '';
    document.getElementById('imagePreview').style.display = 'none';
    document.querySelector('.image-upload-placeholder').style.display = 'block';
}

// Setup drag and drop
function setupDragAndDrop() {
    const dropZone = document.querySelector('.image-upload-area');
    if (!dropZone) return;
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });
    
    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            document.getElementById('newItemImage').files = files;
            previewImage({ target: { files: [files[0]] } });
        }
    });
}

// Save new item
function saveNewItem(category) {
    const name = document.getElementById('newItemName').value.trim();
    const price = document.getElementById('newItemPrice').value.trim();
    const description = document.getElementById('newItemDescription').value.trim();
    const imageInput = document.getElementById('newItemImage');
    
    // Validation
    if (!name || !price) {
        alert('Please fill in required fields (Name and Price)');
        return;
    }
    
    // Handle image
    let imagePath = 'placeholder.jpg';
    if (imageInput.files && imageInput.files[0]) {
        // For now, we'll use a placeholder. In a real application, 
        // you'd upload image to a server and get the URL back
        imagePath = 'new-upload.jpg'; // Placeholder for uploaded image
        alert('Note: Image upload functionality would require server integration. For now, using placeholder image.');
    }
    
    // Create new item
    const newItem = {
        name: name,
        price: price,
        img: imagePath,
        description: description || 'Delicious food item'
    };
    
    // Add to category
    foodData[category].push(newItem);
    updateAllCategory();
    
    // Save to Firebase for real-time sync (with fallback)
    saveFoodDataToCloud();
    
    // Close modal and refresh admin
    closeAddItemModal();
    loadAdminInterface();
    showSaveIndicator();
    
    // Refresh menu if user is on menu page
    refreshMenuForUsers();
}

// Close add item modal
function closeAddItemModal() {
    const modal = document.getElementById('addItemModal');
    if (modal) {
        modal.remove();
    }
}

// Delete item
function deleteItem(category, index) {
    if (confirm('Are you sure you want to delete this item?')) {
        foodData[category].splice(index, 1);
        updateAllCategory();
        
        // Save to Firebase for real-time sync (with fallback)
        saveFoodDataToCloud();
        
        loadAdminInterface();
        showSaveIndicator();
        
        // Refresh menu if user is on menu page
        refreshMenuForUsers();
    }
}

// Add new category
function addNewCategory() {
    const categoryName = prompt('Enter new category name (lowercase, no spaces):');
    if (categoryName && /^[a-z]+$/.test(categoryName)) {
        if (!foodData[categoryName]) {
            foodData[categoryName] = [];
            updateAllCategory();
            
            // Save to Firebase for real-time sync (with fallback)
            saveFoodDataToCloud();
            
            loadAdminInterface();
            showSaveIndicator();
            
            // Refresh menu if user is on menu page
            refreshMenuForUsers();
        } else {
            alert('Category already exists');
        }
    } else {
        alert('Invalid category name. Use lowercase letters only, no spaces.');
    }
}

// Delete category
function deleteCategory(category) {
    if (confirm(`Are you sure you want to delete the entire "${category}" category?`)) {
        delete foodData[category];
        updateAllCategory();
        
        // Save to Firebase for real-time sync (with fallback)
        saveFoodDataToCloud();
        
        loadAdminInterface();
        showSaveIndicator();
        
        // Refresh menu if user is on menu page
        refreshMenuForUsers();
    }
}

// Update 'all' category
function updateAllCategory() {
    foodData.all = [
        ...foodData.special,
        ...foodData.daily,
        ...foodData.custom,
        ...foodData.other
    ];
    
    // Add items from any custom categories
    Object.keys(foodData).forEach(category => {
        if (category !== 'all' && category !== 'special' && category !== 'daily' && category !== 'custom' && category !== 'other') {
            foodData.all = [...foodData.all, ...foodData[category]];
        }
    });
}

// Refresh menu for all users (real-time update)
function refreshMenuForUsers() {
    // Check if user is on menu page
    const activePage = document.querySelector('.page.active');
    if (activePage && activePage.id === 'menuPage') {
        const activeCategory = document.querySelector('.category-btn.active');
        if (activeCategory) {
            const categoryName = activeCategory.textContent.toLowerCase().replace(/[^a-z]/g, '');
            if (foodData[categoryName]) {
                loadFoodItems(categoryName);
            }
        } else {
            // Load 'all' category by default
            loadFoodItems('all');
        }
    }
    
    // Update cart if user is on order page
    if (activePage && activePage.id === 'orderPage') {
        renderCartItems();
        updateCartDisplay();
    }
    
    console.log('Menu refreshed for all users with latest data');
}

// Show save indicator with Firebase status
function showSaveIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'save-indicator';
    
    if (isFirebaseConnected) {
        indicator.textContent = 'Changes saved to cloud! 🔄';
        indicator.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
    } else {
        indicator.textContent = 'Changes saved locally! 💾';
        indicator.style.background = 'linear-gradient(135deg, #ff9800, #f57c00)';
    }
    
    document.body.appendChild(indicator);
    
    setTimeout(() => {
        indicator.remove();
    }, 3000);
}

// Show Firebase setup guide for admin
function showFirebaseSetupGuide() {
    const guide = document.createElement('div');
    guide.className = 'firebase-setup-guide';
    guide.innerHTML = `
        <div class="guide-content">
            <h3>🔥 Firebase Setup Required</h3>
            <p>To enable cross-device synchronization, you need to set up Firebase:</p>
            <ol>
                <li>Go to <a href="https://console.firebase.google.com" target="_blank">Firebase Console</a></li>
                <li>Create a new project: "Ziah Kitchen"</li>
                <li>Enable Realtime Database</li>
                <li>Copy your Firebase configuration</li>
                <li>Replace the dummy config in script.js</li>
            </ol>
            <div class="config-example">
                <strong>Your config should look like:</strong>
                <pre>
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};
                </pre>
            </div>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    
    document.body.appendChild(guide);
}

// Check Firebase connection status and show guide if needed
function checkFirebaseConnection() {
    setTimeout(() => {
        if (!isFirebaseConnected) {
            console.log('Firebase not connected - showing setup guide');
            // Only show guide if user is admin
            if (isAdminLoggedIn) {
                showFirebaseSetupGuide();
            }
        }
    }, 3000); // Check after 3 seconds
}

// Admin access shortcut
document.addEventListener('keydown', function(e) {
    // Ctrl+Shift+A to show admin button
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        showPage('adminPage');
    }
});

// Add admin button to welcome page (initially hidden)
document.addEventListener('DOMContentLoaded', function() {
    const welcomeContent = document.querySelector('.welcome-content');
    if (welcomeContent) {
        const adminBtn = document.createElement('button');
        adminBtn.className = 'admin-hidden-btn';
        adminBtn.innerHTML = '🔧 Admin';
        adminBtn.onclick = function() {
            showPage('adminPage');
        };
        adminBtn.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(0,0,0,0.5);
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 15px;
            font-size: 12px;
            cursor: pointer;
            z-index: 1000;
            display: none;
        `;
        document.body.appendChild(adminBtn);
        
        // Show admin button with keyboard shortcut
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                adminBtn.style.display = 'block';
                setTimeout(() => {
                    adminBtn.style.display = 'none';
                }, 5000);
            }
        });
    }
});

// Search functionality and Zia Assistant
let searchTimeout;
let currentSearchTerm = '';

// Zia Assistant messages and recommendations
const ziaMessages = [
    "Hey! I'm Zia! Try searching for 'chicken' or 'rice' 🍗🍚",
    "Looking for something delicious? Search 'beef' for tasty options! 🥩",
    "Feeling hungry? Try 'daily' for today's specials! 🍽️",
    "Want something custom? Search 'custom' for personalized meals! ⭐",
    "Craving variety? Search 'other' for unique options! 🌟"
];

const foodRecommendations = {
    'chicken': [
        { name: 'Chips & Chicken', category: 'special', badge: 'Popular' },
        { name: 'Chicken Rice', category: 'special', badge: 'Favorite' },
        { name: 'Chicken Rice', category: 'daily', badge: 'Fresh' }
    ],
    'rice': [
        { name: 'Chicken Rice', category: 'special', badge: 'Bestseller' },
        { name: 'Chicken Rice', category: 'custom', badge: 'Custom' }
    ],
    'beef': [
        { name: 'Beef', category: 'special', badge: 'Premium' },
        { name: 'Beef', category: 'custom', badge: 'Grilled' }
    ],
    'daily': [
        { name: 'Daily Special 1', category: 'daily', badge: 'Today' },
        { name: 'Daily Special 2', category: 'daily', badge: 'Fresh' },
        { name: 'Daily Special 3', category: 'daily', badge: 'Chef Pick' }
    ],
    'custom': [
        { name: 'Chicken Rice', category: 'custom', badge: 'Personalized' },
        { name: 'Beef', category: 'custom', badge: 'Custom' }
    ],
    'other': [
        { name: 'Other Plate 1', category: 'other', badge: 'Special' },
        { name: 'Other Plate 2', category: 'other', badge: 'Unique' },
        { name: 'Other Plate 3', category: 'other', badge: 'Chef Choice' }
    ]
};

// Initialize search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('foodSearch');
    const searchBtn = document.getElementById('searchBtn');
    const suggestionsContainer = document.getElementById('searchSuggestions');
    const suggestionsList = document.getElementById('suggestionsList');
    const assistantMessage = document.getElementById('assistantMessage');
    const ziaAssistant = document.getElementById('ziaAssistant');
    
    // Scroll detection for corner mode
    let lastScrollTop = 0;
    let scrollTimeout;
    let isCornerMode = false;
    
    // Handle scroll events
    window.addEventListener('scroll', function() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const menuItems = document.querySelector('.menu-items');
        
        if (menuItems) {
            const menuItemsTop = menuItems.offsetTop;
            const scrollPosition = currentScrollTop + 100; // 100px offset
            
            // Check if user has scrolled past the search section
            if (scrollPosition > menuItemsTop + 200 && !isCornerMode) {
                // Move to corner mode
                activateCornerMode();
            } else if (scrollPosition <= menuItemsTop + 100 && isCornerMode) {
                // Return to normal mode
                deactivateCornerMode();
            }
        }
        
        lastScrollTop = currentScrollTop;
    });
    
    // Corner mode functions
    function activateCornerMode() {
        if (ziaAssistant) {
            ziaAssistant.classList.add('corner-mode');
            isCornerMode = true;
            
            // Start continuous recommendations in corner mode
            startCornerRecommendations();
            
            // Update message for corner mode
            updateZiaMessage("I'm here to help! Scroll down or search for foods! 🎯");
        }
    }
    
    function deactivateCornerMode() {
        if (ziaAssistant) {
            ziaAssistant.classList.remove('corner-mode');
            isCornerMode = false;
            
            // Stop corner recommendations
            stopCornerRecommendations();
            
            // Reset message
            resetZiaMessage();
        }
    }
    
    let cornerRecommendationInterval;
    
    function startCornerRecommendations() {
        // Clear any existing interval
        stopCornerRecommendations();
        
        // Start showing recommendations every 6 seconds
        cornerRecommendationInterval = setInterval(() => {
            if (isCornerMode) {
                showRandomRecommendation();
            }
        }, 6000);
    }
    
    function stopCornerRecommendations() {
        if (cornerRecommendationInterval) {
            clearInterval(cornerRecommendationInterval);
            cornerRecommendationInterval = null;
        }
    }
    
    function showRandomRecommendation() {
        const cornerMessages = [
            "Try our 'Chips & Chicken' - it's a customer favorite! 🍗",
            "Don't miss today's 'Daily Special' - fresh and delicious! 🍽️",
            "Looking for something special? Try 'Beef' - premium quality! 🥩",
            "Custom meals available! Personalize your order! ⭐",
            "Scroll up to see the full menu! There's more to explore! 🔍",
            "Add items to cart for easy ordering! 🛒",
            "Need help? I'm here 24/7! 💬",
            "Try searching for 'rice' - we have great options! 🍚"
        ];
        
        const randomMessage = cornerMessages[Math.floor(Math.random() * cornerMessages.length)];
        updateZiaMessage(randomMessage);
    }
    
    // Click on corner assistant to expand
    if (ziaAssistant) {
        ziaAssistant.addEventListener('click', function(e) {
            if (isCornerMode) {
                // Temporarily expand for better viewing
                ziaAssistant.style.transform = 'scale(1)';
                setTimeout(() => {
                    if (isCornerMode) {
                        ziaAssistant.style.transform = '';
                    }
                }, 3000);
            }
        });
    }
    
    if (searchInput && searchBtn) {
        // Search input event
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.trim();
            currentSearchTerm = searchTerm;
            
            // Clear previous timeout
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
            
            if (searchTerm.length > 0) {
                // Show suggestions after a short delay
                searchTimeout = setTimeout(() => {
                    showSearchSuggestions(searchTerm);
                    updateZiaMessage(searchTerm);
                }, 300);
            } else {
                hideSuggestions();
                resetZiaMessage();
            }
        });
        
        // Search button click
        searchBtn.addEventListener('click', function() {
            performSearch();
        });
        
        // Enter key press
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Click outside to hide suggestions
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.search-container')) {
                hideSuggestions();
            }
        });
    }
    
    // Rotate Zia messages
    rotateZiaMessages();
});

// Show search suggestions
function showSearchSuggestions(searchTerm) {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    const suggestionsList = document.getElementById('suggestionsList');
    
    if (!suggestionsContainer || !suggestionsList) return;
    
    const recommendations = getRecommendations(searchTerm);
    
    if (recommendations.length > 0) {
        suggestionsList.innerHTML = recommendations.map(item => `
            <div class="suggestion-item" onclick="selectSuggestion('${item.name}', '${item.category}')">
                <i class="fas fa-utensils"></i>
                <span class="suggestion-text">${item.name}</span>
                <span class="suggestion-badge">${item.badge}</span>
            </div>
        `).join('');
        
        suggestionsContainer.style.display = 'block';
    } else {
        hideSuggestions();
    }
}

// Get recommendations based on search term
function getRecommendations(searchTerm) {
    const term = searchTerm.toLowerCase();
    const recommendations = [];
    
    // Check for exact matches in foodRecommendations
    if (foodRecommendations[term]) {
        recommendations.push(...foodRecommendations[term]);
    }
    
    // Check for partial matches
    Object.keys(foodRecommendations).forEach(key => {
        if (key.includes(term) || term.includes(key)) {
            foodRecommendations[key].forEach(item => {
                if (!recommendations.find(r => r.name === item.name)) {
                    recommendations.push(item);
                }
            });
        }
    });
    
    // Search through all food items for partial matches
    Object.values(foodData).flat().forEach(food => {
        if (food.name && food.name.toLowerCase().includes(term)) {
            if (!recommendations.find(r => r.name === food.name)) {
                // Determine category
                let category = 'all';
                Object.keys(foodData).forEach(cat => {
                    if (foodData[cat].includes(food)) {
                        category = cat;
                    }
                });
                recommendations.push({
                    name: food.name,
                    category: category,
                    badge: 'Match'
                });
            }
        }
    });
    
    return recommendations.slice(0, 5); // Limit to 5 suggestions
}

// Select suggestion
function selectSuggestion(foodName, category) {
    const searchInput = document.getElementById('foodSearch');
    if (searchInput) {
        searchInput.value = foodName;
    }
    
    hideSuggestions();
    performSearch(category);
    
    // Update Zia message
    updateZiaMessage(`Great choice! ${foodName} is delicious! 🎉`);
}

// Perform search
function performSearch(category = null) {
    const searchInput = document.getElementById('foodSearch');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm.length === 0) {
        loadFoodItems('all');
        return;
    }
    
    // Search through all food items
    const allItems = Object.values(foodData).flat();
    const matchedItems = allItems.filter(food => 
        food.name && food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (matchedItems.length > 0) {
        // Display matched items
        const foodGrid = document.getElementById('foodGrid');
        foodGrid.innerHTML = matchedItems.map((food, index) => `
            <div class="food-card" style="animation: fadeInUp 0.5s ease-out ${index * 0.1}s both;">
                <img src="${food.img}" alt="${food.name}" class="food-img">
                <div class="food-info">
                    <div class="food-name">${food.name}</div>
                    <div class="food-price">${food.price}</div>
                    <div class="food-actions">
                        <button class="add-to-cart-btn" onclick="addToCart('${food.name}', '${food.price}', '${food.img}')"><i class="fas fa-shopping-cart"></i> Add to cart</button>
                        <button class="details-btn" onclick="showFoodDetails('${food.name}', '${food.price}', '${food.img}', '${food.description}')">Tap for details</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Update Zia message
        updateZiaMessage(`Found ${matchedItems.length} delicious item${matchedItems.length > 1 ? 's' : ''} for "${searchTerm}"! 😋`);
    } else {
        // No results found
        const foodGrid = document.getElementById('foodGrid');
        foodGrid.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-search" style="font-size: 48px; margin-bottom: 20px; opacity: 0.3;"></i>
                <h3 style="margin-bottom: 10px;">No results found for "${searchTerm}"</h3>
                <p>Try searching for "chicken", "rice", "beef", or "daily"</p>
            </div>
        `;
        
        // Update Zia message
        updateZiaMessage(`No results for "${searchTerm}". Try different keywords! 💡`);
    }
    
    hideSuggestions();
}

// Hide suggestions
function hideSuggestions() {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.style.display = 'none';
    }
}

// Update Zia message
function updateZiaMessage(message) {
    const assistantMessage = document.getElementById('assistantMessage');
    if (assistantMessage) {
        assistantMessage.textContent = message;
        
        // Add animation effect
        const bubble = document.querySelector('.assistant-bubble');
        if (bubble) {
            bubble.style.animation = 'none';
            setTimeout(() => {
                bubble.style.animation = 'bubbleFloat 3s ease-in-out infinite';
            }, 100);
        }
    }
}

// Reset Zia message
function resetZiaMessage() {
    const assistantMessage = document.getElementById('assistantMessage');
    if (assistantMessage) {
        assistantMessage.textContent = ziaMessages[0];
    }
}

// Rotate Zia messages
function rotateZiaMessages() {
    let messageIndex = 0;
    
    setInterval(() => {
        const searchInput = document.getElementById('foodSearch');
        if (searchInput && searchInput.value.trim().length === 0) {
            messageIndex = (messageIndex + 1) % ziaMessages.length;
            updateZiaMessage(ziaMessages[messageIndex]);
        }
    }, 8000); // Change message every 8 seconds
}

// Customer Reviews
const customerReviews = [
    { name: "Sarah M.", rating: 5, text: "Amazing food! The chicken rice was perfectly cooked and delivered hot. Will definitely order again!", date: "2 days ago" },
    { name: "John K.", rating: 4, text: "Great portion sizes and reasonable prices. The beef was tender and flavorful. Highly recommended!", date: "1 week ago" },
    { name: "Maria L.", rating: 5, text: "Best food in Lilongwe! The daily specials are always fresh and delicious. Zia's Kitchen never disappoints!", date: "2 weeks ago" },
    { name: "David B.", rating: 4, text: "Excellent customer service and quick delivery. The quality is consistent every time. Thank you!", date: "3 weeks ago" },
    { name: "Grace N.", rating: 5, text: "The custom platters are perfect for events. Ordered for my birthday and everyone loved it!", date: "1 month ago" }
];

function loadReviews() {
    const reviewsContainer = document.getElementById('reviewsContainer');
    if (reviewsContainer) {
        reviewsContainer.innerHTML = customerReviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <span class="reviewer-name">${review.name}</span>
                    <div class="review-rating">
                        ${generateStars(review.rating)}
                    </div>
                </div>
                <div class="review-text">${review.text}</div>
                <div class="review-date">${review.date}</div>
            </div>
        `).join('');
    }
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="fas fa-star"></i>';
        }
    }
    return stars;
}

function loadMoreReviews() {
    // Simulate loading more reviews
    updateZiaMessage("Loading more delicious reviews... 📝");
    setTimeout(() => {
        updateZiaMessage("Showing all customer reviews! ⭐");
    }, 1000);
}

// WhatsApp Video Call Support
function startWhatsAppVideoCall() {
    const phoneNumber = '265991418099';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=Hi%20Zia!%20I'd%20like%20to%20start%20a%20video%20call%20for%20support.`;
    window.open(whatsappUrl, '_blank');
    updateZiaMessage("Opening WhatsApp for video call... 📹");
}

// Referral Program
function showReferralProgram() {
    document.getElementById('referralModal').classList.add('active');
}

function closeReferralModal() {
    document.getElementById('referralModal').classList.remove('active');
}

function copyReferralCode() {
    const referralInput = document.getElementById('referralCode');
    if (referralInput) {
        referralInput.select();
        document.execCommand('copy');
        updateZiaMessage("Referral code copied! Share with friends! 🎉");
    }
}

function shareReferralWhatsApp() {
    const referralCode = document.getElementById('referralCode').value;
    const message = `Use my referral code ${referralCode} at Zia's Kitchen and get 10% off your order! 🍽️`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function shareReferralFacebook() {
    const referralCode = document.getElementById('referralCode').value;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(`Use code ${referralCode} for 10% off at Zia's Kitchen!`)}`;
    window.open(facebookUrl, '_blank');
}

function shareReferralSMS() {
    const referralCode = document.getElementById('referralCode').value;
    const message = `Use code ${referralCode} for 10% off at Zia's Kitchen! 🍽️`;
    const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
    window.open(smsUrl, '_blank');
}

// Voice Search
let recognition;
let isListening = false;

function startVoiceSearch() {
    document.getElementById('voiceSearchModal').classList.add('active');
    initializeVoiceRecognition();
}

function closeVoiceSearchModal() {
    document.getElementById('voiceSearchModal').classList.remove('active');
    if (isListening) {
        stopVoiceRecognition();
    }
}

function initializeVoiceRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript.toLowerCase();
            document.getElementById('voiceResult').textContent = `You said: "${transcript}"`;
            
            // Process voice command
            if (transcript.includes('chicken') || transcript.includes('food')) {
                performSearch('chicken');
                updateZiaMessage("Found chicken dishes for you! 🍗");
            } else if (transcript.includes('rice')) {
                performSearch('rice');
                updateZiaMessage("Found rice dishes for you! 🍚");
            } else if (transcript.includes('beef')) {
                performSearch('beef');
                updateZiaMessage("Found beef dishes for you! 🥩");
            } else if (transcript.includes('daily') || transcript.includes('special')) {
                performSearch('daily');
                updateZiaMessage("Found daily specials for you! 🍽️");
            } else {
                performSearch(transcript);
                updateZiaMessage(`Searching for "${transcript}"... 🔍`);
            }
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            updateZiaMessage("Voice search not available. Please try typing! 🎤");
        };
        
        recognition.onend = function() {
            isListening = false;
            document.getElementById('voiceBtn').classList.remove('listening');
        };
    } else {
        updateZiaMessage("Voice search not supported in this browser. Please try typing! 🎤");
    }
}

function toggleVoiceListening() {
    if (!recognition) {
        initializeVoiceRecognition();
        return;
    }
    
    if (isListening) {
        stopVoiceRecognition();
    } else {
        recognition.start();
        isListening = true;
        document.getElementById('voiceBtn').classList.add('listening');
        document.getElementById('voiceStatusText').textContent = "Listening... Speak now!";
    }
}

function stopVoiceRecognition() {
    if (recognition && isListening) {
        recognition.stop();
        isListening = false;
        document.getElementById('voiceBtn').classList.remove('listening');
        document.getElementById('voiceStatusText').textContent = "Say 'Hey Zia, find chicken dishes'";
    }
}

// Push Notifications
let notificationPermission = false;

function togglePushNotifications() {
    document.getElementById('notificationModal').classList.add('active');
}

function closeNotificationModal() {
    document.getElementById('notificationModal').classList.remove('active');
}

function enableNotifications() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                notificationPermission = true;
                document.getElementById('notificationStatus').textContent = 'Notifications Enabled';
                updateZiaMessage("Notifications enabled! You'll get updates on new dishes and offers! 🔔");
                
                // Subscribe to push notifications (in a real implementation, this would connect to a backend service)
                subscribeToPushNotifications();
            } else {
                updateZiaMessage("Notifications blocked. Please enable in browser settings. 🔕");
            }
        });
    } else {
        updateZiaMessage("Notifications not supported in this browser. 🔕");
    }
}

function subscribeToPushNotifications() {
    // This would typically connect to a service worker and backend
    // For demo purposes, we'll just show a success message
    console.log('Subscribed to push notifications');
}

// Simulate receiving push notifications
function simulatePushNotification(title, body, icon) {
    if (notificationPermission && 'Notification' in window) {
        new Notification(title, {
            body: body,
            icon: icon || 'favicon.ico',
            badge: 'favicon.ico'
        });
    }
}

// Analytics Dashboard
function showAnalyticsPage() {
    showPage('analyticsPage');
    updateAnalyticsData();
}

function updateAnalyticsData() {
    // In a real implementation, this would fetch data from a backend API
    // For demo purposes, we'll use static data
    
    // Simulate real-time updates
    setInterval(() => {
        updateStatCards();
    }, 30000); // Update every 30 seconds
}

function updateStatCards() {
    // Simulate changing statistics
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const currentValue = parseInt(stat.textContent);
        const change = Math.floor(Math.random() * 5) - 2; // Random change between -2 and +2
        const newValue = Math.max(0, currentValue + change);
        stat.textContent = newValue.toLocaleString();
    });
}

// Initialize reviews on page load
document.addEventListener('DOMContentLoaded', function() {
    loadReviews();
    initializePWA();
    showPersonalizedGreeting();
    loadTimeBasedMenu();
    initializeHapticFeedback();
});

// Enhanced Features Functions

// Touch Interactions
function initializeTouchInteractions() {
    const foodCards = document.querySelectorAll('.food-card');
    
    foodCards.forEach(card => {
        let touchStartX = 0;
        let touchStartY = 0;
        let currentScale = 1;
        
        // Pinch zoom for images
        card.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }
        });
        
        card.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const currentX = e.touches[0].clientX;
                const currentY = e.touches[0].clientY;
                const distance = Math.sqrt(Math.pow(currentX - touchStartX, 2) + Math.pow(currentY - touchStartY, 2));
                
                if (distance > 50) {
                    const img = card.querySelector('.food-img');
                    img.style.transform = `scale(${1.5})`;
                    img.style.transition = 'transform 0.3s ease';
                }
            }
        });
        
        card.addEventListener('touchend', () => {
            const img = card.querySelector('.food-img');
            img.style.transform = 'scale(1)';
        });
    });
}

// Image Modal for Zoom
function openImageModal(imgSrc, foodName) {
    const modal = document.createElement('div');
    modal.className = 'image-modal active';
    modal.innerHTML = `
        <div class="image-modal-content">
            <div class="image-modal-header">
                <h3>${foodName}</h3>
                <button class="close-modal-btn" onclick="closeImageModal(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="image-modal-body">
                <img src="${imgSrc}" alt="${foodName}" class="zoomed-image">
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Haptic feedback
    triggerHapticFeedback('light');
}

function closeImageModal(btn) {
    const modal = btn.closest('.image-modal');
    modal.remove();
}

// Food Photo Sharing
function shareFoodPhoto(foodName, imgSrc) {
    if (navigator.share) {
        navigator.share({
            title: `Check out this ${foodName} from Zia's Kitchen!`,
            text: `I'm enjoying this delicious ${foodName} from Zia's Kitchen! 🍽️`,
            url: window.location.href
        }).then(() => {
            updateZiaMessage("Thanks for sharing! 📸");
            triggerHapticFeedback('success');
        }).catch(() => {
            updateZiaMessage("Share cancelled. No problem! 😊");
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const text = `I'm enjoying this delicious ${foodName} from Zia's Kitchen! 🍽️ ${window.location.href}`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
            updateZiaMessage("Share link copied to clipboard! 📋");
        }
    }
}

// Customization Modal
function openCustomizeModal(foodName, price, img) {
    const modal = document.createElement('div');
    modal.className = 'customize-modal active';
    modal.innerHTML = `
        <div class="customize-content">
            <div class="customize-header">
                <h3>Customize Your ${foodName}</h3>
                <button class="close-modal-btn" onclick="closeCustomizeModal(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="customize-body">
                <div class="customize-section">
                    <h4>Portion Size</h4>
                    <div class="option-group">
                        <label><input type="radio" name="portion" value="regular" checked> Regular</label>
                        <label><input type="radio" name="portion" value="large"> Large (+MWK 500)</label>
                        <label><input type="radio" name="portion" value="extra"> Extra Large (+MWK 1000)</label>
                    </div>
                </div>
                <div class="customize-section">
                    <h4>Extra Ingredients</h4>
                    <div class="option-group">
                        <label><input type="checkbox" value="extra-meat"> Extra Meat (+MWK 800)</label>
                        <label><input type="checkbox" value="extra-rice"> Extra Rice (+MWK 300)</label>
                        <label><input type="checkbox" value="vegetables"> Extra Vegetables (+MWK 200)</label>
                        <label><input type="checkbox" value="spicy"> Extra Spicy (+MWK 100)</label>
                    </div>
                </div>
                <div class="customize-section">
                    <h4>Dietary Preferences</h4>
                    <div class="option-group">
                        <label><input type="checkbox" value="less-oil"> Less Oil</label>
                        <label><input type="checkbox" value="less-salt"> Less Salt</label>
                        <label><input type="checkbox" value="no-onions"> No Onions</label>
                    </div>
                </div>
            </div>
            <div class="customize-footer">
                <button class="apply-customization-btn" onclick="applyCustomization('${foodName}', '${price}', '${img}')">
                    Apply Customization
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    triggerHapticFeedback('medium');
}

function closeCustomizeModal(btn) {
    const modal = btn.closest('.customize-modal');
    modal.remove();
}

function applyCustomization(foodName, price, img) {
    let totalPrice = parseInt(price.replace(/[^0-9]/g, ''));
    
    // Calculate additional costs
    const portion = document.querySelector('input[name="portion"]:checked').value;
    if (portion === 'large') totalPrice += 500;
    if (portion === 'extra') totalPrice += 1000;
    
    const extras = document.querySelectorAll('.customize-section input[type="checkbox"]:checked');
    extras.forEach(extra => {
        const cost = extra.value.includes('meat') ? 800 :
                    extra.value.includes('rice') ? 300 :
                    extra.value.includes('vegetables') ? 200 :
                    extra.value.includes('spicy') ? 100 : 0;
        totalPrice += cost;
    });
    
    const finalPrice = `MWK ${totalPrice.toLocaleString()}`;
    addToCart(`${foodName} (Customized)`, finalPrice, img);
    closeCustomizeModal(document.querySelector('.close-modal-btn'));
    updateZiaMessage("Customization applied! 🎨");
    triggerHapticFeedback('success');
}

// Time-Based Menu
function loadTimeBasedMenu() {
    const hour = new Date().getHours();
    const welcomeText = document.querySelector('.welcome-text');
    
    if (hour >= 6 && hour < 11) {
        // Breakfast
        if (welcomeText) welcomeText.textContent = "Good Morning! Welcome to Zia's Kitchen";
        loadFoodItems('breakfast');
    } else if (hour >= 11 && hour < 15) {
        // Lunch
        if (welcomeText) welcomeText.textContent = "Good Afternoon! Welcome to Zia's Kitchen";
        loadFoodItems('daily');
    } else if (hour >= 15 && hour < 20) {
        // Dinner
        if (welcomeText) welcomeText.textContent = "Good Evening! Welcome to Zia's Kitchen";
        loadFoodItems('special');
    } else {
        // Late Night
        if (welcomeText) welcomeText.textContent = "Good Night! Welcome to Zia's Kitchen";
        loadFoodItems('daily');
    }
}

// Personalized Greeting
function showPersonalizedGreeting() {
    const customerName = localStorage.getItem('customerName') || 'Food Lover';
    const assistantMessage = document.getElementById('assistantMessage');
    
    if (assistantMessage) {
        const greetings = [
            `Welcome back, ${customerName}! 😊`,
            `Hi ${customerName}! Ready for something delicious? 🍽️`,
            `${customerName}, today's specials are amazing! ⭐`,
            `Great to see you, ${customerName}! 🎉`
        ];
        
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        assistantMessage.textContent = randomGreeting;
    }
}

// Haptic Feedback
function initializeHapticFeedback() {
    // Check if haptic feedback is supported
    if ('vibrate' in navigator) {
        window.hapticSupported = true;
    }
}

function triggerHapticFeedback(type) {
    if (!window.hapticSupported) return;
    
    switch(type) {
        case 'light':
            navigator.vibrate(10);
            break;
        case 'medium':
            navigator.vibrate(20);
            break;
        case 'heavy':
            navigator.vibrate(30);
            break;
        case 'success':
            navigator.vibrate([10, 50, 10]);
            break;
        case 'error':
            navigator.vibrate([50, 30, 50]);
            break;
        default:
            navigator.vibrate(15);
    }
}

// PWA Installation
function initializePWA() {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show install banner after 3 seconds
        setTimeout(() => {
            showInstallBanner();
        }, 3000);
    });
    
    // Handle app installed
    window.addEventListener('appinstalled', () => {
        updateZiaMessage("Thanks for installing Zia's Kitchen! 📱");
        triggerHapticFeedback('success');
    });
}

function showInstallBanner() {
    const banner = document.createElement('div');
    banner.className = 'install-banner';
    banner.innerHTML = `
        <div class="install-banner-content">
            <i class="fas fa-download"></i>
            <span>Install Zia's Kitchen for faster ordering!</span>
            <button class="install-btn" onclick="installApp()">Install</button>
            <button class="dismiss-btn" onclick="dismissInstallBanner()">×</button>
        </div>
    `;
    document.body.appendChild(banner);
}

function installApp() {
    const deferredPrompt = window.deferredPrompt;
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                updateZiaMessage("Installing Zia's Kitchen... 📱");
            }
            deferredPrompt = null;
        });
    }
    dismissInstallBanner();
}

function dismissInstallBanner() {
    const banner = document.querySelector('.install-banner');
    if (banner) banner.remove();
}

// Welcome Page Enhancements

// Animated Welcome Messages
const welcomeMessages = [
    "Welcome to ZIAH'S KITCHEN",
    "Craving Something Delicious?",
    "Fresh Food Made with Love",
    "Your Favorite Meals Await!",
    "Taste the Difference Today"
];

let currentMessageIndex = 0;

function rotateWelcomeMessages() {
    const animatedTitle = document.getElementById('animatedTitle');
    if (animatedTitle) {
        currentMessageIndex = (currentMessageIndex + 1) % welcomeMessages.length;
        animatedTitle.style.opacity = '0';
        
        setTimeout(() => {
            animatedTitle.textContent = welcomeMessages[currentMessageIndex];
            animatedTitle.style.opacity = '1';
        }, 500);
    }
}

// Cooking Carousel
let currentCookingIndex = 0;
const cookingItems = document.querySelectorAll('.cooking-item');

function rotateCookingItems() {
    if (cookingItems.length === 0) return;
    
    cookingItems.forEach(item => item.classList.remove('active'));
    currentCookingIndex = (currentCookingIndex + 1) % cookingItems.length;
    cookingItems[currentCookingIndex].classList.add('active');
}

// Quick Add to Cart
function quickAddToCart(name, price, img) {
    cart.push({ name, price, img });
    updateCartBadge();
    updateCartDisplay();
    
    // Show success feedback
    showQuickAddFeedback(name);
    triggerHapticFeedback('success');
}

function showQuickAddFeedback(itemName) {
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = 'quick-add-feedback';
    feedback.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${itemName} added to cart!</span>
    `;
    
    document.body.appendChild(feedback);
    
    // Animate in
    setTimeout(() => feedback.classList.add('show'), 100);
    
    // Remove after 2 seconds
    setTimeout(() => {
        feedback.classList.remove('show');
        setTimeout(() => feedback.remove(), 300);
    }, 2000);
}

// Countdown Timer for Limited Offers
function startCountdownTimer() {
    const countdownElement = document.getElementById('offerCountdown');
    if (!countdownElement) return;
    
    let hours = 2;
    let minutes = 45;
    let seconds = 30;
    
    setInterval(() => {
        seconds--;
        
        if (seconds < 0) {
            seconds = 59;
            minutes--;
            
            if (minutes < 0) {
                minutes = 59;
                hours--;
                
                if (hours < 0) {
                    // Reset countdown
                    hours = 2;
                    minutes = 45;
                    seconds = 30;
                }
            }
        }
        
        const formattedTime = 
            String(hours).padStart(2, '0') + ':' +
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0');
            
        countdownElement.textContent = formattedTime;
        
        // Add urgency when time is low
        if (hours === 0 && minutes < 10) {
            countdownElement.classList.add('urgent');
        } else {
            countdownElement.classList.remove('urgent');
        }
    }, 1000);
}

// AI Suggestions Based on Time/Weather
function generateAISuggestions() {
    const hour = new Date().getHours();
    const suggestionSection = document.querySelector('.ai-suggestions-section');
    if (!suggestionSection) return;
    
    let suggestions = [];
    
    if (hour >= 6 && hour < 11) {
        suggestions = [
            { name: "Breakfast Special", reason: "Perfect start to your day!", price: "MWK 2,500" },
            { name: "Morning Delight", reason: "Fresh and energizing!", price: "MWK 2,800" }
        ];
    } else if (hour >= 11 && hour < 15) {
        suggestions = [
            { name: "Lunch Combo", reason: "Perfect lunchtime meal!", price: "MWK 3,500" },
            { name: "Quick Bite", reason: "Fast and satisfying!", price: "MWK 2,200" }
        ];
    } else if (hour >= 15 && hour < 20) {
        suggestions = [
            { name: "Dinner Special", reason: "Ideal for dinner!", price: "MWK 4,000" },
            { name: "Family Feast", reason: "Great for sharing!", price: "MWK 6,500" }
        ];
    } else {
        suggestions = [
            { name: "Late Night Snack", reason: "Perfect for cravings!", price: "MWK 1,800" },
            { name: "Midnight Special", reason: "Satisfy your hunger!", price: "MWK 2,000" }
        ];
    }
    
    // Update suggestion item
    const suggestionItem = suggestionSection.querySelector('.suggestion-item');
    if (suggestionItem && suggestions.length > 0) {
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        const suggestionName = suggestionItem.querySelector('.suggestion-name');
        const suggestionReason = suggestionItem.querySelector('.suggestion-reason');
        const suggestionPrice = suggestionItem.querySelector('.suggestion-price');
        
        if (suggestionName) suggestionName.textContent = randomSuggestion.name;
        if (suggestionReason) suggestionReason.textContent = randomSuggestion.reason;
        if (suggestionPrice) suggestionPrice.textContent = randomSuggestion.price;
    }
}

// Pull to Refresh for Welcome Page
let pullStartY = 0;
let isPulling = false;

function initializePullToRefresh() {
    const welcomeContent = document.querySelector('.welcome-content');
    if (!welcomeContent) return;
    
    welcomeContent.addEventListener('touchstart', (e) => {
        if (window.scrollY === 0) {
            pullStartY = e.touches[0].clientY;
            isPulling = true;
        }
    });
    
    welcomeContent.addEventListener('touchmove', (e) => {
        if (!isPulling) return;
        
        const currentY = e.touches[0].clientY;
        const pullDistance = currentY - pullStartY;
        
        if (pullDistance > 0 && pullDistance < 150) {
            welcomeContent.style.transform = `translateY(${pullDistance * 0.5}px)`;
            
            if (pullDistance > 80) {
                showPullToRefreshIndicator();
            }
        }
    });
    
    welcomeContent.addEventListener('touchend', () => {
        if (!isPulling) return;
        
        const currentY = event.changedTouches[0].clientY;
        const pullDistance = currentY - pullStartY;
        
        if (pullDistance > 100) {
            refreshWelcomeContent();
        }
        
        welcomeContent.style.transform = '';
        hidePullToRefreshIndicator();
        isPulling = false;
    });
}

function showPullToRefreshIndicator() {
    let indicator = document.querySelector('.pull-to-refresh-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'pull-to-refresh-indicator';
        indicator.innerHTML = '<i class="fas fa-sync-alt"></i> Pull to refresh';
        document.body.appendChild(indicator);
    }
    indicator.classList.add('show');
}

function hidePullToRefreshIndicator() {
    const indicator = document.querySelector('.pull-to-refresh-indicator');
    if (indicator) {
        indicator.classList.remove('show');
    }
}

function refreshWelcomeContent() {
    // Show loading state
    showLoadingSkeletons();
    
    // Refresh content
    setTimeout(() => {
        generateAISuggestions();
        rotateCookingItems();
        hideLoadingSkeletons();
        showQuickAddFeedback('Content refreshed!');
    }, 1000);
}

// Preload Menu Images
function preloadMenuImages() {
    const imageUrls = [
        'all/636643509_941540581782471_8755384936553117064_n.jpg',
        'daily/638401174_941540578449138_5460591836351719171_n.jpg',
        'other/653705019_963659506237245_8371187904235938820_n.jpg',
        'custom/653702552_963659542903908_7015183637697663978_n.jpg'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Smooth Page Transitions
function smoothPageTransition(targetPage) {
    const currentPage = document.querySelector('.page.active');
    const targetPageElement = document.getElementById(targetPage);
    
    if (currentPage && targetPageElement) {
        // Fade out current page
        currentPage.style.opacity = '0';
        currentPage.style.transform = 'translateX(-100%)';
        
        setTimeout(() => {
            currentPage.classList.remove('active');
            targetPageElement.classList.add('active');
            
            // Fade in target page
            targetPageElement.style.opacity = '0';
            targetPageElement.style.transform = 'translateX(100%)';
            
            setTimeout(() => {
                targetPageElement.style.opacity = '1';
                targetPageElement.style.transform = 'translateX(0)';
            }, 50);
        }, 300);
    }
}

// Enhanced Cart Functions
let cartQuantities = {};
let currentDiscount = 0;
let deliveryFee = 500;

// Enhanced Add to Cart with Quantity Tracking
function addToCart(name, price, img) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        // Increment quantity if item exists
        cartQuantities[name] = (cartQuantities[name] || 1) + 1;
        updateCartItemQuantity(name, cartQuantities[name]);
    } else {
        // Add new item
        cart.push({ name, price, img });
        cartQuantities[name] = 1;
        renderCartItems();
    }
    
    updateCartBadge();
    updateCartDisplay();
    triggerHapticFeedback('success');
}

// Update Cart Item Quantity
function updateCartItemQuantity(itemName, quantity) {
    const itemIndex = cart.findIndex(item => item.name === itemName);
    if (itemIndex !== -1) {
        if (quantity === 0) {
            // Remove item if quantity is 0
            cart.splice(itemIndex, 1);
            delete cartQuantities[itemName];
        } else {
            cartQuantities[itemName] = quantity;
        }
        renderCartItems();
        updateCartDisplay();
    }
}

// Increase Quantity
function increaseQuantity(itemName) {
    cartQuantities[itemName] = (cartQuantities[itemName] || 0) + 1;
    updateCartItemQuantity(itemName, cartQuantities[itemName]);
}

// Decrease Quantity
function decreaseQuantity(itemName) {
    const currentQty = cartQuantities[itemName] || 0;
    if (currentQty > 0) {
        cartQuantities[itemName] = currentQty - 1;
        updateCartItemQuantity(itemName, cartQuantities[itemName]);
    }
}

// Remove Item with Swipe Support
function removeItem(itemName) {
    const itemIndex = cart.findIndex(item => item.name === itemName);
    if (itemIndex !== -1) {
        cart.splice(itemIndex, 1);
        delete cartQuantities[itemName];
        renderCartItems();
        updateCartDisplay();
        triggerHapticFeedback('medium');
        showQuickAddFeedback(`${itemName} removed from cart`);
    }
}

// Render Cart Items
function renderCartItems() {
    const cartContainer = document.getElementById('cartItems');
    const emptyMessage = document.getElementById('emptyCartMessage');
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart-message" id="emptyCartMessage">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <button class="browse-menu-btn" onclick="showPage('menuPage')">
                    <i class="fas fa-utensils"></i>
                    Browse Menu
                </button>
            </div>
        `;
    } else {
        let cartHTML = '';
        cart.forEach((item, index) => {
            const quantity = cartQuantities[item.name] || 1;
            const itemTotal = parseInt(item.price.replace(/[^0-9]/g, '')) * quantity;
            
            cartHTML += `
                <div class="cart-item" data-item-name="${item.name}">
                    <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${item.price} x ${quantity}</div>
                        <div class="cart-item-controls">
                            <div class="quantity-controls">
                                <button class="quantity-btn" onclick="decreaseQuantity('${item.name}')">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="quantity-display">${quantity}</span>
                                <button class="quantity-btn" onclick="increaseQuantity('${item.name}')">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            <button class="remove-item-btn" onclick="removeItem('${item.name}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        cartContainer.innerHTML = cartHTML;
        
        // Initialize swipe gestures
        initializeSwipeGestures();
    }
}

// Initialize Swipe Gestures for Mobile
function initializeSwipeGestures() {
    const cartItems = document.querySelectorAll('.cart-item');
    
    cartItems.forEach(item => {
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let currentY = 0;
        
        item.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        item.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            currentX = e.touches[0].clientX;
            currentY = e.touches[0].clientY;
            
            const diffX = startX - currentX;
            const diffY = startY - currentY;
            
            // Check if it's a horizontal swipe (left swipe)
            if (Math.abs(diffX) > Math.abs(diffY) && diffX > 50) {
                const itemName = item.dataset.itemName;
                removeItem(itemName);
            }
        });
        
        item.addEventListener('touchend', () => {
            startX = 0;
            startY = 0;
        });
    });
}

// Update Cart Display with Order Summary
function updateCartDisplay() {
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('totalAmount');
    const discountRow = document.getElementById('discountRow');
    const discountAmount = document.getElementById('discountAmount');
    
    let subtotal = 0;
    cart.forEach(item => {
        const quantity = cartQuantities[item.name] || 1;
        const itemPrice = parseInt(item.price.replace(/[^0-9]/g, ''));
        subtotal += itemPrice * quantity;
    });
    
    const total = subtotal + deliveryFee - currentDiscount;
    
    if (subtotalElement) subtotalElement.textContent = `MWK ${subtotal.toLocaleString()}`;
    if (totalElement) totalElement.textContent = `MWK ${total.toLocaleString()}`;
    
    // Show/hide discount row
    if (discountRow && discountAmount) {
        if (currentDiscount > 0) {
            discountRow.style.display = 'flex';
            discountAmount.textContent = `-MWK ${currentDiscount.toLocaleString()}`;
        } else {
            discountRow.style.display = 'none';
        }
    }
}

// Apply Promo Code
function applyPromoCode() {
    const promoInput = document.getElementById('promoCode');
    const promoMessage = document.getElementById('promoMessage');
    const code = promoInput.value.trim().toUpperCase();
    
    if (!code) {
        showPromoMessage('Please enter a promo code', 'error');
        return;
    }
    
    // Simple promo code validation
    const promoCodes = {
        'ZIA10': 500,
        'WELCOME10': 300,
        'SPECIAL20': 1000
    };
    
    if (promoCodes[code]) {
        currentDiscount = promoCodes[code];
        updateCartDisplay();
        showPromoMessage(`Success! MWK ${currentDiscount} discount applied`, 'success');
        triggerHapticFeedback('success');
    } else {
        showPromoMessage('Invalid promo code', 'error');
        triggerHapticFeedback('error');
    }
}

// Show Promo Message
function showPromoMessage(message, type) {
    const promoMessageElement = document.getElementById('promoMessage');
    if (promoMessageElement) {
        promoMessageElement.textContent = message;
        promoMessageElement.className = `promo-message ${type}`;
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            promoMessageElement.className = 'promo-message';
            promoMessageElement.textContent = '';
        }, 3000);
    }
}

// Clear Cart
function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        cartQuantities = {};
        currentDiscount = 0;
        renderCartItems();
        updateCartDisplay();
        updateCartBadge();
        triggerHapticFeedback('medium');
        showQuickAddFeedback('Cart cleared');
    }
}

// Enhanced Send Order WhatsApp
function sendOrderWhatsApp() {
    if (cart.length === 0) {
        showError('Your cart is empty. Please add items before ordering.');
        return;
    }
    
    const deliveryAddress = document.getElementById('deliveryAddress')?.value;
    const deliveryPhone = document.getElementById('deliveryPhone')?.value;
    const specialInstructions = document.getElementById('specialInstructions')?.value;
    
    if (!deliveryAddress || !deliveryPhone) {
        showError('Please fill in delivery information.');
        return;
    }
    
    // Calculate order details
    let subtotal = 0;
    let orderDetails = '🍽️ *NEW ORDER* 🍽️\n\n';
    
    cart.forEach((item, index) => {
        const quantity = cartQuantities[item.name] || 1;
        const itemTotal = parseInt(item.price.replace(/[^0-9]/g, '')) * quantity;
        subtotal += itemTotal;
        
        orderDetails += `${index + 1}. ${item.name}\n`;
        orderDetails += `   Quantity: ${quantity}\n`;
        orderDetails += `   Price: ${item.price} each\n`;
        orderDetails += `   Subtotal: MWK ${itemTotal.toLocaleString()}\n\n`;
    });
    
    const total = subtotal + deliveryFee - currentDiscount;
    
    orderDetails += '📊 *ORDER SUMMARY* 📊\n';
    orderDetails += `Subtotal: MWK ${subtotal.toLocaleString()}\n`;
    orderDetails += `Delivery Fee: MWK ${deliveryFee}\n`;
    if (currentDiscount > 0) {
        orderDetails += `Discount: -MWK ${currentDiscount.toLocaleString()}\n`;
    }
    orderDetails += `TOTAL: MWK ${total.toLocaleString()}\n\n`;
    
    orderDetails += '📍 *DELIVERY INFO* 📍\n';
    orderDetails += `Address: ${deliveryAddress}\n`;
    orderDetails += `Phone: ${deliveryPhone}\n`;
    if (specialInstructions) {
        orderDetails += `Special Instructions: ${specialInstructions}\n`;
    }
    
    orderDetails += '\n⏰ *ESTIMATED DELIVERY* ⏰\n';
    orderDetails += '30-45 minutes\n\n';
    
    orderDetails += '🙏 *THANK YOU!* 🙏\n';
    orderDetails += 'Zia\'s Kitchen - Delicious Meals Made with Love!';
    
    const whatsappUrl = `https://wa.me/265991418099?text=${encodeURIComponent(orderDetails)}`;
    
    // Show success animation
    showSuccessAnimation();
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    triggerHapticFeedback('success');
}

// Show Success Animation
function showSuccessAnimation() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-animation';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Order Sent Successfully!</span>
    `;
    
    document.body.appendChild(successDiv);
    
    // Show animation
    setTimeout(() => successDiv.classList.add('show'), 100);
    
    // Add success state to WhatsApp button
    const whatsappBtn = document.querySelector('.btn-whatsapp.enhanced');
    if (whatsappBtn) {
        whatsappBtn.classList.add('success');
    }
    
    // Hide animation after 2 seconds
    setTimeout(() => {
        successDiv.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(successDiv);
            if (whatsappBtn) {
                whatsappBtn.classList.remove('success');
            }
        }, 300);
    }, 2000);
}

// Show Error Message
function showError(message) {
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>${message}</span>
        <button class="retry-btn" onclick="this.parentElement.remove()">OK</button>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Show animation
    setTimeout(() => errorDiv.classList.add('show'), 100);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorDiv.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(errorDiv)) {
                document.body.removeChild(errorDiv);
            }
        }, 300);
    }, 5000);
    
    triggerHapticFeedback('error');
}

// Enhanced Zia Assistant Functions
let assistantState = {
    isMinimized: false,
    isHidden: false,
    isAutoHidden: false,
    currentEmotion: 'happy',
    userOrderHistory: [],
    currentCartItems: [],
    lastScrollPosition: 0,
    touchStartX: 0,
    touchStartY: 0,
    isSwiping: false
};

// Initialize Enhanced Zia Assistant
function initializeEnhancedZiaAssistant() {
    const assistant = document.getElementById('ziaAssistantEnhanced');
    const avatar = document.getElementById('assistantAvatarEnhanced');
    const messageElement = document.getElementById('assistantMessageEnhanced');
    const recommendationsList = document.getElementById('recommendationsList');
    
    if (!assistant || !avatar || !messageElement || !recommendationsList) return;
    
    // Load user order history from localStorage
    loadUserOrderHistory();
    
    // Initialize micro-animations
    initializeMicroAnimations();
    
    // Initialize gesture controls
    initializeGestureControls();
    
    // Initialize scroll positioning
    initializeScrollPositioning();
    
    // Start proactive assistance
    startProactiveAssistance();
    
    // Generate initial recommendations
    generateSmartRecommendations();
    
    // Update emotion based on time
    updateEmotionBasedOnTime();
    
    // Start eye tracking
    startEyeTracking();
    
    // Start auto-hide/show cycle
    startAutoHideShowCycle();
}

// Start Auto Hide/Show Cycle
function startAutoHideShowCycle() {
    const assistant = document.getElementById('ziaAssistantEnhanced');
    if (!assistant) return;
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        if (!assistantState.isMinimized && !assistantState.isHidden) {
            autoHideAssistant();
        }
    }, 3000);
    
    // Auto-show after 5 seconds (2 seconds after hide)
    setTimeout(() => {
        if (assistantState.isAutoHidden) {
            autoShowAssistant();
        }
    }, 5000);
    
    // Continue the cycle
    setInterval(() => {
        if (!assistantState.isMinimized && !assistantState.isHidden) {
            autoHideAssistant();
            
            setTimeout(() => {
                if (assistantState.isAutoHidden) {
                    autoShowAssistant();
                }
            }, 2000); // Show after 2 seconds
        }
    }, 8000); // Repeat every 8 seconds (3s visible + 2s hidden + 3s buffer)
}

// Auto Hide Assistant
function autoHideAssistant() {
    const assistant = document.getElementById('ziaAssistantEnhanced');
    if (assistant && !assistantState.isMinimized && !assistantState.isHidden) {
        assistant.classList.add('auto-hidden');
        assistant.classList.remove('auto-showing');
        assistantState.isAutoHidden = true;
        
        // Update message to indicate it's hiding
        showAssistantMessage("I'll be back in a moment! 👋");
        setEmotion('happy');
    }
}

// Auto Show Assistant
function autoShowAssistant() {
    const assistant = document.getElementById('ziaAssistantEnhanced');
    if (assistant && assistantState.isAutoHidden) {
        assistant.classList.add('auto-showing');
        assistant.classList.remove('auto-hidden');
        assistantState.isAutoHidden = false;
        
        // Update message for re-appearance
        showAssistantMessage("I'm back! How can I help? 😊");
        setEmotion('excited');
        setTimeout(() => setEmotion('happy'), 2000);
    }
}

// Load User Order History
function loadUserOrderHistory() {
    const savedHistory = localStorage.getItem('ziaOrderHistory');
    if (savedHistory) {
        assistantState.userOrderHistory = JSON.parse(savedHistory);
    }
}

// Save Order to History
function saveOrderToHistory(orderItems) {
    const timestamp = new Date().toISOString();
    const orderEntry = {
        timestamp: timestamp,
        items: orderItems
    };
    
    assistantState.userOrderHistory.push(orderEntry);
    
    // Keep only last 10 orders
    if (assistantState.userOrderHistory.length > 10) {
        assistantState.userOrderHistory = assistantState.userOrderHistory.slice(-10);
    }
    
    localStorage.setItem('ziaOrderHistory', JSON.stringify(assistantState.userOrderHistory));
}

// Initialize Micro-Animations
function initializeMicroAnimations() {
    const avatar = document.getElementById('assistantAvatarEnhanced');
    const leftEye = document.getElementById('leftEyeEnhanced');
    const rightEye = document.getElementById('rightEyeEnhanced');
    
    if (!avatar || !leftEye || !rightEye) return;
    
    // Random blinking
    setInterval(() => {
        if (Math.random() > 0.7) {
            blinkEyes();
        }
    }, 3000);
    
    // Random winking
    setInterval(() => {
        if (Math.random() > 0.8) {
            winkEye();
        }
    }, 8000);
    
    // Head tilting on hover
    avatar.addEventListener('mouseenter', () => {
        tiltHead();
    });
    
    // Eye following cursor
    document.addEventListener('mousemove', (e) => {
        followCursor(e);
    });
}

// Blink Eyes
function blinkEyes() {
    const leftEye = document.getElementById('leftEyeEnhanced');
    const rightEye = document.getElementById('rightEyeEnhanced');
    
    if (leftEye && rightEye) {
        leftEye.style.transform = 'scaleY(0.1)';
        rightEye.style.transform = 'scaleY(0.1)';
        
        setTimeout(() => {
            leftEye.style.transform = 'scaleY(1)';
            rightEye.style.transform = 'scaleY(1)';
        }, 150);
    }
}

// Wink Eye
function winkEye() {
    const leftEye = document.getElementById('leftEyeEnhanced');
    const isLeftWink = Math.random() > 0.5;
    const eyeToWink = isLeftWink ? leftEye : document.getElementById('rightEyeEnhanced');
    
    if (eyeToWink) {
        eyeToWink.style.transform = 'scaleY(0.1)';
        setTimeout(() => {
            eyeToWink.style.transform = 'scaleY(1)';
        }, 200);
        
        // Change emotion to excited
        setEmotion('excited');
        setTimeout(() => setEmotion('happy'), 2000);
    }
}

// Tilt Head
function tiltHead() {
    const avatar = document.getElementById('assistantAvatarEnhanced');
    if (avatar) {
        avatar.style.transform = 'rotate(-5deg) scale(1.05)';
        setTimeout(() => {
            avatar.style.transform = 'rotate(0deg) scale(1)';
        }, 500);
    }
}

// Follow Cursor with Eyes
function followCursor(e) {
    const leftEye = document.getElementById('leftEyeEnhanced');
    const rightEye = document.getElementById('rightEyeEnhanced');
    const avatar = document.getElementById('assistantAvatarEnhanced');
    
    if (!leftEye || !rightEye || !avatar) return;
    
    const rect = avatar.getBoundingClientRect();
    const avatarCenterX = rect.left + rect.width / 2;
    const avatarCenterY = rect.top + rect.height / 2;
    
    const angle = Math.atan2(e.clientY - avatarCenterY, e.clientX - avatarCenterX);
    const distance = Math.min(3, Math.sqrt(Math.pow(e.clientX - avatarCenterX, 2) + Math.pow(e.clientY - avatarCenterY, 2)) / 50);
    
    const eyeX = Math.cos(angle) * distance;
    const eyeY = Math.sin(angle) * distance;
    
    leftEye.style.setProperty('--eye-x', `${eyeX}px`);
    leftEye.style.setProperty('--eye-y', `${eyeY}px`);
    rightEye.style.setProperty('--eye-x', `${eyeX}px`);
    rightEye.style.setProperty('--eye-y', `${eyeY}px`);
}

// Initialize Gesture Controls
function initializeGestureControls() {
    const assistant = document.getElementById('ziaAssistantEnhanced');
    if (!assistant) return;
    
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    
    // Touch events for swipe to dismiss
    assistant.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
        assistantState.isSwiping = true;
    });
    
    assistant.addEventListener('touchmove', (e) => {
        if (!assistantState.isSwiping) return;
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = currentX - touchStartX;
        const diffY = currentY - touchStartY;
        
        // Check for swipe to dismiss (left swipe)
        if (Math.abs(diffX) > Math.abs(diffY) && diffX < -50) {
            assistant.style.transform = `translateX(${diffX}px) translateY(-50%)`;
        }
    });
    
    assistant.addEventListener('touchend', (e) => {
        if (!assistantState.isSwiping) return;
        
        const currentX = e.changedTouches[0].clientX;
        const diffX = currentX - touchStartX;
        const timeDiff = Date.now() - touchStartTime;
        
        // Check if it's a valid swipe to dismiss
        if (Math.abs(diffX) > 100 && timeDiff < 500) {
            dismissAssistant();
        } else {
            // Reset position
            assistant.style.transform = '';
        }
        
        assistantState.isSwiping = false;
    });
    
    // Tap to interact
    assistant.addEventListener('click', () => {
        if (!assistantState.isSwiping) {
            tapInteraction();
        }
    });
}

// Tap Interaction
function tapInteraction() {
    const assistant = document.getElementById('ziaAssistantEnhanced');
    const avatar = document.getElementById('assistantAvatarEnhanced');
    
    if (assistant && avatar) {
        assistant.classList.add('tap-interacting');
        avatar.classList.add('tapped');
        
        setTimeout(() => {
            assistant.classList.remove('tap-interacting');
            avatar.classList.remove('tapped');
        }, 300);
        
        // Random emotion change
        const emotions = ['happy', 'excited'];
        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        setEmotion(randomEmotion);
        
        triggerHapticFeedback('light');
    }
}

// Initialize Scroll Positioning
function initializeScrollPositioning() {
    const assistant = document.getElementById('ziaAssistantEnhanced');
    if (!assistant) return;
    
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        const currentScrollPosition = window.pageYOffset;
        
        // Check if scrolling up
        if (currentScrollPosition < assistantState.lastScrollPosition && currentScrollPosition > 100) {
            assistant.classList.add('scrolled-up');
            showAssistantMessage("I'm here to help! 👋");
        } else if (currentScrollPosition < 100) {
            assistant.classList.remove('scrolled-up');
        }
        
        assistantState.lastScrollPosition = currentScrollPosition;
        
        scrollTimeout = setTimeout(() => {
            assistant.classList.remove('scrolled-up');
        }, 3000);
    });
}

// Start Proactive Assistance
function startProactiveAssistance() {
    // Check for order history patterns
    setInterval(() => {
        analyzeOrderPatterns();
    }, 15000); // Every 15 seconds
    
    // Check current cart for suggestions
    setInterval(() => {
        analyzeCurrentCart();
    }, 10000); // Every 10 seconds
    
    // Time-based suggestions
    setInterval(() => {
        generateTimeBasedSuggestions();
    }, 30000); // Every 30 seconds
}

// Analyze Order Patterns
function analyzeOrderPatterns() {
    if (assistantState.userOrderHistory.length === 0) return;
    
    // Find most ordered items
    const itemCounts = {};
    assistantState.userOrderHistory.forEach(order => {
        order.items.forEach(item => {
            itemCounts[item.name] = (itemCounts[item.name] || 0) + 1;
        });
    });
    
    const mostOrdered = Object.entries(itemCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
    
    if (mostOrdered.length > 0 && Math.random() > 0.7) {
        const [itemName, count] = mostOrdered[0];
        showProactiveSuggestion(
            `I notice you usually order ${itemName} (${count} times). Would you like to add it?`,
            itemName,
            'proactive'
        );
    }
}

// Analyze Current Cart
function analyzeCurrentCart() {
    if (cart.length === 0) return;
    
    const cartItems = cart.map(item => item.name.toLowerCase());
    
    // Suggest complementary items
    const suggestions = {
        'chicken': ['rice', 'chips', 'salad'],
        'rice': ['chicken', 'beef', 'vegetables'],
        'chips': ['chicken', 'beef', 'fish'],
        'beef': ['rice', 'chips', 'vegetables']
    };
    
    cartItems.forEach(item => {
        for (const [key, values] of Object.entries(suggestions)) {
            if (item.includes(key)) {
                const suggestion = values.find(val => !cartItems.some(cartItem => cartItem.includes(val)));
                if (suggestion && Math.random() > 0.6) {
                    showProactiveSuggestion(
                        `Based on your current order, you might also like ${suggestion}!`,
                        suggestion,
                        'complementary'
                    );
                    break;
                }
            }
        }
    });
}

// Generate Time-Based Suggestions
function generateTimeBasedSuggestions() {
    const hour = new Date().getHours();
    let suggestions = [];
    
    if (hour >= 6 && hour < 11) {
        suggestions = [
            { text: "Good morning! Try our breakfast specials!", item: "breakfast" },
            { text: "Start your day with something delicious!", item: "coffee" }
        ];
    } else if (hour >= 11 && hour < 15) {
        suggestions = [
            { text: "Lunch time! Our chicken rice is popular!", item: "chicken rice" },
            { text: "Need a quick lunch? Try our daily specials!", item: "daily" }
        ];
    } else if (hour >= 17 && hour < 21) {
        suggestions = [
            { text: "Dinner time! How about our special platters?", item: "custom" },
            { text: "Evening hunger? We've got you covered!", item: "all" }
        ];
    }
    
    if (suggestions.length > 0 && Math.random() > 0.5) {
        const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        showProactiveSuggestion(suggestion.text, suggestion.item, 'time-based');
    }
}

// Show Proactive Suggestion
function showProactiveSuggestion(message, suggestedItem, type) {
    const recommendationsList = document.getElementById('recommendationsList');
    if (!recommendationsList) return;
    
    const suggestionHTML = `
        <div class="recommendation-item ${type}" onclick="handleSuggestionClick('${suggestedItem}')">
            <div class="recommendation-title">💡 Smart Suggestion</div>
            <div class="recommendation-description">${message}</div>
            <div class="recommendation-action">Tap to add →</div>
        </div>
    `;
    
    // Add to top of recommendations
    recommendationsList.insertAdjacentHTML('afterbegin', suggestionHTML);
    
    // Remove old suggestions if too many
    const items = recommendationsList.querySelectorAll('.recommendation-item');
    if (items.length > 5) {
        items[items.length - 1].remove();
    }
    
    // Update emotion to excited
    setEmotion('excited');
    setTimeout(() => setEmotion('happy'), 3000);
    
    triggerHapticFeedback('medium');
}

// Handle Suggestion Click
function handleSuggestionClick(item) {
    // Search for the suggested item
    const searchInput = document.getElementById('foodSearch');
    if (searchInput) {
        searchInput.value = item;
        performSearch(item);
    }
    
    showAssistantMessage(`Great choice! Searching for ${item}...`);
    setEmotion('excited');
    setTimeout(() => setEmotion('happy'), 2000);
}

// Generate Smart Recommendations
function generateSmartRecommendations() {
    const recommendationsList = document.getElementById('recommendationsList');
    if (!recommendationsList) return;
    
    const recommendations = [
        { title: "Today's Special", description: "Chef's special chicken rice", action: "View Special" },
        { title: "Popular Choice", description: "Most ordered this week", action: "See Popular" },
        { title: "Quick Meal", description: "Ready in 10 minutes", action: "Order Now" }
    ];
    
    let recommendationsHTML = '';
    recommendations.forEach(rec => {
        recommendationsHTML += `
            <div class="recommendation-item" onclick="handleRecommendationClick('${rec.title}')">
                <div class="recommendation-title">${rec.title}</div>
                <div class="recommendation-description">${rec.description}</div>
                <div class="recommendation-action">${rec.action} →</div>
            </div>
        `;
    });
    
    recommendationsList.innerHTML = recommendationsHTML;
}

// Handle Recommendation Click
function handleRecommendationClick(title) {
    showAssistantMessage(`Loading ${title} for you...`);
    setEmotion('excited');
    
    // Load appropriate category based on recommendation
    if (title.includes("Special")) {
        selectCategory('special');
    } else if (title.includes("Popular")) {
        selectCategory('all');
    } else {
        selectCategory('daily');
    }
    
    setTimeout(() => setEmotion('happy'), 2000);
}

// Set Emotion
function setEmotion(emotion) {
    const emotionIndicator = document.getElementById('emotionIndicator');
    const messageElement = document.getElementById('assistantMessageEnhanced');
    
    if (!emotionIndicator) return;
    
    // Remove all emotion classes
    emotionIndicator.classList.remove('happy', 'excited', 'concerned');
    
    // Add new emotion class
    emotionIndicator.classList.add(emotion);
    assistantState.currentEmotion = emotion;
    
    // Update message based on emotion
    const emotionMessages = {
        happy: ["I'm here to help! 😊", "What can I help you find? 🤔", "Let's find something delicious! 🍽️"],
        excited: ["Great choice! 🎉", "You'll love this! ✨", "Excellent selection! 🌟"],
        concerned: ["Need help finding something? 🤔", "Let me assist you! 🤝", "I'm here to help! 💪"]
    };
    
    const messages = emotionMessages[emotion] || emotionMessages.happy;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    if (messageElement) {
        messageElement.textContent = randomMessage;
    }
}

// Update Emotion Based on Time
function updateEmotionBasedOnTime() {
    const hour = new Date().getHours();
    let emotion = 'happy';
    
    if (hour >= 12 && hour <= 14) {
        emotion = 'excited'; // Lunch rush
    } else if (hour >= 19 && hour <= 21) {
        emotion = 'excited'; // Dinner time
    } else if (hour >= 22 || hour <= 6) {
        emotion = 'concerned'; // Late night
    }
    
    setEmotion(emotion);
}

// Show Assistant Message
function showAssistantMessage(message) {
    const messageElement = document.getElementById('assistantMessageEnhanced');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.style.animation = 'none';
        setTimeout(() => {
            messageElement.style.animation = 'bubbleFloatEnhanced 3s ease-in-out infinite';
        }, 10);
    }
}

// Dismiss Assistant
function dismissAssistant() {
    const assistant = document.getElementById('ziaAssistantEnhanced');
    if (assistant) {
        assistant.classList.add('swipe-dismissing');
        assistantState.isHidden = true;
        
        setTimeout(() => {
            assistant.style.display = 'none';
        }, 300);
        
        triggerHapticFeedback('medium');
    }
}

// Toggle Assistant
function toggleAssistant() {
    const assistant = document.getElementById('ziaAssistantEnhanced');
    const toggleBtn = document.getElementById('toggleAssistantBtn');
    
    if (!assistant) return;
    
    assistantState.isMinimized = !assistantState.isMinimized;
    
    if (assistantState.isMinimized) {
        assistant.classList.add('minimized');
        toggleBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    } else {
        assistant.classList.remove('minimized');
        toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
    }
    
    triggerHapticFeedback('light');
}

// Show Assistant (if hidden)
function showAssistant() {
    const assistant = document.getElementById('ziaAssistantEnhanced');
    if (assistant && assistantState.isHidden) {
        assistant.style.display = 'block';
        assistant.classList.remove('swipe-dismissing');
        assistantState.isHidden = false;
        
        setTimeout(() => {
            showAssistantMessage("I'm back to help! 👋");
            setEmotion('excited');
        }, 100);
    }
}

// Start Eye Tracking
function startEyeTracking() {
    // Enhanced eye movement patterns
    setInterval(() => {
        if (Math.random() > 0.8) {
            randomEyeMovement();
        }
    }, 4000);
}

// Enhanced page load initialization
document.addEventListener('DOMContentLoaded', function() {
    loadReviews();
    initializePWA();
    showPersonalizedGreeting();
    loadTimeBasedMenu();
    initializeHapticFeedback();
    initializeWelcomePage();
    initializeEnhancedZiaAssistant();
});
