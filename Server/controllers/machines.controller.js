"use strict";
const Machines = require("../models/machines.model");
const ResponseHelper = require("../helpers/responseHelper");

module.exports.addMachine = async (req, res) => {
  let data = req.body;

  try {
    const result = await Machines.addMachine(data);
    ResponseHelper.sendResponse(res, true, "Ajout réussi !", result);
  } catch (error) {
    ResponseHelper.sendResponse(res, false, error.message, 500);
  }
};

module.exports.updateMachine = async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;

  try {
    const result = await Machines.updateMachine(updateData, userId);
    ResponseHelper.sendResponse(res, result.success, result.message);
  } catch (error) {
    ResponseHelper.sendResponse(res, false, error.message, null, 500);
  }
};

module.exports.deleteMachine = async (req, res) => {
  const userId = req.params.id;

  try {
    const deleteResult = await Machines.deleteMachine(userId);
    ResponseHelper.sendResponse(
      res,
      deleteResult.success,
      deleteResult.message
    );
  } catch (error) {
    ResponseHelper.sendResponse(res, false, error.message, 500);
  }
};

module.exports.getAllMachines = async (req, res) => {
  try {
    const result = await Machines.getAllMachines();
    ResponseHelper.sendResponse(
      res,
      true,
      "Liste récupérée avec succès !",
      result
    );
  } catch (error) {
    ResponseHelper.sendResponse(res, false, error.message, 500);
  }
};

module.exports.getIdMachine = async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await Machines.getIdMachine({ id: userId });
    if (result.length > 0) {
      ResponseHelper.sendResponse(res, true, "Trouvé !", result[0]);
    } else {
      ResponseHelper.sendResponse(res, false, "Non trouvé !", null, 404);
    }
  } catch (error) {
    ResponseHelper.sendResponse(res, false, error.message, 500);
  }
};

module.exports.placeAuGlitch = async (req, res) => {
  try {
    const result = await Machines.getAllMachines();
    ResponseHelper.sendResponse(
      res,
      true,
      "Liste récupérée avec succès !",
      result[0]
    );
  } catch (error) {
    ResponseHelper.sendResponse(res, false, error.message, 500);
  }
};

module.exports.getStatMachines = async (req, res) => {
  try {
    const result = await Machines.getStatMachines();
    ResponseHelper.sendResponse(
      res,
      true,
      "Liste récupérée avec succès !",
      result
    );
  } catch (error) {
    ResponseHelper.sendResponse(res, false, error.message, 500);
  }
};

module.exports.getAllMachinesIDM = async (req, res) => {
  try {
    const result = await Machines.getAllMachinesIDM();
    ResponseHelper.sendResponse(
      res,
      true,
      "Liste récupérée avec succès !",
      result
    );
  } catch (error) {
    ResponseHelper.sendResponse(res, false, error.message, 500);
  }
};
