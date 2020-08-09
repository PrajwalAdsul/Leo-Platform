# Leo Mine

Component which creates database of crime news and its statistics using scraping and machine learning models.

## Installation

Create a virtual environment

```bash
python3 -m venv venv
```

Activate virtual environment

```bash
source venv/bin/activate
```

Install required libraries

```bash
python3 -m pip install -r requirements.txt
```

To scrape daily news

```bash
python3 scrapper.py
```

To scrape archives (very first time)

```bash
python3 crimewise.py
```

## Features

- Extracting news articles
  - Scraping latest articles from
    - NDTV
    - Times of India
    - The Hindu
    - Deccan Chronicle
    - Hindustan Times
    - Twitter
  - Scraping archive news from
    - Times Of India (to use crime data of past years as well)
- Extracting location given text:
  - Regions were scrapped with their cities
  - Text was cleaned and tried to find if city is present in the text using data above
  - Used spacy model on dataset obtained above to predict location from the text
  - If not found, did NER tagging to find the nouns which are not present in the english dictionary. Then, this location is appended into the existing data
- Database of stats and articles to display news
  - Stats data contains regions as rows and crime as column. Particular entry indicates number of crimes of particular type in that region
  - Current scraped articles stored in temporary file which then can be loaded into database

## Directory structure

```text
├── bin                     --> For tweet scrapper
│   └── GetOldTweets3.py
├── database                --> Database to store stat, articles, city, regions, speelings, crimes data
│   ├── articles_crimewise.csv
│   ├── country.txt
│   ├── crimes.csv
│   ├── data.json
│   ├── headlines.csv
│   ├── output_got.csv
│   ├── spell.csv
├── GetOldTweets3           --> Contains tweet scrapper main module
│   ├── __init__.py
│   ├── manager
│   └── models
├── scrapper.py             --> Entry point to scrap daily news
├── news_extractor.py       --> Functions for Leo Bot
├── crimewise.py            --> To scrap archives news
├── sources                 --> Contains scrapper to scrape various sources
│   ├── deccan_chronicle.py
│   ├── hindustan_times.py
│   ├── main_tweet_scraper.py
│   ├── ndtv.py
│   ├── newscrape_common.py
│   ├── settings.py
│   ├── sources.py
│   ├── the_hindu.py
│   ├── toi.py
│   └── tweets_scrapper.py
└── utils                   --> Contains main logic to extract locatons as well as some preprocessing tasks
    ├── modules.py
    └── utils.py
```

## Built With

- [spacy](https://spacy.io/) - Industrial Strength Natural Language Processing in Python
- [NLTK](https://www.nltk.org/) - Natural Languge Tool Kit

## Acknowledgments

- [Newscrape](https://github.com/vishvanath45/Newscrape) - Scraping news sources
- [GetOldTweets3](https://github.com/Mottl/GetOldTweets3) - A Python 3 library and a corresponding command line utility for accessing old tweets
