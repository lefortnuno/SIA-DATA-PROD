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

Machines.getAllMachines = async (result) => {
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

module.exports = Machines;
