# Leo Bot

Leo Bot is RASA bot currently integrated with Whatsapp and Telegram. Users can chat with the bot to know the recent location specific news and crime specific precautions.

## Installation

Create a virtual environment

```bash
python3 -m venv venv
```

Activate virtual environment

```bash
source venv/bin/activate
```

Install Rasa and required libraries:

```bash
python3 -m pip install rasa
python3 -m spacy download en_core_web_md
python3 -m spacy link en_core_web_md en
```

Start action server

```bash
rasa run actions
```

To chat with the bot on terminal

```bash
rasa shell
```

## Features

- Precautions
  - User can ask crime specific precautions
  - User have to specify the crime and the bot responds with the precautions
- News
  - User can ask the recent news of any region
- Asking for help
  - If in emergency or trouble, user can ask for help.
  - User will have to specify their name and location, and the bot will mark them in trouble and the appropriate actions will be taken by DRO.
- Description and basic chitchat
  - User can ask for the description or meaning of any crime type
  - Bot also understands usual chitchat to some extent and responds with appropriate answers.

## Examples

### Precautions

| Sender  | Message                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| User    | Tell me precautions to avoid robbery                                                                                                                                                                                                                                                                                                                                                                                            |
| Leo Bot | Precautions to be followed:<br> 1. Avoid having unnecessary amounts of money in your wallet<br> 2. Always lock all doors whether you are in or out of your car<br> 3. Keep the windows rolled up enough so an arm cannot be inserted through the opening<br> 4. Know where police stations and fire stations are in your area.<br> 5. Never leave keys under doormats, flowerpots, mailboxes or other secret hiding places.<br> |

### News

| Sender  | Message                                                                                                                                          |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| User    | News of Ghaziabad                                                                                                                                |
| Leo Bot | How soon can the world get Covid-19 vaccine? A look at which country stands where<br> Updated: Jul 19, 2020 10:48 IST<br> www.toi.com/covid/1526 |

### Help/ Mark Trouble

| Sender  | Message                                                                                                                                          |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| User    | Help. I am Amit. My location is shivajinagar pune                                                                                                |
| Leo Bot | Help is on the way! Stay safe!<br>You have been marked in trouble and have been reported to the desired authorities and your emergency contacts. |

## Directory structure

```text
data/                --> Contains NLU training data and example stories
lookup-files/        --> External files needed like for precautions, citynames, etc
models/              --> Stores the all bot models
scraper/             --> Leo Mine code
actions.py           --> Custom actions code (ex. for fetching news, precautions)
config.yml           --> Pipeline and policies used for training bot
credentials.yml      --> Integration details
domain.yml           --> Lists all intents, entities, slots, actions
endpoints.yml        --> Endpoints or APIs if any
```

## Deployment

Requirements were Ubuntu 16.04 instance with 8GB RAM and 100GB of disk space, which is not possible with Heroku or free trial of AWS.
Hence will be using ngrok.

## Built With

- [Rasa](https://rasa.com/) - Rasa framework for bot
- [Twilio](https://www.twilio.com/) - For whatsapp integration
