# Zuco Motors - Dual Portal Car Marketplace

A comprehensive car marketplace platform with separate portals for buyers and dealers, built with vanilla HTML, CSS, and JavaScript.

## ✅ Completed Features

### Foundation (100% Complete)
- ✅ Project directory structure
- ✅ Database simulation (db.js) with 50+ vehicles, 25 buyers, 10 dealers
- ✅ Authentication system (auth.js) with login/register/session management
- ✅ Utilities module (utils.js) with helpers for formatting, filtering, calculations
- ✅ Global CSS theme with red/white color scheme
- ✅ Landing page with portal selection

### Buyer Portal (30% Complete)
- ✅ Login/Register page with tab switching
- ✅ Dashboard with stats, featured vehicles, saved vehicles, recent activity
- ✅ Inventory browser with advanced filters, sorting, and pagination
- ⏳ Vehicle details page (TO DO)
- ⏳ Compare vehicles page (TO DO)
- ⏳ Favorites page (TO DO)
- ⏳ Financing calculator (TO DO)
- ⏳ Contact agent page (TO DO)
- ⏳ My inquiries page (TO DO)
- ⏳ Profile settings page (TO DO)

### Dealer Portal (0% Complete)
- ⏳ All dealer portal pages (TO DO)

## 🚀 Getting Started

### Prerequisites
- Any modern web browser
- A local web server (Python, Node.js live-server, or VS Code Live Server extension)

### Installation

1. Navigate to the project directory:
```bash
cd zuco-motors
```

2. Start a local web server:

**Option 1: Python**
```bash
python -m http.server 8000
```

**Option 2: Node.js live-server**
```bash
npx live-server
```

**Option 3: VS Code**
- Install "Live Server" extension
- Right-click index.html and select "Open with Live Server"

3. Open your browser and navigate to:
```
http://localhost:8000
```

## 🔑 Demo Accounts

### Buyer Accounts
| Email | Password | Name |
|-------|----------|------|
| john.buyer@email.com | Demo123! | John Smith |
| sarah.buyer@email.com | Demo123! | Sarah Wilson |
| mike.customer@email.com | Demo123! | Mike Johnson |

### Dealer Accounts
| Email | Password | Name |
|-------|----------|------|
| agent1@zucomotors.com | Dealer123! | Alex Thompson |
| agent2@zucomotors.com | Dealer123! | Jessica Martinez |
| manager@zucomotors.com | Admin123! | Robert Chen |

## 📁 Project Structure

```
zuco-motors/
├── index.html                    # ✅ Landing page
├── README.md                     # ✅ This file
├── css/
│   └── styles.css                # ✅ Global styles
├── js/
│   ├── db.js                     # ✅ Database simulation
│   ├── auth.js                   # ✅ Authentication
│   ├── utils.js                  # ✅ Utilities
│   └── data/
│       └── cars.json             # ⏳ Optional JSON file
├── buyer-portal/
│   ├── index.html                # ✅ Buyer dashboard
│   ├── login.html                # ✅ Login/register
│   ├── inventory.html            # ✅ Browse vehicles
│   ├── vehicle-details.html      # ⏳ TO DO
│   ├── compare.html              # ⏳ TO DO
│   ├── favorites.html            # ⏳ TO DO
│   ├── financing.html            # ⏳ TO DO
│   ├── contact-agent.html        # ⏳ TO DO
│   ├── my-inquiries.html         # ⏳ TO DO
│   ├── profile.html              # ⏳ TO DO
│   └── js/
│       └── buyer.js              # ⏳ Optional
└── dealer-portal/
    ├── index.html                # ⏳ TO DO
    ├── login.html                # ⏳ TO DO
    ├── inventory.html            # ⏳ TO DO
    ├── add-vehicle.html          # ⏳ TO DO
    ├── edit-vehicle.html         # ⏳ TO DO
    ├── pricing.html              # ⏳ TO DO
    ├── leads.html                # ⏳ TO DO
    ├── analytics.html            # ⏳ TO DO
    ├── commissions.html          # ⏳ TO DO
    ├── customers.html            # ⏳ TO DO
    ├── reports.html              # ⏳ TO DO
    ├── profile.html              # ⏳ TO DO
    └── js/
        └── dealer.js             # ⏳ Optional
```

## 🛠️ How to Complete Remaining Pages

### Template for Creating New Pages

All pages should follow this structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title - Zuco Motors</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/styles.css">
</head>
<body>
  <!-- Header with navigation -->
  <header>
    <div class="container">
      <div class="header-content">
        <a href="index.html" class="logo">🚗 Zuco Motors</a>
        <nav class="nav">
          <!-- Navigation links -->
        </nav>
      </div>
    </div>
  </header>

  <!-- Main content -->
  <main class="section">
    <div class="container">
      <!-- Page content here -->
    </div>
  </main>

  <!-- Footer -->
  <footer>
    <div class="container">
      <div class="footer-bottom">
        <p>&copy; 2024 Zuco Motors. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <!-- Scripts -->
  <script src="../js/db.js"></script>
  <script src="../js/auth.js"></script>
  <script src="../js/utils.js"></script>
  <script>
    // Page-specific JavaScript
  </script>
