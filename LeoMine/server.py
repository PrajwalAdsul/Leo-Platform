import datetime
import json

import pymongo
from bson import ObjectId, json_util
from bson.son import SON
from flask import Flask, request
from flask_cors import CORS


class MongoDbEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (datetime.datetime, datetime.date)):
            return obj.strftime("%d %B %Y, %I:%M %p")
        if isinstance(obj, ObjectId):
            return str(obj)
        return json.JSONEncoder.default(self, obj)


app = Flask(__name__)
CORS(app)


@app.route("/")
def hello():
    return "Hello from the other side!"


@app.route("/news", methods=["POST", "PUT"])
def news(city):
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
def news_by_city(city):
    if request.method == "GET":
        cursor = db.news.find(
            {"$text": {"$search": city}},
            {"headline": 1, "url": 1, "crime": 1, "city": 1, "date": 1},
        ).sort([("date", -1)])
        docs_list = list(cursor)
        return json.dumps(docs_list, cls=MongoDbEncoder)


@app.route(
    "/crimes", methods=["GET", "POST"],
)
def crimes():
    if request.method == "GET":
        try:
            longitude = float(request.args.get("longitude"))
        except ValueError:
            longitude = 0.0

        try:
            latitude = float(request.args.get("latitude"))
        except ValueError:
            latitude = 0.0

        if longitude == 0.0 and latitude == 0.0:
            # Location is unknown so return recent most 20 crimes
            cursor = db.crimes.find().sort([("date", -1)]).limit(20)
        else:
            cursor = db.crimes.find(
                {
                    "loc": {
                        "$near": SON(
                            [
                                (
                                    "$geometry",
                                    SON(
                                        [
                                            ("type", "Point"),
                                            ("coordinates", [longitude, latitude]),
                                        ]
                                    ),
                                ),
                                ("$maxDistance", 100000),
                            ]
                        )
                    }
                }
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
    db.crimes.create_index([("loc", pymongo.GEOSPHERE)], name="geosearch_index")

    # Start flask server
    app.run(port=5000, debug=True)
