from flask import Flask, render_template, url_for, request, redirect
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
from dotenv import load_dotenv
from plugins.database import Users
from plugins.devtools import is_strong_password, check_username
import os
from bson import ObjectId

## SECRETS

if os.path.exists('config.env'):
    load_dotenv('config.env')

class Secrets():
    DATABASE_URL = os.environ.get('DATABASE_URL')
    USERNAME = os.environ.get("USERNAME")
    SECRET_KEY = os.environ.get("SECRET_KEY")
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


@login_manager.user_loader
def load_user(user_id):
    us = users.find_one({"_id": ObjectId(user_id)})
    if us:
        return User(us)
    return None

## DATABASE class
udb = Users(users)

## ROUTING CODE
@app.route("/")
def home():
    if current_user.is_authenticated:
        return redirect(url_for("dashboard"))
    return render_template("index.html")

@app.route("/register" , methods=["POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username").strip().lower() ## empty none checks bhi add karo
        if not check_username(username):
            return "Invalid username"
        if not udb.check_username(username):
            password = request.form.get("password").strip()
            if not is_strong_password(password):
                return "Password must be 8-20 chars, include uppercase, lowercase, number & special character"
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



if __name__ == "__main__":
    app.run(debug=True)