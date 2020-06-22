var axios = require("axios");
var players = [];

axios
  .get(
    "https://stats.gleague.nba.com/stats/leaguedashplayerbiostats?College=&Conference=&Country=&DateFrom=&DateTo=&Division=&DraftPick=&DraftYear=&GameScope=&GameSegment=&Height=&LastNGames=0&LeagueID=20&Location=&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PerMode=PerGame&Period=0&PlayerExperience=&PlayerPosition=&Season=2019-20&SeasonSegment=&SeasonType=Regular+Season&ShotClockRange=&StarterBench=&TeamID=0&VsConference=&VsDivision=&Weight="
  )
  .then(function (response) {
    //console.log(response.data.resultSets[0].rowSet);
    var playersArr = response.data.resultSets[0].rowSet;
    for (var i = 0; i < playersArr.length; i++) {
      var team = "";
      if (playersArr[i][3] === "ACC") team = "Agua Caliente Clippers";
      if (playersArr[i][3] === "AUS") team = "Austin Spurs";
      if (playersArr[i][3] === "CCG") team = "Capital City Go-Go";
      if (playersArr[i][3] === "CPS") team = "College Park Skyhawks";
      if (playersArr[i][3] === "CTN") team = "Canton Charge";
      if (playersArr[i][3] === "DEL") team = "Delaware Blue Coats";
      if (playersArr[i][3] === "ERI") team = "Erie BayHawks";
      if (playersArr[i][3] === "FWN") team = "Fort Wayne Mad Ants";
      if (playersArr[i][3] === "GBO") team = "Greensboro Swarm";
      if (playersArr[i][3] === "GRD") team = "Grand Rapids Drive";
      if (playersArr[i][3] === "IWA") team = "Iowa Wolves";
      if (playersArr[i][3] === "LAK") team = "Lakeland Magic";
      if (playersArr[i][3] === "LIN") team = "Long Island Nets";
      if (playersArr[i][3] === "MHU") team = "Memphis Hustle";
      if (playersArr[i][3] === "MNE") team = "Maine Red Claws";
      if (playersArr[i][3] === "NAS") team = "Northern Arizona Suns";
      if (playersArr[i][3] === "OKL") team = "Oklahoma City Blue";
      if (playersArr[i][3] === "RAP") team = "Raptors 905";
      if (playersArr[i][3] === "RGV") team = "Rio Grande Valley Vipers";
      if (playersArr[i][3] === "SBL") team = "South Bay Lakers";
      if (playersArr[i][3] === "SCW") team = "Santa Cruz Warriors";
      if (playersArr[i][3] === "SLC") team = "Salt Lake City Stars";
      if (playersArr[i][3] === "STO") team = "Stockton Kings";
      if (playersArr[i][3] === "SXF") team = "Sioux Falls Skyforce";
      if (playersArr[i][3] === "TEX") team = "Texas Legends";
      if (playersArr[i][3] === "WCB") team = "Windy City Bulls";
      if (playersArr[i][3] === "WES") team = "Westchester Knicks";
      if (playersArr[i][3] === "WIS") team = "Wisconsin Herd";

      var player = {};
      player["name"] = playersArr[i][1];
      player["team"] = team;
      player["age"] = playersArr[i][4].toString();
      player["height"] = playersArr[i][5];
      player["weight"] = playersArr[i][7];
      player["college"] = playersArr[i][8];
      player["draft"] = playersArr[i][11] + " " + playersArr[i][12];
      players.push(player);
    }
    //console.log(players);
    axios
      .post("http://localhost:3000/api/teams/postgPlayers", {
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
