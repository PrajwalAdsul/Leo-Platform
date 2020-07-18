from modules import *

data = get_data("./database/data.json")
locs = get_locations_list(data)
spellings = get_spelling_list("./database/spell.csv")
nlp = load_locations(locs, spellings)
crime_list = get_crime_list("./database/crimes.csv")
cities = get_cities(data)
print("setup done")
df = get_articles(1, crime_list, "./database/articles_crimewise.csv")
#df = get_articles(0, crime_list, "./database/articles_crimewise.csv")
df_ = get_locations(df, data, nlp, cities, spellings, 0)
print(df_)
df = preprocessing2(df, data)
df_with_date = get_date(df)
df_final = check_for_duplicates(df_with_date, "./database/headlines.csv")
saving_articles(df_final, "./database/headlines.csv")
data_ = preprocessing(df_, data)


save_data(data_, "./database/updated.json")
