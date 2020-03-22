import pymongo

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["iLabTickets"]
open = db["open"]
assistant = db["assistant"]
userdata = db["userdata"]

open_template = {"netid": "rnt20", "subject": "112", "message": "HELP ME"}
assistant_template = {"iLab": "aam345", "netid": "rnt20", "subject": "112", "message": "HELP ME"}
userdata_template = {"netid": "rnt20", "password": "12345"}

open.insert_one(open_template)
assistant.insert_one(assistant_template)
userdata.insert_one(userdata_template)