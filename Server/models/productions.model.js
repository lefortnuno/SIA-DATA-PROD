let dbConn = require("../config/db");

// GANTT_CHART

let Productions = function (production) {
  this.id_fabrication = production.id_fabrication;
};

Productions.addProduction = async (newProduction) => {
  try {
    const query = `INSERT INTO productions (id_production, libelle_production, date_maintenance, etat) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    const values = [
      newProduction.id_production,
      newProduction.etape_production,
      newProduction.ressource_production,
      newProduction.debut_production,
      newProduction.fin_production,
      newProduction.progression_production,
      newProduction.dependances_production,
    ];

    const result = await dbConn.query(query, values);
    return result;
  } catch (error) {
    throw error;
  }
};

Productions.getAllProductions = async (result) => {
  try {
    const result = await dbConn.query(
      `SELECT  
    ef.id_fabrication, 
    ef.produit, 
    ef.statut_fabrication,
    ef.date_fin_prevue,
    ef.date_lancement,
    se.id_etape, 
    se.poste, 
    se.operation, 
    TO_CHAR(se.debut_etape, 'YYYY-MM-DD') AS debut_etape, 
    TO_CHAR(se.fin_etape, 'YYYY-MM-DD') AS fin_etape, 
    se.statut_etape, 
    se.progression_production AS progression_production, 
    se.temps_ecoule, 
    r.nom_ressource AS ressource_production, 
    de.id_etape_precedente
FROM ordres_fabrication ef
JOIN suivi_etapes se ON ef.id_fabrication = se.id_fabrication
LEFT JOIN affectation_ressources ar ON se.id_etape = ar.id_etape
LEFT JOIN ressources r ON ar.id_ressource = r.id_ressource
LEFT JOIN dependances_etape de ON se.id_etape = de.id_etape_suivante
ORDER BY ef.id_fabrication, se.debut_etape; `
    );

    return result.rows;
  } catch (error) {
    throw error;
  }
};

Productions.getProductionParProduit = async (result) => {
  try {
    const result = await dbConn.query(
      `SELECT  
    ef.id_fabrication, 
    ef.produit, 
    se.id_etape, 
    se.poste, 
    se.operation, 
    TO_CHAR(se.debut_etape, 'YYYY-MM-DD') AS debut_etape, 
    TO_CHAR(se.fin_etape, 'YYYY-MM-DD') AS fin_etape, 
    se.statut_etape, 
    se.progression_production AS progression_production, 
    se.temps_ecoule, 
    r.nom_ressource AS ressource_production, 
    de.id_etape_precedente
FROM ordres_fabrication ef
JOIN suivi_etapes se ON ef.id_fabrication = se.id_fabrication
LEFT JOIN affectation_ressources ar ON se.id_etape = ar.id_etape
LEFT JOIN ressources r ON ar.id_ressource = r.id_ressource
LEFT JOIN dependances_etape de ON se.id_etape = de.id_etape_suivante
WHERE ef.produit = 'Nom_du_produit'
ORDER BY se.debut_etape;

`
    );

    return result.rows;
  } catch (error) {
    throw error;
  }
};

Productions.deleteProduction = async (id) => {
  try {
    const res = await dbConn.query(
      "DELETE FROM productions WHERE id_production = $1",
      [id]
    );
    if (res.rowCount > 0) {
      return { success: true, message: "Productions supprimé avec succès !" };
    } else {
      return {
        success: false,
        message: "Échec de suppression! Productions non existant!",
      };
    }
  } catch (error) {
    throw new Error("Erreur lors de la suppression : " + error.message);
  }
};

Productions.getIdProduction = async (values) => {
  try {
    const requete = `WHERE id_production = $1`;
    const result = await dbConn.query(requete, [values.id]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

Productions.updateProduction = async (updateProduction, id) => {
  try {
    const setQuery = Object.keys(updateProduction)
      .map((key, index) => `"${key}" = $${index + 1}`)
      .join(", ");

    const values = [...Object.values(updateProduction), id]; // Ajouter l'ID pour la condition WHERE

    r = await dbConn.query(
      `UPDATE suivi_etapes SET ${setQuery} WHERE id_etape = $${values.length}`,
      values
    );

    console.log(" Donnee MAJ par le python ", r);
    return { success: true, message: "Mise à jour réussie" };
  } catch (error) {
    console.log("CCCC ", error);
    throw new Error("Erreur MIse à jour : " + error.message);
  }
};

Productions.getPieChart = async (result) => {
  try {
    const result = await dbConn.query(
      `SELECT  produit, SUM(quantite) AS total_quantite FROM  ordres_fabrication GROUP BY  produit ORDER BY  total_quantite DESC; `
    );

    return result.rows;
  } catch (error) {
    throw error;
  }
};

Productions.getLineChart = async (result) => {
  try {
    const result = await dbConn.query(
      `SELECT DATE_TRUNC('month', date_lancement) AS mois, produit, SUM(quantite) AS total_quantite FROM ordres_fabrication GROUP BY DATE_TRUNC('month', date_lancement), produit ORDER BY mois, produit; `
    );

    return result.rows;
  } catch (error) {
    throw error;
  }
};

Productions.getGanttChartVoiture = async (data) => {
  try {
    const allEtapegantt = `SELECT 
    ef.id_fabrication, 
    ef.produit, 
    se.operation, 
    TO_CHAR(se.debut_etape, 'YYYY-MM-DD') AS debut_etape, 
    TO_CHAR(se.fin_etape, 'YYYY-MM-DD') AS fin_etape, 
    se.progression_production, 
    se.statut_etape, 
    r.nom_ressource AS ressource_production, 
    de.id_etape_precedente
FROM ordres_fabrication ef
JOIN suivi_etapes se ON ef.id_fabrication = se.id_fabrication
LEFT JOIN affectation_ressources ar ON se.id_etape = ar.id_etape
LEFT JOIN ressources r ON ar.id_ressource = r.id_ressource
LEFT JOIN dependances_etape de ON se.id_etape = de.id_etape_suivante
WHERE ef.produit = $1
ORDER BY ef.id_fabrication, se.debut_etape;
`;
    const result = await dbConn.query(allEtapegantt, [data.produit]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

module.exports = Productions;
