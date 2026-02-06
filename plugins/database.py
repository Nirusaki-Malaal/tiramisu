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
    
    def set_exam_notification(self, username: str, status: bool):
        self.user.update_one({"username": username}, {"$set": {"notification_settings": {"exam_reminders": status}}})
    
    def set_clan_notifications(self, username: str, allow_clan_invites: bool):
        self.user.update_one({"username": username}, {"$set": {"notification_settings": {"clan_invites": allow_clan_invites}}})

    def set_todo_time_notifications(self, username: str, allow_todo_time: bool, to_do_time):
        self.user.update_one({"username": username}, {"$set": {"notification_settings": {"allow_todo_time": allow_todo_time, "to_do_time": str(to_do_time)}}})