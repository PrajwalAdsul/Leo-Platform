"""
This module scrapes content from The Hindu News.

It provides:
- get_chronological_headlines(url)
- get_trending_headlines(url)
"""

import json
import warnings

from utils.modules import (check_for_duplicates, check_url_in_database,
                           get_data, get_date, preprocessing, preprocessing2,
                           save_data, saving_articles)
from utils.utils import get_crime, get_location

warnings.filterwarnings(action="ignore")
import os
import re
from datetime import datetime
from sys import path

import pandas as pd
import requests
from bs4 import BeautifulSoup
from newspaper import Article

path.insert(0, os.path.dirname(os.path.realpath(__file__)))

from sources.newscrape_common import (is_string, ist_to_utc,
                                      remove_duplicate_entries, str_is_set)
from sources.sources import KNOWN_NEWS_SOURCES


def get_all_content(objects):
    """
    Call this function with a list of objects. Make sure there are no duplicate
    copies of an object else downloading might take long time.
    """

    def get_content(url):
        from time import sleep

        sleep(1)
        response = requests.get(url)
        if response.status_code == 200:
            html_content = BeautifulSoup(response.text, "html.parser")
            try:
                text = html_content.find(
                    "div", id=re.compile("content-body-*")
                ).get_text()
            except AttributeError:
                try:
                    text = (
                        html_content.find("div", {"class": "lead-video-cont"})
                        .find("iframe")
                        .get("src")
                    )
                    return text
                except:
                    return "NA"
        return "NA"

    for obj in objects:
        obj["content"] = get_content(obj["link"])


def get_headline_details(obj):
    try:
        timestamp = datetime.strptime(
            obj["title"].split("Published: ")[1].split(" IST")[0], "%B %d, %Y %H:%M"
        )
        return {
            "content": "NA",
            "link": obj["href"],
            "scraped_at": datetime.utcnow().isoformat(),
            "published_at": ist_to_utc(timestamp).isoformat(),
            "title": "\n".join(
                filter(str_is_set, map(str.strip, filter(is_string, obj.children)))
            ),
        }
    except KeyError:
        import pdb

        pdb.set_trace()


def get_chronological_headlines(url):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, "html.parser")
        for tag in soup.find_all("div", {"class": "search-scrollar"}):
            tag.decompose()
        main_div = soup.find("section", id="section_2").find("div", {"class": "main"})
        a_tags = list(
            map(lambda x: x.find("a", href=str_is_set), main_div.find_all("h3"))
        )
        headlines = list(map(get_headline_details, a_tags))
        get_all_content(headlines)  # Fetch contents separately
        return headlines
    return None


def find_a_tag_in_trending(tag):
    if tag.name == "a" and tag.get("title"):
        if re.compile("^Updated: .+Published: .+$").match(tag.get("title")):
            return True
    return False


def get_trending_headlines(url):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, "html.parser")
        soup.find("div", {"class": "100_3x_JustIn"}).decompose()
        a_tags = soup.find("div", {"class": "main"}).find_all(find_a_tag_in_trending)
        headlines = list(map(get_headline_details, a_tags))
        return headlines
    return None


def TheHinduScrapper():
    import json

    SRC = KNOWN_NEWS_SOURCES["The Hindu"]
    data1 = get_chronological_headlines(SRC["pages"].format(1))
    data2 = get_trending_headlines(SRC["home"])
    text_lst = []
    url_lst = []
    date_lst = []
    title_lst = []
    try :
        for data in data1:
            if data["content"] == "NA":
                try:
                    article = Article(data["link"])
                    article.download()
                    article.parse()
                    article.nlp()
                    summary = article.text
                    text_lst.append(summary)
                except:
                    text_lst.append(data["content"])
            else:
                text_lst.append(data["content"])
            url_lst.append(data["link"])
            date = data["published_at"]
            if(date == None) :
                date = datetime.now()
            date_lst.append(date)
            try :
                title_lst.append(data["title"])
            except:
                title_lst.append(data["content"].replace("\n\n", " ").replace("\n", " ").split(".")[0])
        for data in data2:
            if data["content"] == "NA":
                try:
                    article = Article(data["link"])
                    article.download()
                    article.parse()
                    article.nlp()
                    summary = article.text
                    text_lst.append(summary)
                except:
                    text_lst.append(data["content"])
            else:
                text_lst.append(data["content"])
            url_lst.append(data["link"])
            date = data["published_at"]
            if(date == None) :
                date = datetime.now()
            date_lst.append(date)
            try :
                title_lst.append(data["title"])
            except:
                title_lst.append(data["content"].replace("\n\n", " ").replace("\n", " ").split(".")[0])

        df_raw = pd.DataFrame(list(zip(text_lst, url_lst, date_lst, title_lst)), columns=["text", "url", "date", "headline"])

        df_crime = get_crime(df_raw)
        data = get_data("./database/data.json")
        df = get_location(df_crime, data)
        df = preprocessing2(df, data)
        return df.reset_index(drop=True)
    except :
        return pd.DataFrame(columns=["index","text","url","crime","location","region","city","date","headline"])

    # DeccanChronicleScrapper()
