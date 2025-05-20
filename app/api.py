from flask import Blueprint, current_app, jsonify, request, session
import json
import logging
import random
import string

api = Blueprint('api', __name__)

@api.route('/api/products', methods=['GET'])
def get_products():
    try:
        conn = current_app.get_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Products")
        rows = cursor.fetchall()
        cursor.close()

        products = []

        for row in rows:
            products.append(row)

        return jsonify({'status': 'success', 'message': 'Retrieved products', 'products': products}), 200
    
    except Exception as e:
         return jsonify({'status': 'error', 'message': 'Failed to retrieve products', 'error': str(e)}), 500


def generate_order_id():
    """Generate a short, unique order ID."""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

@api.route('/api/create_order', methods=['POST'])
def create_order():
    try:
        # Ensure the user is logged in
        if 'user_id' not in session:
            return jsonify({'status': 'error', 'message': 'User not logged in'}), 401

        user_id = session['user_id']  # Get the user_id from the session
        data = request.json
        cart_products = data.get('cart_products')

        if not cart_products:
            return jsonify({'status': 'error', 'message': 'Invalid data'}), 400

        conn = current_app.get_db()
        cursor = conn.cursor()
        order_id = generate_order_id()

        # Validate and calculate order total
        order_total = 0
        for product in cart_products:
            try:
                price = float(product['price'])
                quantity = int(product['quantity'])
                total_price = price * quantity
                order_total += total_price
                product['price'] = price  # Ensure price is a float
                product['quantity'] = quantity  # Ensure quantity is an int
                product['total_price'] = total_price  # Add total_price to product
            except (ValueError, KeyError):
                return jsonify({'status': 'error', 'message': 'Invalid product data'}), 400

        # Insert order into Orders table
        cursor.execute("INSERT INTO Orders (order_id, user_id, order_total) VALUES (%s, %s, %s)", (order_id, user_id, order_total))

        # Insert each product into OrderDetails table
        for product in cart_products:
            cursor.execute(
                "INSERT INTO OrderDetails (order_id, product_id, quantity, total_price) VALUES (%s, %s, %s, %s)",
                (order_id, product['product_id'], product['quantity'], product['total_price'])
            )

        conn.commit()
        cursor.close()

        return jsonify({'status': 'success', 'message': 'Order created', 'order_id': order_id}), 201

    except Exception as e:
        logging.error(f"Error creating order: {e}")
        return jsonify({'status': 'error', 'message': 'Failed to create order', 'error': str(e)}), 500


@api.route('/api/order_history', methods=['GET'])
def get_user_orders():
    try:
        # Ensure the user is logged in
        if 'user_id' not in session:
            return jsonify({'status': 'error', 'message': 'User not logged in'}), 401

        user_id = session['user_id']  # Get the user_id from the session

        conn = current_app.get_db()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT order_id, order_total, order_date 
            FROM Orders 
            WHERE user_id = %s 
            ORDER BY order_date DESC;
        """, (user_id,))
        orders = cursor.fetchall()
        cursor.close()

        return jsonify({'status': 'success', 'orders': orders}), 200

    except Exception as e:
        logging.error(f"Error fetching order history: {e}")
        return jsonify({'status': 'error', 'message': 'Failed to fetch order history', 'error': str(e)}), 500



@api.route('/api/order_details', methods=['GET'])
def get_order_details():
    try:
        order_id = request.args.get('order_id')
        if not order_id:
            return jsonify({'status': 'error', 'message': 'Order ID is required'}), 400

        conn = current_app.get_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT od.product_id, p.name, p.tablet_image, p.price, od.quantity, od.total_price
            FROM OrderDetails od
            JOIN Products p ON od.product_id = p.product_id
            WHERE od.order_id = %s
        """, (order_id,))
        products = cursor.fetchall()
        cursor.close()

        return jsonify({'status': 'success', 'products': products}), 200
    except Exception as e:
        logging.error(f"Error fetching order details: {e}")
        return jsonify({'status': 'error', 'message': 'Failed to fetch order details', 'error': str(e)}), 500





# def read_file():
#     DATA_FILE = "data.json"
#     with open(DATA_FILE, "r", encoding="utf-8") as file:
#         return json.load(file)

# @api.route('/api/add_products_db', methods=['GET'])
# def add_products_to_db():
#     try:
#         data = read_file()
#         conn = current_app.get_db()
#         cursor = conn.cursor(dictionary=True)


#         for product in data:
#             name = product['name']
#             category = product['category']
#             price = product['price']
#             thumbnail_image = product['image']['thumbnail']
#             mobile_image = product['image']['mobile']
#             desktop_image = product['image']['desktop']
#             tablet_image = product['image']['tablet']

#             cursor.execute("INSERT INTO Products (name, category, price, thumbnail_image, mobile_image, desktop_image, tablet_image) VALUES (%s, %s, %s, %s, %s, %s, %s)", (name, category, price, thumbnail_image, mobile_image, desktop_image, tablet_image))
#         conn.commit()
#         cursor.close()

#         return jsonify({'status': 'success', 'message': 'Added products'}), 200
    
#     except Exception as e:
#          logging.error(f"Error adding products: {e}")
#          return jsonify({'status': 'error', 'message': 'Failed to add products', 'error': str(e)}), 500

    