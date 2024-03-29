from scraper.utils.modules import *
import pymongo
import re


def get_location(text):
    data = get_data("scraper/database/data.json")
    locs = get_locations_list(data)
    spellings = get_spelling_list("scraper/database/spell.csv")
    nlp = load_locations(locs, spellings)
    cities = get_cities(data)

    return get_locations_from_user_text(text, data, nlp, cities, spellings)

def get_news_headlines(loc) :
    client = pymongo.MongoClient(
        "mongodb+srv://praj:pra@cluster0-jpt7l.mongodb.net/test?retryWrites=true&w=majority"
    )
    db = client.get_database("Leo")
    df = pd.read_csv("scraper/database/headlines.csv", index_col=[0])
    #print(df)
    news = []
    urls = []
    region_lst = df["region"].tolist()
    city_lst = df["city"].tolist()
    headlines_lst = df["headline"].tolist()
    url_lst = df["url"].tolist()
    #print(city_lst)
    
            
    for index, region in enumerate(region_lst) :
        query = { "region": re.compile(region, re.IGNORECASE) }
        cursor = db.news.find(query)
        lst = list(cursor)
        for l in lst :
            news.append(headlines_lst[index])
            urls.append(url_lst[index])
            
    for index, city in enumerate(city_lst) :
        query = { "city": re.compile(city, re.IGNORECASE) }
        cursor = db.news.find(query)
        lst = list(cursor)
        for l in lst :
            news.append(headlines_lst[index])
            urls.append(url_lst[index])

    return news, urls


def extract_news_from_text(text):
    news, urls = get_news_headlines(get_location(text))
    return news, urls
