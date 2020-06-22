var axios = require("axios");
var teams = [];

axios
  .get(
    "https://stats.gleague.nba.com/stats/leaguedashteamstats?Conference=&DateFrom=&DateTo=&Division=&GameScope=&GameSegment=&LastNGames=0&LeagueID=20&Location=&MeasureType=Advanced&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=PerGame&Period=0&PlayerExperience=&PlayerPosition=&PlusMinus=N&Rank=N&Season=2019-20&SeasonSegment=&SeasonType=Regular+Season&ShotClockRange=&StarterBench=&TeamID=0&TwoWay=0&VsConference=&VsDivision="
  )
  .then(function (response) {
    //console.log(response.data.resultSets[0].rowSet);
    var teamsArr = response.data.resultSets[0].rowSet;
    for (var i = 0; i < teamsArr.length; i++) {
      var team = {};
      team["Name"] = teamsArr[i][1];
      team["ORtg"] = teamsArr[i][8];
      team["DRtg"] = teamsArr[i][10];
      team["ORB_PCT"] = teamsArr[i][16];
      team["DRB_PCT"] = teamsArr[i][17];
      team["OFF_TOV_PCT"] = teamsArr[i][19];
      team["OFF_eFG_PCT"] = teamsArr[i][20];
      team["PACE"] = teamsArr[i][23];
      teams.push(team);
    }
    console.log(teams);
    //outputToCsv(teams);
  })
  .catch(function (error) {
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
  data.forEach(function (item) {
    ctr = 0;
    keys.forEach(function (key) {
      if (ctr > 0) result += columnDelimiter;
      result += item[key];
      ctr++;
    });
    result += lineDelimiter;
  });
  //console.log(result);
  var fs = window.require("fs");
  var currentTime = new Date();
  var month = currentTime.getMonth() + 1;
  var day = currentTime.getDate();
  var year = currentTime.getFullYear();
  var fileName = "csv-gLeague/team-basic.csv";
  var filePath = fs.pathJoin(fs.workingDirectory, fileName);

  fs.write(filePath, result, "w");
  console.log(result);
  return result;
}
