@echo off
echo ============================================
echo   JAR Solutions QR SaaS - Backend Setup
echo ============================================
cd /d "%~dp0backend"
if not exist venv (
  python -m venv venv
)
call venv\Scripts\activate.bat
pip install -r requirements.txt
if not exist .env copy .env.example .env
python manage.py migrate
python manage.py seed_defaults
echo.
echo Creating admin account:
python manage.py createsuperuser
echo.
echo Starting server on http://localhost:8000 ...
python manage.py runserver
pause
