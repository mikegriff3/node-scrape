var axios = require("axios");
var players = [];

axios
  .get(
    "https://stats.nba.com/stats/leaguedashptstats?College=&Conference=&Country=&DateFrom=&DateTo=&Division=&DraftPick=&DraftYear=&GameScope=&Height=&LastNGames=0&LeagueID=00&Location=&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PerMode=PerGame&PlayerExperience=&PlayerOrTeam=Player&PlayerPosition=&PtMeasureType=PostTouch&Season=2017-18&SeasonSegment=&SeasonType=Regular+Season&StarterBench=&TeamID=0&VsConference=&VsDivision=&Weight="
  )
  .then(function(response) {
    var playersArr = response.data.resultSets[0].rowSet;
    for (var i = 0; i < playersArr.length; i++) {
      var player = {};
      player["Name"] = playersArr[i][1];
      player["touches"] = playersArr[i][8];
      player["postUps"] = playersArr[i][9];
      player["fgm"] = playersArr[i][10];
      player["fga"] = playersArr[i][11];
      player["fgPct"] = playersArr[i][12];
      player["ftm"] = playersArr[i][13];
      player["fta"] = playersArr[i][14];
      player["ftPct"] = playersArr[i][15];
      player["pts"] = playersArr[i][16];
      player["ptsPct"] = playersArr[i][17];
      player["pass"] = playersArr[i][18];
      player["passPct"] = playersArr[i][19];
      player["ast"] = playersArr[i][20];
      player["astPct"] = playersArr[i][21];
      player["tov"] = playersArr[i][22];
      player["tovPct"] = playersArr[i][23];
      player["pf"] = playersArr[i][24];
      player["pfPct"] = playersArr[i][25];
      players.push(player);
    }
    outputToCsv(players);
  })
  .catch(function(error) {
    console.log(error);
  });

function outputToCsv(statsArr) {
  var result, ctr, keys, columnDelimiter, lineDelimiter, data;
  data = statsArr || null;
  if (data == null || !data.length) {
    console.log("No Data Found");
    return null;
  }
  columnDelimiter = statsArr.columnDelimiter || ",";
  lineDelimiter = statsArr.lineDelimiter || "\n";
  keys = Object.keys(data[0]);
  result = "";
  result += keys.join(columnDelimiter);
  result += lineDelimiter;
  data.forEach(function(item) {
    ctr = 0;
    keys.forEach(function(key) {
      if (ctr > 0) result += columnDelimiter;
      result += item[key];
      ctr++;
    });
    result += lineDelimiter;
  });
  //console.log(result);
  var fs = require("fs");
  var currentTime = new Date();
  var month = currentTime.getMonth() + 1;
  var day = currentTime.getDate();
  var year = currentTime.getFullYear();
  var fileName = "nba-tracking/player-postup.csv";
  var filePath = fs.pathJoin(fs.workingDirectory, fileName);

  fs.write(filePath, result, "w");
  console.log(result);
  return result;
}
