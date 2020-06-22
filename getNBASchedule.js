var allTeamStatsArr = [];

var casper = require("casper").create({
  viewportSize: {
    width: 1024,
    height: 768,
  },
});

casper.start();

var teamAbbrv = [
  //"",
  //"-november",
  //"-december",
  //"-january",
  //"-february",
  "-march",
];

for (var i = 0; i < teamAbbrv.length; i++) {
  var team = teamAbbrv[i];
  var url =
    "https://www.basketball-reference.com/leagues/NBA_2020_games" +
    team +
    ".html";
  var playerBasicStats;

  casper.thenOpen(url, function () {
    if (this.exists("#schedule tr")) {
      this.echo("found element!!!", "INFO");
    } else {
      this.echo("Did not find element!!", "ERROR");
    }
  });
  casper.then(function () {
    //GET TEAM BASIC STATS
    casper.wait(30000, function () {
      playerBasicStats = this.evaluate(getPlayerStats);
      for (var i = 0; i < playerBasicStats.length; i++) {
        allTeamStatsArr.push(playerBasicStats[i]);
      }
      //allTeamStatsArr.push(playerBasicStats);
      //this.echo("TEAM BASIC STATS");
      require("utils").dump(allTeamStatsArr);
      //require("utils").dump(playerBasicStats);
    });
  });
}

var getPlayerStats = function () {
  var rows = document.querySelectorAll("#schedule tr");
  var players = [];

  for (var i = 1; i < rows.length; i++) {
    var game = {};
    var gameInfo = rows[i].querySelectorAll("td");
    var regex = new RegExp(",", "g");
    var gameDate = rows[i].querySelectorAll("a");
    var date = gameDate[0].innerText;
    game.date = date.replace(regex, "");
    game.start = gameInfo[0].innerText;
    game.visitor = gameDate[1].innerText;
    game.visitorPts = gameInfo[2].innerText;
    game.home = gameDate[2].innerText;
    game.homePts = gameInfo[4].innerText;
    var attend = gameInfo[7].innerText;
    game.attend = attend.replace(regex, "");

    players.push(game);
  }
  return players;
};

casper.run(function () {
  outputToCsv(allTeamStatsArr);
  this.exit();
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
  var fs = require("fs");
  var currentTime = new Date();
  var month = currentTime.getMonth() + 1;
  var day = currentTime.getDate();
  var year = currentTime.getFullYear();
  var fileName = "nba-schedule-csv/schedule-Mar-20.csv";
  var filePath = fs.pathJoin(fs.workingDirectory, fileName);

  fs.write(filePath, result, "w");
  console.log(result);
  return result;
}
