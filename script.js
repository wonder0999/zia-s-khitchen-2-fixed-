/* ── DATA ──────────────────────────────────── */
const foods = [
  { id:1, cat:'daily', name:'Nsima with Chicken & Vegetables', price:10000,
    img:'daily/638401174_941540578449138_5460591836351719171_n.jpg', 
    desc:'Traditional Malawian nsima served with tender chicken and mixed vegetables',
    tags:['Traditional','Daily Meal'] },
  { id:2, cat:'daily', name:'Grilled Chicken & Rice', price:12000,
    img:'daily/653700701_963659522903910_926241426865272640_n.jpg',
    desc:'Juicy grilled chicken breast served with fluffy white rice',
    tags:['Popular','Daily Meal'] },
  { id:3, cat:'daily', name:'Beef Stew & Nsima', price:15000,
    img:'daily/653702552_963659542903908_7015183637697663978_n.jpg',
    desc:'Rich and hearty beef stew with soft nsima',
    tags:['Hearty','Daily Meal'] },
  { id:4, cat:'daily', name:'Vegetable Medley', price:8000,
    img:'daily/653706075_963659596237236_7545349917405451024_n.jpg',
    desc:'Fresh mixed vegetables served with nsima',
    tags:['Vegetarian','Healthy','Daily Meal'] },
  { id:5, cat:'all', name:'Chicken & Nsima Combo', price:18000,
    img:'all/636643509_941540581782471_8755384936553117064_n.jpg',
    desc:'Generous portion of chicken served with traditional nsima',
    tags:['Combo','Popular'] },
  { id:6, cat:'all', name:'Fish & Chips Special', price:16000,
    img:'all/636679488_941540638449132_7701090060312251468_n.jpg',
    desc:'Crispy fried fish served with potato chips and salad',
    tags:['Seafood','Special'] },
  { id:7, cat:'all', name:'Mixed Meat Platter', price:20000,
    img:'all/637013469_941540615115801_1322117913686776318_n.jpg',
    desc:'Large platter with assorted meats and sides',
    tags:['Large Portions','Sharing'] },
  { id:8, cat:'all', name:'Spicy Chicken Wings', price:14000,
    img:'all/637424558_941538855115977_7878569932847660976_n.jpg',
    desc:'Crispy chicken wings with special seasoning',
    tags:['Chef Special','Popular'] },
  { id:9, cat:'all', name:'Nsima with Chicken & Vegetables', price:13000,
    img:'all/638401174_941540578449138_5460591836351719171_n.jpg',
    desc:'Hearty portion of nsima with chicken and mixed vegetables',
    tags:['Value','Popular'] },
  { id:10, cat:'all', name:'Premium Chicken Plate', price:22000,
    img:'all/652915904_963659556237240_6309603174102272531_n.jpg',
    desc:'Premium chicken dish with special preparation and sides',
    tags:['Premium','Special'] },
  { id:11, cat:'all', name:'Chicken & Rice Special', price:19000,
    img:'all/653700701_963659522903910_926241426865272640_n.jpg',
    desc:'Special chicken and rice combination perfect for sharing',
    tags:['Festival','Sharing'] },
  { id:12, cat:'all', name:'Deluxe Beef Stew', price:25000,
    img:'all/653702552_963659542903908_7015183637697663978_n.jpg',
    desc:'Deluxe beef stew with premium ingredients and nsima',
    tags:['Deluxe','Large Portions'] },
  { id:13, cat:'all', name:'Royal Vegetable Platter', price:28000,
    img:'all/653705418_963659409570588_4197455826349683040_n.jpg',
    desc:'Elegant vegetable platter with premium ingredients',
    tags:['Royal','Premium','Vegetarian'] }
];
const specials = [
  { id:101, name:'Monday Vegetable Special', price:9000, oldPrice:12000,
    img:'all/653706075_963659596237236_7545349917405451024_n.jpg',
    desc:'Monday special - fresh vegetables with nsima',
    tags:['Monday','Special','Value'] },
  { id:102, name:'Tuesday Fish & Chips', price:11000, oldPrice:14000,
    img:'all/653705019_963659506237245_8371187904235938820_n.jpg',
    desc:'Tuesday special - crispy fish with chips',
    tags:['Tuesday','Seafood','Special'] },
  { id:103, name:'Wednesday Chicken Deal', price:13000, oldPrice:16000,
    img:'daily/653706075_963659596237236_7545349917405451024_n.jpg',
    desc:'Wednesday special - chicken with vegetables and nsima',
    tags:['Wednesday','Chicken','Special'] }
];
const others = [
  { id:201, name:'Loaded Fries', price:8000,
    img:'other/653705019_963659506237245_8371187904235938820_n.jpg',
    desc:'Crispy fries topped with cheese and sauce',
    tags:['Snack','Popular'] },
  { id:202, name:'Vegetable Snack Plate', price:10000,
    img:'other/653706075_963659596237236_7545349917405451024_n.jpg',
    desc:'Fresh vegetable assortment perfect for snacking',
    tags:['Snack','Healthy'] }
];

