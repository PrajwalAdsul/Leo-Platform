# script to scrap tweets by a twitter user.
# Author - ThePythonDjango.Com
# dependencies - BeautifulSoup, requests

import json
import warnings

from utils.modules import (check_for_duplicates, get_data, get_date,
                           preprocessing, preprocessing2, save_data,
                           saving_articles)
from utils.utils import get_crime, get_location

warnings.filterwarnings(action="ignore")
import json
import sys

import pandas as pd
import requests
from bs4 import BeautifulSoup
from newspaper import Article

from sources.main_tweet_scraper import MainTweetScrapper


def TweetsScrapper():
    # username = get_username()
    try :
        MainTweetScrapper()
        df = pd.read_csv("./database/output_got.csv")
        df_raw = df[["text", "permalink"]]
        df_raw.rename(columns={"permalink": "url"}, inplace=True)
        df_crime = get_crime(df_raw)
        data = get_data("./database/data.json")
        df = get_location(df_crime, data)
        df.to_csv("./database/test_df.csv")
        df = preprocessing2(df, data)
        df_with_date = get_date(df)
        # df_final = check_for_duplicates(df_with_date, "./database/headlines.csv")
        df_final = df_with_date
        if df_final.shape[0] != 0:
            # saving_articles(df_final, "./database/headlines.csv")
            data_ = preprocessing(df_final, data)
            save_data(data_, "./database/data.json")

        return df_final.reset_index(drop=True)
    except :
        return pd.DataFrame(columns=["index","text","url","crime","location","region","city","date","headline"])

