from flask import Flask, render_template, request, redirect, url_for, session
from flask_mysqldb import MySQL, MySQLdb
import bcrypt
import os

app = Flask(__name__)
app.config['MYSQL_HOST'] = os.environ['HOSTENV_MYSQL']
app.config['MYSQL_PORT'] = 3306
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
        #EXTRAER DATOS DEL FORMULARIO
        email = request.form['valog_email']
        password = request.form['valog_password'].encode('utf-8')
        hash_password = bcrypt.hashpw(password, bcrypt.gensalt())
        #CONECTAR A MYSQL
        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cur.execute('SELECT * FROM users WHERE email=%s', (email,)) #SELECCIONAR DATOS DEL EMAIL DE LA TABLA
        user = cur.fetchone()
        cur.close()#CERRAR CONEXION
        #COMPROBAR SI HAY DATOS EN LA TABLA
        if user != None:
            #COMPROBAR CONTRASEÑA
            if bcrypt.hashpw(password, user['password'].encode('utf-8')) == user['password'].encode('utf-8'):
                #PONER DATOS EN LA SESION
                session['email'] = user['email']
                session['name'] = user['name']
                session['ver_email'] = user['ver_email']
                session['login_sux'] = True
                return redirect(url_for('home'))
            else:
                session['login_sux'] = False#LOGIN FALLIDO
                return redirect(url_for('login'))
        else:
            session['login_sux'] = False#LOGIN FALLIDO
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
        #EXTRAER DATOS DEL FORMULARIO
        name = request.form['val_name']
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
            cur.execute('INSERT INTO users (name, email, password) VALUES (%s, %s, %s)', (name, email, hash_password))
            mysql.connection.commit()
            return redirect(url_for('login'))

@app.route('/profile')
def profile():
    if 'email' in session:
        return render_template('profile.html')
    else:
        return redirect(url_for('login'))

@app.route('/edit_profile', methods = ['GET', 'POST'])
def edit_profile():
    if request.method == 'GET':
        if 'email' in session:
            return render_template('edit_profile.html')
        else:
            session['login_sux'] = True
            return redirect(url_for('login'))
    else:
        #EXTRAER DATOS DEL FORMULARIO
        new_name = request.form['val_name']
        new_email = request.form['val_email']
        #CAMBIAR EMAIL
        if len(new_email) > 0:
            if new_email != session['email']:
                cur = mysql.connection.cursor()
                cur.execute('UPDATE users SET email = %s WHERE users.email = %s', (new_email, session['email']))
                mysql.connection.commit()
                session['email'] = new_email
        #CAMBIAR NOMBRE
        if len(new_name) > 0:
            if new_name != session['name']:
                cur = mysql.connection.cursor()
                cur.execute('UPDATE users SET name = %s WHERE users.email = %s', (new_name, session['email']))
                mysql.connection.commit()
                session['name'] = new_name
        return redirect(url_for('profile'))

@app.route('/logout')
def logout():
    session.clear()
    session['login_sux'] = True
    return redirect(url_for("login"))

if __name__ == "__main__":
    app.run()