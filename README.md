# PC Store - Full-Stack Web Application

A complete PC Store e-commerce web application built with HTML, CSS, JavaScript, and PHP.

## Features

- **User Authentication** - Login, Register, Logout with secure password hashing
- **Product Catalog** - Browse products by category, search, pagination
- **Product Details** - Detailed product pages with images and descriptions
- **Shopping Cart** - Add, update, remove items, cart summary
- **Checkout** - Complete order with shipping details
- **User Profile** - Edit profile, change password
- **Order History** - View past orders and their status
- **Contact Page** - Send messages to store administrators
- **Admin Panel**:
  - Dashboard with stats (users, products, orders, revenue)
  - Product management (CRUD)
  - Order management with status updates
  - Category management
  - User management
  - Contact message management

## Requirements

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Web server (Apache/Nginx) or PHP built-in server

## Installation

### 1. Clone or download the project

```bash
cd /path/to/your/webserver
```

### 2. Create the database

```bash
mysql -u root -p < database.sql
```

### 3. Configure the application

Edit `includes/config.php` and update the database credentials:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'pc_store');
define('SITE_URL', 'http://localhost:8000');
```

### 4. Start the development server

```bash
php -S localhost:8000
```

### 5. Open in browser

Navigate to `http://localhost:8000`

## Default Admin Login

- **Username:** `admin`
- **Email:** `admin@pcstore.com`
- **Password:** `password`

## Project Structure

```
pc-store/
├── admin/                  # Admin panel pages
│   ├── sidebar.php         # Admin navigation sidebar
│   ├── dashboard.php       # Admin dashboard with stats
│   ├── products.php        # Product management
│   ├── add-product.php     # Add new product
│   ├── edit-product.php    # Edit product
│   ├── orders.php          # Order management
│   ├── users.php           # User management
│   ├── categories.php      # Category management
│   └── messages.php        # Contact messages
├── css/
│   └── style.css           # Main stylesheet
├── js/
│   └── main.js             # Main JavaScript
├── includes/
│   ├── config.php          # Configuration
│   ├── db.php              # Database connection
│   ├── functions.php       # Helper functions
│   ├── header.php          # HTML header/nav
│   └── footer.php          # HTML footer
├── uploads/                # Product image uploads
├── index.php               # Home page
├── products.php            # Products listing
├── product.php             # Product detail
├── cart.php                # Shopping cart
├── checkout.php            # Checkout page
├── contact.php             # Contact page
├── login.php               # Login page
├── register.php            # Registration page
├── profile.php             # User profile
├── orders.php              # User order history
├── logout.php              # Logout handler
├── database.sql            # Database schema
└── README.md               # This file
```

## Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** PHP 7.4+
- **Database:** MySQL
- **Icons:** Font Awesome 6
- **Design:** Responsive, mobile-friendly CSS Grid/Flexbox layout
