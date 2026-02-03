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