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
  },
  loadBoxScores: (req, res) => {
    //console.log("REQ BODY: ", req.body.data);
    var gamesArr = req.body.data;
    //console.log("GAME 1: ", gamesArr[0]);
    for (var i = 0; i < gamesArr.length; i++) {
      var game = gamesArr[i];
      db.Scores
        .findOrCreate({
          where: {
            Date: game["Date"],
            HW: game["HW"],
            Home: game["Home"],
            Home_Pts: game["Home_Pts"],
            Visitor: game["Visitor"],
            Visitor_Pts: game["Visitor_Pts"],
            Home_Diff: game["Home_Diff"],
            Start_Time: game["Start_Time"]
          }
        })
        .then(data => {
          console.log("Successfully added game to db");
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  getTeamStats: (req, res) => {
    console.log("REQ: ", req.query.season);
    var season = req.query.season;
    var team = req.query.team;
    if (season === "2017") {
      db.Seventeen
        .findAll({
          where: {
            Name: team
          }
        })
        .then(data => {
          res.status(200).send(data);
        })
        .catch(err => {
          res.status(404).send(err);
        });
    }
    if (season === "2016") {
      db.Sixteen
        .findAll({
          where: {
            Name: team
          }
        })
        .then(data => {
          res.status(200).send(data);
        })
        .catch(err => {
          res.status(404).send(err);
        });
    }
    if (season === "2015") {
      db.Fifteen
        .findAll({
          where: {
            Name: team
          }
        })
        .then(data => {
          res.status(200).send(data);
        })
        .catch(err => {
          res.status(404).send(err);
        });
    }
    if (season === "2014") {
      db.Fourteen
        .findAll({
          where: {
            Name: team
          }
        })
        .then(data => {
          res.status(200).send(data);
        })
        .catch(err => {
          res.status(404).send(err);
        });
    }
    if (season === "2013") {
      db.Thirteen
        .findAll({
          where: {
            Name: team
          }
        })
        .then(data => {
          res.status(200).send(data);
        })
        .catch(err => {
          res.status(404).send(err);
        });
    }
  },
  postTeamAverages: (req, res) => {
    console.log("pst request: ", req);
    var teamsArr = req.body.data;
    for (var i = 0; i < teamsArr.length; i++) {
      var team = teamsArr[i];
      db.Thirteen
        .findOrCreate({
          where: {
            Name: team["team"],
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
            DEF_FT_FGA: team["DEF-FT/FGA"],
            oFG: team["oFG"],
            oFGA: team["oFGA"],
            oFGPCT: team["oFGPCT"],
            o3P: team["o3P"],
            o3PA: team["o3PA"],
            o3PCT: team["o3PCT"],
            o2P: team["o2P"],
            o2PA: team["o2PA"],
            o2PCT: team["o2PCT"],
            oFTM: team["oFTM"],
            oFTA: team["oFTA"],
            oFTPCT: team["oFTPCT"],
            oORB: team["oORB"],
            oDRB: team["oDRB"],
            oTRB: team["oTRB"],
            oAST: team["oAST"],
            oSTL: team["oSTL"],
            oBLK: team["oBLK"],
            oTOV: team["oTOV"],
            oPF: team["oPF"],
            oPTS: team["oPTS"]
          }
        })
        .then(data => {
          console.log("Team Average saved");
        })
        .catch(err => {
          console.log("Error saving team average: ", err);
        });
    }
  }
};