/* ── STATE ──────────────────────────────────── */
let cart = [];
let history = ['pg-welcome'];
let detailItem = null;
let reviews = JSON.parse(localStorage.getItem('ziah-reviews') || '[]');
let selectedRating = 0;
let trendingItems = [
  { id: 5, name: 'Chicken & Nsima Combo', orders: 47, trend: 'up' },
  { id: 8, name: 'Spicy Chicken Wings', orders: 35, trend: 'up' },
  { id: 2, name: 'Grilled Chicken & Rice', orders: 28, trend: 'stable' },
  { id: 10, name: 'Premium Chicken Plate', orders: 22, trend: 'up' },
  { id: 1, name: 'Nsima with Chicken & Vegetables', orders: 19, trend: 'down' }
];

/* ── NAVIGATION ─────────────────────────────── */
function goTo(id) {
  const cur = history[history.length - 1];
  document.getElementById(cur).classList.remove('active');
  document.getElementById(cur).classList.add('behind');
  document.getElementById(id).classList.add('active');
  history.push(id);
  if (id === 'pg-cart') renderCart();
}
function goBack() {
  const cur  = history.pop();
  const prev = history[history.length - 1];
  document.getElementById(cur).classList.remove('active');
  setTimeout(() => document.getElementById(cur).classList.remove('behind'), 420);
  document.getElementById(prev).classList.remove('behind');
  document.getElementById(prev).classList.add('active');
}

/* Intercept device back button */
window.history.pushState(null, '', location.href);
window.addEventListener('popstate', () => {
  window.history.pushState(null, '', location.href);
  if (document.querySelectorAll('.modal.open').length) closeAllModals();
  else if (history.length > 1) goBack();
});

/* ── MODALS ─────────────────────────────────── */
function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.getElementById('overlay').classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  if (!document.querySelectorAll('.modal.open').length)
    document.getElementById('overlay').classList.remove('open');
}
function closeAllModals() {
  document.querySelectorAll('.modal.open').forEach(m => m.classList.remove('open'));
  document.getElementById('overlay').classList.remove('open');
}

/* ── TOAST ──────────────────────────────────── */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2000);
}

/* ── CART ───────────────────────────────────── */
function allItems() { return [...foods, ...specials, ...others]; }

function toggleCart(id) {
  const item = allItems().find(f => f.id === id);
  if (!item) return;
  const idx = cart.findIndex(c => c.id === id);
  if (idx > -1) { cart.splice(idx, 1); showToast('Removed from cart'); }
  else          { cart.push({ ...item, qty: 1 }); showToast('<i class="fas fa-check"></i> Added to cart'); }
  updateBadge();
  refreshButtons(id);
  // Add vibration effect when item is added
  if (idx === -1) {
    const cartPill = document.querySelector('.cart-pill');
    cartPill.classList.add('vibrate');
    setTimeout(() => cartPill.classList.remove('vibrate'), 500);
  }
}

function changeQty(id, delta) {
  const idx = cart.findIndex(c => c.id === id);
  if (idx === -1) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) { cart.splice(idx, 1); showToast('Removed from cart'); }
  updateBadge();
  renderCart();
}

