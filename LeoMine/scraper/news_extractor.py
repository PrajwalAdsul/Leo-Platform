from sources.modules import *

def get_location(text) :
    data = get_data("./database/data.json")
    locs = get_locations_list(data)
    spellings = get_spelling_list("./database/spell.csv")
    nlp = load_locations(locs, spellings)
    cities = get_cities(data)
    

    return get_locations_from_user_text(text, data, nlp, cities, spellings)

def get_news_headlines(loc) :
    df = pd.read_csv("./database/headlines.csv")
    #print(df)
    news = []
    region_lst = df["region"].tolist()
    city_lst = df["city"].tolist()
    headlines_lst = df["text"].tolist()
    #print(city_lst)
    for index, city in enumerate(city_lst) :
        
        if(city.lower() == loc.lower()) :
            print("ok")
            news.append(headlines_lst[index])
            
    for index, region in enumerate(region_lst) :
        if(region.lower() == loc.lower()) :
            news.append(headlines_lst[index])
            
    return news


def extract_news_from_text(text) :
    news = get_news_headlines(get_location(text))
    return news
    
