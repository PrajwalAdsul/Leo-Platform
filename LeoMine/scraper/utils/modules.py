import requests
import urllib.request
import time
from bs4 import BeautifulSoup

import requests
from urllib.parse import quote

from newspaper import Article

import spacy
from spacy.tokens import Span
from spacy.matcher import PhraseMatcher

import nltk
from nltk.stem.porter import *

porterStemmer = PorterStemmer()

import pandas as pd

import json

import csv
import math

import spacy
from spacy import displacy
from collections import Counter

import en_core_web_sm
from nltk.tokenize import sent_tokenize, word_tokenize 
from nltk import tokenize
from nltk.tokenize import RegexpTokenizer
import warnings 
  
warnings.filterwarnings(action = 'ignore') 
  
import gensim 
from gensim.models import Word2Vec 
import nltk
from nltk.tokenize import RegexpTokenizer

import enchant

index = "https://timesofindia.indiatimes.com/topic/"
topics = ["arson", "assault", "rape", "murder-case", "riot", "kidnapping", "hostage"]
pages = 20
prefix = "https://timesofindia.indiatimes.com"

class EntityMatcher(object):
    name = "entity_matcher"

    def __init__(self, nlp, terms, label):
        patterns = [nlp.make_doc(text) for text in terms]
        self.matcher = PhraseMatcher(nlp.vocab)
        self.matcher.add(label, None, *patterns)

    def __call__(self, doc):
        matches = self.matcher(doc)
        seen_tokens = set()
        new_entities = []
        entities = doc.ents
        for match_id, start, end in matches:
        #    span = Span(doc, start, end, label=match_id)
        #    doc.ents = list(doc.ents) + [span]
            # check for end - 1 here because boundaries are inclusive
            if start not in seen_tokens and end - 1 not in seen_tokens:
                new_entities.append(Span(doc, start, end, label=match_id))
                entities = [
                    e for e in entities if not (e.start < end and e.end > start)
                ]
                seen_tokens.update(range(start, end))

        doc.ents = tuple(entities) + tuple(new_entities)
        return doc

def is_nan(x):
    return isinstance(x, float) and math.isnan(x)

def get_spelling_list(spell_fname) :
    data = pd.read_csv(spell_fname) 
    #use only spellings and region
    return data

def get_crime_list(crime_fname) :
    '''returns crime with it similiar meaning words
    [[murder, kill], [..],..]'''
    crime = pd.read_csv(crime_fname)
    crime = crime.transpose()
    crime_list_ = crime.values.tolist()
    crime_list = []
    for crime in crime_list_:
        temp = []
        for word in crime:
            if(is_nan(word)):
                break
            temp.append(word)
        crime_list.append(temp)
    return crime_list

def get_data(data_fname) :
    '''database of regions with crime stats'''
    with open(data_fname) as json_file:
        data = json.load(json_file)
    return data

def get_cities(data) :
    '''get list of cities'''
    city = []
    for row in data:
        city.append(row['City'].lower())
    myset = set(city)
    return myset

def get_locations_list(data) :
    lst_locations = []
    city = "NULL"
    for row in data:
        if(row['City'] != city) :
            lst_locations.append(row['City'])
            city = row['City']
        lst_locations.append(row['Regions'])
    return lst_locations

def load_locations(locs, spellings) :
    spells = []
    for row in spellings['region']:
        spells.append(row)
    #for row in spellings['spellings']:
    #    spells.append(row)
    temp = []
    for loc in locs:
        temp.append(str(loc))
    #for spell in spells:
    #    if(spell == "" and len(spell) < 3) :
    #       continue
    #   temp.append(str(spell))
    LOCATIONS = set(temp)
    #LOCATIONS = temp
    nlp = spacy.load("en_core_web_sm")
    entity_matcher = EntityMatcher(nlp, LOCATIONS, "GPE")
    nlp.add_pipe(entity_matcher)
    return nlp

def check_in_dict(word) :
    d = enchant.Dict("en_US")
    return d.check(str(word))


