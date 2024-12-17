let dbConn = require("../config/db");

// GANTT_CHART

let Productions = function (production) {
  this.id_fabrication = production.id_fabrication;
};

Productions.getGanttChart = async (result) => {
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
 
    return { success: true, message: "Mise à jour réussie" };
  } catch (error) { 
    throw new Error("Erreur MIse à jour : " + error.message);
  }
};

Productions.getPieChart = async (result) => {
  try {
    const result = await dbConn.query(
      `SELECT  produit, SUM(quantite)*1.2 AS total_quantite FROM  ordres_fabrication GROUP BY  produit ORDER BY  total_quantite DESC; `
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

Productions.getLeafletChart = async (result) => {
  try {
    const result = await dbConn.query(
      `SELECT 
    r.nom_ressource AS poste,
    r.latitude,
    r.longitude,
    SUM(r.qte_produit)*50 AS production_totale
FROM 
    ressources r
GROUP BY 
    r.nom_ressource, r.latitude, r.longitude; `
    );

    return result.rows;
  } catch (error) {
    throw error;
  }
};

module.exports = Productions;
