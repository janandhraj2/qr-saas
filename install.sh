#!/bin/bash
cd "$(dirname "$0")/backend"
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
[ ! -f .env ] && cp .env.example .env
python manage.py migrate
python manage.py seed_defaults
python manage.py createsuperuser
python manage.py runserver
