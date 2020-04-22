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
  updateMLBAdvStats: (req, res) => {
    //console.log("REQ BODY: ", req.body.data);
    var gamesArr = req.body.data;
    //console.log("GAME 1: ", gamesArr[0]);
    for (var i = 0; i < gamesArr.length; i++) {
      var game = gamesArr[i];
      if (game["Home"] === "Los Angeles Angels of Anaheim")
        game["Home"] = "LA Angels of Anaheim";
      if (game["Home"] === "Arizona Diamondbacks")
        game["Home"] = "Arizona D'Backs";
      db.MLBScores.update(
        {
          Ballpark: game["Ballpark"],
          Home_AB: game["Home_AB"],
          Home_Hits: game["Home_Hits"],
          Home_RBI: game["Home_RBI"],
          Home_BB: game["Home_BB"],
          Home_PA: game["Home_PA"],
          Home_BA: game["Home_BA"],
          Home_OBP: game["Home_OBP"],
          Home_SLG: game["Home_SLG"],
          Home_OPS: game["Home_OPS"],
          Home_Pitches_Seen: game["Home_Pitches_Seen"],
          Home_Strikes_Taken: game["Home_Strikes_Taken"],
          Home_WPA: game["Home_WPA"],
          Home_BORA: game["Home_BORA"],
          Home_PO: game["Home_PO"],
          Home_AST: game["Home_AST"],
          Home_Starter: game["Home_Starter"],
          Home_SP_IP: game["Home_SP_IP"],
          Home_SP_HA: game["Home_SP_HA"],
          Home_SP_ERA: game["Home_SP_ERA"],
          Home_SP_BB: game["Home_SP_BB"],
          Home_SP_HRA: game["Home_SP_HRA"],
          Home_SP_SO: game["Home_SP_SO"],
          Home_SP_BF: game["Home_SP_BF"],
          Home_SP_Pit: game["Home_SP_Pit"],
          Home_SP_Str: game["Home_SP_Str"],
          Home_SP_GB: game["Home_SP_GB"],
          Home_SP_FB: game["Home_SP_FB"],
          Home_SP_LD: game["Home_SP_LD"],
          Home_BP_IP: game["Home_BP_IP"],
          Home_BP_HA: game["Home_BP_HA"],
          Home_BP_ERA: game["Home_BP_ERA"],
          Home_BP_BB: game["Home_BP_BB"],
          Home_BP_HRA: game["Home_BP_HRA"],
          Home_BP_SO: game["Home_BP_SO"],
          Home_BP_BF: game["Home_BP_BF"],
          Home_BP_Pit: game["Home_BP_Pit"],
          Home_BP_Str: game["Home_BP_Str"],
          Home_BP_GB: game["Home_BP_GB"],
          Home_BP_FB: game["Home_BP_FB"],
          Home_BP_LD: game["Home_BP_LD"],
          Home_Errors: game["homeErrors"],
          Away_AB: game["Away_AB"],
          Away_Hits: game["Away_Hits"],
          Away_RBI: game["Away_RBI"],
          Away_BB: game["Away_BB"],
          Away_PA: game["Away_PA"],
          Away_BA: game["Away_BA"],
          Away_OBP: game["Away_OBP"],
          Away_SLG: game["Away_SLG"],
          Away_OPS: game["Away_OPS"],
          Away_Pitches_Seen: game["Away_Pitches_Seen"],
          Away_Strikes_Taken: game["Away_Strikes_Taken"],
          Away_WPA: game["Away_WPA"],
          Away_BORA: game["Away_BORA"],
          Away_PO: game["Away_PO"],
          Away_AST: game["Away_AST"],
          Away_Starter: game["Away_Starter"],
          Away_SP_IP: game["Away_SP_IP"],
          Away_SP_HA: game["Away_SP_HA"],
          Away_SP_ERA: game["Away_SP_ERA"],
          Away_SP_BB: game["Away_SP_BB"],
          Away_SP_HRA: game["Away_SP_HRA"],
          Away_SP_SO: game["Away_SP_SO"],
          Away_SP_BF: game["Away_SP_BF"],
          Away_SP_Pit: game["Away_SP_Pit"],
          Away_SP_Str: game["Away_SP_Str"],
          Away_SP_GB: game["Away_SP_GB"],
          Away_SP_FB: game["Away_SP_FB"],
          Away_SP_LD: game["Away_SP_LD"],
          Away_BP_IP: game["Away_BP_IP"],
          Away_BP_HA: game["Away_BP_HA"],
          Away_BP_ERA: game["Away_BP_ERA"],
          Away_BP_BB: game["Away_BP_BB"],
          Away_BP_HRA: game["Away_BP_HRA"],
          Away_BP_SO: game["Away_BP_SO"],
          Away_BP_BF: game["Away_BP_BF"],
          Away_BP_Pit: game["Away_BP_Pit"],
          Away_BP_Str: game["Away_BP_Str"],
          Away_BP_GB: game["Away_BP_GB"],
          Away_BP_FB: game["Away_BP_FB"],
          Away_BP_LD: game["Away_BP_LD"],
          Away_Errors: game["awayErrors"]
        },
        {
          where: {
            Date: game["Date"],
            Home: game["Home"],
            Home_Runs: game["homeRuns"],
            Away_Runs: game["awayRuns"]
          },
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
  getMLBBoxScores: (req, res) => {
    console.log("REQ: ", req.query.season);
    var team = req.query.team;
    db.MLBScores.findAll({
      where: {
        $or: {
          Home: team,
          Away: team
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
  getNullGames: (req, res) => {
    console.log("REQ: ", req.query.season);
    var team = req.query.team;
    db.MLBScores.findAll({
      where: {
        Ballpark: null
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
  },
  mlbLoadBoxScores: (req, res) => {
    //console.log("REQ BODY: ", req.body.data);
    var gamesArr = req.body.data;
    //console.log("GAME 1: ", gamesArr[0]);
    for (var i = 0; i < gamesArr.length; i++) {
      var game = gamesArr[i];
      db.MLBScores.findOrCreate({
        where: {
          Date: game["date"],
          HW: game["HW"],
          Total_Runs: game["Total_Runs"],
          Home: game["Home"],
          Home_Runs: game["homeRuns"],
          Away: game["Away"],
          Away_Runs: game["awayRuns"]
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
  mlbUpdateBoxScores: (req, res) => {
    //console.log("REQ BODY: ", req.body.data);
    var gamesArr = req.body.data;
    //console.log("GAME 1: ", gamesArr[0]);
    for (var i = 0; i < gamesArr.length; i++) {
      var game = gamesArr[i];
      db.MLBScores.update(
        {
          HW: game["HW"],
          Total_Runs: game["Total_Runs"],
          Home_Runs: game["homeRuns"],
          Away: game["Away"],
          Away_Runs: game["awayRuns"]
        },
        {
          where: { Date: game["date"], Home: game["Home"] },
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
  }
};
