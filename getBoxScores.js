//var axios = require("axios");
var allBoxScores = [];

var casper = require("casper").create({
  viewportSize: {
    width: 1024,
    height: 768
  }
});

casper.start();

var years = ["2017", "2016", "2015", "2014", "2013"];
var months = [
  "october",
  "november",
  "december",
  "january",
  "february",
  "march"
  //"april"
];

for (var i = 0; i < years.length; i++) {
  var year = years[i];
  for (var j = 0; j < months.length; j++) {
    var url =
      "https://www.basketball-reference.com/leagues/NBA_" +
      year +
      "_games-" +
      months[j] +
      ".html";
    var monthScores;

    casper.thenOpen(url, function() {
      if (this.exists("#schedule tr")) {
        this.echo("found element!!!", "INFO");
      } else {
        this.echo("Did not find element!!", "ERROR");
      }
    });
    casper.then(function() {
      //GET TEAM BASIC STATS
      casper.wait(60000, function() {
        monthScores = this.evaluate(getTeamBasicTotalStats);
        for (var i = 0; i < monthScores.length; i++) {
          allBoxScores.push(monthScores[i]);
        }
        //this.echo("TEAM BASIC STATS");
        require("utils").dump(allBoxScores);
      });
    });
  }
}

var getTeamBasicTotalStats = function() {
  // rows = array of games
  var rows = document.querySelectorAll("#schedule tr");
  var games = [];

  for (var i = 1; i < rows.length; i++) {
    var gameInfo = rows[i].querySelectorAll("td");
    var game = {};
    var datePlayed = rows[i].querySelector("a");
    var commaDate = datePlayed.innerText;
    var date = commaDate.replace(/,/g, "");
    game["Date"] = date;
    for (var j = 0; j < gameInfo.length; j++) {
      var start = gameInfo[0];
      game["Start_Time"] = start.innerText;
      var visitor = gameInfo[1];
      game["Visitor"] = visitor.innerText;
      var visitorPoints = gameInfo[2];
      game["Visitor_Pts"] = visitorPoints.innerText;
      var home = gameInfo[3];
      game["Home"] = home.innerText;
      var homePoints = gameInfo[4];
      game["Home_Pts"] = homePoints.innerText;
      game["Home_Diff"] =
        parseInt(homePoints.innerText) - parseInt(visitorPoints.innerText);

      if (parseInt(homePoints.innerText) > parseInt(visitorPoints.innerText)) {
        console.log("Home wins");
        game["HW"] = 1;
      } else {
        game["HW"] = 0;
        console.log("Away Wins");
      }
    }
    games.push(game);
  }
  // Get box scores info and add them to box score object
  return games;
};

casper.run(function() {
  outputToCsv(allBoxScores);
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
  var fileName = "csv-boxscores/" + month + "_" + day + "_" + year + ".csv";
  var filePath = fs.pathJoin(fs.workingDirectory, fileName);

  fs.write(filePath, result, "w");
  console.log(result);
  return result;
}
