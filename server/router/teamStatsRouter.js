const router = require("express").Router();
const controller = require("../controller/teamStatsController");

//router.get('/getTeamStats', controller.getTeamStats);
router.put("/updateTeam", controller.updateTeam);
router.put("/updateBoxScores", controller.updateBoxScores);
router.put("/updateBoxScoresInjury", controller.updateBoxScoresInjury);
router.post("/loadBoxScores", controller.loadBoxScores);
router.get("/getTeamStats", controller.getTeamStats);
router.post("/postTeamAverages", controller.postTeamAverages);
router.get("/getBoxScores", controller.getBoxScores);
router.get("/getAllBoxScores", controller.getAllBoxScores);

module.exports = router;
