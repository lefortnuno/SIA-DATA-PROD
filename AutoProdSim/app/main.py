import requests
import os
import time
from threading import Thread
from capteurs.capteurs import capteurs
from productions.productions import productions
from dotenv import load_dotenv

load_dotenv()
API_URL = os.getenv("SERVER_SUN_COMPLET_URL")
TIME_DELAI = 5

def get_routes_name(): 
    try: 
        response = requests.get(f"{API_URL}machines/routeName/")
        response.raise_for_status() 
        route_name = response.text.strip() 
        print(f"Route récupérée : {route_name}")
        return route_name
    except Exception as e:
        print(f"Erreur lors de la récupération de la route : {e}")
        return ""

def route_monitor(): 
    while True:
        route_name = get_routes_name()
        if route_name == "productions":
            Thread(target=productions).start()  # Exécute productions dans un thread
        elif route_name == "capteurs":
            Thread(target=capteurs).start()  # Exécute capteurs dans un thread
        time.sleep(TIME_DELAI)

if __name__ == "__main__":
    route_monitor()
