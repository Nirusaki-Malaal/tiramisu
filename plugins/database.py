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
        self.user.update_one({"username": username}, {"$set": {"notification_settings.exam_reminders": status}})
    
    def set_clan_notifications(self, username: str, allow_clan_invites: bool):
        self.user.update_one({"username": username}, {"$set": {"notification_settings.clan_invites": allow_clan_invites}})

    def set_todo_time_notifications(self, username: str, allow_todo_time: bool, to_do_time):
        self.user.update_one({"username": username}, {"$set": {"notification_settings.allow_todo_time": allow_todo_time, "notification_settings.to_do_time": str(to_do_time)}})

    def get_notification_settings(self, username: str):
        user = self.user.find_one({"username": username})
        return user.get("notification_settings", {})
    
    def get_wake_me_up_data(self, username: str):
        user = self.user.find_one({"username": username})
        data = user.get("wake_me_up_data", {})
        return {"wake_me_up_enabled": data.get("wake_me_up_enabled", False)}

    def get_wake_me_up_settings(self, username: str):
        user = self.user.find_one({"username": username})
        data = user.get("wake_me_up_data", {})
        return {"wake_me_up_settings": data.get("wake_me_up_settings", {})}

    def set_wake_me_up_data(self, username: str, wake_me_up_enabled: bool, wake_me_up_settings: dict):
        self.user.update_one({"username": username}, {"$set": {"wake_me_up_data": {"wake_me_up_enabled": wake_me_up_enabled, "wake_me_up_settings": wake_me_up_settings}}})

    def update_avatar(self, username: str, avatar_data: str):
        self.user.update_one({"username": username}, {"$set": {"avatar": avatar_data}})
    
    def get_avatar(self, username: str):
        user = self.user.find_one({"username": username})
        return user.get("avatar", "")

    def delete_user(self, username: str):
        self.user.delete_one({"username": username})