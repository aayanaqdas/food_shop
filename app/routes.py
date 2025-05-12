from flask import render_template, Blueprint, session, redirect, url_for, flash

routes = Blueprint('routes', __name__)

@routes.route('/')
def index():
    # Check if the user is logged in
    user_logged_in = 'user_id' in session
    return render_template("index.html", user_logged_in=user_logged_in)

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