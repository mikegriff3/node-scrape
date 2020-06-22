var axios = require("axios");
var teams = [];

axios
  .get(
    "https://stats.gleague.nba.com/stats/leaguedashteamstats?Conference=&DateFrom=&DateTo=&Division=&GameScope=&GameSegment=&LastNGames=0&LeagueID=20&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=PerGame&Period=0&PlayerExperience=&PlayerPosition=&PlusMinus=N&Rank=N&Season=2019-20&SeasonSegment=&SeasonType=Regular+Season&ShotClockRange=&StarterBench=&TeamID=0&TwoWay=0&VsConference=&VsDivision="
  )
  .then(function (response) {
    //console.log(response.data.resultSets[0].rowSet);
    var teamsArr = response.data.resultSets[0].rowSet;
    for (var i = 0; i < teamsArr.length; i++) {
      var team = {};
      team["Name"] = teamsArr[i][1];
      team["W"] = teamsArr[i][3];
      team["L"] = teamsArr[i][4];
      team["PTS"] = teamsArr[i][26];
      team["STL"] = teamsArr[i][21];
      team["BLK"] = teamsArr[i][22];
      team["FG"] = teamsArr[i][7];
      team["FGA"] = teamsArr[i][8];
      team["FG_PCT"] = teamsArr[i][9];
      team["Three_Pointers"] = teamsArr[i][10];
      team["Three_Pointers_Att"] = teamsArr[i][11];
      team["Three_Pointers_Pct"] = teamsArr[i][12];
      team["FTM"] = teamsArr[i][13];
      team["FTA"] = teamsArr[i][14];
      team["FT_Pct"] = teamsArr[i][15];
      team["ORB"] = teamsArr[i][16];
      team["DRB"] = teamsArr[i][17];
      team["TRB"] = teamsArr[i][18];
      team["AST"] = teamsArr[i][19];
      team["TOV"] = teamsArr[i][20];
      team["PF"] = teamsArr[i][24];
      team["MOV"] = teamsArr[i][27];
      teams.push(team);
    }
    console.log(teams);
    outputToCsv(teams);
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
