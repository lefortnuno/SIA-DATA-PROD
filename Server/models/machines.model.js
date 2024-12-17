let dbConn = require("../config/db");

let Machines = function (machine) {
  this.id_machine = machine.id_machine;
  this.libelle_machine = machine.libelle_machine;
  this.date_maintenance = machine.date_maintenance;
  this.etat = machine.etat;
};

const reqSQL = `SELECT * FROM machines `;
const reqOrdre = ` ORDER BY m_created_at DESC `;

Machines.addMachine = async (newMachine) => {
  try {
    const query = `INSERT INTO machines (id_machine, libelle_machine, date_maintenance, etat) 
                   VALUES ($1, $2, $3, $4)`;
    const values = [
      newMachine.id_machine,
      newMachine.libelle_machine,
      newMachine.date_maintenance,
      newMachine.etat,
    ];

    const result = await dbConn.query(query, values);
    return result;
  } catch (error) {
    throw error;
  }
};

Machines.getAllMachines = async () => {
  try {
    const result = await dbConn.query(reqSQL + reqOrdre);

    return result.rows;
  } catch (error) {
    throw error;
  }
};

Machines.deleteMachine = async (id) => {
  try {
    const res = await dbConn.query(
      "DELETE FROM machines WHERE id_machine = $1",
      [id]
    );
    if (res.rowCount > 0) {
      return { success: true, message: "Machines supprimé avec succès !" };
    } else {
      return {
        success: false,
        message: "Échec de suppression! Machines non existant!",
      };
    }
  } catch (error) {
    throw new Error("Erreur lors de la suppression : " + error.message);
  }
};

