from flask import Blueprint, current_app, jsonify
import mysql.connector
import json
import logging

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

    