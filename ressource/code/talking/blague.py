# -*- coding: utf-8 -*-

import requests
import random
import sys
import os

i = random.randint(1,114)

x = requests.get('https://bridge.buddyweb.fr/api/blagues/blagues/'+str(i))

txt = x.json()

print(txt["blagues"])

os.system("python3 tts.py \"" + txt["blagues"] + "\"")
