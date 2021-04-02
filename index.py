from flask import Flask, render_template, request, redirect, url_for, session
from flask_mysqldb import MySQL, MySQLdb
import bcrypt
import os

app = Flask(__name__)
app.config['MYSQL_HOST'] = os.environ['HOSTENV_MYSQL']
app.config['MYSQL_PORT'] = os.environ['PORTENV_MYSQL']
app.config['MYSQL_USER'] = os.environ['USERENV_MYSQL']
app.config['MYSQL_PASSWORD'] = os.environ['PASSENV_MYSQL']
app.config['MYSQL_DB'] = os.environ['DBENV_MYSQL']
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
mysql = MySQL(app)

app.secret_key = os.environ['weros']

@app.route('/')
def home():
    session['signup_fail'] = False
    session['login_sux'] = True
    return render_template("home.html")

@app.route('/about')
def about():
    session['signup_fail'] = False
    session['login_sux'] = True
    return render_template("about.html")

@app.route('/login', methods = ['GET', 'POST'])
def login():
    if request.method == 'GET':
        if 'email' in session:
            return redirect(url_for('home'))
        else:
            session['signup_fail'] = False
            return render_template("login.html")
    else:
        email = request.form['valog_email']
        password = request.form['valog_password'].encode('utf-8')
        hash_password = bcrypt.hashpw(password, bcrypt.gensalt())

        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cur.execute('SELECT * FROM users WHERE email=%s', (email,))
        user = cur.fetchone()
        cur.close()

        if user != None:
            if bcrypt.hashpw(password, user['password'].encode('utf-8')) == user['password'].encode('utf-8'):
                session['email'] = user['email']
                session['login_sux'] = True
                return redirect(url_for('home'))
            else:
                session['login_sux'] = False
                return redirect(url_for('login'))
        else:
            session['login_sux'] = False
            return redirect(url_for('login'))

@app.route('/signup', methods = ['GET', 'POST'])
def signup():
    if request.method == 'GET':
        if 'email' in session:
            return redirect(url_for('home'))
        else:
            session['login_sux'] = True
            return render_template("signup.html")
    else:
        email = request.form['val_email']
        password = request.form['val_password'].encode('utf-8')
        hash_password = bcrypt.hashpw(password, bcrypt.gensalt())
        #COMPROBAR REGISTRO
        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cur.execute('SELECT * FROM users WHERE email=%s', (email,))
        user = cur.fetchone()
        cur.close()
        #Verificamos aqui
        if user != None:
            session['signup_fail'] = True
            return redirect(url_for('signup'))
        else:
            session['signup_fail'] = False
            #REGISTRAR
            cur = mysql.connection.cursor()
            cur.execute('INSERT INTO users (email, password) VALUES (%s, %s)', (email, hash_password))
            mysql.connection.commit()
            return redirect(url_for('login'))

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for("home"))

if __name__ == "__main__":
    app.run(debug=True)