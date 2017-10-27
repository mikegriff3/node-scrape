const db = require("../db");

module.exports = {
  updateTeam: (req, res) => {
    console.log("REQ BODY: ", req.body.data);
    var statArr = req.body.data;
    for (var i = 0; i < statArr.length; i++) {
      var team = statArr[i];
      var teamName = team.team;
      db.Teams
        .update(
          {
            GP: team["gamesPlayed"],
            FG: team["FG"],
            FGA: team["FGA"],
            FG_PCT: team["FGPCT"],
            Three_Pointers: team["3P"],
            Three_Pointers_Att: team["3PA"],
            Three_Pointers_Pct: team["3PCT"],
            Two_Pointers: team["2P"],
            Two_Pointers_Att: team["2PA"],
            Two_Pointers_Pct: team["2PCT"],
            FTM: team["FTM"],
            FTA: team["FTA"],
            FT_PCT: team["FTPCT"],
            ORB: team["ORB"],
            DRB: team["DRB"],
            TRB: team["TRB"],
            AST: team["AST"],
            STL: team["STL"],
            BLK: team["BLK"],
            TOV: team["TOV"],
            PF: team["PF"],
            PTS: team["PTS"],
            W: team["W"],
            L: team["L"],
            PW: team["PW"],
            PL: team["PL"],
            MOV: team["MOV"],
            SOS: team["SOS"],
            SRS: team["SRS"],
            ORtg: team["ORtg"],
            DRtg: team["DRtg"],
            PACE: team["PACE"],
            FTr: team["FTr"],
            Three_PAr: team["3PAr"],
            OFF_eFG_PCT: team["OFF-eFG%"],
            OFF_TOV_PCT: team["OFF-TOV%"],
            ORB_PCT: team["ORB%"],
            OFF_FT_FGA: team["OFF-FT/FGA"],
            DEF_eFG_PCT: team["DEF-eFG%"],
            DEF_TOV_PCT: team["DEF-TOV%"],
            DRB_PCT: team["DRB%"],
            DEF_FT_FGA: team["DEF-FT/FGA"]
          },
          {
            where: { Name: team["team"] },
            returning: true
          }
        )
        .then(update => {
          console.log("updated successfully");
        })
        .catch(err => {
          console.log("err updating database: ", err);
        });
    }
  }
};
