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

router.post("/mlbLoadBoxScores", controller.mlbLoadBoxScores);
router.put("/updateMLBAdvStats", controller.updateMLBAdvStats);
router.get("/getNullGames", controller.getNullGames);
router.get("/getMLBBoxScores", controller.getMLBBoxScores);
router.put("/mlbUpdateBoxScores", controller.mlbUpdateBoxScores);

module.exports = router;
