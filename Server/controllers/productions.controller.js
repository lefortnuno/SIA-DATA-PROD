"use strict";
const Productions = require("../models/productions.model");
const ResponseHelper = require("../helpers/responseHelper");

module.exports.addProduction = async (req, res) => {
  let data = req.body;

  try {
    const result = await Productions.addProduction(data);
    ResponseHelper.sendResponse(res, true, "Ajout réussi !", result);
  } catch (error) {
    ResponseHelper.sendResponse(res, false, error.message, 500);
  }
};

module.exports.updateProduction = async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;
  console.log("CCCC ", userId, updateData);

  try {
    const result = await Productions.updateProduction(updateData, userId);
    ResponseHelper.sendResponse(res, result.success, result.message);
  } catch (error) {
    ResponseHelper.sendResponse(res, false, error.message, null, 500);
  }
};

module.exports.deleteProduction = async (req, res) => {
  const userId = req.params.id;

  try {
    const deleteResult = await Productions.deleteProduction(userId);
    ResponseHelper.sendResponse(
      res,
      deleteResult.success,
      deleteResult.message
    );
  } catch (error) {
    ResponseHelper.sendResponse(res, false, error.message, 500);
  }
};

module.exports.getAllProductions = async (req, res) => {
  try {
    const result = await Productions.getAllProductions();
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

module.exports.getIdProduction = async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await Productions.getIdProduction({ id: userId });
    if (result.length > 0) {
      ResponseHelper.sendResponse(res, true, "Trouvé !", result[0]);
    } else {
      ResponseHelper.sendResponse(res, false, "Non trouvé !", null, 404);
    }
  } catch (error) {
    ResponseHelper.sendResponse(res, false, error.message, 500);
  }
};

module.exports.getPieChart = async (req, res) => {
  try {
    const result = await Productions.getPieChart();
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


module.exports.getLineChart = async (req, res) => {
  try {
    const result = await Productions.getLineChart();
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

module.exports.getGanttChartVoiture = async (req, res) => {
  let data = req.body;

  try {
    const result = await Productions.getGanttChartVoiture(data);
    ResponseHelper.sendResponse(res, true, "GanttChart Voiture !", result);
  } catch (error) {
    ResponseHelper.sendResponse(res, false, error.message, 500);
  }
};