def check_similarity(text, words_lst, city) :
    nlp = spacy.load('en')
    #text = "This event took place at " + str(city) + ". " + text
    tokens = nlp(text)
    sim = []
    found = 0
    for token in tokens:
        if(str(token).lower() == str(city).lower()):
            city_token = token
            found = 1
            break
    if(found == 0) :
        tks = nlp(city)
        for tk in tks:
             if(str(tk).lower() == str(city).lower()):
                city_token = tk
                found = 1
                break
    for word in words_lst:
        if(str(word).lower() == str(city).lower()):
            sim.append(0)
            continue
        flag = 0
        for token in tokens:
            if(str(word).lower() == str(token).lower()) :
                sim.append(token.similarity(city_token))
                flag = 1
                break
        if(flag == 0) :
            sim.append(0)
    #print(words_lst)
    #print(sim)
    return words_lst[sim.index(max(sim))]

def find_in_db(loc, data) :
    '''returns index, takes location(str)'''
    index = -1
    for row in data:
        index = index + 1
        if(str(row['Regions']).lower() == str(loc).lower()) :
            return index
    return -1

def find_in_spell(loc, spellings, data):
    for index, row in enumerate(spellings['spellings']):
        if(str(loc).lower() == str(row).lower()) :
            region = spellings['region'][index]
            for index, row in enumerate(data):
                if(row['Regions'].lower() == region.lower()) :   
                    return index
    return -1
              
               
def get_articles(mode, crime_list, articles_fname) :
    '''mode = 0 read from file, mode = 1 scrap'''
    print(mode)
    if(mode) :
        #saves in list [[cime, url, text],..]
        final_data = []
        articles_crimewise = []
        for topic in topics :
            articles_lst = []
            #print(topic)
            articles_lst.append(topic)
            for page in range(pages) :
                url = index + topic
                if(page) :
                    url = url + "/" + str(page+1)
                #print(url)
                response = requests.get(url, allow_redirects = True)
                soup = BeautifulSoup(response.text)
                text = soup.findAll('a')
                for t in text:
                    try:
                        if(t['href'][-4:] == ".cms"):
                            if(t['href'].find("articleshow") != -1):
                                if(t['href'][0] == '/') :
                                    link = prefix + t['href']
                                else :
                                    link = t['href']
                                #print(link)
                                articles_lst.append(link)

                    except:
                        break
            articles_crimewise.append(articles_lst)
            #print("end topic")
        #print(articles_crimewise)
            #articles_crimewise conatins [[murder, url1, ...], ...]
        #crime_list = get_crime_list(crime_fname)
        crimewise = []
        for articles_lst in articles_crimewise :
            for i, link in enumerate(articles_lst) :
                found = 0
                temporary = []
                if(i == 0) :
                    crime = link
                    #print(crime)
                    if(crime == "murder-case"):
                        crime = "murder"
                    for crime_ in crime_list :
                        if(crime_[0].lower() == crime.lower() or crime_[1].lower() == crime.lower()) :
                            stemWords = [porterStemmer.stem(word) for word in crime_]
                            #print(stemWords)
                            required_crime = stemWords
                            required_crime_temp = crime_
                            #print(crime_)
                            break
                    continue
                #print(link)
                temporary.append(required_crime_temp[0])
                found = 0
                words = link.split('/')[-3].split("-")
                sen = " ".join(words)
                sen = sen.lower()
                wordList = nltk.word_tokenize(sen)
                stemWords = [porterStemmer.stem(word) for word in wordList]
                sen = " ".join(stemWords)
                #print(sen)
                for crime in required_crime :
                    #print(crime)
                    if(sen.find(crime.lower()) != -1) :
                        try :
                            found = 1
                            article = Article(link)
                            article.download()
                            article.parse()
                            article.nlp()
                            #print(article.publish_date)
                            summary = article.text
                            article_text = summary
                            blog = []
                            blog.append(required_crime_temp[0])
                            blog.append(link)
                            blog.append(article_text)
                            final_data.append(blog)
                            break
                        except:
                            break
                #print(found)
                if(found == 0) :
                    try :
                        article = Article(link)
                        article.download()
                        article.parse()
                        article.nlp()
                        #print(article.publish_date)
                        summary = article.text
                        article_text = summary
                        #print(summary)
                        wordList = nltk.word_tokenize(summary)
                        stemWords = [porterStemmer.stem(word) for word in wordList]
                        flag = 0
                        for word in stemWords :
                            for t in required_crime:
                                if(word.lower() == t.lower()) :
                                    found = link
                                    #print(link)
                                    found = 1
                                    flag = 1
                                    blog = []
                                    blog.append(required_crime_temp[0])
                                    blog.append(link)
                                    blog.append(article_text)
                                    final_data.append(blog)
                                    #print(blog)
                                break
                            if(flag) :
                                break
                    except:
                        break
                #if(found == 1) :
                    #break
        df = pd.DataFrame(final_data, columns = ["crime", "url", "text"])
        df.to_csv(articles_fname)
        #use only crime, url, text
        return df
    elif(mode == 0) :
        print("Reading")
        data = pd.read_csv(articles_fname, index_col=[0]) 
        #use only crime, url, text
        print("done")
        return data
    
