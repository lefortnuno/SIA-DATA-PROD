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

def get_full_path(filename):
    return os.path.join(BASE_DIR, filename)

def initialize_excel_file(filepath):
    if not os.path.exists(filepath):
        df = pd.DataFrame(columns=[
            "id_capteur", "id_machine", "date_mesure",
            "temps_mesure", "temperature", "pression", "vibration", "valid"
        ])
        df.to_excel(filepath, index=False)

def serialize_record(record):
    serialized = record.copy()
    serialized.pop("valid", None)  # Retirer la clé "valid"
    serialized["date_mesure"] = record["date_mesure"].isoformat() if record["date_mesure"] else None
    serialized["temps_mesure"] = record["temps_mesure"].isoformat() if record["temps_mesure"] else None
    return serialized

def get_machine_ids(): 
    try: 
        response = requests.get(f"{API_URL}machines/IDM/") 
        response.raise_for_status() 
        machines = response.json().get("data", [])
        machine_ids = [machine["id_machine"] for machine in machines]
        return machine_ids 
    except Exception as e:
        print(f"Erreur lors de la récupération des machines : {e}")
        return []

def generate_sensor_data(machine_ids, last_save_time, num_records=1000): 
    data = []
     
    for _ in range(num_records): 
        id_machine = random.choice(machine_ids)
        id_capteur = f"C{random.randint(1000, 9999)}"
        # date_mesure = datetime.now().strftime("%Y-%m-%d")   
        # temps_mesure = datetime.now().strftime("%H:%M:%S") 
        date_mesure = datetime.now().date()  
        temps_mesure = datetime.now().time() 
        temperature = random.uniform(-20, 120) if random.random() < 0.9 else random.uniform(0, 120)
        pression = random.uniform(-10, 20) if random.random() < 0.9 else random.uniform(0, 20)
        vibration = random.uniform(-20, 120) if random.random() < 0.9 else random.uniform(0, 120)

        valid = (
            temperature >= 0
            and pression >= 0
            and vibration >= 0
            and id_machine is not None
        ) 

        if not valid:
            error_fields = [
                "id_machine", "id_capteur", "date_mesure",
                "temps_mesure", "temperature", "pression", "vibration"
            ]
            field_to_modify = random.choice(error_fields)
            match field_to_modify:
                case "id_machine":
                    id_machine = None if random.random() < 0.5 else -1
                case "id_capteur":
                    id_capteur = None if random.random() < 0.5 else -1
                case "date_mesure":
                    date_mesure = None
                case "temps_mesure":
                    temps_mesure = None
                case "temperature":
                    temperature = None if random.random() < 0.5 else -abs(temperature)
                case "pression":
                    pression = None if random.random() < 0.5 else -abs(pression)
                case "vibration":
                    vibration = None if random.random() < 0.5 else -abs(vibration)

        data.append({
            "id_capteur": id_capteur,
            "id_machine": id_machine,
            "date_mesure": date_mesure,
            "temps_mesure": temps_mesure,
            "temperature": temperature,
            "pression": pression,
            "vibration": vibration,
            "valid": valid
        })  
        time.sleep(1)
        current_time = time.time()
        if current_time - last_save_time >= TIME_DELAI: 
            break
          
    return data

def save_data_to_api(data): 
    big_data = []
    valid_data = []

    for record in data: 
        big_data.append(record) 
        if record["valid"]: 
            valid_data.append(record)
            try:
                serialized_record = serialize_record(record)  # Sérialisez avant envoi
                response = requests.post(f"{API_URL}capteurs/", json=serialized_record)
                response.raise_for_status()
                # print(f"Données envoyées : {record['id_capteur']}")
            except Exception as e:
                print(f"Erreur lors de l'envoi des données : {e}")
 
def save_data_to_excel(data):  
    big_data = data  
    valid_data = [d for d in data if d["valid"]]

    base_dir = "../../Warehouse/capteurs"
    init_file = os.path.join(base_dir, "capteurs_init.xlsx")
    final_file = os.path.join(base_dir, "capteurs.xlsx")

    try:
        os.makedirs(base_dir, exist_ok=True)
        initialize_excel_file(init_file)
        initialize_excel_file(final_file)

        if big_data:
            big_data_df = pd.DataFrame(big_data)
            with pd.ExcelWriter(init_file, mode="a", if_sheet_exists="overlay", engine="openpyxl") as writer:
                big_data_df.to_excel(writer, index=False, header=False, startrow=writer.sheets['Sheet1'].max_row)

        if valid_data:
            valid_data_df = pd.DataFrame(valid_data)
            with pd.ExcelWriter(final_file, mode="a", if_sheet_exists="overlay", engine="openpyxl") as writer:
                valid_data_df.to_excel(writer, index=False, header=False, startrow=writer.sheets['Sheet1'].max_row)

    except Exception as e:
        print(f"Erreur lors de la sauvegarde dans Excel : {e}")

def capteurs():
    last_save_time = time.time()  

    while True:  
        machine_ids = get_machine_ids()
        if not machine_ids:
            print("Aucun id_machine trouvé. Vérifiez l'API.")
        else: 
            data = generate_sensor_data(machine_ids, last_save_time)
 
            current_time = time.time()
            if current_time - last_save_time >= TIME_DELAI: 
                save_data_to_excel(data)
                save_data_to_api(data)

                last_save_time = 0   
