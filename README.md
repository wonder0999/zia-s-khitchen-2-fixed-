# Zia's Kitchen Website

A modern, professional website for Zia's Kitchen food business featuring daily food stock recommendations and comprehensive restaurant information.

## Features

### 🍽️ **Core Features**
- **Hero Section** with professional chef presentation and branding
- **Daily Recommendations** showcasing today's special food items
- **Interactive Menu** with category filtering (Appetizers, Main Courses, Desserts, Beverages)
- **About Section** with business story and statistics
- **Contact & Reservation** system with functional forms
- **Newsletter Subscription** for daily recommendations

### 🎨 **Design Elements**
- **Modern UI/UX** with gradient backgrounds and card-based layouts
- **Professional Color Scheme** using orange/amber tones for food industry
- **Responsive Design** optimized for desktop, tablet, and mobile devices
- **Smooth Animations** and micro-interactions
- **Custom Typography** combining Playfair Display (serif) and Inter (sans-serif)

### 🚀 **Technical Features**
- **Pure HTML/CSS/JavaScript** - No frameworks required
- **Mobile-First Responsive Design**
- **Smooth Scrolling Navigation**
- **Interactive Category Filtering**
- **Form Validation** with user feedback
- **Performance Optimized** with lazy loading and debouncing
- **Accessibility Features** including keyboard navigation

## File Structure

```
zia's khitchen/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling with responsive design
├── script.js           # Interactive functionality and animations
└── README.md           # This documentation file
```

## Getting Started

### Option 1: Direct Opening
Simply open `index.html` in your web browser to view the website.

### Option 2: Local Server (Recommended)
For the best experience, run a local web server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000` in your browser.

## Website Sections

### 1. Navigation Bar
- Fixed header with smooth scroll navigation
- Mobile-responsive hamburger menu
- Professional branding with utensil icon

### 2. Hero Section
- Eye-catching gradient background
- "Chef Zia" professional presentation
- Call-to-action buttons for user engagement
- Responsive layout for all devices

### 3. Daily Recommendations
- Dynamic date display showing current day
- 6 featured food items with badges and pricing
- Feature tags (Fresh, Gluten-Free, Vegan, etc.)
- Hover effects and smooth animations

### 4. Menu Showcase
- Category filtering system
- 12 diverse menu items across 4 categories
- Icon-based visual representations
- Price display and descriptions

### 5. About Section
- Business story and philosophy
- Key statistics and achievements
- Feature highlights with icons
- Professional presentation layout

### 6. Contact & Reservation
- Complete contact information
- Interactive reservation form
- Newsletter subscription
- Social media links

### 7. Footer
- Multi-column layout with useful links
- Newsletter signup form
- Social media integration
- Professional branding

## Interactive Features

### Forms
- **Reservation System**: Collects customer details for table bookings
- **Newsletter Signup**: Captures email addresses for marketing
- **Form Validation**: Ensures data integrity with user-friendly feedback

### Animations
- **Fade-in Effects**: Elements appear smoothly on scroll
- **Hover States**: Interactive feedback on all clickable elements
- **Mobile Menu**: Smooth hamburger menu transitions
- **Loading States**: Professional user experience during interactions

### Navigation
- **Smooth Scrolling**: Seamless navigation between sections
- **Active States**: Visual feedback for current section
- **Mobile Optimization**: Touch-friendly interface

## Customization

### Colors
The website uses CSS custom properties for easy color customization:

```css
:root {
    --primary-color: #d35400;    /* Main orange */
    --secondary-color: #e67e22;  /* Lighter orange */
    --accent-color: #f39c12;     /* Amber accent */
    --text-dark: #2c3e50;        /* Dark text */
    --text-light: #7f8c8d;      /* Light text */
    --bg-light: #ecf0f1;         /* Light background */
    --bg-white: #ffffff;         /* White background */
}
```

### Content
All content is easily editable:
- Update business information in HTML
- Modify menu items in `script.js`
- Adjust pricing and descriptions
- Add new categories or items

### Images
The website uses Font Awesome icons as placeholders. To add real images:
1. Replace icon placeholders with `<img>` tags
2. Add real chef photos in the hero section
3. Include actual food photography for menu items

## Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile Browsers**: Optimized for iOS and Android

## Performance Features

- **Optimized CSS**: Efficient styling with minimal redundancy
- **Lazy Loading**: Images load as needed
- **Debounced Events**: Optimized scroll and resize handlers
- **Minimal Dependencies**: No external frameworks required
- **Compressed Animations**: Hardware-accelerated CSS transforms

## SEO Considerations

- Semantic HTML5 structure
- Proper heading hierarchy
- Meta tags and descriptions
- Alt text for images (when added)
- Mobile-friendly responsive design
- Fast loading times

## Future Enhancements

Consider adding these features for an even more impressive website:

1. **Real Menu Management System**
2. **Online Ordering Integration**
3. **Customer Reviews and Ratings**
4. **Photo Gallery of Dishes**
5. **Events and Catering Information**
6. **Loyalty Program Integration**
7. **Multi-language Support**
8. **Advanced Booking Calendar**

## Support

This website is built with modern web standards and best practices. For any questions or customization needs, refer to the well-commented code in the HTML, CSS, and JavaScript files.

---

**Zia's Kitchen** - Fresh food, warm hospitality, memorable experiences.
