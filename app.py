from flask import Flask, render_template, url_for, request, redirect, jsonify
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
from dotenv import load_dotenv
from plugins.database import Users
from plugins.email import send_email
from plugins.devtools import is_strong_password, check_username, check_email
import os, asyncio, time
from threading import Thread
from bson import ObjectId
from werkzeug.security import check_password_hash

otp_handler = []

async def otp_handle():
    while True:
        current_time = time.time()
        for i in otp_handler:
            if current_time - i["timestamp"] > 300:  # 5 minutes
                    otp_handler.remove(i)
        await asyncio.sleep(60)



## SECRETS

if os.path.exists('config.env'):
    load_dotenv('config.env')

class Secrets():
    DATABASE_URL = os.environ.get('DATABASE_URL')
    USERNAME = os.environ.get("USERNAME")
    SECRET_KEY = os.environ.get("SECRET_KEY")
    EMAIL = os.environ.get("EMAIL")
    APP_PASSWORD = os.environ.get("APP_PASSWORD")

## CREATING Flask Object with Cross Origin Request Sharing

app = Flask(__name__)
app.secret_key = Secrets.SECRET_KEY ## FOR COOKIE PROTECTION
CORS(app) ## enables to request from any website 

## CREATING DATABASE Objects

cluster = MongoClient(Secrets.DATABASE_URL)
db = cluster[Secrets.USERNAME]
users  = db["users"]

## INTIALIZING LOGIN MANAGER
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"  

class User(UserMixin):
    def __init__(self, user_doc):
        self.id = str(user_doc["_id"])
        self.username = user_doc["username"]
        self.email = user_doc["email"]
        self.password = user_doc["password"]

@login_manager.user_loader
def load_user(user_id):
    us = users.find_one({"_id": ObjectId(user_id)})
    if us:
        return User(us)
    return None


## DATABASE class
udb = Users(users)

@app.route("/verify-otp", methods=["POST"])
def verify_otp():
 try:
    if request.method == "POST": 
     data = request.get_json()
     print(data)
     for i in otp_handler:
         if i["username"] == data.get("username").lower().strip() and int(i["otp"]) == int(data.get("otp")) and (time.time() - i["timestamp"]) <=300 and i["email"] == data.get("email").lower().strip():
             try:
                    id=udb.add_user(username=i["username"], password=i["hashed_password"], email=i["email"])
                    user = User({"_id":id,"username":i["username"].lower().strip(), "email":i["email"].lower().strip(), "password":i["hashed_password"]})
                    login_user(user)    
                    otp_handler.remove(i)
                    print("OTP verified and user logged in")
                    return jsonify({"status":"success", "message":"OTP_VERIFIED"})
             except Exception as e:
                return jsonify({"status":"error", "message":"DB_ERROR_OR_OTP_EXPIRED"})
         else:
             return jsonify({"status":"error", "message":"DB_ERROR_OR_OTP_EXPIRED"})
 except Exception as e:
        return jsonify({"status":"error", "message":"DB_ERROR_OR_OTP_EXPIRED"})
     
## ROUTING CODE
@app.route("/")
def home():
    return render_template("homepage.html") # homepage.html

@app.route("/register_old" , methods=["POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username").strip().lower() ## empty none checks bhi add karo
        if not check_username(username):
            return "Invalid username"
        if not check_email(request.form.get("email").strip().lower()):
            return "Invalid email"
        if not udb.check_username(username):
            password = request.form.get("password").strip()
            if not is_strong_password(password):
                return "Password must be 8-20 chars, include uppercase, lowercase, number & special character"
            try:
               email = request.form.get("email").strip().lower()
               otp = send_email(Secrets.EMAIL, Secrets.APP_PASSWORD, email)
               hashed_password = generate_password_hash(password, method="pbkdf2:sha256")
               otp_handler.append({"username": username, "email": email, "otp": otp , "hashed_password":hashed_password, "timestamp": time.time()})
            except Exception as e:
                return f"Error sending email: {str(e)}"
            hashed_password = generate_password_hash(password, method="pbkdf2:sha256")
            try:
                id=udb.add_user(username=username, password=hashed_password)
                user = User({"_id":id,"username":username})
                login_user(user)
                return redirect(url_for("dashboard"))
            except Exception as e:
                return str(e)
        else:
            return "Already Registered"

@app.route("/login" , methods=["POST"])
def login():
  try:
    if request.method == "POST":
        print("Login Request Recieved")
        credentials = request.get_json()
        email = credentials.get("email").strip().lower()
        password = credentials.get("password").strip()
        usar = udb.get_user(email=email)
        if usar and check_password_hash(usar.get("password"), password):    
            user1 = User(usar)
            login_user(user1)
            print("User logged in")
            return jsonify({"status":"success", "message":"LOGGED_IN"})
        else:
            return jsonify({"status":"error"})
  except Exception as e:
        print(e)

@app.route("/signup", methods=["POST"])
def signup():
    if request.method == "POST":
        print("Signup request received")
        credentials = request.get_json()
        print(credentials)
        username = credentials.get("username").strip().lower()
        email = credentials.get("email").strip().lower()
        password = credentials.get("password").strip()
        if not udb.check_username(username):
            try:
                email = credentials.get("email").strip().lower()
                otp = send_email(Secrets.EMAIL, Secrets.APP_PASSWORD, email)
                hashed_password = generate_password_hash(password, method="pbkdf2:sha256")
                otp_handler.append({"username": username, "email": email, "otp": otp , "hashed_password":hashed_password, "timestamp": time.time()})
                return jsonify({"otp": "sent"}) ## otp sent
            except Exception as e:
                return jsonify({"error": f"Error sending email: {str(e)}"})
        else:
            return jsonify({"error": "Already Registered"})
        
@app.route("/username_check", methods=["POST"])
def username_check():
    if request.method == "POST":
        data = request.get_json()
        username = data.get("username").strip().lower()
        if udb.check_username(username):
            return jsonify({"status": "TAKEN"}) ## username taken
        else:
            return jsonify({"status": "NOT_TAKEN"}) ## username available
@app.route("/email_check", methods=["POST"])
def email_check():
    if request.method == "POST":
        data = request.get_json()
        print(data)
        email = data.get("email").strip().lower()
        if udb.check_email(email):
            return jsonify({"status": "TAKEN"})
        else:
            return jsonify({"status": "NOT_TAKEN"})
        
@app.route("/dashboard")
def dashboard():
    if current_user.is_authenticated:
        return render_template("dashboard.html")
    else:
        return "LOGIN FIRST BITCH"
    
@app.route("/logout", methods=["GET"])
@login_required
def logout():
    if request.method == "GET":
        logout_user()
        return redirect("/")

def start_otp_bg():
    asyncio.run(otp_handle())

Thread(target=start_otp_bg, daemon=True).start()
app.run(debug=True)