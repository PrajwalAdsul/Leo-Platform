# script to scrap tweets by a twitter user.
# Author - ThePythonDjango.Com
# dependencies - BeautifulSoup, requests

import json
from utils.utils import get_crime, get_location
from utils.modules import preprocessing, save_data, get_data, preprocessing2, get_date, check_for_duplicates, saving_articles
import warnings 
warnings.filterwarnings(action = 'ignore')
import pandas as pd
from newspaper import Article

from bs4 import BeautifulSoup
import requests
import sys
import json
from sources.main_tweet_scraper import MainTweetScrapper



def TweetsScrapper():
    #username = get_username()
    MainTweetScrapper()
    df = pd.read_csv("./database/output_got.csv")
    df_raw = df[["text", "permalink"]]
    df_raw.rename(columns={'permalink':'url'}, inplace=True)
    df_crime = get_crime(df_raw)
    data = get_data("./database/data.json")
    df = get_location(df_crime, data)
    df.to_csv("./database/test_df.csv")
    df = preprocessing2(df, data)
    df_with_date = get_date(df)
    df_final = check_for_duplicates(df_with_date, "./database/headlines.csv")
    if(df_final.shape[0] != 0) :
        saving_articles(df_final, "./database/headlines.csv")
        data_ = preprocessing(df_final, data)
        save_data(data_, "./database/updated.json")