function updateBadge() {
  const total = cart.reduce((s, c) => s + c.qty, 0);
  const pill  = document.getElementById('cart-pill-count');
  const lbl   = document.getElementById('cart-pill-label');
  const cartPill = document.querySelector('.cart-pill');
  
  if (total > 0) {
    pill.style.display = 'flex'; pill.textContent = total;
    lbl.textContent = '(' + total + ')';
    cartPill.classList.add('has-items');
  } else {
    pill.style.display = 'none'; lbl.textContent = 'Cart';
    cartPill.classList.remove('has-items');
  }
}

function refreshButtons(id) {
  const inCart = !!cart.find(c => c.id === id);
  const fb = document.getElementById('fb-' + id);
  const sb = document.getElementById('sb-' + id);
  const ob = document.getElementById('ob-' + id);
  const db = document.getElementById('btn-detail-add');
  if (fb) { fb.classList.toggle('on', inCart); fb.innerHTML = inCart ? '<i class="fas fa-check"></i>' : '<i class="fas fa-shopping-cart"></i>'; }
  if (sb) { sb.classList.toggle('on', inCart); sb.innerHTML = inCart ? '<i class="fas fa-check"></i> Added' : '<i class="fas fa-shopping-cart"></i> Add'; }
  if (ob) { ob.classList.toggle('on', inCart); ob.innerHTML = inCart ? '<i class="fas fa-check"></i> Added' : '<i class="fas fa-shopping-cart"></i> Add'; }
  if (db && detailItem?.id === id) {
    db.classList.toggle('on', inCart);
    db.innerHTML = inCart ? '<i class="fas fa-check"></i> Added to Cart' : '<i class="fas fa-shopping-cart"></i> Add to Cart';
  }
}

function renderCart() {
  const empty = document.getElementById('cart-empty');
  const items = document.getElementById('cart-items');
  const foot  = document.getElementById('cart-foot');
  if (cart.length === 0) {
    empty.classList.remove('hidden'); items.classList.add('hidden');
    foot.classList.add('hidden'); return;
  }
  empty.classList.add('hidden'); items.classList.remove('hidden');
  foot.classList.remove('hidden');
  items.innerHTML = '';
  let sum = 0;
  cart.forEach(item => {
    sum += item.price * item.qty;
    items.innerHTML += `
      <div class="citem">
        <img src="${item.img}" class="citem-img"/>
        <div class="citem-info">
          <div class="citem-name">${item.name}</div>
          <div class="citem-price">MK ${(item.price * item.qty).toLocaleString()}</div>
        </div>
        <div class="citem-qty">
          <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
        </div>
      </div>`;
  });
  document.getElementById('cart-total-val').textContent = 'MK ' + sum.toLocaleString();
  // Build WhatsApp order message
  let msg = "Hello Zia's Kitchen! I'd like to order:\n\n";
  cart.forEach(i => { msg += `• ${i.name} ×${i.qty} — MK ${(i.price*i.qty).toLocaleString()}\n`; });
  msg += `\nTotal: MK ${sum.toLocaleString()}\n\nThank you! 🙏`;
  document.getElementById('cart-wa-btn').href =
    'https://wa.me/265991418099?text=' + encodeURIComponent(msg);
}

/* ── TRENDING ───────────────────────────── */
function renderTrending() {
  const grid = document.getElementById('trending-grid');
  grid.innerHTML = trendingItems.map((item, index) => {
    const trendIcon = item.trend === 'up' ? '🔥' : item.trend === 'down' ? '📉' : '➡️';
    return `
      <div class="trending-item" onclick="openDetail(${item.id})">
        <div class="trending-rank">#${index + 1}</div>
        <div class="trending-name">${item.name}</div>
        <div class="trending-orders">${trendIcon} ${item.orders} orders this week</div>
      </div>
    `;
  }).join('');
}

