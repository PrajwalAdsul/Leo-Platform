import datetime
import json
import pymongo
from bson import ObjectId, json_util
from bson.son import SON
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests


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


class MongoDbEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (datetime.datetime, datetime.date)):
            return obj.strftime("%d %B %Y, %I:%M %p")
        if isinstance(obj, ObjectId):
            return str(obj)
        return json.JSONEncoder.default(self, obj)


app = Flask(__name__)
CORS(app)


def getcos(slat, slong, elat, elong):
    urls = 'https://api.mapbox.com/directions/v5/mapbox/driving/'
    
    token = 'pk.eyJ1IjoicHJhandhbHdvdyIsImEiOiJja2RkZjNrNXoxYjVtMzZtaGEzMHZid3duIn0.HXYDybJOshLrcdCHlvnA1w'

    url = urls + slong + '%2C' + slat + '%3B' + elong + '%2C' + elat + \
        '?alternatives=true&geometries=geojson&steps=true&access_token=' + token

    r = requests.get(url)

    jj = json.loads(r.text)['routes']
    for x in range(0, len(jj)): 
        j = json.loads(r.text)['routes'][x]

        l = list()

        for i in range(0, len(j)):
            try:
                for x in j['geometry']['coordinates']:
                    l.append(x)
            except:
                print()
    return l

def get_lat_long_fun(area):
    key = "4a4590286e2c474ca287e179cd718be9"
    region = area
    location_details = requests.get(
                "https://api.opencagedata.com/geocode/v1/json?q="
                + region.strip()
                + "&key="+key
            ).json()
    # s = "https://api.opencagedata.com/geocode/v1/json?q=" \
    #             + region.strip() \
    #             + "&key="+key 
    # print(s)
    latitude, longitude = location_details["results"][0][
                            "geometry"
                        ].values()

    l = location_details["results"]
    for x in l:
        if(x["components"]["state"] == "Maharashtra" or
            x["components"]["county"] == "Pune Division" or
            x["components"]["state_district"] == "Pune" or 
            x["components"]["county"] == "Pune City" or
            x["components"]["county"] == "Pune"             
            ):
            return [latitude, longitude]
    # return [18.521428,  73.8544541]
    return [0, 0]

@app.route("/")
def hello():
    return "LeoMine - Best in the world"

@app.route('/directions/<slat>/<slong>/<elat>/<elong>', methods=['GET'])
def directions(slat, slong, elat, elong):
    return jsonify({'directions' : getcos(slat, slong, elat, elong)})
    
@app.route('/get_lat_long/<area>', methods=['GET'])
def get_lat_long(area):
    r = get_lat_long_fun(area)
    return jsonify({'lat' : r[0], 'long' : r[1]})


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


@app.route("/all_news", methods=["GET"])
def all_news():
    res = []
    for x in db.news.find():
        del x["_id"]
        res.append(x)
    return jsonify(res)
    
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
    # Start flask server
    app.run()
