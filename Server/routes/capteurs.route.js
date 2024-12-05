const router = require("express").Router();
const CapteursController = require("../controllers/capteurs.controller");

router.post("/", CapteursController.addCapteur);

router.get("/", CapteursController.getAllCapteurs);
router.get("/glitch/", CapteursController.placeAuGlitch);

router.get("/:id", CapteursController.getIdCapteur);

router.put("/:id", CapteursController.updateCapteur);

router.delete("/:id", CapteursController.deleteCapteur);

module.exports = router;