/* ── REVIEWS & RATINGS ───────────────────── */
function renderReviews(itemId) {
  const reviewsList = document.getElementById('reviews-list');
  const itemReviews = reviews.filter(r => r.itemId === itemId);
  
  if (itemReviews.length === 0) {
    reviewsList.innerHTML = '<p class="no-reviews">No reviews yet. Be the first to review!</p>';
    return;
  }
  
  reviewsList.innerHTML = itemReviews.map(review => `
    <div class="review-item">
      <div class="review-header">
        <span class="review-name">${review.name}</span>
        <div class="review-stars">${renderStars(review.rating)}</div>
      </div>
      <p class="review-text">${review.text}</p>
    </div>
  `).join('');
}

function renderStars(rating) {
  return Array.from({length: 5}, (_, i) => 
    `<i class="fas fa-star star ${i < rating ? 'filled' : ''}"></i>`
  ).join('');
}

function updateItemRating(itemId) {
  const itemReviews = reviews.filter(r => r.itemId === itemId);
  if (itemReviews.length === 0) return;
  
  const avgRating = itemReviews.reduce((sum, r) => sum + r.rating, 0) / itemReviews.length;
  const starsElement = document.getElementById('detail-stars');
  const textElement = document.getElementById('rating-text');
  
  if (starsElement) {
    starsElement.innerHTML = renderStars(Math.round(avgRating));
    textElement.textContent = `${avgRating.toFixed(1)} (${itemReviews.length} review${itemReviews.length !== 1 ? 's' : ''})`;
  }
}

function openReviewModal() {
  document.getElementById('modal-review').classList.add('open');
  document.getElementById('overlay').classList.add('open');
  setupStarRating();
}

function setupStarRating() {
  const stars = document.querySelectorAll('#star-rating .fa-star');
  selectedRating = 0;
  
  stars.forEach(star => {
    star.classList.remove('active');
    star.onclick = () => selectRating(parseInt(star.dataset.rating));
  });
}

function selectRating(rating) {
  selectedRating = rating;
  const stars = document.querySelectorAll('#star-rating .fa-star');
  stars.forEach((star, index) => {
    star.classList.toggle('active', index < rating);
  });
}

function submitReview(event) {
  event.preventDefault();
  
  const name = document.getElementById('review-name').value;
  const text = document.getElementById('review-text').value;
  
  if (selectedRating === 0) {
    showToast('Please select a rating');
    return;
  }
  
  const newReview = {
    itemId: detailItem.id,
    name: name,
    rating: selectedRating,
    text: text,
    date: new Date().toISOString()
  };
  
  reviews.push(newReview);
  localStorage.setItem('ziah-reviews', JSON.stringify(reviews));
  
  closeModal('modal-review');
  renderReviews(detailItem.id);
  updateItemRating(detailItem.id);
  showToast('Review added successfully!');
  
  // Reset form
  document.getElementById('review-form').reset();
  selectedRating = 0;
}

/* ── VOICE ORDERING ───────────────────────── */
let recognition = null;
let isListening = false;

function startVoiceOrder() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    showToast('Voice recognition is not supported in your browser. Please use Chrome or Edge.');
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  const voiceBtn = document.querySelector('.voice-order-btn');
  voiceBtn.classList.add('listening');
  voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i><span>Listening...</span>';
  isListening = true;

  recognition.onstart = () => {
    showToast('Listening for your order...');
  };

  recognition.onresult = (event) => {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript.toLowerCase();
    
    if (event.results[current].isFinal) {
      processVoiceCommand(transcript);
    }
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    showToast('Voice recognition error. Please try again.');
    stopVoiceOrder();
  };

  recognition.onend = () => {
    stopVoiceOrder();
  };

  recognition.start();
}

function stopVoiceOrder() {
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
  
  const voiceBtn = document.querySelector('.voice-order-btn');
  voiceBtn.classList.remove('listening');
  voiceBtn.innerHTML = '<i class="fas fa-microphone"></i><span>Voice Order</span>';
  isListening = false;
}