def get_locations(articles_df, data, loc_model, cities_lst, spellings, present) :
    '''data=origianl db'''
    extra_locs = []
    ultra_found = []
    #[[loc,link]]
    cities_lst = [city.lower() for city in cities_lst]
    for city in cities_lst:
        extra_locs.append(city)
    states = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu and Kashmir","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli","Daman and Diu","Lakshadweep","National Capital Territory of Delhi","Puducherry"]
    state = [s.lower() for s in states]
    extra_locs.extend(state)
    f = open("./database/country.txt", "r")
    for country in f.readline():
        extra_locs.append(country.lower())
    
    nlp = loc_model
    for article in articles_df.iterrows() :
        post = []
        post.append(article[1].text)
        #print(post)
        found_loc = []
        if(present) :
            city = article[1].city
        else :
            parts = article[1].text.split(':')
            loc = word_tokenize(parts[0])[-1]
            #if loc.lower() in cities_lst:
            if loc.lower() in cities_lst:
                city = str(loc).title()
            else:
                t = 0
                if(article[1].url == None) :
                    city = ""
                else:
                    bow = article[1].url.split("/")
                    for i, word in enumerate(bow):
                        if(word == "city"):
                            city = str(bow[i+1]).title()
                            t = 1
                            break
                    if(t == 0):
                        city = ""
            #print(loc)
        
            found_loc.append(str(loc).title())
        for doc in nlp.pipe(post):
            #print([(ent.text, ent.label_) for ent in doc.ents])
            for ent in doc.ents :
                if(ent.label_ == "GPE") :
                    #print(ent.text)
                    if ent.text.lower() in cities_lst and city == "":
                        city = str(ent.text).title()
                    elif ent.text.lower() not in cities_lst and ent.text.lower() not in extra_locs and check_in_dict(ent.text) == False:
                        found_loc.append(ent.text)
        lstt = []
        for loc in found_loc:
            if(len(loc) > 3 and str(loc).lower() != str(city).lower()) :
                lstt.append(loc)
        found_loc = lstt
        success = 0
        #print(found_loc)
        if(len(found_loc) != 0) :
            for loc in found_loc:
                index = find_in_db(loc, data)
                if(index != -1):
                    #print(loc)
                    ultra_found.append(index)
                    success = 1
                    break
            if(success):
                continue
            else :
                for loc in found_loc:
                    index = find_in_spell(loc, spellings, data) 
                    if(index != -1):
                        #print(loc)
                        ultra_found.append(index)
                        success = 1
                        break
                if(success):
                    continue
                else :
                    if(city != "") :
                        string = "/" + str(loc) + ":" + str(city)
                        ultra_found.append(string)
                        sucess = 1
                        continue
                    else:
                        ultra_found.append("")
                        continue               
        elif(len(found_loc) == 0 and city != "") :
            nlp = spacy.load('en')
            about_doc = nlp(article[1].text)
            words = []
            for token in about_doc:
                if(token.tag_ == "NNP") :
                    #print (token, token.tag_, token.pos_, spacy.explain(token.tag_))
                    if(check_in_dict(token) == False and str(token).lower() not in extra_locs) :
                        words.append(token)
            #print(words)
            if(len(words) == 0) :
                ultra_found.append("")
                continue
            word = check_similarity(article[1].text, words, city)
            #print(word)
            index = find_in_spell(word, spellings, data) 
            if(index != -1):
                #print(word)
                ultra_found.append(index)
                success = 1
                continue
            else:
                string = "/" + str(word) + ":" + str(city)
                ultra_found.append(string)
                sucess = 1
                continue            
        else:
            #cannot find 
            ultra_found.append("")
            continue
    articles_df['location'] = ultra_found
    #print(articles_df)
    return articles_df

