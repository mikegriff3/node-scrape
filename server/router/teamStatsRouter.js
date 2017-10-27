const router = require("express").Router();
const controller = require("../controller/teamStatsController");

//router.get('/getTeamStats', controller.getTeamStats);
router.put("/updateTeam", controller.updateTeam);

module.exports = router;