function processVoiceCommand(command) {
  showToast(`I heard: "${command}"`);
  
  // Parse food items from command
  const allItems = foods.concat(specials).concat(others);
  let foundItems = [];
  
  allItems.forEach(item => {
    const itemWords = item.name.toLowerCase().split(' ');
    const commandWords = command.split(' ');
    
    // Check if item name appears in command
    const matchCount = itemWords.filter(word => 
      commandWords.some(cmdWord => cmdWord.includes(word) || word.includes(cmdWord))
    ).length;
    
    if (matchCount >= 2) {
      foundItems.push(item);
    }
  });
  
  if (foundItems.length > 0) {
    // Add found items to cart
    foundItems.forEach(item => {
      if (!cart.find(c => c.id === item.id)) {
        cart.push({ ...item, qty: 1 });
      }
    });
    
    updateBadge();
    renderCart();
    showToast(`Added ${foundItems.length} item(s) to cart!`);
    goTo('pg-cart');
  } else {
    // Try to understand specific commands
    if (command.includes('chicken')) {
      const chickenItems = allItems.filter(item => 
        item.name.toLowerCase().includes('chicken')
      );
      if (chickenItems.length > 0) {
        cart.push({ ...chickenItems[0], qty: 1 });
        updateBadge();
        renderCart();
        showToast(`Added ${chickenItems[0].name} to cart!`);
        goTo('pg-cart');
        return;
      }
    }
    
    if (command.includes('rice')) {
      const riceItems = allItems.filter(item => 
        item.name.toLowerCase().includes('rice')
      );
      if (riceItems.length > 0) {
        cart.push({ ...riceItems[0], qty: 1 });
        updateBadge();
        renderCart();
        showToast(`Added ${riceItems[0].name} to cart!`);
        goTo('pg-cart');
        return;
      }
    }
    
    showToast('Sorry, I couldn\'t find that item. Please try again or use the menu.');
  }
}

/* ── ZOOM GALLERY ───────────────────────────── */
let zoomLevel = 1;
let currentZoomItem = null;

function openZoomGallery(item) {
  currentZoomItem = item;
  zoomLevel = 1;
  
  const modal = document.getElementById('modal-zoom');
  const mainImg = document.getElementById('zoom-main-img');
  const thumbnails = document.getElementById('zoom-thumbnails');
  
  mainImg.src = item.img;
  
  // Create thumbnails with different angles/views (simulated)
  const thumbnailsHtml = `
    <img src="${item.img}" class="zoom-thumb active" onclick="selectZoomThumb(this, '${item.img}')"/>
    <img src="${item.img}" class="zoom-thumb" onclick="selectZoomThumb(this, '${item.img}')"/>
    <img src="${item.img}" class="zoom-thumb" onclick="selectZoomThumb(this, '${item.img}')"/>
  `;
  thumbnails.innerHTML = thumbnailsHtml;
  
  modal.classList.add('open');
  document.getElementById('overlay').classList.add('open');
}

function selectZoomThumb(thumb, imgSrc) {
  document.querySelectorAll('.zoom-thumb').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
  document.getElementById('zoom-main-img').src = imgSrc;
  resetZoom();
}

function zoomIn() {
  if (zoomLevel < 3) {
    zoomLevel += 0.5;
    updateZoom();
  }
}

function zoomOut() {
  if (zoomLevel > 1) {
    zoomLevel -= 0.5;
    updateZoom();
  }
}

function resetZoom() {
  zoomLevel = 1;
  updateZoom();
}

function updateZoom() {
  const img = document.getElementById('zoom-main-img');
  img.style.transform = `scale(${zoomLevel})`;
}

/* ── FOOD DETAIL ─────────────────────────────── */
function openDetail(id) {
  const item = allItems().find(f => f.id === id);
  detailItem = item;
  document.getElementById('detail-img').src     = item.img;
  document.getElementById('detail-name').textContent  = item.name;
  document.getElementById('detail-price').textContent = 'MK ' + item.price.toLocaleString();
  document.getElementById('detail-desc').textContent  = item.desc;
  const chips = document.getElementById('detail-chips');
  chips.innerHTML = '';
  (item.tags || []).forEach(t => {
    chips.innerHTML += `<span class="chip">${t}</span>`;
  });
  const db = document.getElementById('btn-detail-add');
  const inCart = !!cart.find(c => c.id === id);
  db.classList.toggle('on', inCart);
  db.textContent = inCart ? '✓ Added to Cart' : '🛒 Add to Cart';
  
  // Render reviews and rating
  renderReviews(id);
  updateItemRating(id);
  
  openModal('modal-detail');
}
function addFromDetail() { if (detailItem) toggleCart(detailItem.id); }