</body>
</html>
```

### Priority Pages to Build Next

1. **buyer-portal/vehicle-details.html** - Show individual vehicle with all specs
2. **buyer-portal/favorites.html** - List saved vehicles
3. **dealer-portal/login.html** - Dealer authentication
4. **dealer-portal/index.html** - Dealer dashboard with KPIs
5. **dealer-portal/leads.html** - Manage customer inquiries

## 🔧 Available Utilities

### Database Functions (DB)
```javascript
DB.getVehicles()                    // Get all vehicles
DB.getVehicle(id)                   // Get specific vehicle
DB.getUsers()                       // Get all users
DB.getUserByEmail(email)            // Find user by email
DB.getInquiries()                   // Get all inquiries
DB.getInquiriesByBuyer(buyerId)     // Get buyer's inquiries
DB.getInquiriesByAgent(agentId)     // Get agent's inquiries
DB.updateVehicle(id, updates)       // Update vehicle
DB.addInquiry(inquiry)              // Add new inquiry
```

### Authentication Functions (Auth)
```javascript
Auth.login(email, password, rememberMe)  // Login user
Auth.register(userData)                  // Register new user
Auth.logout()                            // Logout current user
Auth.isAuthenticated()                   // Check if logged in
Auth.getCurrentUser()                    // Get current user object
Auth.hasRole(role)                       // Check user role
Auth.requireAuth(role)                   // Protect page (use on load)
```

### Utility Functions (Utils)
```javascript
Utils.formatCurrency(amount)             // Format as $XX,XXX
Utils.formatDate(dateString)             // Format date
Utils.formatRelativeTime(dateString)     // "2 days ago"
Utils.filterVehicles(vehicles, filters)  // Apply filters
Utils.sortVehicles(vehicles, field, order) // Sort vehicles
Utils.toggleFavorite(vehicleId)          // Toggle favorite
Utils.isFavorite(vehicleId)              // Check if favorite
Utils.addToComparison(vehicleId)         // Add to comparison
Utils.getComparisonList()                // Get comparison list
Utils.showToast(message, type)           // Show notification
Utils.calculateMonthlyPayment(amount, rate, months) // Finance calc
```

## 📊 Database Schema

### Vehicles
- 50+ vehicles with complete data
- Fields: id, vin, year, make, model, trim, bodyStyle, specs, pricing, features, images, status

### Users
- 25 buyers + 10 dealers
- Buyer fields: id, email, password, role, firstName, lastName, profile
- Dealer fields: additional employeeId, commissionRate, salesTarget

### Inquiries
- 40 sample inquiries
- Fields: id, vehicleId, buyerId, agentId, type, status, message, offer, communications

### Transactions
- 15 completed transactions
- Fields: id, vehicleId, buyerId, agentId, pricing, commission, status

## 🎨 Styling Guide

### Colors
- Primary Red: `var(--primary-600)` - #dc2626
- White: `var(--white)` - #ffffff
- Gray shades: `var(--gray-50)` through `var(--gray-900)`
- Success: `var(--success)` - #10b981
- Warning: `var(--warning)` - #f59e0b
- Error: `var(--error)` - #ef4444

### Components
- Buttons: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline`
- Cards: `.card`, `.card-header`, `.card-body`, `.card-footer`
- Forms: `.form-group`, `.form-control`
- Badges: `.badge`, `.badge-primary`, `.badge-success`, etc.
- Vehicle Cards: `.vehicle-card` with predefined structure

## 🧪 Testing Checklist

- [x] Database initializes with sample data
- [x] Login/logout works for buyers
- [x] Session persistence works
- [x] Inventory filters and sorts correctly
- [x] Responsive design works on mobile
- [ ] Vehicle details page shows all info
- [ ] Favorites can be added/removed
- [ ] Comparison feature works
- [ ] Dealer login works
- [ ] Dealer can manage inventory

## 📝 Notes

- All data is stored in localStorage for demo purposes
- No backend server required
- Database resets on first load (can be reset via `DB.reset()` in console)
- Authentication is simplified (passwords not actually hashed)
- For production, replace with real backend and database

## 🤝 Next Steps

1. Complete buyer portal pages (vehicle details, favorites, etc.)
2. Build dealer portal pages
3. Add vehicle image uploads
4. Implement real-time chat between buyers and dealers
5. Add email notifications
6. Create mobile app version
7. Add payment processing integration

## 📄 License

Demo project for educational purposes.

---

**Built with ❤️ using vanilla HTML, CSS, and JavaScript**