Machines.getIdMachine = async (values) => {
  try {
    const requete = reqSQL + `WHERE id_machine = $1`;
    const result = await dbConn.query(requete, [values.id]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

Machines.updateMachine = async (updateMachine, id) => {
  try {
    const setQuery = Object.keys(updateMachine)
      .map((key, index) => `"${key}" = $${index + 1}`)
      .join(", ");

    const values = [...Object.values(updateMachine), id]; // Ajouter l'ID pour la condition WHERE

    await dbConn.query(
      `UPDATE machines SET ${setQuery} WHERE id_machine = $${values.length}`,
      values
    );

    return { success: true, message: "Mise à jour réussie" };
  } catch (error) {
    throw new Error("Erreur MIse à jour : " + error.message);
  }
};

Machines.getStatMachines = async (result) => {
  try {
    const requetes = `SELECT m.id_machine, m.libelle_machine, ROUND(AVG(c.temperature)::NUMERIC, 2) AS avg_temperature, ROUND(AVG(c.pression)::NUMERIC, 2) AS avg_pression, ROUND(AVG(c.vibration)::NUMERIC, 2) AS avg_vibration FROM machines m JOIN capteurs c ON m.id_machine = c.id_machine GROUP BY m.id_machine, m.libelle_machine ORDER BY m.id_machine `;
    const result = await dbConn.query(requetes);

    return result.rows;
  } catch (error) {
    throw error;
  }
};

Machines.getAllMachinesIDM = async (result) => {
  try {
    const result = await dbConn.query(
      "SELECT id_machine FROM machines WHERE etat=false ORDER BY m_created_at DESC"
    );

    return result.rows;
  } catch (error) {
    throw error;
  }
};

Machines.glitchResetDB = async () => {
  try {
    const result =
      await dbConn.query(`-- ========================================================================
-- Table des CAPTEURS / MACHINES
-- ========================================================================
DROP TABLE IF EXISTS capteurs;

DROP TABLE IF EXISTS machines;

-- Création de la table des machines
CREATE TABLE machines (
    id_machine VARCHAR(6) PRIMARY KEY,
    libelle_machine VARCHAR(25),
    date_maintenance DATE,
    etat BOOLEAN DEFAULT false,
    -- true = Panne, false = Disponible
    m_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table des capteurs
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

-- Insertion des données dans les machines
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

-- Insertion des données dans les capteurs
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
        12.8,
        106.7
    );

-- ========================================================================
-- Table G-PRODUCTION
-- ========================================================================
DROP TABLE IF EXISTS affectation_ressources;

DROP TABLE IF EXISTS dependances_etape;

DROP TABLE IF EXISTS suivi_etapes;

DROP TABLE IF EXISTS ressources;

DROP TABLE IF EXISTS ordres_fabrication;

-- Création de la table des ordres de fabrication
CREATE TABLE ordres_fabrication (
    id_fabrication SERIAL PRIMARY KEY,
    produit TEXT NOT NULL,
    quantite INTEGER NOT NULL,
    date_lancement DATE NOT NULL,
    date_fin_prevue DATE NOT NULL,
    statut_fabrication BOOLEAN DEFAULT false
);

-- Création de la table des étapes de production
CREATE TABLE suivi_etapes (
    id_etape SERIAL PRIMARY KEY,
    id_fabrication INTEGER REFERENCES ordres_fabrication(id_fabrication) ON DELETE CASCADE,
    poste TEXT NOT NULL,
    operation TEXT NOT NULL,
    debut_etape DATE NOT NULL,
    fin_etape DATE NOT NULL,
    statut_etape BOOLEAN DEFAULT false,
    progression_production INT DEFAULT 0,
    temps_ecoule DECIMAL NOT NULL,
    niveau_etape INTEGER NOT NULL DEFAULT 1 -- Niveau dans le flux de production
);

-- Création de la table des ressources
CREATE TABLE ressources (
    id_ressource SERIAL PRIMARY KEY,
    nom_ressource VARCHAR(255) NOT NULL UNIQUE,
    type_ressource TEXT CHECK (type_ressource IN ('poste', 'atelier')) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    qte_produit INT NOT NULL DEFAULT 0
);

-- Création de la table de l'affectation des ressources aux étapes
CREATE TABLE affectation_ressources (
    id_affectation SERIAL PRIMARY KEY,
    id_etape INTEGER REFERENCES suivi_etapes(id_etape) ON DELETE CASCADE,
    id_ressource INTEGER REFERENCES ressources(id_ressource) ON DELETE CASCADE
);

-- Création de la table des dépendances entre les étapes
CREATE TABLE dependances_etape (
    id_dependance SERIAL PRIMARY KEY,
    id_etape_precedente INTEGER REFERENCES suivi_etapes(id_etape) ON DELETE CASCADE,
    id_etape_suivante INTEGER REFERENCES suivi_etapes(id_etape) ON DELETE CASCADE,
    UNIQUE (id_etape_precedente, id_etape_suivante) -- Empêche les doublons
);

-- Index pour améliorer la recherche dans les dépendances
CREATE INDEX idx_dependances ON dependances_etape (id_etape_precedente, id_etape_suivante);

-- Insertion des données dans ordres_fabrication
INSERT INTO
    ordres_fabrication (
        id_fabrication,
        produit,
        quantite,
        date_lancement,
        date_fin_prevue,
        statut_fabrication
    )
VALUES
    (
        1,
        'D.CHALLENGER',
        100,
        '2024-7-18',
        '2024-11-02',
        true
    ),
    (
        2,
        'D.RAM',
        200,
        '2024-7-29',
        '2024-12-28',
        false
    ),
    (
        3,
        'D.CORONET',
        150,
        '2024-8-27',
        '2024-12-31',
        false
    ),
    (
        4,
        'D.DART',
        250,
        '2024-8-1',
        '2024-12-31',
        false
    ),
    (
        5,
        'D.CHARGER',
        235,
        '2024-9-11',
        '2024-12-16',
        false
    ),
    (
        6,
        'D.VIPER',
        400,
        '2024-9-25',
        '2024-12-29',
        false
    );

-- Insertion dans suivi_etapes
INSERT INTO
    suivi_etapes (
        id_etape,
        id_fabrication,
        poste,
        operation,
        debut_etape,
        fin_etape,
        statut_etape,
        progression_production,
        temps_ecoule,
        niveau_etape
    )
VALUES
    (
        1,
        1,
        'Argentine',
        'Découpage',
        '2024-11-21',
        '2024-11-30',
        true,
        80,
        4.0,
        1
    ),
    (
        2,
        2,
        'Espagne',
        'Assemblage',
        '2024-12-01',
        '2024-12-10',
        false,
        20,
        2.0,
        2
    ),
    (
        3,
        3,
        'Maroc',
        'Peinture',
        '2024-12-12',
        '2024-12-19',
        false,
        0,
        0.0,
        3
    ),
    (
        4,
        4,
        'Etat-Unis',
        'Lavage',
        '2024-12-19',
        '2024-12-21',
        false,
        10,
        3.0,
        3
    ),
    (
        5,
        5,
        'Canada',
        'Coffrage',
        '2024-12-21',
        '2024-12-25',
        false,
        10,
        2.0,
        4
    ),
    (
        6,
        6,
        'France',
        'Emballeur',
        '2024-12-24',
        '2024-12-29',
        false,
        0,
        0.0,
        5
    );

-- Insertion dans ressources
INSERT INTO
    ressources (
        id_ressource,
        nom_ressource,
        type_ressource,
        latitude,
        longitude,
        qte_produit
    )
VALUES
    (
        1,
        'Argentine',
        'poste',
        -34.9964963,
        -64.9672817,
        50
    ),
    (
        2,
        'Espagne',
        'poste',
        39.3260685,
        -4.8379791,
        30
    ),
    (3, 'Maroc', 'poste', 34.025917, -6.836300, 20),
    (
        4,
        'Etat-Unis',
        'poste',
        48.27251380530047,
        -99.52124322964949,
        60
    ),
    (
        5,
        'Canada',
        'poste',
        61.0666922,
        -107.991707,
        40
    ),
    (6, 'France', 'poste', 48.8588897, 2.320041, 30),
    (
        7,
        'Brésil',
        'atelier',
        -10.3333333,
        -53.2,
        50
    );

-- Insertion dans affectation_ressources
INSERT INTO
    affectation_ressources (id_affectation, id_etape, id_ressource)
VALUES
    (1, 1, 1),
    (2, 2, 2),
    (3, 3, 3),
    (4, 4, 4),
    (5, 5, 5),
    (6, 6, 6);

-- Insertion dans dependances_etape
INSERT INTO
    dependances_etape (
        id_dependance,
        id_etape_precedente,
        id_etape_suivante
    )
VALUES
    (1, 1, 2),
    (2, 2, 3),
    (3, 3, 4),
    (5, 5, 6);

-- ========================================================================
-- Nouvelles données
-- ======================================================================== 
-- FIN`);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

module.exports = Machines;
