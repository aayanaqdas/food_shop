from flask import Blueprint, request, render_template, redirect, url_for, session, flash, current_app
from werkzeug.security import check_password_hash, generate_password_hash
import logging

auth = Blueprint('auth', __name__)

def check_existing_user(email):
    try:
        conn = current_app.get_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Users WHERE email = %s", (email,))
        user = cursor.fetchone()
        cursor.close()
        return user is not None
    except Exception as e:
        logging.error(f"Error checking existing user: {e}")
        return False


@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        full_name = request.form.get('name')
        email = request.form.get('email')
        password = request.form.get('password')

        if not full_name or not email or not password:
            flash('All fields are required.', 'error')
            return render_template('signup.html')
        
        if check_existing_user(email):
            flash('An account with this email already exists.', 'error')
            return render_template('signup.html')

        try:
            password_hash = generate_password_hash(password)
            conn = current_app.get_db()
            cursor = conn.cursor(dictionary=True)
            cursor.execute("INSERT INTO Users (email, password_hash, full_name) VALUES (%s, %s, %s)", (email, password_hash, full_name))
            conn.commit()
            cursor.close()

            flash('Signup successful! Please log in.', 'success')
            return redirect(url_for('auth.login'))
        except Exception as e:
            logging.error(f"Error during signup: {e}")
            flash('An error occurred during signup. Please try again.', 'error')
            return render_template('signup.html')

    return render_template('signup.html')


@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        if not email or not password:
            flash('Email and password are required.', 'error')
            return render_template('login.html')

        try:
            conn = current_app.get_db()
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM Users WHERE email = %s", (email,))
            user = cursor.fetchone()
            cursor.close()

            if user and check_password_hash(user['password_hash'], password):
                session['user_id'] = user['user_id']
                session['email'] = user['email']
                flash('Login successful!', 'success')
                return redirect(url_for('routes.index'))
            else:
                flash('Invalid email or password.', 'error')
                return render_template('login.html')
        except Exception as e:
            logging.error(f"Error during login: {e}")
            flash('An error occurred during login. Please try again.', 'error')
            return render_template('login.html')

    return render_template('login.html')


@auth.route('/logout', methods=['GET'])
def logout():
    session.clear()
    flash('You have been logged out.', 'success')
    return redirect(url_for('auth.login'))