DROP TABLE IF EXISTS capteurs;

DROP TABLE IF EXISTS machines;

-- DELETE FROM capteurs;
-- DELETE FROM
--     machines;
-- Création des tables
CREATE TABLE machines (
    id_machine VARCHAR(6) PRIMARY KEY,
    libelle_machine VARCHAR(25),
    date_maintenance DATE,
    etat BOOLEAN DEFAULT false,
    -- true = Panne, false = Disponible
    m_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE capteurs (
    id_capteur VARCHAR(6) PRIMARY KEY,
    id_machine VARCHAR(6) NOT NULL,
    date_mesure DATE,
    temps_mesure TIME,
    temperature FLOAT,
    pression FLOAT,
    vibration FLOAT,
    c_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_machine FOREIGN KEY (id_machine) REFERENCES machines (id_machine) ON DELETE CASCADE
);

-- Insertion des donnees de la table 
DELETE FROM
    machines;

INSERT INTO
    machines (
        id_machine,
        libelle_machine,
        date_maintenance,
        etat
    )
VALUES
    ('M101', 'Robot d''assemblage', '2024-12-12', 'f'),
    ('M102', 'Machine de découpe', '2024-12-7', 'f'),
    ('M103', 'Machine de peinture', '2024-12-20', 'f'),
    ('M104', 'Machine de lavage', '2024-12-20', 'T');

DELETE FROM
    capteurs;

INSERT INTO
    capteurs (
        id_capteur,
        id_machine,
        date_mesure,
        temps_mesure,
        temperature,
        pression,
        vibration
    )
VALUES
    (
        'C101',
        'M101',
        '2024-12-5',
        '08:40:22',
        75.0,
        5.5,
        50.1
    ),
    (
        'C102',
        'M101',
        '2024-12-5',
        '09:40:22',
        85.0,
        7.5,
        58.1
    ),
    (
        'C103',
        'M102',
        '2024-12-5',
        '08:40:22',
        65.0,
        6.2,
        60.1
    ),
    (
        'C104',
        'M103',
        '2024-12-5',
        '07:40:22',
        45.0,
        4.5,
        40.1
    ),
    (
        'C105',
        'M104',
        '2024-12-5',
        '17:40:22',
        105.3,
        8.8,
        60.7
    );