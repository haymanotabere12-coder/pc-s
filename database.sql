-- PC Store Database Schema
-- Run this SQL to set up the database

CREATE DATABASE IF NOT EXISTS pc_store;
USE pc_store;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    address TEXT DEFAULT NULL,
    avatar VARCHAR(255) DEFAULT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT DEFAULT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    category_id INT DEFAULT NULL,
    image VARCHAR(255) DEFAULT 'default.jpg',
    featured TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password, full_name, role) VALUES
('admin', 'admin@pcstore.com', '123456', 'Administrator', 'admin');

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Laptops', 'Portable computers for work and gaming'),
('Desktops', 'Desktop computers and towers'),
('Monitors', 'Computer monitors and displays'),
('Keyboards', 'Mechanical and membrane keyboards'),
('Mice', 'Gaming and productivity mice'),
('Headsets', 'Audio headsets and headphones'),
('Graphics Cards', 'GPU cards for gaming and workstations'),
('Processors', 'CPU processors from Intel and AMD'),
('Storage', 'SSDs, HDDs, and external drives'),
('Accessories', 'PC accessories and peripherals');

-- Insert sample products
INSERT INTO products (name, description, price, stock, category_id, image, featured) VALUES
('Gaming Laptop Pro X1', 'High-performance gaming laptop with RTX 4080, 32GB RAM, 1TB SSD', 1899.99, 15, 1, 'laptop1.jpg', 1),
('UltraBook Slim 14', 'Ultra-thin laptop with Intel i7, 16GB RAM, 512GB SSD', 1099.99, 25, 1, 'laptop2.jpg', 1),
('Desktop Tower Beast', 'Custom-built desktop with RTX 4090, 64GB RAM, 2TB SSD', 2999.99, 8, 2, 'desktop1.jpg', 1),
('Office Desktop Pro', 'Business desktop with Intel i5, 16GB RAM, 512GB SSD', 799.99, 30, 2, 'desktop2.jpg', 0),
('4K UltraWide Monitor 34"', '34-inch curved ultrawide monitor, 3440x1440, 144Hz', 549.99, 20, 3, '2.webp', 1),
('Gaming Monitor 27" 240Hz', '27-inch gaming monitor, 1080p, 240Hz, 1ms response', 399.99, 18, 3, 'monitor2.jpg', 0),
('Mechanical Keyboard RGB', 'Cherry MX switches, full RGB, aluminum frame', 149.99, 50, 4, 'keyboard1.jpg', 1),
('Wireless Keyboard Compact', 'Bluetooth wireless keyboard, rechargeable, slim design', 79.99, 40, 4, 'keyboard2.jpg', 0),
('Gaming Mouse Pro', '16000 DPI optical sensor, 8 programmable buttons, RGB', 69.99, 60, 5, 'mouse1.jpg', 1),
('Wireless Ergonomic Mouse', 'Ergonomic design, dual-mode wireless, silent clicks', 49.99, 45, 5, 'mouse2.jpg', 0),
('Gaming Headset 7.1', 'Virtual 7.1 surround sound, noise-canceling mic, RGB', 89.99, 35, 6, 'headset1.jpg', 0),
('RTX 4070 Ti Graphics Card', '12GB GDDR6X, ray tracing, DLSS 3.0', 799.99, 12, 7, 'gpu1.jpg', 1),
('AMD Ryzen 9 7950X', '16-core, 32-thread desktop processor, 5.7GHz boost', 549.99, 20, 8, 'cpu1.jpg', 0),
('1TB NVMe SSD Gen4', 'PCIe 4.0, 7000MB/s read, 5000MB/s write', 109.99, 55, 9, 'ssd1.jpg', 0),
('USB-C Hub 10-in-1', 'HDMI, USB 3.0, SD card reader, Ethernet, PD charging', 39.99, 70, 10, 'hub1.jpg', 0);
