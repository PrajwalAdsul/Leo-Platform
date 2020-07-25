import nltk
from nltk.stem.porter import *

porterStemmer = PorterStemmer()

import pandas as pd

from utils.modules import *

import warnings 
warnings.filterwarnings(action = 'ignore') 

def get_crime(df) :
    crime_list = get_crime_list("./database/crimes.csv")
    lst = []
    i = 0
    for one in df.iterrows():
        i = i + 1
        wordList = nltk.word_tokenize(one[1].text)
        stemWords = [porterStemmer.stem(word) for word in wordList]
        flag = 0
        for crime in crime_list :
            for word in stemWords :
                if(str(word).lower() in crime) :
                    flag = 1
                    lst.append(crime[0])
                    break
            if(flag == 1):
                break
        if(flag == 0) :
            lst.append("")
    #print(i)
    #print(len(lst))
    df['crime'] = lst
    df = df[df['crime'] != ""] 
    df = df.reset_index()
    #print(df)
    return df

def get_location(df, data):
    locs = get_locations_list(data)
    spellings = get_spelling_list("./database/spell.csv")
    nlp = load_locations(locs, spellings)
    cities = get_cities(data)
    #print(df)
    df_ = get_locations(df, data, nlp, cities, spellings, 0)
    #print(df_)
    return df_
    
    