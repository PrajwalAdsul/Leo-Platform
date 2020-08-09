# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/core/actions/#custom-actions/


# This is a simple example for a custom action which utters "Hello World!"

from typing import Any, Text, Dict, List, Union

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet, AllSlotsReset
from rasa_sdk.forms import FormAction

from scraper.news_extractor import *

import re
import csv
import http.client
import json
import requests

from outcome import predict_outcome 


conn = http.client.HTTPSConnection('peaceful-refuge-01419.herokuapp.com')
headers = {'Content-type': 'application/json'}

class ActionShowNews(Action):

    def name(self) -> Text:
        return "action_show_news"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        ## Custom action for showing news

        msg = tracker.latest_message.get('text')
        print(msg)

        location = tracker.get_slot('location')
        location1 = get_location(msg)

        if len(location1) == 0:
            dispatcher.utter_message(text="Please specify the location. \n \n  👉 Type: 'News in *Pune*'")
        else:
            print(location1)

            ## Fetching latest news from Leomine database
            news_data = requests.request("GET", "https://leomine-backend.herokuapp.com/news/"+str(location1))
            news_data = news_data.json()

            ## Displaying first five unique news
            news_found = False
            urls = []
            i = 0
            for index, new in enumerate(news_data) :
                if(i == 5) :
                    break
                news_found = True

                if urls.count(new["url"]) > 0 :
                    continue

                urls.append(new["url"])
                i = i + 1

                print(new)
                try:
                    dispatcher.utter_message(text="*"+new["headline"]+"*" + "\n \n📅 "+ new["city"] +", " + new["date"] + "\n \nCheck out the news at:\n"+new["url"])
                except:
                    dispatcher.utter_message(text="*"+new["headline"]+"*" + "\n \n📅 "+ new["city"] +", " + "27 July, 2020" + "\n \nCheck out the news at:\n"+new["url"])

            if not news_found:
                dispatcher.utter_message(text="Sorry, no news found for this location.")

        if location:
            return[SlotSet("location", None)]

        return []

class ActionShowPrecautions(Action):

    def name(self) -> Text:
        return "action_show_precautions"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        ## Custom action for showing precautions
        entities = tracker.latest_message['entities']
        for entity in entities :
            entity['value'] = re.sub(r'[^\w\s]', '', entity['value'])

        print(entities)
        msg = tracker.latest_message.get('text')
        print(msg)

        crime_type = tracker.get_slot('crime_type')

        ## If crime type is not specified, ask it
        if not crime_type:
            dispatcher.utter_message(text="Select the type of crime:\nMurder\nRape\nArson\nAssault\nRiot\nHolding hostage\nKidnapping\nRobbery\nCOVID")
            return []

        dispatcher.utter_message(text="Precautions to be followed:")
        found = False


        ## Fetching precautions from local database
        with open('lookup_files/precautions.csv') as csv_file:
            csv_reader = csv.reader(csv_file, delimiter=',')
            line_count = 0
            for row in csv_reader:
                if line_count != 0:
                    if crime_type.lower() == row[0]:
                        for i in range(2,7):
                            precautions = row[i]
                            if len(precautions) == 0:
                                break
                            msg = str(i - 1) + ". " + precautions
                            dispatcher.utter_message(text=msg)
                        found = True
                    if found:
                        break
                line_count += 1

        return [SlotSet("crime_type", None)]

class ActionShowDescription(Action):

    def name(self) -> Text:
        return "action_show_description"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        ## Custom action for showing crime description
        entities = tracker.latest_message['entities']
        msg = tracker.latest_message.get('text')
        print(msg)
        for entity in entities :
            entity['value'] = re.sub(r'[^\w\s]', '', entity['value'])

        print(entities)

        crime_type = tracker.get_slot('crime_type')

        if not crime_type:
            dispatcher.utter_message(text="Please refrase the query.")
            return []

        ## Fetching description from local database
        with open('lookup_files/precautions.csv') as csv_file:
            csv_reader = csv.reader(csv_file, delimiter=',')
            line_count = 0
            for row in csv_reader:
                if line_count != 0:
                    if crime_type.lower() == row[0]:
                        dispatcher.utter_message(text=row[1])
                        break
                line_count += 1

        return [SlotSet("crime_type", None)]

