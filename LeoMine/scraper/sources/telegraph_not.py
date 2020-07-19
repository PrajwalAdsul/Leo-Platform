"""
This module scrapes content from Telegraph News.

It provides:
- get_chronological_headlines(url)
- get_trending_headlines(url)
"""
#error :
'''Traceback (most recent call last):
  File "telegraph.py", line 132, in <module>
    data2 = get_trending_headlines(SRC["home"])
  File "telegraph.py", line 110, in get_trending_headlines
    soup.find('div', {'class': 'mainStoryBox d-flex flex-wrap' '''
import json
from utils import get_crime, get_location
from modules import preprocessing, save_data, get_data
import warnings 
warnings.filterwarnings(action = 'ignore')
import pandas as pd

import os
from sys import path
from datetime import datetime

import requests
from bs4 import BeautifulSoup

from newscrape_common import (is_string, ist_to_utc, remove_duplicate_entries,
                              str_is_set)
from sources import KNOWN_NEWS_SOURCES

path.insert(0, os.path.dirname(os.path.realpath(__file__)))


def rectify_url(url):
    url = url.split('/')
    url[7] = str(
            (int(url[7]) - 1) * int(url[-1]) + 1
            )
    return '/'.join(url)

def get_all_content(objects):
    """
    Call this function with a list of objects. Make sure there are no duplicate
    copies of an object else downloading might take long time.
    """
    def get_content(url, obj):
        response = requests.get(url)
        if response.status_code == 200:
            html_content = BeautifulSoup(response.text, "html.parser")

            # extracting time here
            timestamp_tag = html_content.find(
                        'ul', {'class': 'rowUl'}
                        ).find('li')
            if timestamp_tag is None:
                timestamp = datetime.now()
            else:
                content = timestamp_tag.contents[2].strip()
                timestamp = datetime.strptime(
                    content,
                    "%d.%m.%y, %I:%M %p"
                )
            obj["published_at"] = ist_to_utc(timestamp).isoformat()

            
            contents = html_content.find('div', {'class': 'padiingDetails story-advertise'})
            text = ''
            for cont in contents.stripped_strings:
                text += cont + ' '
            return text
        return "NA"

    for obj in objects:
        obj["content"] = get_content(obj["link"], obj)


def get_headline_details(obj):
    try:    
        return {
            "content": "NA",
            "link": "https://www.telegraphindia.com" + obj["href"],
            "scraped_at": datetime.utcnow().isoformat(),
            "published_at": datetime.utcnow().isoformat(),
            "title": obj.contents[0].strip()
        }
    except KeyError:
        import pdb
        pdb.set_trace()


def get_chronological_headlines(url):
    url = rectify_url(url)
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, "html.parser")
        a_tags = list( 
                map( lambda x: x.find("a"),
                    soup.find_all("h3", {"class": "loadMore"})
                    )
                )
        headlines = list(map(get_headline_details, a_tags))
        get_all_content(headlines)  # Fetch contents separately
        return headlines
    return None


def get_trending_headlines(url):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, "html.parser")
        a_tags = list(
                    map(
                        lambda x: x.find('a'),
                        soup.find('div', {'class': 'mainStoryBox d-flex flex-wrap'}
                        ).find_all('h3')
                    )
                ) + \
                list(
                    map(
                        lambda x: x.find('a'),
                        soup.find('div', {'data-widget': 'India_Home Template'}
                        ).find_all(['h3', 'p'])
                    )
                )
        headlines = list(map(get_headline_details, a_tags))
        return headlines
    return None


if __name__ == "__main__":
    import json

    SRC = KNOWN_NEWS_SOURCES["Telegraph"]

    data1 = get_chronological_headlines(SRC["pages"].format(1))
    data2 = get_trending_headlines(SRC["home"])
    text_lst = []
    url_lst = []
    for data in data1:
        text_lst.append(data['content'])
        url_lst.append(data['link'])
    for data in data2:  
        text_lst.append(data['content'])
        url_lst.append(data['link'])
    df_raw = pd.DataFrame(list(zip(text_lst, url_lst)), columns = ["text", "url"])
    df_crime = get_crime(df_raw)
    data = get_data("./database/data.json")
    df = get_location(df_crime, data)
    df.to_csv("./database/test_df.csv")
    data_ = preprocessing(df, data)
    save_data(data_, "./database/updated.json")
