import pymongo
from pymongo import MongoClient
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import jwt
import bcrypt
import datetime
from functools import wraps
import os
from dotenv import load_dotenv
load_dotenv()


app = Flask(__name__)
CORS(app)

MONGO_LINK = os.getenv('MONGO_LINK')
APP_SECRET_KEY = os.getenv('APP_SECRET_KEY')
ACCESS_TOKEN_SECRET = os.getenv('ACCESS_TOKEN_SECRET')
REFRESH_TOKEN_SECRET = os.getenv('REFRESH_TOKEN_SECRET')

ACCESS_TOKEN_DURATION = 1
REFRESH_TOKEN_DURATION = 3
client = pymongo.MongoClient(MONGO_LINK)

#Authenticate User Token
def tokenRequired(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        data = request.get_json()
        access_token = data['access_token']

        # Access Token Missing (Expired)
        if not access_token:
            return genNewAccessToken(data)

        try:
            decoded_token = jwt.decode(access_token, ACCESS_TOKEN_SECRET, algorithms=["HS256"])

        # Access Token Invalid
        except:
            return genNewAccessToken(data)

        return f(*args, **kwargs)
    return decorated

# generate new access token and return to client if access token is invalid
def genNewAccessToken(data):
    try:
        if 'refresh_token' not in data:
            print("Refresh token is missing")
            return jsonify({'success': False, 'msg': 'Refresh token is missing'}), 403

        refresh_token = data['refresh_token']
        decoded_token = jwt.decode(refresh_token, REFRESH_TOKEN_SECRET, algorithms=["HS256"])
        access_token = generateAccessToken(data['user'])

        return jsonify({'success': False, 'msg': 'Access token expired', 'access_token': access_token})

    except:
        print("Refresh token is invalid")
        return jsonify({'success': False, 'msg': 'Refresh token is invalid'}), 403

def generateAccessToken(user):
    return jwt.encode({'user': user['netid'],
                       'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=ACCESS_TOKEN_DURATION)},
                      ACCESS_TOKEN_SECRET,
                      algorithm="HS256")


def generateRefreshToken(user):
    return jwt.encode({'user': user['netid'],
                       'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=REFRESH_TOKEN_DURATION)},
                      REFRESH_TOKEN_SECRET,
                      algorithm="HS256")

# Refresh Access Token
@app.route('/refresh', methods=['POST'])
def refresh():
    data = request.get_json()
    user = data['user']
    try:
        if 'refresh_token' not in data:
            return jsonify({'success': False, 'message': 'Refresh token is missing'}), 403

        refresh_token = data['refresh_token']
        decoded_token = jwt.decode(refresh_token, REFRESH_TOKEN_SECRET, algorithms=["HS256"])
    except:
        return jsonify({'success': False, 'message': 'Refresh token is invalid'}), 403

    access_token = generateAccessToken(user)
    return jsonify({'success': True, 'access_token': access_token})


#Recieve Ticket Information
@app.route('/', methods=['POST'])
def submit():
    submission = request.get_json()
    dict = {"netid": submission['netid'], "subject": submission['subject'], "request": submission['request']}
    db = client["iLabTickets"]
    open = db["open"]
    open.insert_one(dict)
    return "done"

#Return Open Tickets and Handle Closing Tickets
@app.route('/open', methods=['GET', 'POST'])
@tokenRequired
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
                        insert = {"iLab": finished["iLab"], "netid": document["netid"], "subject": document["subject"], "request": document["request"]}
                        closed.insert_one(insert)
                        openTickets.remove(document)
                        return "removed"
        return "done"


#Return Closed Tickets
@app.route('/closed', methods=['GET'])
@tokenRequired
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
                access_token = generateAccessToken(user)
                refresh_token = generateRefreshToken(user)
                return json.dumps({"success": True,
                    "msg": "Login successful",
                    'access_token': access_token,
                    'refresh_token': refresh_token
                    })
            else:
                return "incorrect"

    return "incorrect"



if __name__ == "__main__":
    app.run()