from flask import Flask, after_this_request, render_template, url_for, request, redirect, jsonify, session
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
from dotenv import load_dotenv
from plugins.database import Users
from plugins.email import send_email, send_delete_email
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

@app.route("/set_avatar" , methods=["POST"])
@login_required
def set_avatar():
    if request.method == "POST":
        data = request.get_json()
        avatar_data = data.get("src")
        udb.update_avatar(current_user.username, avatar_data)
        return jsonify({"status": "success"})

@app.route("/get_avatar", methods=["POST"])
@login_required
def get_avatar():
    if request.method == "POST":
        avatar_data = udb.get_avatar(current_user.username)
        return jsonify({"status": "success", "src": avatar_data})
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
                    login_user(user, remember=i["remember"])    
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
@app.route("/", methods=["GET", "POST"])
def home():
  if request.method == "POST":
        if current_user.is_authenticated:
            return {"message": "LOGGED_IN", "username": current_user.username}
        return {"message": "NOT_LOGGED_IN"}
  if request.method == "GET":
        return render_template("homepage.html")

@app.route("/login" , methods=["POST"])
def login():
  try:
    if request.method == "POST":
        print("Login Request Recieved")
        credentials = request.get_json()
        email = credentials.get("email").strip().lower()
        password = credentials.get("password").strip()
        remember = credentials.get("remember")
        print(f"Remember me: {remember}")
        usar = udb.get_user(email=email)
        if usar and check_password_hash(usar.get("password"), password):    
            user1 = User(usar)
            login_user(user1, remember=remember)
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
                otp_handler.append({"username": username, "email": email, "otp": otp , "hashed_password":hashed_password, "timestamp": time.time(), "remember": credentials.get("remember")})
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
    
@app.route("/logout", methods=["POST"])
@login_required
def logout():
    if request.method == "POST":
        logout_user()
        return jsonify({"status": "success"})
    
@app.route("/get_notifications_settings", methods=["GET"])
@login_required
def notification_settings():
    if request.method == "GET":
        settings = udb.get_notification_settings(current_user.username)
        return jsonify({"status": "success", "settings": settings})
    
@app.route("/profile", methods=["GET"])
@login_required
def profile():
    username , email = current_user.username , current_user.email
    name , bio = udb.get_name(username) , udb.get_bio(username)
    roll_no = email.upper().split("@")[0]
    return render_template("profile.html", username=username, email=email,roll_no=roll_no, name=name, bio=bio)
def start_otp_bg():
    asyncio.run(otp_handle())

@app.route("/update_profile", methods=["POST"])
@login_required
def update_profile():
    data = request.get_json()
    name = data.get("name")
    bio = data.get("bio")
    username = current_user.username
    udb.update_name(username, name)
    udb.update_bio(username, bio)
    return jsonify({"status": "success"})

@app.route("/update/<function>", methods=["POST"])
@login_required
def update_notifications(function):
    if function == "clan":
        udb.set_clan_notifications(current_user.username, request.get_json().get("allow_clan_invites"))
    
    elif function == "exam_reminders" :
        udb.set_exam_notification(current_user.username, request.get_json().get("exam_reminders"))
    
    elif function == "todo_time":
        udb.set_todo_time_notifications(current_user.username, request.get_json().get("allow_todo_time"), request.get_json().get("to_do_time"))
    return jsonify({"status": "success"})

@app.route("/get_wake_me_up_data", methods=["GET"])
@login_required
def get_wake_me_up_data():
    data = udb.get_wake_me_up_data(current_user.username)
    return jsonify(data)


@app.route("/get_wake_me_up_settings", methods=["GET"])
@login_required
def get_wake_me_up_settings():
    data = udb.get_wake_me_up_settings(current_user.username)
    return jsonify(data)


@app.route("/set_wake_me_up", methods=["POST"])
@login_required
def set_wake_me_up_data():
    data = request.get_json()
    wake_me_up_enabled = data.get("wake_me_up_enabled", False)
    wake_me_up_settings = data.get("wake_me_up_settings", {})
    udb.set_wake_me_up_data(current_user.username, wake_me_up_enabled, wake_me_up_settings)
    return jsonify({"status": "success"})



@app.route("/update_password", methods=["POST"])
@login_required
def update_password():
    data = request.get_json()
    oldpass = data.get("oldpass")
    newpass = data.get("newpass")
    username = current_user.username
    user = udb.get_user_by_username(username=username)
    print(current_user.password)
    if user and check_password_hash(str(current_user.password), oldpass):
        hashed_password = generate_password_hash(newpass, method="pbkdf2:sha256")
        udb.update_password(username, hashed_password)
        return jsonify({"status": "success"})
    else:
        return jsonify({"status": "error"})

@app.route("/delete_account_verify", methods=["POST"])
@login_required
def delete_account_verify():
    try:
        data = request.get_json()
        password = data.get("password", "").strip()
        if not password:
            return jsonify({"status": "error", "message": "PASSWORD_REQUIRED"})
        if not check_password_hash(str(current_user.password), password):
            return jsonify({"status": "error", "message": "INVALID_PASSWORD"})
        otp = send_delete_email(Secrets.EMAIL, Secrets.APP_PASSWORD, current_user.email)
        otp_handler.append({
            "username": current_user.username,
            "email": current_user.email,
            "otp": otp,
            "timestamp": time.time(),
            "action": "delete_account"
        })
        return jsonify({"status": "success", "message": "OTP_SENT"})
    except Exception as e:
        print(e)
        return jsonify({"status": "error", "message": "SERVER_ERROR"})

@app.route("/delete_account_confirm", methods=["POST"])
@login_required
def delete_account_confirm():
    try:
        data = request.get_json()
        otp_input = data.get("otp", "").strip()
        if not otp_input:
            return jsonify({"status": "error", "message": "OTP_REQUIRED"})
        for i in otp_handler:
            if (i.get("action") == "delete_account"
                and i["username"] == current_user.username
                and i["email"] == current_user.email
                and int(i["otp"]) == int(otp_input)
                and (time.time() - i["timestamp"]) <= 300):
                udb.delete_user(current_user.username)
                otp_handler.remove(i)
                logout_user()
                return jsonify({"status": "success", "message": "ACCOUNT_DELETED"})
        return jsonify({"status": "error", "message": "INVALID_OR_EXPIRED_OTP"})
    except Exception as e:
        print(e)
        return jsonify({"status": "error", "message": "SERVER_ERROR"})

if __name__ == "__main__":
    Thread(target=start_otp_bg, daemon=True).start()
    app.run(debug=True)