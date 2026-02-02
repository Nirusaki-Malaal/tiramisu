from pymongo import MongoClient

class Users:
    def __init__(self, user):
        self.user = user
    
    def check_username(self,username: str):
        return self.user.find_one({"username": username}) is not None
        
    def add_user(self, username, password):
       result = self.user.insert_one({"username":username, "password":password})
       return result.inserted_id