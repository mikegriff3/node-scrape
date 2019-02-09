const db = require("../db");

module.exports = {
  updateTeam: (req, res) => {
    console.log("REQ BODY: ", req.body.data);
    var statArr = req.body.data;
    for (var i = 0; i < statArr.length; i++) {
      var team = statArr[i];
      var teamName = team.team;
      db.Nineteen.update(
        {
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
      db.Scores.findOrCreate({
        where: {
          Date: game["Date"],
          HW: game["HW"] || 0,
          Total_Pts: game["Total_Pts"] || 0,
          Home: game["Home"],
          Home_Pts: game["Home_Pts"],
          Visitor: game["Visitor"],
          Visitor_Pts: game["Visitor_Pts"],
          Home_Diff: game["Home_Diff"] || 0,
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
  updateBoxScores: (req, res) => {
    //console.log("REQ BODY: ", req.body.data);
    var gamesArr = req.body.data;
    //console.log("GAME 1: ", gamesArr[0]);
    for (var i = 0; i < gamesArr.length; i++) {
      var game = gamesArr[i];
      db.Scores.update(
        {
          HW: game["HW"],
          Total_Pts: game["Total_Pts"],
          Home_Pts: game["Home_Pts"],
          Visitor: game["Visitor"],
          Visitor_Pts: game["Visitor_Pts"],
          Home_Diff: game["Home_Diff"],
          Start_Time: game["Start_Time"]
        },
        {
          where: { Date: game["Date"], Home: game["Home"] },
          returning: true
        }
      )
        .then(data => {
          console.log("Successfully added game to db");
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  updateBoxScoresInjury: (req, res) => {
    //console.log("REQ BODY: ", req.body.data);
    var gamesArr = req.body.data;
    //console.log("GAME 1: ", gamesArr[0]);
    for (var i = 0; i < gamesArr.length; i++) {
      var game = gamesArr[i];
      db.Scores.update(
        {
          Away_3P: game["Away_3P"],
          Away_3PA: game["Away_3PA"],
          Away_AST: game["Away_AST"],
          Away_BLK_PCT: game["Away_BLK_PCT"],
          Away_FG: game["Away_FG"],
          Away_FGA: game["Away_FGA"],
          Away_FTA: game["Away_FTA"],
          Away_FTM: game["Away_FTM"],
          Away_ORB: game["Away_ORB"],
          Away_ORB_PCT: game["Away_ORB_PCT"],
          Away_STL: game["Away_STL"],
          Away_TOV_PCT: game["Away_TOV_PCT"],
          Away_TRB: game["Away_TRB"],
          Home_3P: game["Home_3P"],
          Home_3PA: game["Home_3PA"],
          Home_AST: game["Home_AST"],
          Home_BLK_PCT: game["Home_BLK_PCT"],
          Home_FG: game["Home_FG"],
          Home_FGA: game["Home_FGA"],
          Home_FTA: game["Home_FTA"],
          Home_FTM: game["Home_FTM"],
          Home_ORB: game["Home_ORB"],
          Home_ORB_PCT: game["Home_ORB_PCT"],
          Home_ST: game["Home_STL"],
          Home_TOV_PCT: game["Home_TOV_PCT"],
          Home_TRB: game["Home_TRB"],
          Injuries: game["Injuries"],
          Referees: game["Referees"]
        },
        {
          where: { Date: game["Date"], Home: game["Home"] },
          returning: true
        }
      )
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
    if (season === "2019") {
      db.Nineteen.findAll({
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
    if (season === "2018") {
      db.Eighteen.findAll({
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
    if (season === "2017") {
      db.Seventeen.findAll({
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
      db.Sixteen.findAll({
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
      db.Fifteen.findAll({
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
      db.Fourteen.findAll({
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
      db.Thirteen.findAll({
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
  getBoxScores: (req, res) => {
    console.log("REQ: ", req.query.season);
    var team = req.query.team;
    db.Scores.findAll({
      where: {
        $or: {
          Home: team,
          Visitor: team
        }
      }
    })
      .then(data => {
        res.status(200).send(data);
      })
      .catch(err => {
        res.status(404).send(err);
      });
  },
  getAllBoxScores: (req, res) => {
    db.Score.findAll({})
      .then(data => {
        res.status(200).send(data);
      })
      .catch(err => {
        res.status(404).send(err);
      });
  },
  postTeamAverages: (req, res) => {
    console.log("pst request: ", req);
    var teamsArr = req.body.data;
    for (var i = 0; i < teamsArr.length; i++) {
      var team = teamsArr[i];
      db.Thirteen.findOrCreate({
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
