var axios = require("axios");
var players = [];

axios
  .get(
    "https://stats.gleague.nba.com/stats/leaguedashplayerstats?College=&Conference=&Country=&DateFrom=&DateTo=&Division=&DraftPick=&DraftYear=&GameScope=&GameSegment=&Height=&LastNGames=0&LeagueID=20&Location=&MeasureType=Advanced&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=PerGame&Period=0&PlayerExperience=&PlayerPosition=&PlusMinus=N&Rank=N&Season=2019-20&SeasonSegment=&SeasonType=Regular+Season&ShotClockRange=&StarterBench=&TeamID=0&TwoWay=0&VsConference=&VsDivision=&Weight="
  )
  .then(function (response) {
    //console.log(response.data.resultSets[0].rowSet);
    var playersArr = response.data.resultSets[0].rowSet;
    for (var i = 0; i < playersArr.length; i++) {
      var player = {};
      player["name"] = playersArr[i][1];
      player["ORtg"] = playersArr[i][11].toString();
      player["DRtg"] = playersArr[i][14].toString();
      player["AST%"] = playersArr[i][19].toString();
      player["ORB%"] = playersArr[i][22].toString();
      player["DRB%"] = playersArr[i][23].toString();
      player["TRB%"] = playersArr[i][24].toString();
      player["eFG%"] = playersArr[i][27].toString();
      player["ts%"] = playersArr[i][28].toString();
      player["USG%"] = playersArr[i][29].toString();
      player["PIE"] = playersArr[i][35];
      players.push(player);
    }
    //console.log(players);
    axios
      .put("http://localhost:3000/api/teams/updategPlayersAdv", {
        data: players,
      })
      .then((data) => {
        console.log("SAVED SUCCESSFULLY");
      })
      .catch((err) => {
        console.log("Error posting to server", err);
      });
  })
  .catch(function (error) {
    console.log(error);
  });

// function outputToCsv(statsArr) {
//   var result, ctr, keys, columnDelimiter, lineDelimiter, data;
//   data = statsArr || null;
//   if (data == null || !data.length) {
//     console.log("No Data Found");
//     return null;
//   }
//   columnDelimiter = statsArr.columnDelimiter || ",";
//   lineDelimiter = statsArr.lineDelimiter || "\n";
//   keys = Object.keys(data[0]);
//   result = "";
//   result += keys.join(columnDelimiter);
//   result += lineDelimiter;
//   data.forEach(function (item) {
//     ctr = 0;
//     keys.forEach(function (key) {
//       if (ctr > 0) result += columnDelimiter;
//       result += item[key];
//       ctr++;
//     });
//     result += lineDelimiter;
//   });
//   //console.log(result);
//   var fs = require("fs");
//   var currentTime = new Date();
//   var month = currentTime.getMonth() + 1;
//   var day = currentTime.getDate();
//   var year = currentTime.getFullYear();
//   var fileName = "csv-gLeague/player-bio-20.csv";
//   var filePath = fs.pathJoin(fs.workingDirectory, fileName);

//   fs.write(filePath, result, "w");
//   console.log(result);
//   return result;
// }
