var axios = require("axios");
var allBoxScores = [];

var casper = require("casper").create({
  viewportSize: {
    width: 1024,
    height: 768
  }
});

casper.start();

var games = [];

casper.then(function() {
  var fs = require("fs");
  var stream = fs.open("./csv-boxscores/fivePrevSeasons.csv", "r");
  var line = stream.readLine();

  var i = 0;

  while (line) {
    var game = {};
    line = stream.readLine();
    var lineArr = line.split(",");
    if (lineArr[0] === "") continue;
    console.log(lineArr);
    var dateArr = lineArr[0].split(" ");
    var gameMonth = getGameMonth(dateArr[1]);
    var gameDay = getGameDay(dateArr[2]);
    var year = dateArr[3];
    var teamAbr;
    if (lineArr[2] === "Charlotte Bobcats") {
      teamAbr = "CHA";
    } else {
      teamAbr = getTeamAbr(lineArr[2]);
    }
    var gameUrl =
      "https://www.basketball-reference.com/boxscores/" +
      year +
      gameMonth +
      gameDay +
      "0" +
      teamAbr +
      ".html";
    game["Date"] = dateArr[1] + " " + dateArr[2] + " " + dateArr[3];
    game["Home"] = lineArr[2];
    game["Visitor"] = lineArr[7];
    game["Game_URL"] = gameUrl;
    games.push(game);
    i++;
  }

  stream.close();
  require("utils").dump(games);
});

casper.then(function() {
  for (var i = 1500; i < 1600; i++) {
    var gameScores;
    casper.thenOpen(games[i].Game_URL, function() {
      if (this.exists("#content a")) {
        this.echo("found element!!!", "INFO");
      } else {
        this.echo("Did not find element!!", "ERROR");
      }
    });
    casper.then(function() {
      casper.wait(10000, function() {
        gameScores = this.evaluate(getGameInfo);
        for (var i = 0; i < gameScores.length; i++) {
          allBoxScores.push(gameScores[i]);
        }
        //this.echo("TEAM BASIC STATS");
        require("utils").dump(allBoxScores);
      });
    });
  }
});

var getGameInfo = function() {
  var games = [];
  var injured = [];
  var refs = [];
  var game = {};

  // GET HOME AND AWAY TEAM
  var teams = document.querySelectorAll(
    "div.scorebox > div > div > strong > a"
  );
  game.Visitor = teams[0].innerText;
  game.Home = teams[1].innerText;

  // GET GAME DATE
  var dateText = document.querySelectorAll("div.scorebox_meta > div");
  var tempDate = dateText[0].innerText;
  var spaceDate = tempDate.replace(/,/g, "");
  var arr = spaceDate.split(" ");
  var numMonth;
  switch (arr[2]) {
    case "October":
      numMonth = "Oct";
      break;
    case "November":
      numMonth = "Nov";
      break;
    case "December":
      numMonth = "Dec";
      break;
    case "January":
      numMonth = "Jan";
      break;
    case "February":
      numMonth = "Feb";
      break;
    case "March":
      numMonth = "Mar";
      break;
  }
  game["Date"] = numMonth + " " + arr[3] + " " + arr[4];
  //game["Date"] = tempDate;

  // GET INJURIES AND REFS
  var rows = document.querySelectorAll("div#content > div > a");
  for (var i = 0; i < rows.length - 3; i++) {
    injured.push(rows[i].innerText);
  }
  for (var j = rows.length - 3; j < rows.length; j++) {
    refs.push(rows[j].innerText);
  }

  // GET GAME TOTALS
  var game_total = document.querySelectorAll(
    "#line_score > tbody > tr > td > strong"
  );
  var homePts = game_total[0].innerText;
  var awayPts = game_total[1].innerText;

  // GET TEAM TOTALS
  var team_totals = document.querySelectorAll("tfoot > tr > td.right");
  game.Home_FG = team_totals[1].innerText;
  game.Home_FGA = team_totals[2].innerText;
  game.Home_3P = team_totals[4].innerText;
  game.Home_3PA = team_totals[5].innerText;
  game.Home_FTM = team_totals[7].innerText;
  game.Home_FTA = team_totals[8].innerText;
  game.Home_ORB = team_totals[10].innerText;
  game.Home_TRB = team_totals[12].innerText;
  game.Home_AST = team_totals[13].innerText;
  game.Home_STL = team_totals[14].innerText;
  game.Home_ORB_PCT = team_totals[25].innerText;
  game.Home_BLK_PCT = team_totals[30].innerText;
  game.Home_TOV_PCT = team_totals[31].innerText;

  game.Away_FG = team_totals[1 + 35].innerText;
  game.Away_FGA = team_totals[2 + 35].innerText;
  game.Away_3P = team_totals[4 + 35].innerText;
  game.Away_3PA = team_totals[5 + 35].innerText;
  game.Away_FTM = team_totals[7 + 35].innerText;
  game.Away_FTA = team_totals[8 + 35].innerText;
  game.Away_ORB = team_totals[10 + 35].innerText;
  game.Away_TRB = team_totals[12 + 35].innerText;
  game.Away_AST = team_totals[13 + 35].innerText;
  game.Away_STL = team_totals[14 + 35].innerText;
  game.Away_ORB_PCT = team_totals[25 + 35].innerText;
  game.Away_BLK_PCT = team_totals[30 + 35].innerText;
  game.Away_TOV_PCT = team_totals[31 + 35].innerText;

  var strInj = JSON.stringify(injured);
  var newStr = strInj.replace(/,/g, "|");
  var strRef = JSON.stringify(refs);
  var refStr = strRef.replace(/,/g, "|");

  //game.test = newStr;
  game.Injuries = newStr;
  game.Referees = refStr;
  game.homePts = homePts;
  game.awayPts = awayPts;

  games.push(game);
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
  var fileName = "csv-boxscores/update_boxscores_injury16.csv";
  var filePath = fs.pathJoin(fs.workingDirectory, fileName);

  fs.write(filePath, result, "w");
  console.log(result);
  return result;
}

function getGameDay(gameDay) {
  if (gameDay.length < 2) {
    return "0" + gameDay;
  }
  return gameDay;
}

function getGameMonth(month) {
  var numMonth;
  switch (month) {
    case "Oct":
      numMonth = "10";
      break;
    case "Nov":
      numMonth = "11";
      break;
    case "Dec":
      numMonth = "12";
      break;
    case "Jan":
      numMonth = "01";
      break;
    case "Feb":
      numMonth = "02";
      break;
    case "Mar":
      numMonth = "03";
      break;
  }
  return numMonth;
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
