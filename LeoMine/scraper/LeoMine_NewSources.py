from sources.tweets_scrapper import TweetsScrapper
from sources.the_hindu import TheHinduScrapper
from sources.ndtv import NdtvScrapper
from sources.hindustan_times import HindustanTimesScrapper
from sources.deccan_chronicle import DeccanChronicleScrapper
from sources.toi import ToiScrapper
from utils.modules import saving_articles
import pymongo
import pandas as pd
from newspaper import Article
import re


def LeoMineScraper():
    df = DeccanChronicleScrapper()
    df = df.append(NdtvScrapper(), ignore_index=True)
    df = df.append(HindustanTimesScrapper(), ignore_index=True)
    df = df.append(TheHinduScrapper(), ignore_index=True)
    df = df.append(TweetsScrapper(), ignore_index=True)
    #df = df.append(ToiScrapper(), ignore_index=True)
    headlines_lst = []
    for index, row in df.iterrows() :
        try:
            article = Article(row["url"])
            article.download()
            article.parse()
            article.nlp()
            #print(article.publish_date)
            headline = article.title
            #print(headline)
            if(headline == "") :
                #print("nothing")
                row["text"] = row["text"].replace("\n\n", " ")
                row["text"] = row["text"].replace("\n", " ")
                headline = row["text"].split(".")[0]
                
        except:
            row["text"] = row["text"].replace("\n\n", " ")
            row["text"] = row["text"].replace("\n", " ")
            headline = row["text"].split(".")[0]
        headlines_lst.append(headline)
    df["headline"] = headlines_lst
    client = pymongo.MongoClient(
        "mongodb+srv://praj:pra@cluster0-jpt7l.mongodb.net/test?retryWrites=true&w=majority"
    )
    db = client.get_database("Leo")
    final_df = pd.DataFrame(columns = df.columns)
    
    for index, row in df.iterrows() :
        query = { "url": row["url"] }
        cursor = db.news.find(query)
        lst = list(cursor)
        if(len(lst) == 0) :
            query = { "date": row["date"],"crime": row["crime"], "region": re.compile(row["region"], re.IGNORECASE), "city": re.compile(row["city"], re.IGNORECASE)  }
            cursor = db.news.find(query)
            lst = list(cursor)
            if(len(lst) == 0) :
                final_df = final_df.append(row, ignore_index=True)
    saving_articles(final_df, "./database/headlines.csv")
        
LeoMineScraper()