/* ── RENDER FUNCTIONS ─────────────────────────── */
function renderFoods(items = foods) {
  const grid = document.getElementById('food-grid');
  grid.innerHTML = '';
  items.forEach(item => {
    const inCart = !!cart.find(c => c.id === item.id);
    grid.innerHTML += `
      <div class="fcard" onclick="openDetail(${item.id})">
        <div class="fcard-img-wrap">
          <img src="${item.img}" alt="${item.name}" class="fcard-img"/>
          <div class="fcard-img-overlay"></div>
          <div class="fcard-tag">${item.tags ? item.tags[0] : 'Daily'}</div>
        </div>
        <div class="fcard-body">
          <div class="fcard-name">${item.name}</div>
          <div class="fcard-price">MK ${item.price.toLocaleString()}</div>
        </div>
        <button class="fcard-add" id="fb-${item.id}" onclick="event.stopPropagation(); toggleCart(${item.id})">
          ${inCart ? '<i class="fas fa-check"></i>' : '<i class="fas fa-shopping-cart"></i>'}
        </button>
      </div>`;
  });
}

function renderSpecials() {
  const list = document.getElementById('specials-list');
  list.innerHTML = '';
  specials.forEach(item => {
    const inCart = !!cart.find(c => c.id === item.id);
    list.innerHTML += `
      <div class="scard" onclick="openDetail(${item.id})">
        <div class="scard-img-wrap">
          <img src="${item.img}" alt="${item.name}" class="scard-img"/>
        </div>
        <div class="scard-body">
          <div class="scard-name">${item.name}</div>
          <div class="scard-price-row">
            <span class="scard-old">MK ${item.oldPrice.toLocaleString()}</span>
            <span class="scard-price">MK ${item.price.toLocaleString()}</span>
          </div>
        </div>
        <button class="scard-add-btn" id="sb-${item.id}" onclick="event.stopPropagation(); toggleCart(${item.id})">
          ${inCart ? '<i class="fas fa-check"></i> Added' : '<i class="fas fa-shopping-cart"></i> Add'}
        </button>
      </div>`;
  });
}

function renderOthers() {
  const grid = document.getElementById('other-grid');
  grid.innerHTML = '';
  others.forEach(item => {
    const inCart = !!cart.find(c => c.id === item.id);
    grid.innerHTML += `
      <div class="fcard" onclick="openDetail(${item.id})">
        <div class="fcard-img-wrap">
          <img src="${item.img}" alt="${item.name}" class="fcard-img"/>
          <div class="fcard-img-overlay"></div>
          <div class="fcard-tag">${item.tags ? item.tags[0] : 'Other'}</div>
        </div>
        <div class="fcard-body">
          <div class="fcard-name">${item.name}</div>
          <div class="fcard-price">MK ${item.price.toLocaleString()}</div>
        </div>
        <button class="fcard-add" id="ob-${item.id}" onclick="event.stopPropagation(); toggleCart(${item.id})">
          ${inCart ? '<i class="fas fa-check"></i>' : '<i class="fas fa-shopping-cart"></i>'}
        </button>
      </div>`;
  });
}

function filterMenu(cat, btn) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  const filtered = cat === 'all' ? foods : foods.filter(f => f.cat === cat);
  renderFoods(filtered);
}

/* ── PLATTER FORM ────────────────────────────── */
function submitPlatter(e) {
  e.preventDefault();
  const name  = document.getElementById('p-name').value;
  const loc   = document.getElementById('p-loc').value;
  const notes = document.getElementById('p-notes').value;
  const msg = `Hello Zia's Kitchen! <i class="fas fa-gift"></i>\nPlatter Order\n\n👤 ${name}\n📍 ${loc}\n📝 ${notes}`;
  document.getElementById('p-wa-link').href =
    'https://wa.me/265991418099?text=' + encodeURIComponent(msg);
  document.getElementById('p-success').classList.add('show');
}

