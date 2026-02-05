from pymongo import MongoClient

class Users:
    def __init__(self, user):
        self.user = user
    
    def check_username(self,username: str):
        return self.user.find_one({"username": username}) is not None
        
    def add_user(self, username, password, email):
       result = self.user.insert_one({"username":username, "password":password, "email": email})
       return result.inserted_id
    
    def check_email(self,email: str):
        return self.user.find_one({"email": email}) is not None
    
    def get_user(self, email: str):
        return self.user.find_one({"email": email})
    
    def get_user_by_username(self, username: str):
        return self.user.find_one({"username": username})
    
    def get_name(self, username: str):
        return self.user.find_one({"username": username}).get("name", "")
    
    def get_bio(self, username: str):
        return self.user.find_one({"username": username}).get("bio", "")
    
    def update_name(self, username: str, name: str):
        self.user.update_one({"username": username}, {"$set": {"name": name}})
    
    def update_bio(self, username: str, bio: str):
        self.user.update_one({"username": username}, {"$set": {"bio": bio}})

    def update_password(self, username: str, hashed_password: str):
        self.user.update_one({"username": username}, {"$set": {"password": hashed_password}})