var allBoxScores = [];

var casper = require("casper").create({
  viewportSize: {
    width: 1024,
    height: 768
  }
});

casper.start();

var years = ["2019"];
var months = ["march"];

for (var i = 0; i < years.length; i++) {
  var year = years[i];
  for (var j = 0; j < months.length; j++) {
    var url =
      "https://www.basketball-reference.com/leagues/NBA_" +
      year +
      "_games-" +
      months[j] +
      ".html";

    casper.thenOpen(url, function() {
      if (this.exists("#schedule tr")) {
        this.echo("found element!!!", "INFO");
      } else {
        this.echo("Did not find element!!", "ERROR");
      }
    });
    casper.then(function() {
      casper.wait(10000, function() {
        var games = this.evaluate(getGames);
        for (var i = 0; i < games.length; i++) {
          allBoxScores.push(games[i]);
        }
        require("utils").dump(allBoxScores);
      });
    });
  }
}

casper.run(function() {
  outputToCsv(allBoxScores);
  this.exit();
});

var getGames = function() {
  // rows = array of games
  var today = new Date();
  var mm = today.getMonth() + 1;
  var dd = today.getDate();
  var yyyy = today.getFullYear();
  var todayDate = mm + dd + yyyy;
  var rows = document.querySelectorAll("#schedule tr");
  var games = [];

  for (var i = 1; i < rows.length; i++) {
    var gameInfo = rows[i].querySelectorAll("td");
    var datePlayed = rows[i].querySelector("a");
    var commaDate = datePlayed.innerText;
    var date = commaDate.replace(/,/g, "");
    var dateArr = date.split(" ");
    var newDate = dateArr[1] + " " + dateArr[2] + " " + dateArr[3];
    if ("Mar 30 2019" === newDate) {
      var game = {};
      game["Date"] = newDate;
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

        // if (parseInt(homePoints.innerText) > parseInt(visitorPoints.innerText)) {
        //   game["HW"] = 1;
        // } else {
        //   game["HW"] = 0;
        // }
      }
      games.push(game);
    }
  }
  // Get box scores info and add them to box score object
  return games;
};

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
  //var fileName = "csv-boxscores/test.csv";
  var filePath = fs.pathJoin(fs.workingDirectory, fileName);

  fs.write(filePath, result, "w");
  console.log(result);
  return result;
}
