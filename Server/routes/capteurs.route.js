const router = require("express").Router();
const CapteursController = require("../controllers/capteurs.controller");

router.post("/", CapteursController.addCapteur);

router.get("/", CapteursController.getAllCapteurs);
router.get("/glitch/", CapteursController.placeAuGlitch);

router.put("/:id", CapteursController.updateCapteur);

module.exports = router;
