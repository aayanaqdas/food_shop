from flask import Blueprint, current_app, jsonify, request, session
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

@api.route('/api/order', methods=['POST'])
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


















# def read_file():
#     DATA_FILE = "data.json"
#     with open(DATA_FILE, "r", encoding="utf-8") as file:
#         return json.load(file)

# @api.route('/api/add_products', methods=['GET'])
# def get_products():
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

#             cursor.execute("INSERT INTO products (name, category, price, thumbnail_image, mobile_image, desktop_image, tablet_image) VALUES (%s, %s, %s, %s, %s, %s, %s)", (name, category, price, thumbnail_image, mobile_image, desktop_image, tablet_image))
#         conn.commit()
#         cursor.close()

#         return jsonify({'status': 'success', 'message': 'Added products'}), 200
    
#     except Exception as e:
#          logging.error(f"Error adding products: {e}")
#          return jsonify({'status': 'error', 'message': 'Failed to add products', 'error': str(e)}), 500

    