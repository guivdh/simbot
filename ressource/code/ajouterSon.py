# Programme qui transforme un texte en voix de robot et qui sauvegarde le son
# avec le nom rentré en paramètre lors de l'exécution du script

import os
import time
import bluetooth
import speech_recognition as sr
from gtts import gTTS
from mutagen.mp3 import MP3
import sys
from time import sleep
import requests
import shutil

def speak(text,file):

    def download_file(url):
        local_filename = url.split('/')[-1]
        with requests.get(url, stream=True) as r:
            with open(local_filename, 'wb') as f:
                shutil.copyfileobj(r.raw, f)

        return local_filename


    headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:75.0) Gecko/20100101 Firefox/75.0',
        'Accept': 'audio/webm,audio/ogg,audio/wav,audio/*;q=0.9,application/ogg;q=0.7,video/*;q=0.6,*/*;q=0.5',
        'Accept-Language': 'en-US,en;q=0.5',
        'Range': 'bytes=0-',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Referer': 'https://www.vocalware.com/index/demo',
        'TE': 'Trailers',
    }

    params = (
        ('EID', '2'),
        ('LID', '4'),
        ('VID', '2'),
        ('TXT', mot),
        ('IS_UTF8', '1'),
        ('FX_TYPE', 'P'),
        ('FX_LEVEL','2'),
        ('ACC', '3314795'),
        ('API', '2292376'),
        ('CB', 'vw_mc.vwCallback'),
        ('HTTP_ERR', '1'),
        ('vwApiVersion', '2'),
        ('d', 'f88dda1b76a1b76931320d9f8810330ee9f6df88dd'),
    )
    filename="sounds/"+file+".mp3"
    print(filename)
    with requests.get('https://cache-a.oddcast.com/tts/gen.php', headers=headers, params=params, stream=True) as r:
        with open(filename, 'wb') as f:
            shutil.copyfileobj(r.raw, f)


    #os.system("mpg123 "+filename)
    sys.exit()

mot = sys.argv[1]
file = sys.argv[2]
speak(mot,file)
