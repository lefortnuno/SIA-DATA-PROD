import random
import pandas as pd
import time
import os
import requests
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
API_URL = os.getenv("SERVER_SUN_COMPLET_URL")
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TIME_DELAI = 1
DELAI = TIME_DELAI + 1

def get_full_path(filename):
    return os.path.join(BASE_DIR, filename)

def initialize_excel_file(filepath):
    if not os.path.exists(filepath): 
        df = pd.DataFrame(columns=[
            "id_etape", "id_fabrication", "poste", "operation", "debut_etape",
            "fin_etape", "statut_etape", "temps_ecoule"
        ])
        df.to_excel(filepath, index=False)

def fetch_ordres_fabrication():
    try:
        response = requests.get(f"{API_URL}productions/")
        response.raise_for_status()
        productions = response.json().get("data", []) 
        return productions
    except Exception as e:
        print(f"Erreur lors de la récupération des productions : {e}")
        return []

def update_etape_production(updated_data):
    try:
        for data in updated_data:
            id_etape = data['id_etape']
            statut_etape = data['statut_etape']
            temps_ecoule = data['temps_ecoule']
            progression_production = data['progression_production']

            payload = {
                "statut_etape": statut_etape,
                "temps_ecoule": temps_ecoule,
                "progression_production": progression_production
            }
            response = requests.put(f"{API_URL}productions/{id_etape}", json=payload)
            response.raise_for_status()
            print(f"Étape {id_etape} mise à jour avec succès.")
    except Exception as e:
        print(f"Erreur lors de la mise à jour des étapes : {e}")

def save_data_to_excel(data):
    base_dir = "../../Warehouse/productions"
    file_path = os.path.join(base_dir, "productions.xlsx")

    try:
        os.makedirs(base_dir, exist_ok=True)
        initialize_excel_file(file_path)

        df = pd.DataFrame(data)
        with pd.ExcelWriter(file_path, mode="a", if_sheet_exists="overlay", engine="openpyxl") as writer:
            df.to_excel(writer, index=False, header=False, startrow=writer.sheets['Sheet1'].max_row)
        print("Données sauvegardées dans productions.xlsx")
    except Exception as e:
        print(f"Erreur lors de la sauvegarde dans Excel : {e}")

def simulate_step_progression(ordres):
    updated_data = []
    for ordre in ordres:
        id_fabrication = ordre['id_fabrication']
        produit = ordre["produit"] 
        print(f"Simulation pour la fabrication de {produit} (ID: {id_fabrication})")
        
        id_etape = ordre['id_etape']
        poste = ordre['poste']
        operation = ordre['operation']
        debut_etape = datetime.fromisoformat(ordre['debut_etape'])
        fin_etape = datetime.fromisoformat(ordre['fin_etape'])
        statut_etape = ordre['statut_etape']
        temps_ecoule = ordre['temps_ecoule']
        ressource_production = ordre["ressource_production"]
        id_etape_precedente = ordre["id_etape_precedente"]
        progression_production = ordre["progression_production"]

        if not statut_etape:  # L'étape n'est pas encore terminée
            temps_total = (fin_etape - debut_etape).total_seconds()
            progression_actuelle = (datetime.now() - debut_etape).total_seconds()

            temps_avance = random.randint(1, 5)  # Avance aléatoire
            
            temps_ecoule = float(temps_ecoule) if isinstance(temps_ecoule, str) else temps_ecoule  
            temps_ecoule += temps_avance
            progression_production += random.randint(5,20)
            statut_etape = temps_ecoule >= temps_total  # Déterminer si l'étape est terminée

            temps_ecoule = min(temps_ecoule, temps_total)  # Limiter à la durée totale

        updated_data.append({
            "id_etape": id_etape,
            "id_fabrication": id_fabrication,
            "poste": poste,
            "operation": operation,
            "debut_etape": debut_etape,
            "fin_etape": fin_etape,
            "statut_etape": statut_etape,
            "temps_ecoule": temps_ecoule,
            "progression_production": progression_production
        })
        time.sleep(DELAI)
    print("Simulation des étapes terminée.")
    return updated_data

def productions():
    last_save_time = time.time()
    while True:
        ordres = fetch_ordres_fabrication()
        if not ordres:
            print("Aucun ordre de fabrication trouvé.")
            time.sleep(DELAI)
            continue
        
        updated_data = simulate_step_progression(ordres)
        
        current_time = time.time()
        if current_time - last_save_time >= TIME_DELAI:
            update_etape_production(updated_data)
            save_data_to_excel(updated_data)
            last_save_time = current_time

        time.sleep(DELAI)
