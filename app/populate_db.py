
# Run only to populate the database with product details in data.json

import json
import mysql.connector
from mysql.connector import errors
import logging
from dotenv import load_dotenv
import os

load_dotenv()

def read_file():
    DATA_FILE = "data.json"
    with open(DATA_FILE, "r", encoding="utf-8") as file:
        return json.load(file)

def main():
    try:
        data = read_file()
        conn = mysql.connector.connect(
            user = os.getenv('DB_user'),
            password = os.getenv('DB_password'),
            host = os.getenv('DB_host'),
            database = os.getenv('DB_name')
        )
        cursor = conn.cursor(dictionary=True)

        for product in data:
            name = product['name']
            category = product['category']
            price = product['price']
            thumbnail_image = product['image']['thumbnail']
            mobile_image = product['image']['mobile']
            desktop_image = product['image']['desktop']
            tablet_image = product['image']['tablet']

            try:
                cursor.execute(
                    "INSERT INTO Products (name, category, price, thumbnail_image, mobile_image, desktop_image, tablet_image) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                    (name, category, price, thumbnail_image, mobile_image, desktop_image, tablet_image)
                )
            except errors.IntegrityError:
                print(f"Skipped duplicate product: {name}")
                continue

        conn.commit()
        cursor.close()
        conn.close()
        print("Added products successfully.")

    except Exception as e:
        logging.error(f"Error adding products: {e}")
        print(f"Failed to add products: {e}")


if __name__ == "__main__":
    main()