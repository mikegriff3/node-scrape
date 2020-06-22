var allTeamStatsArr = [];

var casper = require("casper").create({
  viewportSize: {
    width: 1024,
    height: 768
  }
});

casper.start();

var teamAbbrv = [
  "ATL",
  "BRK",
  "BOS",
  "CHO",
  "CHI",
  "CLE",
  "DAL",
  "DEN",
  "DET",
  "GSW",
  "HOU",
  "IND",
  "LAC",
  "LAL",
  "MEM",
  "MIA",
  "MIL",
  "MIN",
  "NOP",
  "NYK",
  "OKC",
  "ORL",
  "PHI",
  "PHO",
  "POR",
  "SAC",
  "SAS",
  "TOR",
  "UTA",
  "WAS"
];

for (var i = 0; i < teamAbbrv.length; i++) {
  var team = teamAbbrv[i];
  var url = "https://www.basketball-reference.com/contracts/" + team + ".html";
  var playerBasicStats;

  casper.thenOpen(url, function() {
    if (this.exists("#contracts tr")) {
      this.echo("found element!!!", "INFO");
    } else {
      this.echo("Did not find element!!", "ERROR");
    }
  });
  casper.then(function() {
    //GET TEAM BASIC STATS
    casper.wait(30000, function() {
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

var getPlayerStats = function() {
  var rows = document.querySelectorAll("#contracts tr");
  var metas = document.querySelectorAll("#content h1");
  var players = [];

  // Set team for all players
  var temp = metas[0].innerText;
  var teamArr = temp.split(" ");
  var team;
  if (teamArr[2] === "Team") {
    team = teamArr[0] + " " + teamArr[1];
  } else {
    team = teamArr[0] + " " + teamArr[1] + " " + teamArr[2];
  }

  // Loop through every player
  for (var i = 2; i < rows.length - 1; i++) {
    var playerInfo = rows[i].querySelectorAll("td");
    var playerName = rows[i].querySelectorAll("a");
    var player = {};
    if (playerInfo.length > 1 && playerName.length > 0) {
      var regex = new RegExp(",", "g");
      var yearTwoOption = playerInfo[2].getAttribute("class");
      var yearThreeOption = playerInfo[3].getAttribute("class");
      var yearFourOption = playerInfo[4].getAttribute("class");
      var yearFiveOption = playerInfo[5].getAttribute("class");
      var yearSixOption = playerInfo[6].getAttribute("class");
      player["team"] = team;
      player["name"] = playerName[0].innerText;
      player["age"] = playerInfo[0].innerText;
      var yearOne = playerInfo[1].innerText;
      var yearTwo = playerInfo[2].innerText;
      var yearThree = playerInfo[3].innerText;
      var yearFour = playerInfo[4].innerText;
      var yearFive = playerInfo[5].innerText;
      var yearSix = playerInfo[6].innerText;
      var guaranteed = playerInfo[8].innerText;
      player["y1"] = yearOne.replace(regex, "");
      player["y2"] = yearTwo.replace(regex, "");
      player["y3"] = yearThree.replace(regex, "");
      player["y4"] = yearFour.replace(regex, "");
      player["y5"] = yearFive.replace(regex, "");
      player["y6"] = yearSix.replace(regex, "");
      player["signedUsing"] = playerInfo[7].innerText;
      player["guaranteed"] = guaranteed.replace(regex, "");

      if (yearTwoOption === "right salary-pl") {
        yearTwoOption = "Player";
      } else if (yearTwoOption === "right salary-tm") {
        yearTwoOption = "Team";
      } else if (yearTwoOption === "right salary-et") {
        yearTwoOption = "Early Termination";
      } else {
        yearTwoOption = "None";
      }

      if (yearThreeOption === "right salary-pl") {
        yearThreeOption = "Player";
      } else if (yearThreeOption === "right salary-tm") {
        yearThreeOption = "Team";
      } else if (yearThreeOption === "right salary-et") {
        yearThreeOption = "Early Termination";
      } else {
        yearThreeOption = "None";
      }

      if (yearFourOption === "right salary-pl") {
        yearFourOption = "Player";
      } else if (yearFourOption === "right salary-tm") {
        yearFourOption = "Team";
      } else if (yearFourOption === "right salary-et") {
        yearFourOption = "Early Termination";
      } else {
        yearFourOption = "None";
      }

      if (yearFiveOption === "right salary-pl") {
        yearFiveOption = "Player";
      } else if (yearFiveOption === "right salary-tm") {
        yearFiveOption = "Team";
      } else if (yearFiveOption === "right salary-et") {
        yearFiveOption = "Early Termination";
      } else {
        yearFiveOption = "None";
      }

      if (yearSixOption === "right salary-pl") {
        yearSixOption = "Player";
      } else if (yearSixOption === "right salary-tm") {
        yearSixOption = "Team";
      } else if (yearSixOption === "right salary-et") {
        yearSixOption = "Early Termination";
      } else {
        yearSixOption = "None";
      }

      player["y2option"] = yearTwoOption;
      player["y3option"] = yearThreeOption;
      player["y4option"] = yearFourOption;
      player["y5option"] = yearFiveOption;
      player["y6option"] = yearSixOption;
      players.push(player);
    }
  }
  return players;
};

var getOption = function(cl) {
  if (cl === "right salary-pl") {
    return "Player";
  } else if (cl === "right salary-tm") {
    return "Team";
  } else if (cl === "right salary-et") {
    return "Early Termination";
  } else {
    return "None";
  }
};

var getPlayerBasicStats = function() {
  var rows = document.querySelectorAll("#per_game tr");
  var advanced = document.querySelectorAll("#advanced tr");
  var players = [];

  // rows = array of players
  for (var i = 1; i < rows.length; i++) {
    var playerInfo = rows[i].querySelectorAll("td");
    // playerInfo = array of tds or stats.
    var player = {};
    for (var j = 0; j < playerInfo.length; j++) {
      var name = playerInfo[0];
      name = name.innerText;
      var nameStr = name.replace(/,/g, "");
      player["Name"] = nameStr;
      var age = playerInfo[1];
      player["Age"] = age.innerText;
      var games = playerInfo[2];
      player["GP"] = games.innerText;
      var started = playerInfo[3];
      player["GS"] = started.innerText;
      var minutes = playerInfo[4];
      player["MPG"] = minutes.innerText;
      var fg = playerInfo[5];
      player["FG"] = fg.innerText;
      var fga = playerInfo[6];
      player["FGA"] = fga.innerText;
      var fgpct = playerInfo[7];
      player["FGPCT"] = fgpct.innerText;
      var threes = playerInfo[8];
      player["3P"] = threes.innerText;
      var threesAtt = playerInfo[9];
      player["3PA"] = threesAtt.innerText;
      var threesPct = playerInfo[10];
      player["3PCT"] = threesPct.innerText;
      var twos = playerInfo[11];
      player["2P"] = twos.innerText;
      var twosAtt = playerInfo[12];
      player["2PA"] = twosAtt.innerText;
      var twosPct = playerInfo[13];
      player["2PCT"] = twosPct.innerText;
      var efg = playerInfo[14];
      player["eFG"] = efg.innerText;
      var ft = playerInfo[15];
      player["FT"] = ft.innerText;
      var fta = playerInfo[16];
      player["FTA"] = fta.innerText;
      var ftpct = playerInfo[17];
      player["FTPCT"] = ftpct.innerText;
      var orb = playerInfo[18];
      player["ORB"] = orb.innerText;
      var drb = playerInfo[19];
      player["DRB"] = drb.innerText;
      var trb = playerInfo[20];
      player["TRB"] = trb.innerText;
      var ast = playerInfo[21];
      player["AST"] = ast.innerText;
      var stl = playerInfo[22];
      player["STL"] = stl.innerText;
      var blk = playerInfo[23];
      player["BLK"] = blk.innerText;
      var tov = playerInfo[24];
      player["TOV"] = tov.innerText;
      var pf = playerInfo[25];
      player["PF"] = pf.innerText;
      var pts = playerInfo[26];
      player["PTS"] = pts.innerText;
    }
    players.push(player);
  }
  return players;
};

casper.run(function() {
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
  var fileName = "player-sal/player-sals-20.csv";
  var filePath = fs.pathJoin(fs.workingDirectory, fileName);

  fs.write(filePath, result, "w");
  console.log(result);
  return result;
}
