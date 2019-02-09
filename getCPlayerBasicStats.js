//var axios = require("axios");
var allTeamStatsArr = [];

var casper = require("casper").create({
  viewportSize: {
    width: 1024,
    height: 768
  }
});

casper.start();

var teamAbbrv = [
  "baylor",
  "kansas",
  "arizona",
  "arizona-state",
  "california",
  "colorado",
  "oregon",
  "oregon-state",
  "stanford",
  "ucla",
  "southern-california",
  "utah",
  "washington",
  "washington-state",
  "alabama",
  "arkansas",
  "florida",
  "kentucky",
  "louisiana-state",
  "mississippi",
  "gonzaga",
  "duke",
  "florida-state",
  "north-carolina",
  "michigan-state",
  "villanova",
  "xavier",
  "west-virginia",
  "oklahoma",
  "virginia",
  "wichita-state",
  "clemson",
  "miami-fl",
  "syracuse",
  "notre-dame",
  "boston-college",
  "texas-tech",
  "virginia-tech",
  "kansas-state",
  "texas",
  "texas-christian",
  "seton-hall",
  "butler",
  "creighton",
  "purdue",
  "ohio-state",
  "maryland",
  "michigan",
  "texas-am",
  "cincinnati",
  "auburn",
  "houston",
  "tulsa",
  "central-florida",
  "temple",
  "memphis",
  "louisville",
  "north-carolina-state",
  "oklahoma-state",
  "providence",
  "nebraska",
  "penn-state",
  "tennessee",
  "missouri",
  "mississippi-state"
];

for (var i = 0; i < teamAbbrv.length; i++) {
  var team = teamAbbrv[i];
  var url =
    "https://www.sports-reference.com/cbb/schools/" + team + "/2018.html";
  var playerBasicStats;

  casper.thenOpen(url, function() {
    if (this.exists("#per_game tr")) {
      this.echo("found element!!!", "INFO");
    } else {
      this.echo("Did not find element!!", "ERROR");
    }
  });
  casper.then(function() {
    //GET TEAM BASIC STATS
    casper.wait(60000, function() {
      playerBasicStats = this.evaluate(getPlayerBasicInfo);
      for (var i = 0; i < playerBasicStats.length; i++) {
        allTeamStatsArr.push(playerBasicStats[i]);
      }
      //allTeamStatsArr.push(playerBasicStats);
      //this.echo("TEAM BASIC STATS");
      require("utils").dump(allTeamStatsArr);
    });
  });
}

var getPlayerBasicInfo = function() {
  var rows = document.querySelectorAll("#per_game tr");
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
      var games = playerInfo[1];
      player["Games"] = games.innerText;
      var minutes = playerInfo[3];
      player["MPG"] = minutes.innerText;
      var fg = playerInfo[4];
      player["FG"] = fg.innerText;
      var fga = playerInfo[5];
      player["FGA"] = fga.innerText;
      var fgpct = playerInfo[6];
      player["FG%"] = fgpct.innerText;
      var twoPoint = playerInfo[7];
      player["2P"] = twoPoint.innerText;
      var twoPointAtt = playerInfo[8];
      player["2PA"] = twoPointAtt.innerText;
      var twoPointPct = playerInfo[9];
      player["2P%"] = twoPointPct.innerText;
      var threePoint = playerInfo[10];
      player["3P"] = threePoint.innerText;
      var threePointAtt = playerInfo[11];
      player["3PA"] = threePointAtt.innerText;
      var threePointPct = playerInfo[12];
      player["3P%"] = threePointPct.innerText;
      var ft = playerInfo[13];
      player["FT"] = ft.innerText;
      var fta = playerInfo[14];
      player["FTA"] = fta.innerText;
      var ftpct = playerInfo[15];
      player["FT%"] = ftpct.innerText;
      var orb = playerInfo[16];
      player["ORB"] = orb.innerText;
      var drb = playerInfo[17];
      player["DRB"] = drb.innerText;
      var trb = playerInfo[18];
      player["TRB"] = trb.innerText;
      var ast = playerInfo[19];
      player["AST"] = ast.innerText;
      var stl = playerInfo[20];
      player["STL"] = stl.innerText;
      var blk = playerInfo[21];
      player["BLK"] = blk.innerText;
      var tov = playerInfo[22];
      player["TOV"] = tov.innerText;
      var pf = playerInfo[23];
      player["PF"] = pf.innerText;
      var pts = playerInfo[24];
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
  var fileName = "csv-college-player-basic/collegePlayerStats.csv";
  var filePath = fs.pathJoin(fs.workingDirectory, fileName);

  fs.write(filePath, result, "w");
  console.log(result);
  return result;
}
