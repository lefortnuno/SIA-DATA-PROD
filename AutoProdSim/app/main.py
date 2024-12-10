import time
from capteurs.capteurs import capteurs
from productions.productions import productions

TIME_DELAI = 20

if __name__ == "__main__":  
    last_play_time = time.time()
    while True: 
        current_time = time.time()
        if current_time - last_play_time >= TIME_DELAI:
            productions()
            last_play_time = current_time
        else:
            capteurs()
