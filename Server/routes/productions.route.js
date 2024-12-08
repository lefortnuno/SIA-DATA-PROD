const router = require("express").Router();
const ProductionsController = require("../controllers/productions.controller");

router.post("/ganttChartVoiture/", ProductionsController.getGanttChartVoiture);

router.get("/", ProductionsController.getGanttChart);
router.get("/pieChart/", ProductionsController.getPieChart);
router.get("/lineChart/", ProductionsController.getLineChart);
router.get("/leafletChart/", ProductionsController.getLeafletChart);

module.exports = router;
