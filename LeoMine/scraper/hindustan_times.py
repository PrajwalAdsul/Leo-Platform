"""
This module scrapes content from Hindustan Times News.

It provides:
- get_chronological_headlines(url)
- get_trending_headlines(url)
"""

import json
from utils import get_crime, get_location
from modules import preprocessing, save_data, get_data, get_date, check_for_duplicates, preprocessing2, saving_articles, check_url_in_database
import warnings 
warnings.filterwarnings(action = 'ignore')
import pandas as pd
from newspaper import Article

import os
from sys import path

import requests
from bs4 import BeautifulSoup

path.insert(0, os.path.dirname(os.path.realpath(__file__)))

from newscrape_common import (is_string, ist_to_utc, remove_duplicate_entries,
                              str_is_set)
from sources import KNOWN_NEWS_SOURCES


def get_all_content(objects):
    """
    Call this function with a list of objects. Make sure there are no duplicate
    copies of an object else downloading might take long time.
    """
    def get_content(url):
        response = requests.get(url)
        if response.status_code == 200:
            html_content = BeautifulSoup(response.text, "html.parser")            
            contents = html_content.find(
                        'div', {'class': 'story-details'}
                        )
            if not contents:
                return "NA"
            contents = contents.find_all('p')
            text = ''
            for cont in contents[:-1]:
                if cont.string:
                    text += cont.string + '\n'
            return text
        return "NA"

    for obj in objects:
        obj["content"] = get_content(obj["link"])


def get_headline_details(obj):
    try:
        from datetime import datetime
        timestamp_tag = obj.parent.parent.find(
            "span", {"class": "time-dt"}
        )
        if timestamp_tag is None:
            timestamp = datetime.now()
        else:
            content = timestamp_tag.contents[0].strip()
            timestamp = datetime.strptime(
                content,
                "%b %d, %Y %H:%M"
            )
        return {
            "content": "NA",
            "link": obj["href"].split("?")[0],
            "scraped_at": datetime.utcnow().isoformat(),
            "published_at": ist_to_utc(timestamp).isoformat(),
            "title": "\n".join(filter(
                str_is_set,
                map(
                    str.strip,
                    filter(is_string, obj.children)
                )
            ))
        }
    except KeyError:
        import pdb
        pdb.set_trace()


def get_chronological_headlines(url):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, "html.parser")
        a_tags = list(map(
            lambda x: x.find("a"),
            soup.find_all("div", {
                "class": "media-body"
            })
        ))
        headlines = list(map(get_headline_details, a_tags))
        get_all_content(headlines)  # Fetch contents separately
        return headlines
    return None


def get_trending_headlines(url):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, "html.parser")
        soup.find("div", { "class": "latestnews-left" }).decompose()
        soup.find("div", { "class": "advertisement-250" }).decompose()
        # to remove sponsered content
        # not sure if tag works every time
        if soup.find("div", { "class": "top-thumb mt-20"}) is not None :
            soup.find("div", { "class": "top-thumb mt-20"}).decompose()  
        a_tags = soup.find("div", { 
            "class": "news-area newtop-block mb-5 mt-10" }).find_all(
            "a")
        headlines = remove_duplicate_entries(
            map(get_headline_details, a_tags),
            "link",
            "title"
        )
        return headlines
    return None


def HindustanTimesScrapper():

    SRC = KNOWN_NEWS_SOURCES["Hindustan Times"]
    
    data1 = get_chronological_headlines(SRC["pages"].format(1))
    data2 = get_trending_headlines(SRC["home"])
    text_lst = []
    url_lst = []
    for data in data1:
        if(data['content'] == "NA") :
            try :
                article = Article(data['link'])
                article.download()
                article.parse()
                article.nlp()
                summary = article.text
                text_lst.append(summary)
            except :
                text_lst.append(data['content'])
        else:
            text_lst.append(data['content'])
        url_lst.append(data['link'])
    for data in data2:  
        if(data['content'] == "NA") :
            try :
                article = Article(data['link'])
                article.download()
                article.parse()
                article.nlp()
                summary = article.text
                text_lst.append(summary)
            except :
                text_lst.append(data['content'])
        else:
            text_lst.append(data['content'])
        url_lst.append(data['link'])
    df_raw = pd.DataFrame(list(zip(text_lst, url_lst)), columns = ["text", "url"])
    print(df_raw)
    df_raw = check_url_in_database(df_raw, "./database/headlines.csv")
    df_crime = get_crime(df_raw)
    data = get_data("./database/data.json")
    print(df_crime.columns)
    df = get_location(df_crime, data)
    df.to_csv("./database/test_df.csv")
    df = preprocessing2(df, data)
    df_with_date = get_date(df)
    df_final = check_for_duplicates(df_with_date, "./database/headlines.csv")
    if(df_final.shape[0] != 0) :
        saving_articles(df_final, "./database/headlines.csv")
        data_ = preprocessing(df_final, data)
        save_data(data_, "./database/data.json")
        
HindustanTimesScrapper()