/* ── RESERVATION FORM ────────────────────────── */
function submitReservation(e) {
  e.preventDefault();
  document.getElementById('r-success').classList.add('show');
  setTimeout(() => document.getElementById('r-success').classList.remove('show'), 5500);
  e.target.reset();
}

/* ── ZIAH ASSISTANT ───────────────────────────── */
let ziahCurrentIndex = 0;
let ziahTimer = null;
let ziahVisible = false;

const ziahRecommendations = [
  "🍽️ Try our Nsima & Chambo Fish! It's our signature dish - soft Malawian nsima paired with freshly fried chambo. A true taste of Malawi! 🇲🇼",
  "🔥 Hot Deal Alert! Monday Combo Special for only MK 9,000! Includes nsima with chicken and vegetables. Perfect value meal! 💰",
  "🐟 Tuesday Fish Deal! Get our grilled chambo with sides for just MK 11,000 (was MK 14,000)! Fresh catch of the day! 🌊",
  "🍗 Chicken & Rice is a crowd favorite! Tender grilled chicken served with seasoned rice and fresh vegetables. You'll love it! 😋",
  "🥘 Beef Stew for MK 15,000! Rich beef stew with root vegetables and nsima. Perfect hearty meal for lunch or dinner! 🍲",
  "🥗 Vegetarian Plate for MK 8,000! Fresh seasonal vegetables with nsima and peanut sauce. Healthy and delicious! 🌱",
  "🎉 Festival Special for MK 19,000! Perfect celebration platter for sharing with friends and family. Great for gatherings! 🎊",
  "👑 Royal Feast for MK 28,000! Fit for royalty - our most extravagant platter with premium selection of finest dishes! 👑",
  "🍖 Mixed Grill for MK 18,000! Assorted grilled meats with sides and sauces. Perfect for meat lovers! 🍢",
  "🎁 Custom Platters starting from MK 40,000! Made exactly to your taste and occasion. Perfect for birthdays and events! 🎂"
];

function ziahInit() {
  const assistant = document.getElementById('ziah-assistant');
  const face = assistant.querySelector('.ziah-face');
  
  // Click face to show/hide recommendations
  face.addEventListener('click', ziahToggle);
  
  // Start with first recommendation after 3 seconds
  setTimeout(() => {
    ziahShow();
    ziahStartAutoRotate();
  }, 3000);
}

function ziahToggle() {
  if (ziahVisible) {
    ziahHide();
  } else {
    ziahShow();
  }
}

function ziahShow() {
  const assistant = document.getElementById('ziah-assistant');
  assistant.classList.add('show');
  ziahVisible = true;
  ziahShowCurrentRecommendation();
}

function ziahHide() {
  const assistant = document.getElementById('ziah-assistant');
  assistant.classList.remove('show');
  ziahVisible = false;
  ziahStopAutoRotate();
}

function ziahShowCurrentRecommendation() {
  const recommendation = document.getElementById('ziah-recommendation');
  recommendation.textContent = ziahRecommendations[ziahCurrentIndex];
}

function ziahShowNext() {
  ziahCurrentIndex = (ziahCurrentIndex + 1) % ziahRecommendations.length;
  ziahShowCurrentRecommendation();
  ziahRestartAutoRotate();
}

function ziahStartAutoRotate() {
  ziahTimer = setInterval(() => {
    if (ziahVisible) {
      ziahShowNext();
    }
  }, 3000); // Change recommendation every 3 seconds
}

function ziahStopAutoRotate() {
  if (ziahTimer) {
    clearInterval(ziahTimer);
    ziahTimer = null;
  }
}

function ziahRestartAutoRotate() {
  ziahStopAutoRotate();
  ziahStartAutoRotate();
}

/* ── INIT ────────────────────────────────────── */
document.getElementById('r-date').min = new Date().toISOString().split('T')[0];
renderFoods(foods);
renderSpecials();
renderOthers();
ziahInit();