import pymongo
from pymongo import MongoClient
from flask import Flask, request, jsonify
from flask_cors import CORS
import json


app = Flask(__name__)
CORS(app)
client = pymongo.MongoClient("mongodb://localhost:27017/")


#Recieve Ticket Information
@app.route('/', methods=['POST'])
def submit():
    submission = request.get_json()
    dict = {"netid": submission['netid'], "subject": submission['subject'], "message": submission['message']}
    db = client["iLabTickets"]
    open = db["open"]
    open.insert_one(dict)
    return "done"

#Return Open Tickets and Handle Closing Tickets
@app.route('/open', methods=['GET', 'POST'])
def tickethandling():
    db = client["iLabTickets"]
    if request.method == 'GET':
        open = db["open"]
        tickets = []
        for document in open.find({}, projection = {"_id" : False}):
            tickets.append(document)
        return jsonify(tickets)


    if request.method == 'POST':
        finished = request.get_json()
        openTickets = db["open"]

        for document in openTickets.find({}, projection = {"_id" : False}):
            if document["netid"] == finished["netid"]:
                if document["subject"] == finished["subject"]:
                    if document["message"] == finished["message"]:
                        openTickets.remove(document)
                        closed = db.assistant
                        insert = {"iLab": finished["iLab"], "netid": document["netid"], "subject": document["subject"], "message": document["message"]}
                        closed.insert_one(insert)
                        openTickets.remove(document)
                        return "removed"
        return "done"


#Return Closed Tickets
@app.route('/closed', methods=['GET'])
def closed():
    db = client["iLabTickets"]
    closedTickets = db["assistant"]
    tickets = []
    for document in closedTickets.find({}, projection={"_id": False}):
        tickets.append(document)
    return jsonify(tickets)


#Login Database
@app.route('/login', methods=['POST'])
def login():
    db = client["iLabTickets"]
    logininfo = db["userdata"]
    attempt = request.get_json()
    for document in logininfo.find({}, projection = {"_id" : False}):
        if document["netid"] == attempt['netid']:
            if document["password"] == attempt['password']:
                return "correct"
            else:
                return "incorrect"

    return "incorrect"



if __name__ == "__main__":
    app.run()