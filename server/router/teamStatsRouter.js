const router = require("express").Router();
const controller = require("../controller/teamStatsController");

//router.get('/getTeamStats', controller.getTeamStats);
router.put("/updateTeam", controller.updateTeam);
router.post("/loadBoxScores", controller.loadBoxScores);
router.get("/getTeamStats", controller.getTeamStats);
router.post("/postTeamAverages", controller.postTeamAverages);

module.exports = router;
