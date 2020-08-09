## say goodbye
* goodbye
  - utter_goodbye

## chitchat
* greet
  - utter_greet
  - utter_whatcanIdo
* chitchat
   - respond_chitchat

## say thanks
* thanks
  - utter_welcome

## precautions_story_1
* precautions{"crime_type": "murder"}
  - action_show_precautions

## description_story_1
* description{"crime_type": "rape"}
  - action_show_description

## news_story_1
* news
  - action_show_news

## interactive_story_1
* greet
    - utter_greet
    - utter_whatcanIdo
* precautions
    - action_show_precautions
* precautions{"crime_type": "covid"}
    - slot{"crime_type": "covid"}
    - action_show_precautions
    - reset_slots
* thanks
    - utter_welcome

## interactive_story_1
* greet
    - utter_greet
    - utter_whatcanIdo
* precautions{"crime_type": "rape"}
    - slot{"crime_type": "rape"}
    - action_show_precautions
    - reset_slots
* affirm
    - utter_agree

## interactive_story_1
* greet
    - utter_greet
    - utter_whatcanIdo
* news
    - action_show_news
* thanks
    - utter_welcome

## interactive_story_1
* greet
    - utter_greet
    - utter_whatcanIdo
* greet
    - utter_greet
* greet
    - utter_greet
* greet
    - utter_greet
* greet
    - utter_greet
* greet
    - utter_greet
* greet
    - utter_greet
* greet
    - utter_greet
* greet
    - utter_greet
* greet
    - utter_greet
* greet
    - utter_greet

## depression path 1
* greet
  - utter_greet
* mood_unhappy
  - utter_next_question
* mood_great
  - utter_history_question
* mood_affirm
  - patient_consultation_info

## depression path 2
* greet
  - utter_greet
* mood_unhappy
  - utter_next_question
* mood_great
  - utter_history_question
* mood_decline
  - patient_consultation_info

## depression path 3
* greet
  - utter_greet
* mood_great
  - utter_next_question
* mood_unhappy
  - utter_history_question
* mood_affirm
  - patient_consultation_info 

## depression path 4
* greet
  - utter_greet
* mood_unhappy
  - utter_next_question
* mood_great
  - utter_history_question
* mood_decline
  - patient_consultation_info 

## depression path 5
* greet
  - utter_greet
* mood_unhappy
  - utter_next_question
* mood_unhappy
  - utter_history_question
* mood_affirm
  - patient_consultation_info 
 

## depression path 6
* greet
  - utter_greet
* mood_unhappy
  - utter_next_question
* mood_unhappy
  - utter_history_question
* mood_decline
  - patient_consultation_info 

## depression path 7
* greet
  - utter_greet
* mood_great
  - utter_next_question
* mood_unhappy
  - utter_history_question
* mood_decline
  - patient_consultation_info
  
## interactive_story_1
* greet
    - utter_greet
    - utter_whatcanIdo
* ask_help
    - action_mark_trouble
    - slot{"in_trouble": true}

## interactive_story_2
* greet
    - utter_greet
    - utter_whatcanIdo
* unmark_trouble
    - action_unmark_trouble
    - slot{"in_trouble": false}
* thanks
    - utter_welcome

## interactive_story_3
* ask_help
    - action_mark_trouble
    - slot{"in_trouble": true}
* unmark_trouble
    - action_unmark_trouble
    - slot{"in_trouble": false}
