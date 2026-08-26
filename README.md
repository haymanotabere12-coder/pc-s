# PC Store - Modern Hardware & Gaming Tech Hub

A full-stack e-commerce web application tailored for computer hardware, custom gaming rigs, workstations, and peripherals with Ethiopian Birr (ETB) currency and localized CBE / Telebirr payment receipt processing.

---

## Key Features

### 🛒 E-Commerce & Shopping Experience
- **Hardware Catalog**: Filter by category (Laptops, Gaming Desktops, GPUs, Processors, Monitors, Accessories), live keyword search, price range filters, and stock indicators.
- **Product Details & Quick View**: High-resolution hardware previews, detailed technical specifications, instant stock status, and add-to-cart controls.
- **Cart & Discount Codes**: Real-time quantity adjustment, subtotal calculation, automated Ethiopian tax calculation, and free shipping over 15,000 ETB.
- **Ethiopian Payment Options**: Support for Commercial Bank of Ethiopia (CBE) and Telebirr direct bank transfers with receipt screenshot upload and verification.

### 🔐 User & Admin Authentication
- **Unified Sign-In**: Single login portal for both customers and administrators with session persistence.
- **Customer Registration**: Quick registration with full name, username, email, and phone number.
- **Password Reset**: Self-service reset link generation.
- **Admin Security Controls**: Dedicated admin credential management to update username, full name, avatar, and password with verification.

### 📦 Order Tracking & Two-Way Live Chat
- **Order History & Timeline**: Real-time tracking through 4 stages: Pending Approval, Processing, Shipped, and Delivered.
- **Customer-to-Admin Order Chat**: Direct communication channel for order inquiries, payment clarifications, and status updates.
- **Live Notifications**: Header notification bell with badge counters and one-click alert dismissals.

### 🛠️ Admin Management Dashboard
- **Analytics & Revenue**: Total sales (ETB), active customer count, pending orders, and low-stock alerts.
- **Product CRUD**: Add, edit, update inventory, upload images, and delete hardware items.
- **Payment Verification**: Review customer payment screenshots and approve or reject receipts with 1-click.
- **Customer Inquiries**: Manage and respond to contact inquiries directly from the admin panel.

---

## Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React icons
- **Backend**: Node.js, Express 5, Express-Session, Multer (file uploads)
- **Currency & Localization**: Ethiopian Birr (ETB) formatting with local payment instructions

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
The server will start on `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
npm start
```

---

## Default Credentials

### Store Administrator
- **Username**: `admin`
- **Password**: `admin123`

### Demo Customer
- **Username**: `customer`
- **Password**: `customer123`
