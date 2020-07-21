from sources.tweets_scrapper import TweetsScrapper
from sources.the_hindu import TheHinduScrapper
from sources.ndtv import NdtvScrapper
from sources.hindustan_times import HindustanTimesScrapper
from sources.dd_news_loc import DdNewsScrapper
from sources.deccan_chronicle import DeccanChronicleScrapper
from sources.toi import ToiScrapper
from utils.modules import saving_articles


def LeoMineScraper():
    df = DeccanChronicleScrapper()
    df.append(NdtvScrapper(), ignore_index=True)
    df.append(HindustanTimesScrapper(), ignore_index=True)
    df.append(TheHinduScrapper(), ignore_index=True)
    df.append(TweetsScrapper(), ignore_index=True)
    df.append(ToiScrapper(), ignore_index=True)
    saving_articles(df, "./database/headlines.csv")
