import pymongo
import random
import string 
import datetime
import pytz

from flask import Flask, request, make_response, jsonify, send_file, send_from_directory
from flask_cors import CORS
from flask_ngrok import run_with_ngrok


app = Flask(__name__)  
CORS(app)

client = pymongo.MongoClient("mongodb+srv://praj:pra@cluster0-jpt7l.mongodb.net/test?retryWrites=true&w=majority")

# with every news also insert time in json object
ist = pytz.timezone('Asia/Calcutta')
print(datetime.datetime.now(ist))

db = client.get_database('Leo')
news = db.news

# run this is another thread
def scrapNews():
	pass
	# ML algo (crime, city)
	# duplicate detection
	# add to database
	#news.insert_one(newsJSON)

# function to insert news into database
def addNews(data):
	x = news.insert_one(data)	

# write all such routes
@app.route('/addNews', methods = ['POST'])
def addNewsFun():
  print(request.json)
  return jsonify(addNews(request.json))


if __name__ == '__main__': 
	app.run(port=5000, debug = True)
