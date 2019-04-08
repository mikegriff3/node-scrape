//var axios = require("axios");
var allBoxScores = [];

var casper = require("casper").create({
  viewportSize: {
    width: 1024,
    height: 768
  }
});

casper.start();

var years = ["2018"];
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
    if (dateText === "Today's Games") continue;
    var gameDate = dateText.split(", ");
    var gameRows = rows[i].querySelectorAll("p.game");
    for (var j = 0; j < gameRows.length; j++) {
      var game = {};
      game.date = gameDate[1] + " " + gameDate[2];
      var teams = gameRows[j].querySelectorAll("a");
      game.Away = teams[0].innerText;
      game.Home = teams[1].innerText;
      var gameStr = gameRows[j].innerText;
      var arr = gameStr.split(/[(|)]/);
      game.awayRuns = arr[1];
      game.homeRuns = arr[3];
      game["Total_Runs"] = parseInt(game.awayRuns) + parseInt(game.homeRuns);
      if (parseInt(game.homeRuns) > parseInt(game.awayRuns)) {
        game["HW"] = 1;
      } else {
        game["HW"] = 0;
      }
      games.push(game);
    }
    //games.push(game);
  }
  // Get box scores info and add them to box score object
  return games;
};

casper.run(function() {
  //outputToCsv(allBoxScores);
  this.exit();
});

// function getGameURL(date, homeTeam) {
//   this.echo("TEST COMMENT");
// var abr = getTeamAbr(homeTeam);
// var dateArr = date.split(" ");
// var year = dateArr[3];
// var gameMonth = getGameMonth(dateArr[1]);
// var gameDay = getGameDay(dateArr[2]);
// var date = year + gameMonth + gameDay + "0";
// var input = date + abr;
// var url = "https://www.basketball-reference.com/boxscores/" + input + ".html";
// return url;
//}

// function getGameDay(gameDay) {
//   if (gameDay.length < 2) {
//     return "0" + gameDay;
//   }
//   return gameDay;
// }

// function getGameMonth(month) {
//   var numMonth;
//   switch (month) {
//     case "Oct":
//       numMonth = "10";
//       break;
//     case "Nov":
//       numMonth = "11";
//       break;
//     case "Dec":
//       numMonth = "12";
//       break;
//     case "Jan":
//       numMonth = "01";
//       break;
//     case "Feb":
//       numMonth = "02";
//       break;
//     case "Mar":
//       numMonth = "03";
//       break;
//   }
//   return numMonth;
// }

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
  var fileName = "csv-boxscores/update_boxscores_mlb.csv";
  var filePath = fs.pathJoin(fs.workingDirectory, fileName);

  fs.write(filePath, result, "w");
  console.log(result);
  return result;
}

function getTeamAbr(team) {
  var abr = "";
  switch (team) {
    case "Atlanta Hawks":
      abr = "ATL";
      break;
    case "Brooklyn Nets":
      abr = "BRK";
      break;
    case "Boston Celtics":
      abr = "BOS";
      break;
    case "Charlotte Hornets":
      abr = "CHO";
      break;
    case "Chicago Bulls":
      abr = "CHI";
      break;
    case "Dallas Mavericks":
      abr = "DAL";
      break;
    case "Denver Nuggets":
      abr = "DEN";
      break;
    case "Detroit Pistons":
      abr = "DET";
      break;
    case "Golden State Warriors":
      abr = "GSW";
      break;
    case "Houston Rockets":
      abr = "HOU";
      break;
    case "Indiana Pacers":
      abr = "IND";
      break;
    case "Los Angeles Clippers":
      abr = "LAC";
      break;
    case "Los Angeles Lakers":
      abr = "LAL";
      break;
    case "Memphis Grizzlies":
      abr = "MEM";
      break;
    case "Milwaukee Bucks":
      abr = "MIL";
      break;
    case "Miami Heat":
      abr = "MIA";
      break;
    case "Minnesota Timberwolves":
      abr = "MIN";
      break;
    case "New Orleans Pelicans":
      abr = "NOP";
      break;
    case "New York Knicks":
      abr = "NYK";
      break;
    case "Oklahoma City Thunder":
      abr = "OKC";
      break;
    case "Orlando Magic":
      abr = "ORL";
      break;
    case "Philadelphia 76ers":
      abr = "PHI";
      break;
    case "Phoenix Suns":
      abr = "PHO";
      break;
    case "Portland Trail Blazers":
      abr = "POR";
      break;
    case "Sacramento Kings":
      abr = "SAC";
      break;
    case "San Antonio Spurs":
      abr = "SAS";
      break;
    case "Toronto Raptors":
      abr = "TOR";
      break;
    case "Utah Jazz":
      abr = "UTA";
      break;
    case "Washington Wizards":
      abr = "WAS";
      break;
    case "Cleveland Cavaliers":
      abr = "CLE";
      break;
  }
  return abr;
}
