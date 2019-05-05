//var axios = require("axios");
var allBoxScores = [];

var casper = require("casper").create({
  viewportSize: {
    width: 1024,
    height: 768
  }
});

casper.start();

var years = ["2019"];
// var months = [
//   //"october",
//   //"november",
//   //"december",
//   //"january",
//   //"february",
//   "march"
//   //"april"
// ];

for (var i = 0; i < years.length; i++) {
  var year = years[i];
  var url =
    "https://www.baseball-reference.com/leagues/MLB/" +
    year +
    "-schedule" +
    ".shtml";
  var monthScores;
  var gameUrl = "";

  casper.thenOpen(url, function() {
    if (this.exists("div h3")) {
      this.echo("found element!!!", "INFO");
    } else {
      this.echo("Did not find element!!", "ERROR");
    }
  });
  casper.then(function() {
    //GET TEAM BASIC STATS
    casper.wait(20000, function() {
      monthScores = this.evaluate(getGameInfo);
      for (var i = 0; i < monthScores.length; i++) {
        allBoxScores.push(monthScores[i]);
      }
      //this.echo("TEAM BASIC STATS");
      require("utils").dump(allBoxScores);
    });
  });
}

var getGameInfo = function() {
  // rows = array of games
  var rows = document.querySelectorAll("div.section_content div");
  var games = [];

  for (var i = 0; i < rows.length; i++) {
    var date = rows[i].querySelectorAll("h3");
    var dateText = date[0].innerText;
    var gameDate;
    if (dateText === "Today's Games") {
      dateText = "Saturday, May 4, 2019";
      gameDate = dateText.split(", ");
    } else {
      gameDate = dateText.split(", ");
    }
    var gameRows = rows[i].querySelectorAll("p.game");
    for (var j = 0; j < gameRows.length; j++) {
      var game = {};
      game.date = gameDate[1] + " " + gameDate[2];
      var teams = gameRows[j].querySelectorAll("a");
      game.Away = teams[0].innerText;
      game.Home = teams[1].innerText;
      var gameStr = gameRows[j].innerText;
      var arr = gameStr.split(/[(|)]/);
      if (arr.length === 5) {
        game.awayRuns = arr[1];
        game.homeRuns = arr[3];
      } else {
        game.awayRuns = "0";
        game.homeRuns = "0";
      }
      game["Total_Runs"] = parseInt(game.awayRuns) + parseInt(game.homeRuns);
      if (parseInt(game.homeRuns) > parseInt(game.awayRuns)) {
        game["HW"] = 1;
      } else {
        game["HW"] = 0;
      }
      if (game.date != "May 3 2019") continue;
      games.push(game);
    }
    //games.push(game);
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
  //var fileName = "csv-boxscores/" + month + "_" + day + "_" + year + ".csv";
  var fileName = "mlb-csv-boxscores/update_2019_schedule.csv";
  var filePath = fs.pathJoin(fs.workingDirectory, fileName);

  fs.write(filePath, result, "w");
  console.log(result);
  return result;
}
