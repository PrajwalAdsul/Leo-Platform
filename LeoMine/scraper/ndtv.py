"""
This module scrapes content from NDTV News.

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
        return "NA"

    for obj in objects:
        obj["content"] = get_content(obj["link"])


def get_headline_details(obj):
    try:
        from datetime import datetime
        timestamp_tag = obj.parent.parent.find(
            "div", {"class": "nstory_dateline"}
        )
        if timestamp_tag is None:
            timestamp = datetime.now()
        else:
            content = timestamp_tag.contents[-1].strip()
            date = content.split("| ")[-1].split(", ")
            if date[-1].isdigit():
                date = " ".join(date)
            else:
                for i in range(1, 10):
                    if date[-i].isdigit():
                        break
                i -= 1
                date = " ".join(date[:-i])
            timestamp = datetime.strptime(
                date + " 05:30",
                "%A %B %d %Y %H:%M"
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
                "class": "new_storylising_contentwrap"
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
        soup.find("div", { "class": "opinion_opt" }).decompose()
        # Some anchor tags in div[class="lhs_col_two"] are not parsed by the following
        a_tags = soup.find("div", { "class": "hmpage_lhs" }).find_all(
            "a", { "class": "item-title" }
        )
        headlines = remove_duplicate_entries(
            map(get_headline_details, a_tags),
            "link"
        )
        return headlines
    return None


if __name__ == "__main__":
    import json

    SRC = KNOWN_NEWS_SOURCES["NDTV"]

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
    df_crime = get_crime(df_raw)
    data = get_data("./database/data.json")
    df = get_location(df_crime, data)
    df.to_csv("./database/test_df.csv")
    data_ = preprocessing(df, data)
    save_data(data_, "./database/updated.json")