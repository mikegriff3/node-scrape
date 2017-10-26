const router = require("express").Router();

router.use("/teamStats", require("./teamStatsRouter"));

module.exports = router;
