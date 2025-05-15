from flask import Flask, g
import mysql.connector
from app.routes import routes
from app.api import api
from app.config import Config
from app.auth import auth
import logging

def create_app():
    app = Flask(__name__, template_folder='../templates', static_folder='../static')
    app.config.from_object(Config)

    def get_db():
        if 'db' not in g:
            try:
                logging.info("Initializing database connection...")
                g.db = mysql.connector.connect(**app.config['DATABASE_CONFIG'])
            except mysql.connector.Error as e:
                logging.error(f"Database connection error: {e}")
                g.db = None  # Ensure g.db is set to None if connection fails
        return g.db

    # Close DB connection after each request
    @app.teardown_appcontext
    def close_db(exception):
        db = g.pop('db', None)
        if db is not None:
            db.close()
            
    app.get_db = get_db   
    app.register_blueprint(routes)
    app.register_blueprint(api)
    app.register_blueprint(auth)

    return app