from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

class Config:
    DATABASE_CONFIG = {
        'user': os.getenv('DB_user'),
        'password': os.getenv('DB_password'),
        'host': os.getenv('DB_host'),
        'database': os.getenv('DB_name')
    }