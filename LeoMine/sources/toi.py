"""
Citywise Toi news scrapper
"""
import time
import urllib.request
from urllib.parse import quote

import nltk
import requests
import spacy
from bs4 import BeautifulSoup
from newspaper import Article
from nltk.stem.porter import *
from spacy.matcher import PhraseMatcher
from spacy.tokens import Span

porterStemmer = PorterStemmer()

import csv
import json
import math
import warnings
from collections import Counter

import en_core_web_sm
import pandas as pd
import spacy
from nltk import tokenize
from nltk.tokenize import RegexpTokenizer, sent_tokenize, word_tokenize
from spacy import displacy

warnings.filterwarnings(action="ignore")

import enchant
import gensim
import nltk
from gensim.models import Word2Vec
from nltk.tokenize import RegexpTokenizer

from utils.modules import *

url_lst_citywise = ["https://timesofindia.indiatimes.com/city"]


def find_crime(text):
    crime_list = get_crime_list("./database/crimes.csv")
    wordList = nltk.word_tokenize(text)
    stemWords = [porterStemmer.stem(word) for word in wordList]
    for crime in crime_list:
        for word in stemWords:
            if str(word).lower() in crime:
                return crime[0]
    return ""


def citywise():
    prefix = "https://timesofindia.indiatimes.com"
    covid_citywise = []
    response = requests.get(url_lst_citywise[0], allow_redirects=True)
    soup = BeautifulSoup(response.text)
    one_a_tag = soup.findAll("a")
    # print(one_a_tag)
    no_cities = 67
    index = 0
    cities_lst = []
    for line in one_a_tag:
        if index > no_cities:
            break
        try:
            link = line["href"]
            if link[:6] == "/city/":
                cities_lst.append(link)
                print(link)
                index = index + 1
        except:
            continue

    articles_citywise = []
    i = -1
    for url in cities_lst:
        i = i + 1
        articles_lst = []
        url_ = prefix + url
        print(url_)
        words = url_.split("/")
        # print(words[-1])
        articles_lst.append(words[-1])
        length_ = len(url_)
        length = len(url)
        # print(url_)
        r = requests.get(url_)
        soup = BeautifulSoup(r.content, "html5lib")
        # print(soup)
        one_a_tag = soup.findAll("a")
        for link in one_a_tag:
            try:
                if link["href"][-4:] == ".cms":
                    if link["href"][:length] == url:
                        temp = prefix + link["href"]
                        articles_lst.append(temp)
                    elif link["href"][:length_] == url_:
                        articles_lst.append(link["href"])
            except:
                continue
        # for ele in articles_lst :
        #    print(ele)
        print(articles_lst)
        articles_citywise.append(articles_lst)
        # break
    return articles_citywise


def extracting_city_crime(articles):
    city_lst = []
    url_lst = []
    text_lst = []
    crime_lst = []
    headlines_lst = []
    date_lst = []
    for articles_lst in articles:
        for index, link in enumerate(articles_lst):
            if index == 0:
                city = link
                print(city)
                continue
            article = Article(link)
            article.download()
            while True :
                try:
                    article.parse()
                    break
                except :
                    continue
            article.nlp()
            text = article.text
            crime = find_crime(text)
            title = article.title
            date = article.publish_date
            
            if crime != "":
                city_lst.append(city)
                url_lst.append(link)
                text_lst.append(text)
                crime_lst.append(crime)
                headlines_lst.append(title)
                date_lst.append(date)
    df = pd.DataFrame(
        list(zip(city_lst, url_lst, text_lst, crime_lst, headlines_lst, date_lst)),
        columns=["city", "url", "text", "crime", "headline", "date"],
    )
    # print(df)
    return df


def ToiScrapper():
    data = get_data("./database/data.json")
    spellings = get_spelling_list("./database/spell.csv")
    locs = get_locations_list(data)
    nlp = load_locations(locs, spellings)
    cities = get_cities(data)
    print("setup done")

    articles = citywise()
    print("scrapped articles")
    df = extracting_city_crime(articles)
    print(df)

    df_ = get_locations(df, data, nlp, cities, spellings, 1)
    print(df)
    df = preprocessing2(df, data)
    
    return df
