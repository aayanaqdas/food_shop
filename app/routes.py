from flask import render_template, Blueprint

routes = Blueprint('routes', __name__)

@routes.route('/')
def index():
    return render_template("index.html")

@routes.route("/login")
def login_page():
    return render_template("login.html")

@routes.route("/signup")
def signup_page():
    return render_template("signup.html")
