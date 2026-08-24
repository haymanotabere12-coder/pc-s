
ALTER TABLE orders 
ADD COLUMN payment_method VARCHAR(50) DEFAULT NULL AFTER notes,
ADD COLUMN payment_status ENUM('pending', 'proof_uploaded', 'approved', 'rejected') DEFAULT 'pending' AFTER payment_method,
ADD COLUMN payment_proof VARCHAR(255) DEFAULT NULL AFTER payment_status,
ADD COLUMN admin_response TEXT DEFAULT NULL AFTER payment_proof,
ADD COLUMN payment_message_seen TINYINT(1) DEFAULT 0 AFTER admin_response;


CREATE TABLE IF NOT EXISTS banks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    account_name VARCHAR(100) NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO banks (name, account_number, account_name) VALUES
('Commercial Bank of Ethiopia (CBE)', '1000123456789', 'PC Store Ethiopia'),
('Dashen Bank', '2000987654321', 'PC Store Ethiopia'),
('Bank of Abyssinia', '3000456789123', 'PC Store Ethiopia'),
('Awash Bank', '4000321654987', 'PC Store Ethiopia'),
('Wegagen Bank', '5000789123456', 'PC Store Ethiopia'),
('United Bank', '6000654987321', 'PC Store Ethiopia'),
('Nib International Bank', '7000147258369', 'PC Store Ethiopia'),
('Cooperative Bank of Oromia', '8000963852741', 'PC Store Ethiopia');


CREATE TABLE IF NOT EXISTS payment_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    sender ENUM('admin', 'user') NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SELECT 'Payment system tables created successfully!' as status;
