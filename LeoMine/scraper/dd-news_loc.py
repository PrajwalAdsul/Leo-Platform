"""
This module scrapes content from DD News.

It provides:
- get_chronological_headlines(url)
- get_trending_headlines(url)
"""

import json
from utils import get_crime, get_location
from modules import preprocessing, save_data, get_data
import warnings 
warnings.filterwarnings(action = 'ignore')
import pandas as pd
from newspaper import Article

import requests
from bs4 import BeautifulSoup
from sys import path
import os
path.insert(0, os.path.dirname(os.path.realpath(__file__)))
from sources import KNOWN_NEWS_SOURCES
from newscrape_common import   \
    str_is_set, is_string, remove_duplicate_entries, ist_to_utc
 


def get_all_content(objects):
    """
    Call this function with a list of objects. Make sure there are no duplicate
    copies of an object else downloading might take long time.
    """
    def get_content(url):
        response = requests.get(url)
        if response.status_code == 200:
            html_content = BeautifulSoup(response.text, "html.parser")
            contents = html_content.find('div', {'class': 'news_content'})
            if not contents:
                return ""
            contents = contents.find_all('p')#lambda tag: tag.name == 'p' and not tag.img, recursive=False)
            text = contents[0].get_text() + '\n' + contents[1].get_text()
            return text
        return "NA"

    for obj in objects:
        obj["content"] = get_content(obj["link"])


def get_chronological_headline_details(obj):
    try:
        from datetime import datetime
        timestamp_tag = obj.find(
            "p", {"class": "archive-date"}
        )
        if timestamp_tag is None:
            timestamp = datetime.now()
        else:
            content = timestamp_tag.contents[0].strip()
            timestamp = datetime.strptime(
                content,
                "%d-%m-%Y | %I:%M %p"
            )
        return {
            "content": "NA",
            "link": "http://ddnews.gov.in" + obj["href"],
            "scraped_at": datetime.utcnow().isoformat(),
            "published_at": ist_to_utc(timestamp).isoformat(),
            "title": obj.find("p", {"class": "archive-title"}).get_text().strip()
        }
    except KeyError:
        import pdb
        pdb.set_trace()


def get_trending_headline_details(obj):
    try:
        from datetime import datetime
        timestamp_tag = obj.find(
            "p", {"class": "date"}
        )
        if timestamp_tag is None:
            timestamp = datetime.now()
        else:
            content = timestamp_tag.contents[0].strip()
            timestamp = datetime.strptime(
                content,
                "%d-%m-%Y | %I:%M %p"
            )
        return {
            "content": "NA",
            "link": "http://ddnews.gov.in" + obj.find("a")["href"],
            "scraped_at": datetime.utcnow().isoformat(),
            "published_at": ist_to_utc(timestamp).isoformat(),
            "title": obj.find("a").contents[0].strip()
        }
    except KeyError:
        import pdb
        pdb.set_trace()


def get_chronological_headlines(url):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, "html.parser")
        a_tags = list(
                    soup.find('div', {'class': 'view-content'}
                    ).find_all('a')
                )
        headlines = list(map(get_chronological_headline_details, a_tags))
        get_all_content(headlines)  # Fetch contents separately
        return headlines
    return None


def get_trending_headlines(url):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, "html.parser")
        li_tags = list(
                        soup.find('div', {'class': 'panel-pane pane-views pane-news national'}
                        ).find('div', {'class': 'item-list'}
                        ).find_all('li')
                    )
        headlines = list(map(get_trending_headline_details, li_tags))
        return headlines
    return None


if __name__ == "__main__":

    SRC = KNOWN_NEWS_SOURCES["DD News"]
    data1 = get_chronological_headlines(SRC["pages"].format(0))
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
    #print(df_raw)
    df_crime = get_crime(df_raw)
    data = get_data("./database/data.json")
    df = get_location(df_crime, data)
    df.to_csv("./database/test_df.csv")
    data_ = preprocessing(df, data)
    save_data(data_, "./database/updated.json")
                                   
