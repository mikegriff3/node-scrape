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
  var stream = fs.open("./mlb-csv-boxscores/update_2019_schedule.csv", "r");
  var line = stream.readLine();

  var i = 0;

  while (line) {
    var game = {};
    line = stream.readLine();
    var lineArr = line.split(",");
    if (lineArr[5] === undefined) continue;
    //console.log(lineArr[5]);
    var dateArr = lineArr[5].split(" ");
    var gameMonth = getGameMonth(dateArr[0]);
    var gameDay = getGameDay(dateArr[1]);
    var year = dateArr[2];
    var teamAbr = getTeamAbr(lineArr[2]);
    //var cap = lineArr[7];
    var gameUrl =
      "https://www.baseball-reference.com/boxes/" +
      teamAbr +
      "/" +
      teamAbr +
      year +
      gameMonth +
      gameDay +
      "0" +
      ".shtml";
    game["Date"] = dateArr[0] + " " + dateArr[1] + " " + dateArr[2];
    game["Home"] = lineArr[2];
    game["Away"] = lineArr[0];
    game["Game_URL"] = gameUrl;
    games.push(game);
    //i++;
  }

  stream.close();
  require("utils").dump(games);
});

casper.then(function() {
  for (var i = 0; i < games.length; i++) {
    var gameScores;
    casper.thenOpen(games[i].Game_URL, function() {
      if (this.exists("div.scorebox")) {
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
  var game = {};

  // GET HOME AND AWAY TEAM
  var teams = document.querySelectorAll(
    "div.scorebox > div > div > strong > a"
  );
  game.Away = teams[0].innerText;
  game.Home = teams[1].innerText;

  // GET GAME DATE
  var dateText = document.querySelectorAll("div.scorebox_meta > div");
  var tempDate = dateText[0].innerText;
  var spaceDate = tempDate.replace(/,/g, "");
  var arr = spaceDate.split(" ");
  game["Date"] = arr[1] + " " + arr[2] + " " + arr[3];

  // // // GET GAME TOTALS
  var game_total = document.querySelectorAll(
    "div.scorebox > div > div.scores > div.score"
  );
  var awayRuns = game_total[0].innerText;
  var homeRuns = game_total[1].innerText;

  // // Get Team Errors
  var error_total = document.querySelectorAll(
    "#content > div > table > tbody > tr > td.center"
  );
  var awayErrors = error_total[error_total.length / 2 - 1].innerText;
  var homeErrors = error_total[error_total.length - 1].innerText;

  // // Get Ballpark
  var venue = dateText[3].innerText;
  var venueArr = venue.split(" ");
  venueArr.shift();
  var ballpark = venueArr.join(" ");
  game["Ballpark"] = ballpark;

  var totals = document.querySelectorAll("tfoot > tr > td.right");
  // Get Away Team Game Stats
  game["Away_AB"] = totals[0].innerText;
  game["Away_Hits"] = totals[2].innerText;
  game["Away_RBI"] = totals[3].innerText;
  game["Away_BB"] = totals[4].innerText;
  game["Away_PA"] = totals[6].innerText;
  game["Away_BA"] = totals[7].innerText;
  game["Away_OBP"] = totals[8].innerText;
  game["Away_SLG"] = totals[9].innerText;
  game["Away_OPS"] = totals[10].innerText;
  game["Away_Pitches_Seen"] = totals[11].innerText;
  game["Away_Strikes_Taken"] = totals[12].innerText;
  game["Away_WPA"] = totals[13].innerText;
  game["Away_BORA"] = totals[17].innerText;
  game["Away_PO"] = totals[18].innerText;
  game["Away_AST"] = totals[19].innerText;

  var awayTag;
  if (game.Away === "Arizona Diamondbacks") {
    awayTag = "#ArizonaDiamondbackspitching > tbody > tr";
  } else if (game.Away === "St. Louis Cardinals") {
    awayTag = "#StLouisCardinalspitching > tbody > tr";
  } else {
    var awayNameArr = game["Away"].split(" ");
    awayTag = "#" + awayNameArr.join("") + "pitching" + " > tbody > tr";
  }

  var awayPitchingName = document.querySelectorAll(awayTag + " > th > a");
  game["Away_Starter"] = awayPitchingName[0].innerText;

  var awayStarterStats = document.querySelectorAll(awayTag + " > td");
  game["Away_SP_IP"] = awayStarterStats[0].innerText;
  game["Away_SP_HA"] = awayStarterStats[1].innerText;
  game["Away_SP_BB"] = awayStarterStats[4].innerText;
  game["Away_SP_SO"] = awayStarterStats[5].innerText;
  game["Away_SP_HRA"] = awayStarterStats[6].innerText;
  game["Away_SP_ERA"] = awayStarterStats[3].innerText;
  game["Away_SP_BF"] = awayStarterStats[8].innerText;
  game["Away_SP_Pit"] = awayStarterStats[9].innerText;
  game["Away_SP_Str"] = awayStarterStats[10].innerText;
  game["Away_SP_GB"] = awayStarterStats[14].innerText;
  game["Away_SP_FB"] = awayStarterStats[15].innerText;
  game["Away_SP_LD"] = awayStarterStats[16].innerText;

  game["Away_BP_IP"] = (
    parseFloat(totals[40].innerText) - parseFloat(game.Away_SP_IP)
  ).toString();
  game["Away_BP_HA"] = (
    parseFloat(totals[41].innerText) - parseFloat(game.Away_SP_HA)
  ).toString();
  game["Away_BP_BB"] = (
    parseFloat(totals[44].innerText) - parseFloat(game.Away_SP_BB)
  ).toString();
  game["Away_BP_SO"] = (
    parseFloat(totals[45].innerText) - parseFloat(game.Away_SP_SO)
  ).toString();
  game["Away_BP_HRA"] = (
    parseFloat(totals[46].innerText) - parseFloat(game.Away_SP_HRA)
  ).toString();
  game["Away_BP_ERA"] = (
    parseFloat(totals[43].innerText) - parseFloat(game.Away_SP_ERA)
  ).toString();
  game["Away_BP_BF"] = (
    parseFloat(totals[48].innerText) - parseFloat(game.Away_SP_BF)
  ).toString();
  game["Away_BP_Pit"] = (
    parseFloat(totals[49].innerText) - parseFloat(game.Away_SP_Pit)
  ).toString();
  game["Away_BP_Str"] = (
    parseFloat(totals[50].innerText) - parseFloat(game.Away_SP_Str)
  ).toString();
  game["Away_BP_GB"] = (
    parseFloat(totals[54].innerText) - parseFloat(game.Away_SP_GB)
  ).toString();
  game["Away_BP_FB"] = (
    parseFloat(totals[55].innerText) - parseFloat(game.Away_SP_FB)
  ).toString();
  game["Away_BP_LD"] = (
    parseFloat(totals[56].innerText) - parseFloat(game.Away_SP_LD)
  ).toString();

  var homeTag;
  if (game.Home === "Arizona Diamondbacks") {
    homeTag = "#ArizonaDiamondbackspitching > tbody > tr";
  } else if (game.Home === "St. Louis Cardinals") {
    homeTag = "#StLouisCardinalspitching > tbody > tr";
  } else {
    var homeNameArr = game["Home"].split(" ");
    homeTag = "#" + homeNameArr.join("") + "pitching" + " > tbody > tr";
  }

  var homePitchingName = document.querySelectorAll(homeTag + " > th > a");
  game["Home_Starter"] = homePitchingName[0].innerText;

  var homeStarterStats = document.querySelectorAll(homeTag + " > td");
  game["Home_SP_IP"] = homeStarterStats[0].innerText;
  game["Home_SP_HA"] = homeStarterStats[1].innerText;
  game["Home_SP_BB"] = homeStarterStats[4].innerText;
  game["Home_SP_SO"] = homeStarterStats[5].innerText;
  game["Home_SP_HRA"] = homeStarterStats[6].innerText;
  game["Home_SP_ERA"] = homeStarterStats[3].innerText;
  game["Home_SP_BF"] = homeStarterStats[8].innerText;
  game["Home_SP_Pit"] = homeStarterStats[9].innerText;
  game["Home_SP_Str"] = homeStarterStats[10].innerText;
  game["Home_SP_GB"] = homeStarterStats[14].innerText;
  game["Home_SP_FB"] = homeStarterStats[15].innerText;
  game["Home_SP_LD"] = homeStarterStats[16].innerText;

  game["Home_BP_IP"] = (
    parseFloat(totals[64].innerText) - parseFloat(game.Home_SP_IP)
  ).toString();
  game["Home_BP_HA"] = (
    parseFloat(totals[65].innerText) - parseFloat(game.Home_SP_HA)
  ).toString();
  game["Home_BP_BB"] = (
    parseFloat(totals[68].innerText) - parseFloat(game.Home_SP_BB)
  ).toString();
  game["Home_BP_SO"] = (
    parseFloat(totals[69].innerText) - parseFloat(game.Home_SP_SO)
  ).toString();
  game["Home_BP_HRA"] = (
    parseFloat(totals[70].innerText) - parseFloat(game.Home_SP_HRA)
  ).toString();
  game["Home_BP_ERA"] = (
    parseFloat(totals[67].innerText) - parseFloat(game.Home_SP_ERA)
  ).toString();
  game["Home_BP_BF"] = (
    parseFloat(totals[72].innerText) - parseFloat(game.Home_SP_BF)
  ).toString();
  game["Home_BP_Pit"] = (
    parseFloat(totals[73].innerText) - parseFloat(game.Home_SP_Pit)
  ).toString();
  game["Home_BP_Str"] = (
    parseFloat(totals[74].innerText) - parseFloat(game.Home_SP_Str)
  ).toString();
  game["Home_BP_GB"] = (
    parseFloat(totals[78].innerText) - parseFloat(game.Home_SP_GB)
  ).toString();
  game["Home_BP_FB"] = (
    parseFloat(totals[79].innerText) - parseFloat(game.Home_SP_FB)
  ).toString();
  game["Home_BP_LD"] = (
    parseFloat(totals[80].innerText) - parseFloat(game.Home_SP_LD)
  ).toString();

  // // Get Home Team Game Stats
  game["Home_AB"] = totals[20].innerText;
  game["Home_Hits"] = totals[22].innerText;
  game["Home_RBI"] = totals[23].innerText;
  game["Home_BB"] = totals[24].innerText;
  game["Home_PA"] = totals[26].innerText;
  game["Home_BA"] = totals[27].innerText;
  game["Home_OBP"] = totals[28].innerText;
  game["Home_SLG"] = totals[29].innerText;
  game["Home_OPS"] = totals[30].innerText;
  game["Home_Pitches_Seen"] = totals[31].innerText;
  game["Home_Strikes_Taken"] = totals[32].innerText;
  game["Home_WPA"] = totals[33].innerText;
  game["Home_BORA"] = totals[37].innerText;
  game["Home_PO"] = totals[38].innerText;
  game["Home_AST"] = totals[39].innerText;

  game.homeRuns = homeRuns;
  game.awayRuns = awayRuns;
  game.awayErrors = awayErrors;
  game.homeErrors = homeErrors;

  //console.log(game);
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
  var fileName = "mlb-csv-boxscores/update_boxscores_adv.csv";
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
    case "March":
      numMonth = "03";
      break;
    case "April":
      numMonth = "04";
      break;
    case "May":
      numMonth = "05";
      break;
    case "June":
      numMonth = "06";
      break;
    case "July":
      numMonth = "07";
      break;
    case "August":
      numMonth = "08";
      break;
    case "September":
      numMonth = "09";
      break;
    case "October":
      numMonth = "10";
      break;
    case "November":
      numMonth = "11";
      break;
  }
  return numMonth;
}

function getTeamAbr(team) {
  var abr = "";
  switch (team) {
    case "Arizona D'Backs":
      abr = "ARI";
      break;
    case "Atlanta Braves":
      abr = "ATL";
      break;
    case "Baltimore Orioles":
      abr = "BAL";
      break;
    case "Boston Red Sox":
      abr = "BOS";
      break;
    case "Chicago Cubs":
      abr = "CHN";
      break;
    case "Chicago White Sox":
      abr = "CHA";
      break;
    case "Cincinnati Reds":
      abr = "CIN";
      break;
    case "Cleveland Indians":
      abr = "CLE";
      break;
    case "Colorado Rockies":
      abr = "COL";
      break;
    case "Detroit Tigers":
      abr = "DET";
      break;
    case "Houston Astros":
      abr = "HOU";
      break;
    case "Kansas City Royals":
      abr = "KCA";
      break;
    case "LA Angels of Anaheim":
      abr = "ANA";
      break;
    case "Los Angeles Angels":
      abr = "ANA";
      break;
    case "Los Angeles Dodgers":
      abr = "LAN";
      break;
    case "Miami Marlins":
      abr = "MIA";
      break;
    case "Milwaukee Brewers":
      abr = "MIL";
      break;
    case "Minnesota Twins":
      abr = "MIN";
      break;
    case "New York Mets":
      abr = "NYN";
      break;
    case "New York Yankees":
      abr = "NYA";
      break;
    case "Oakland Athletics":
      abr = "OAK";
      break;
    case "Philadelphia Phillies":
      abr = "PHI";
      break;
    case "Pittsburgh Pirates":
      abr = "PIT";
      break;
    case "San Diego Padres":
      abr = "SDN";
      break;
    case "San Francisco Giants":
      abr = "SFN";
      break;
    case "Seattle Mariners":
      abr = "SEA";
      break;
    case "St. Louis Cardinals":
      abr = "SLN";
      break;
    case "Tampa Bay Rays":
      abr = "TBA";
      break;
    case "Texas Rangers":
      abr = "TEX";
      break;
    case "Toronto Blue Jays":
      abr = "TOR";
      break;
    case "Washington Nationals":
      abr = "WAS";
      break;
  }
  return abr;
}
