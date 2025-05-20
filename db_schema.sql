CREATE DATABASE IF NOT EXISTS food_shop;

USE food_shop;

CREATE USER IF NOT EXISTS 'flaskuser'@'%' IDENTIFIED BY 'password';

GRANT ALL PRIVILEGES ON food_shop.* TO 'flaskuser'@'%';

FLUSH PRIVILEGES;

-- Users table for account authentication and user details
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table for storing product details
CREATE TABLE Products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    thumbnail_image VARCHAR(255),
    mobile_image VARCHAR(255),
    tablet_image VARCHAR(255),
    desktop_image VARCHAR(255)
);

-- Orders table for storing order history
CREATE TABLE Orders (
    order_id VARCHAR(10) PRIMARY KEY,
    user_id INT NOT NULL,
    order_total DECIMAL(10, 2) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- OrderDetails table for storing details of products in each order
CREATE TABLE OrderDetails (
    order_detail_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(10) NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

