const router = require("express").Router();
const MachinesController = require("../controllers/machines.controller");

router.post("/", MachinesController.addMachine);

router.get("/", MachinesController.getAllMachines);
router.get("/glitch/", MachinesController.placeAuGlitch);

router.get("/:id", MachinesController.getIdMachine);

router.put("/:id", MachinesController.updateMachine);

router.delete("/:id", MachinesController.deleteMachine);

module.exports = router;