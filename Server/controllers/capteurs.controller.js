"use strict";
const Capteurs = require("../models/capteurs.model");
const ResponseHelper = require("../helpers/responseHelper");

module.exports.addCapteur = async (req, res) => {
  let data = req.body;

  try {
    const result = await Capteurs.addCapteur(data);
    ResponseHelper.sendResponse(res, true, "Ajout réussi !", result);
  } catch (error) {
    ResponseHelper.sendResponse(res, false, error.message, 500);
  }
};

module.exports.updateCapteur = async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;

  try {
    const result = await Capteurs.updateCapteur(updateData, userId);
    ResponseHelper.sendResponse(res, result.success, result.message);
  } catch (error) {
    ResponseHelper.sendResponse(res, false, error.message, null, 500);
  }
};

module.exports.getAllCapteurs = async (req, res) => {
  try {
    const result = await Capteurs.getAllCapteurs();
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

module.exports.placeAuGlitch = async (req, res) => {
  try {
    const result = await Capteurs.getAllCapteurs();
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
