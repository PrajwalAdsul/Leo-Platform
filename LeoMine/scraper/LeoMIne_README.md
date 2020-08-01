# Project Title

Leo Mine

Component which creates database of crime news and its statistics using scraping and ML model.

## Installation

Run the following commands :
>cd LeoMine
>cd scraper
If you want to scrap daily news :
>python LeoMine_NewsSources.py


## Screenshots

Include logo/demo screenshot etc.

## Features

- Extracting news articles from various news surces :
  - Web scrapping is used to scrap articles from various news sources like ndtv, toi, the hindu, etc.
  - Archive news is scrapped from Times Of India so that we get crime data of past years as well.
- Extracting location given text:
  - Scrapped regions with their cities.
  - Cleaned the text and tried to find if city is present in the text using data above.
  - Used spacy model on dataset obtained above to predict location in the text.
  - If not found, did NER tagging to find the nouns which are not present in the english dictionary. Then, this location is appended into the eexisting data.
- Creating database of stats and articles to display news :
  - Stats data contains regions as rows and crime as column. Particular entry indicates no of that particular type of crime in that region.
  - Temporary file is created to store current scrapped articles which then can be dumped into database.

## API Documentation

If some other part of our own project is using your functions or if you are serving requests, mention inputs, outputs and what are you exporting with some simple examples.

## Directory structure

├── bin                     --> For tweet scrapper
│   ├── GetOldTweets3.py
├── database                --> database to store stat, articles, city, regions, speelings, crimes data
│   ├── articles_crimewise.csv
│   ├── country.txt
│   ├── crimes.csv
│   ├── data.json
│   ├── data.txt
│   ├── db.csv
│   ├── db.json
│   ├── headlines.csv
│   ├── output_got.csv
│   ├── spell.csv
│   ├── test_df.csv
│   └── updated.json
├── GetOldTweets3           --> contains tweet scrapper main module
│   ├── __init__.py
│   ├── manager
│   ├── models
├── LeoMine_NewsSources.py   --> entry point to scrap daily news
├── crimewise.py             --> archives news scrapper
├── news_extractor.py       --> functions for LeoBot
├── README.md
├── server.py 
├── sources                 --> contains scrapper to scrape various sources
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
└── utils                   --> contains main logic to extract locatons as well as some preprocessing tasks
    ├── modules.py
    └── utils.py


## Deployment

Add additional notes about how to deploy this on a live system if you know any

## Built With

- [spacy](https://spacy.io/) - The NLP library used
- [NLTK](https://www.nltk.org/) - Natural Languge Tol Kit

## Contributing

To be filled later

## Authors

- [Mayank Jain](https://github.com/mayank-02)
- [Gouri Nangliya](https://github.com/clue1ess)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- https://github.com/vishvanath45/Newscrape
- https://github.com/Mottl/GetOldTweets3

