# backend/create_superuser.py
import os
import django
from django.contrib.auth import get_user_model

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "visualizer_project.settings")
django.setup()

User = get_user_model()

username = "chemical"
email = "prajeensenthilkumar.24@gmail.com"
password = "chemicalintern"  

if not User.objects.filter(username=username).exists():
    print(f"Creating superuser: {username}")
    User.objects.create_superuser(username, email, password)
else:
    print(f"Superuser {username} already exists.")