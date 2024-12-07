const router = require("express").Router();
const ProductionsController = require("../controllers/productions.controller");

router.post("/", ProductionsController.addProduction);

router.get("/", ProductionsController.getAllProductions);   

router.get("/:id", ProductionsController.getIdProduction);

router.put("/:id", ProductionsController.updateProduction);

router.delete("/:id", ProductionsController.deleteProduction);

module.exports = router;
