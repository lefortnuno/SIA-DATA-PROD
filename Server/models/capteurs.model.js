let dbConn = require("../config/db");

let Capteurs = function (capteur) {
  this.id_capteur = capteur.id_capteur;
  this.id_machine = capteur.id_machine;
  this.date_mesure = capteur.date_mesure;
  this.temps_mesure = capteur.temps_mesure;
  this.temperature = capteur.temperature;
  this.pression = capteur.pression;
  this.vibration = capteur.vibration;
};

const reqSQL = `SELECT * FROM capteurs `;
const reqOrdre = ` ORDER BY c_created_at DESC `;

Capteurs.addCapteur = async (newCapteur) => {
  try {
    const query = `INSERT INTO capteurs (id_capteur, id_machine, date_mesure, temps_mesure, temperature, pression, vibration) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    const values = [
      newCapteur.id_capteur,
      newCapteur.id_machine,
      newCapteur.date_mesure,
      newCapteur.temps_mesure,
      newCapteur.temperature,
      newCapteur.pression,
      newCapteur.vibration,
    ];

    const result = await dbConn.query(query, values); 

    return result;
  } catch (error) {
    throw error;
  }
};

Capteurs.getAllCapteurs = async (result) => {
  try {
    const result = await dbConn.query(reqSQL + reqOrdre);

    return result.rows;
  } catch (error) {
    throw error;
  }
};

Capteurs.deleteCapteur = async (id) => {
  try {
    const res = await dbConn.query(
      "DELETE FROM capteurs WHERE id_capteur = $1",
      [id]
    );
    if (res.rowCount > 0) {
      return { success: true, message: "Capteurs supprimé avec succès !" };
    } else {
      return {
        success: false,
        message: "Échec de suppression! Capteurs non existant!",
      };
    }
  } catch (error) {
    throw new Error("Erreur lors de la suppression : " + error.message);
  }
};

Capteurs.getIdCapteur = async (values) => {
  try {
    const requete = reqSQL + `WHERE id_capteur = $1`;
    const result = await dbConn.query(requete, [values.id]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

Capteurs.updateCapteur = async (updateCapteur, id) => {
  try {
    const setQuery = Object.keys(updateCapteur)
      .map((key, index) => `"${key}" = $${index + 1}`)
      .join(", ");

    const values = [...Object.values(updateCapteur), id]; // Ajouter l'ID pour la condition WHERE

    await dbConn.query(
      `UPDATE capteurs SET ${setQuery} WHERE id_capteur = $${values.length}`,
      values
    );

    return { success: true, message: "Mise à jour réussie" };
  } catch (error) {
    throw new Error("Erreur Mise à jour : " + error.message);
  }
};

module.exports = Capteurs;
