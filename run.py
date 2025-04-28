import logging
from app import create_app


logging.basicConfig(
    filename='food_shop_logs.log',  # Log to a file
    level=logging.DEBUG, 
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'  # Include timestamp, logger name, and log level
)

app = create_app()

if __name__ == '__main__':
    
    app.run(debug=True, host='0.0.0.0')