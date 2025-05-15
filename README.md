# Food Shop

A web based application for managing a food shop, allowing users to browse products, add items to their cart, place orders, and view order history. The application is built using Flask for the backend and vanilla JavaScript for the frontend.

---

## Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Installation](#installation)
* [Folder Structure](#folder-structure)
* [API Endpoints](#api-endpoints)
* [Acknowledgments](#acknowledgments)

---

## Features

* **User Authentication**: Signup, login, and logout functionality.
* **Product Management**: Display products dynamically fetched from the database.
* **Cart System**: Add, update, and remove products from the cart.
* **Order Management**: Place orders and view order history with detailed product information.
* **Responsive Design**: Optimized for desktop and mobile devices.

---

## Tech Stack

* **Backend**: Flask (Python)
* **Frontend**: HTML, CSS, JavaScript
* **Database**: MySQL
* **Environment Management**: Python Dotenv
* **Styling**: Custom CSS with a focus on responsiveness

---

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://https://github.com/aayanaqdas/food_shop.git
   cd food_shop
   ```

2. **Set up the database**:

   * Create a MySQL database using the schema provided in `db_schema.sql`.
   * Populate the database with sample data if needed.

3. **Configure environment variables**:

   * Create a `.env` file in the root directory with the following content:

     ```env
     DB_USER=<your-database-username>
     DB_PASSWORD=<your-database-password>
     DB_HOST=<your-database-host>
     DB_NAME=<your-database-name>
     SECRET_KEY=<your-secret-key>
     ```

4. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

5. **Run the application**:

   ```bash
   python run.py
   ```

6. **Access the application**:

   * Open your browser and navigate to `http://127.0.0.1:5000`

---

## Folder Structure

```
food_shop/
├── app/
│   ├── __init__.py
│   ├── api.py
│   ├── auth.py
│   ├── config.py
│   └── routes.py
├── design/
├── static/
│   ├── assets/
│   │   ├── fonts/
│   │   └── images/
│   ├── css/
│   │   ├── cart.css
│   │   ├── forms.css
│   │   ├── main.css
│   │   ├── orderConfirmation.css
│   │   └── ordersPage.css
│   └── js/
│       ├── cart.js
│       ├── main.js
│       ├── orderConfirmation.js
│       ├── orderHistory.js
│       └── productPage.js
├── templates/
│   ├── index.html
│   ├── login.html
│   ├── orders.html
│   └── signup.html
├── .env
├── .gitignore
├── data.json
├── db_schema.sql
├── README.md
├── requirements.txt
└── run.py
```

---

## API Endpoints

### Products

* **GET** `/api/products`

  * Fetch all available products.

### Orders

* **POST** `/api/create_order`

  * Create a new order.

* **GET** `/api/order_history`

  * Fetch the logged-in user's order history.

* **GET** `/api/order_details?order_id=<id>`

  * Fetch details of a specific order.


---


## Acknowledgments

* **Fonts**: Red Hat Text
* **Icons, Images and design**: [Frontendmentor](https://www.frontendmentor.io/)
