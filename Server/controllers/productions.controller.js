"use strict";
const Productions = require("../models/productions.model");
const ResponseHelper = require("../helpers/responseHelper");

module.exports.getGanttChart = async (req, res) => {
  try {
    const result = await Productions.getGanttChart();
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

module.exports.getLeafletChart = async (req, res) => {
  try {
    const result = await Productions.getLeafletChart();
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