def preprocessing2(df, data) :
    df = df[df['location'] != ""].reset_index(drop=True)
    for i, loc in enumerate(df['location']) :
        if(isinstance(loc, int) == True) :
            string = "/" + data[loc]['Regions'] + ":" + data[loc]['City']
            df['location'][i] = string
    region_lst = []
    city_lst = []
    for loc in df['location'] :
        try :
            s = loc.split('/')[1].split(":")
            city_lst.append(s[1])
            region_lst.append(s[0])
        except :
            s = loc.split('/')[2].split(":")
            city_lst.append(s[1])
            region_lst.append(s[0])
    try :
        df.drop(['city'], axis = 1, inplace = True) 
    except:
        #do nothing
        t = 1
    df['region'] = region_lst
    df['city'] = city_lst
    return df
    #df.to_csv('./database/headlines.csv', mode='a', header=True)

def saving_articles(df, filename) :
    with open(filename, 'w') as f:
        df.to_csv(f)
        
def preprocessing(articles_df, data) :
    df = articles_df
    #saving_articles(df, data)
    index = -1
    for loc in articles_df['location'] :
        index = index + 1
        #print(type(loc))
        if(isinstance(loc, int) == False) :
            if(loc != "") :
                string = loc[1:]
                city = string.split(":")[1]
                reg = string.split(":")[0]
                crime = str(articles_df['crime'][index]).title()
                #print(crime)
                row = dict()
                row['Regions'] = reg.title()
                row['City'] = city.title()
                row['Latitude'] = 0
                row['Longitude'] = 0
                if(crime == "Murder") :
                    row['Murder'] = 1
                else:
                    row['Murder'] = 0
                if(crime == "Rape") :
                    row['Rape'] = 1
                else:
                    row['Rape'] = 0
                if(crime == "Kidnapping") :
                    row['Kidnapping'] = 1
                else:
                    row['Kidnapping'] = 0
                if(crime == "Robbery") :
                    row['Robbery'] = 1
                else:
                    row['Robbery'] = 0
                if(crime == "Holding hostage") :
                    row['Holding hostage'] = 1
                else:
                    row['Holding hostage'] = 0
                if(crime == "Riot") :
                    row['Riot'] = 1
                else:
                    row['Riot'] = 0
                if(crime == "Arson") :
                    row['Arson'] = 1
                else:
                    row['Arson'] = 0
                if(crime == "Assault") :
                    row['Assault'] = 1
                else:
                    row['Assault'] = 0
                if(crime == "Covid") :
                    row['Covid'] = 1
                else:
                    row['Covid'] = 0
                data.append(row) 
                #print(row)
        else:
            entry = int(loc)
            crime = articles_df['crime'][index].capitalize()
            row = data[entry]
            row[crime] = row[crime] + 1
            data[entry] = row
    
    return data   

def save_data(data, data_fname):
     with open(data_fname, 'w') as json_file:
        json.dump(data, json_file)
        
def get_date(df) :
    date_lst = []
    for _, row in df.iterrows() :
        link = row['url']
        article = Article(link)
        article.download()
        article.parse()
        article.nlp()
        date_lst.append(article.publish_date)
    df["date"] = date_lst
    return df

