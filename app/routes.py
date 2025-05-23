from flask import render_template, Blueprint, session, redirect, url_for, flash

routes = Blueprint('routes', __name__)

@routes.route('/')
def index():
    # Check if the user is logged in
    user_logged_in = 'user_id' in session
    user_name = session['name'] if user_logged_in and 'name' in session else None
    return render_template("index.html", user_logged_in=user_logged_in, user_name=user_name)

@routes.route('/login')
def login_page():
    # Redirect to the index page if the user is already logged in
    if 'user_id' in session:
        flash('You are already logged in.', 'error')
        return redirect(url_for('routes.index'))
    return render_template("login.html")

@routes.route('/signup')
def signup_page():
    # Redirect to the index page if the user is already logged in
    if 'user_id' in session:
        flash('You are already logged in.', 'error')
        return redirect(url_for('routes.index'))
    return render_template("signup.html")


@routes.route("/orders")
def orders_page():
    user_logged_in = 'user_id' in session
    if user_logged_in:
        user_name = session['name'] if 'name' in session else None
        return render_template("orders.html", user_logged_in=user_logged_in, user_name=user_name)
    return redirect(url_for('routes.login_page'))