from __future__ import print_function
import datetime
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from gtts import gTTS
import sys

SCOPES = ['https://www.googleapis.com/auth/calendar.events']

mois={1:'janvier',2:'février',3:'mars',4:'avril',5:'mai',6:'juin',7:'juillet',8:'août',9:'septembre',10:'octobre',11:'novembre',12:'décembre'}

"""Shows basic usage of the Google Calendar API.
Prints the start and name of the next 10 events on the user's calendar.
"""

def speak(text):
    tts = gTTS(text=text, lang='fr')
    filename="voice.mp3"
    tts.save(filename)
    os.system("mpg123 "+'voice.mp3')

def main():
    creds = None
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    service = build('calendar', 'v3', credentials=creds)

    # Call the Calendar API
    event = {
      'summary': 'test',
      'description': 'Ceci un test d\'évènement',
      'start': {
        'dateTime': '2020-04-01T09:00:00-07:00',
        'timeZone': 'Europe/Brussels',
      },
      'end': {
        'dateTime': '2020-04-01T12:00:00-07:00',
        'timeZone': 'Europe/Brussels',
      },
      'recurrence': [
        'RRULE:FREQ=DAILY;COUNT=2'
      ],
      'attendees': [
        {'email': 'guillaume-vdh@skynet.be'},
      ],
      'reminders': {
        'useDefault': true,
      },
    }

    event = service.events().insert(calendarId='primary', body=event).execute()
    print ('Event created: ' + event.get('htmlLink'))



main()