def check_for_duplicates(df, filename) :
    #cols = ["level_0", "index", "text", "url", "crime", "location", "region", "city", "date"]
    try :
        df_org = pd.read_csv(filename)
    except :
        return df
    #print(df_org.columns)
    #print(df.columns)
    for index, row in df.iterrows() :
        df_copy = df_org[df_org['date'] == row["date"]]
        df_copy = df_copy[df_copy["crime"] == row["crime"]]
        df_copy = df_copy[df_copy["city"] == row["city"]]
        df_copy = df_copy[df_copy["region"] == row["region"]]
        if(df_copy.shape[0] != 0) :
             df.drop(df.index[[index]], inplace=True)
    return df
        
def check_url_in_database(df, filename) :
    #cols = ["level_0", "index", "text", "url", "crime", "location", "region", "city", "date"]
    flag_lst = []
    #try :
    #print("try")
    df_org = pd.read_csv(filename)
    url_lst = df_org["url"].tolist()
    #print(url_lst)
    for index, row in df.iterrows() :
        #print(row["url"])
        if(row["url"] in url_lst):
             flag_lst.append("True")
        else :
            flag_lst.append("False")
    df["Flag"] = flag_lst
    df = df[df["Flag"] == "False"].reset_index(drop=True)
    df.drop("Flag", axis=1, inplace=True)
    return df
   
def get_locations_from_user_text(text, data, loc_model, cities_lst, spellings) :
    '''data=origianl db'''
    extra_locs = []
    ultra_found = []
    #[[loc,link]]
    cities_lst = [city.lower() for city in cities_lst]
    for city in cities_lst:
        extra_locs.append(city)
    cleaned_text = re.findall(r"[\w']+|[.,!?;]", text)
    city_flag = 0
    for word in cleaned_text :
        if word in cities_lst :
            city = word
            city_flag = 1
            break
    if(city_flag == 0) :
        city = ""
    states = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu and Kashmir","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli","Daman and Diu","Lakshadweep","National Capital Territory of Delhi","Puducherry"]
    state = [s.lower() for s in states]
    extra_locs.extend(state)
    f = open("./database/country.txt", "r")
    for country in f.readline():
        extra_locs.append(country.lower())
    
    nlp = loc_model
    post = []
    post.append(text)
    #print(post)
    found_loc = []
    for doc in nlp.pipe(post):
        #print([(ent.text, ent.label_) for ent in doc.ents])
        for ent in doc.ents :
            if(ent.label_ == "GPE") :
                #print(ent.text)
                if ent.text.lower() in cities_lst and city == "":
                    city = str(ent.text).title()
                elif ent.text.lower() not in cities_lst and ent.text.lower() not in extra_locs and check_in_dict(ent.text) == False:
                    found_loc.append(ent.text)
    lstt = []
    for loc in found_loc:
        if(len(loc) > 3 and str(loc).lower() != str(city).lower()) :
            lstt.append(loc)
    found_loc = lstt
    success = 0
    #print(found_loc)
    if(len(found_loc) != 0) :
        for loc in found_loc:
            index = find_in_db(loc, data)
            if(index != -1):
                #print(loc)
                return loc
        else :
            for loc in found_loc:
                index = find_in_spell(loc, spellings, data) 
                if(index != -1):
                    #print(loc)
                    return loc
                if(city != "") :
                    string = "/" + str(loc) + ":" + str(city)
                    return loc
                else:
                    return city
    elif(len(found_loc) == 0 and city != "") :
        nlp = spacy.load('en')
        about_doc = nlp(text)
        words = []
        for token in about_doc:
            if(token.tag_ == "NNP") :
                #print (token, token.tag_, token.pos_, spacy.explain(token.tag_))
                if(check_in_dict(token) == False and str(token).lower() not in extra_locs) :
                    words.append(token)
        #print(words)
        if(len(words) == 0) :
            return city
        word = check_similarity(text, words, city)
        return word
          
    else:
        return city
    return city
