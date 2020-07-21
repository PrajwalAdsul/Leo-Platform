import pymongo
import random
import string
import datetime
import pytz
import requests
import threading
import time
import csv
import json
from bson import json_util
import pandas as pd
from flask import Flask, request, make_response, jsonify, send_file, send_from_directory
from flask_cors import CORS
from flask_ngrok import run_with_ngrok
from LeoMine_NewSources import LeoMineScraper


app = Flask(__name__)
CORS(app)


@app.before_first_request
def activate_job():
    def scrape_news():
        print("Scraping news and calculating crime stats...")
        while True:
            # Scrape for news and calculate crime stats
            LeoMineScraper()
            # Read news stored in default file
            news = pd.read_csv(
                "./database/headlines.csv",
                usecols=["text", "url", "crime", "location", "region", "city", "date"],
            )
            # Convert news to json to allow to store in mongodb
            json_news = news.to_dict(orient="records")
            # Finally insert the data into mongo
            result = db.news.insert_many(json_news)
            print("Number of news saved into database:", len(result.inserted_ids))

            # Read crime stats stored in default file
            with open("./database/data.json") as handle:
                # Load data from JSON to dict
                file_data = json.load(handle)
                # Iterate over list of crime objects
                results = []
                for data in file_data:
                    # Make an UPSERT query
                    result = db.crimes.update_one(
                        {"regions": data["Regions"]},
                        {
                            "$set": {
                                "regions": data["Regions"],
                                "city": data["City"],
                                "loc": {
                                    "lon": data["Longitude"],
                                    "lat": data["Latitude"],
                                },
                                "murder": data["Murder"],
                                "rape": data["Rape"],
                                "kidnapping": data["Kidnapping"],
                                "robbery": data["Robbery"],
                                "holding hostage": data["Holding hostage"],
                                "riot": data["Riot"],
                                "arson": data["Arson"],
                                "assault": data["Assault"],
                                "covid": data["Covid"],
                            }
                        },
                        upsert=True,
                    )
                    results.append(result.upserted_id)
                print("Number of news saved into database:", len(results))

    thread = threading.Thread(target=scrape_news)
    thread.setDaemon(True)
    thread.start()


def start_runner():
    def start_loop():
        not_started = True
        while not_started:
            print("Checking if server has started yet...")
            try:
                r = requests.get("http://127.0.0.1:5000/")
                if r.status_code == 200:
                    print("Server started!")
                    not_started = False
                print(r.status_code)
            except:
                print("Server has not started yet!")
            time.sleep(2)

    print("Started runner to activate job : scraping news and caluculating crime stats")
    thread = threading.Thread(target=start_loop)
    thread.setDaemon(True)
    thread.start()


@app.route("/")
def hello():
    return "Hello from the other side!"


@app.route("/news", methods=["POST", "PUT"])
def get_news(city):
    if request.method == "POST":
        result = db.news.insert_one(request.json)
        print("Inserted succesfully ", result.inserted_id)
        if result.acknowledged and result.inserted_id is not None:
            return (
                json.dumps({"success": True}),
                200,
                {"ContentType": "application/json"},
            )

    if request.method == "PUT":
        result = db.news.update_one({"_id": request.json._id}, {"set": {request.json}})
        if result.acknowledged and result.matched_count == 1:
            print("Updated succesfully")
            return (
                json.dumps({"success": True}),
                200,
                {"ContentType": "application/json"},
            )

        return json.dumps({"success": False}), 500, {"ContentType": "application/json"}


@app.route("/news/<city>", methods=["GET"])
def post_put_news(city):
    if request.method == "GET":
        cursor = db.news.find({"$text": {"$search": city}})
        docs_list = list(cursor)
        return json.dumps(docs_list, default=json_util.default)


@app.route(
    "/crimes/<float:longitude>/<float:latitude>", methods=["GET", "POST"],
)
def crimes(longitude, latitude):
    if request.method == "GET":
        if longitude == 0.0 and latitude == 0.0:
            # Location is unknown
            cursor = db.crimes.find().sort([("date", -1)]).limit(20)
        else:
            cursor = db.crimes.find(
                {"loc": {"$near": [longitude, latitude], "$maxDistance": 0.10}}
            )

        docs_list = list(cursor)
        return json.dumps(docs_list, default=json_util.default)

    if request.method == "POST":
        result = db.crimes.insert_one(request.json)
        print(result.inserted_id)
        if result.acknowledged and result.inserted_id is not None:
            return (
                json.dumps({"success": True}),
                200,
                {"ContentType": "application/json"},
            )


if __name__ == "__main__":
    # Make a connection to database
    client = pymongo.MongoClient(
        "mongodb+srv://praj:pra@cluster0-jpt7l.mongodb.net/test?retryWrites=true&w=majority"
    )
    db = client.get_database("Leo")

    # Create index on city in news collection
    db.news.create_index(
        [("city", pymongo.TEXT)], name="search_index", default_language="english"
    )

    # Create index on loc in crimes collection
    db.crimes.create_index([("loc", pymongo.GEO2D)], name="geosearch_index")

    # Start another thread for job
    start_runner()

    # Start flask server
    app.run(port=5000, debug=True)