class ActionMarkTrouble(Action):

    def name(self) -> Text:
        return "action_mark_trouble"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        in_trouble = tracker.get_slot('in_trouble')
        print(in_trouble)

        if in_trouble is not None:
            if in_trouble:
                dispatcher.utter_message(text="You been already marked in trouble.\n \nHelp is on the way !")
                return [SlotSet("in_trouble", True)]
           

        ## Custom action for asking help / emergency
        sender = tracker.sender_id

        data = {
            "user_name" : sender,
            "area": "null",
            "latitude": 0,
            "longitude": 0,
            "inTrouble": True,
            "type": "bot",
            "token": "bot",
            "datetime": None,
            "log": []
        }

        try:
            sender = sender.split(":")
            sender_no = sender[1]
            phone = sender_no[3:]
            data["phone"] = phone
            data["username"] = "bot" + sender_no[3:]
            print(sender_no[3:], phone)
        except:
            print(sender)

        print(data)

        ## Marking user in trouble
        json_data = json.dumps(data)
        try:
            conn.request('PUT', '/LeoHelp/user/mark_trouble', json_data, headers)
            response = conn.getresponse()
            print(response.read().decode())
        except:
            print("Error")
            try:
                conn.request('PUT', '/LeoHelp/user/mark_trouble', json_data, headers)
                response = conn.getresponse()
                print(response.read().decode())
            except:
                print("Double Error")

        dispatcher.utter_message(text="Help is on the way! Stay safe!\n \nYou have been marked in trouble and have been reported to the desired authorities.")
        dispatcher.utter_message(text="If it was a false alarm, you can always mark yourself *safe* by typing *unmark me*.")
        return [SlotSet("in_trouble", True)]


class ActionUnMarkTrouble(Action):

    def name(self) -> Text:
        return "action_unmark_trouble"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        in_trouble = tracker.get_slot('in_trouble')
        print(in_trouble)
        
        if in_trouble is not None:
            if not in_trouble:
                dispatcher.utter_message(text="You been already marked in trouble.\n \nHelp is on the way !")
                return [SlotSet("in_trouble", False)]
        
        ## Custom action for asking help / emergency
        sender = tracker.sender_id

        data = {
            "user_name" : sender
        }

        try:
            sender = sender.split(":")
            sender_no = sender[1]
            phone = sender_no[3:]
            data["phone"] = phone
            data["username"] = "bot" + sender_no[3:]
            print(sender_no[3:], phone)
        except:
            print(sender)

        print(data)

        ## Marking user in trouble
        json_data = json.dumps(data)
        try:
            conn.request('PUT', '/LeoHelp/user/unmark_trouble_bot', json_data, headers)
            response = conn.getresponse()
            print(response.read().decode())
        except:
            print("Error")
            try:
                conn.request('PUT', '/LeoHelp/user/unmark_trouble_bot', json_data, headers)
                response = conn.getresponse()
                print(response.read().decode())
            except:
                print("Double Error")

        dispatcher.utter_message(text="You have been marked as safe. 😊")
        return [SlotSet("in_trouble", False)]

class ActionPatientInfoRecurrence(Action):
    def name(self):
        return "patient_consultation_info"
    def run(self, dispatcher, tracker, domain):
        dispatcher.utter_message(text="Getting patient depression recurrence../")
        rec_info = predict_outcome()
        return []
    
class ActionPatientGeneralInfo(Action):
    def name(self):
        return "patient_general_info"    
    def run(self, dispatcher, tracker, domain):
        dispatcher.utter_message(text="Patient's general info")
        return []
        