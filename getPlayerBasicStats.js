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
  var url = "https://www.basketball-reference.com/teams/" + team + "/2019.html";
  var playerBasicStats;
  //console.log(team);

  casper.thenOpen(url, function() {
    if (this.exists("#advanced tr")) {
      this.echo("found element!!!", "INFO");
    } else {
      this.echo("Did not find element!!", "ERROR");
    }
  });
  casper.then(function() {
    //GET TEAM BASIC STATS
    casper.wait(30000, function() {
      playerBasicStats = this.evaluate(getPlayerBasicStats);
      for (var i = 0; i < playerBasicStats.length; i++) {
        allTeamStatsArr.push(playerBasicStats[i]);
      }
      //allTeamStatsArr.push(playerBasicStats);
      //this.echo("TEAM BASIC STATS");
      require("utils").dump(allTeamStatsArr);
    });
  });
}

var getPlayerStats = function() {
  var playersProfile = document.querySelectorAll("#roster tr");
  var metas = document.querySelectorAll("#meta span");
  var rows = document.querySelectorAll("#team_and_opponent td");
  var advanced = document.querySelectorAll("#team_misc td");
  var players = [];

  for (var i = 1; i < playersProfile.length; i++) {
    var playerAdvanced = playersProfile[i].querySelectorAll("td");
    // playerAdvanced = array of tds or stats.
    var player = {};
    for (var j = 0; j < playerAdvanced.length; j++) {
      var team = metas[1];
      player["team"] = team.innerText;
      var name = playerAdvanced[0];
      name = name.innerText;
      var nameStr = name.replace(/,/g, "");
      player["Name"] = nameStr;
      var position = playerAdvanced[1];
      player["Position"] = position.innerText;
      var height = playerAdvanced[2];
      player["Height"] = height.innerText;
      var weight = playerAdvanced[3];
      player["Weight"] = weight.innerText;
      var experience = playerAdvanced[6];
      player["Experience"] = experience.innerText;
      var college = playerAdvanced[7];
      college = college.innerText;
      var collegeStr = college.replace(/,/g, "");
      player["College"] = collegeStr;
    }
    players.push(player);
  }

  return players;
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

var getPlayerAdvancedStats = function() {
  var advanced = document.querySelectorAll("#advanced tr");
  var players = [];

  // advanced = array of players
  for (var i = 1; i < advanced.length; i++) {
    var playerAdvanced = advanced[i].querySelectorAll("td");
    // playerAdvanced = array of tds or stats.
    var player = {};
    for (var j = 0; j < playerAdvanced.length; j++) {
      var name = playerAdvanced[0];
      player["Name"] = name.innerText;
      var per = playerAdvanced[4];
      player["PER"] = per.innerText;
      var ts = playerAdvanced[5];
      player["TS%"] = ts.innerText;
      var threePAr = playerAdvanced[6];
      player["3PAr"] = threePAr.innerText;
      var ftr = playerAdvanced[7];
      player["FTr"] = ftr.innerText;
      var orbpct = playerAdvanced[8];
      player["ORB%"] = orbpct.innerText;
      var drbpct = playerAdvanced[9];
      player["DRB%"] = drbpct.innerText;
      var trbpct = playerAdvanced[10];
      player["TRB%"] = trbpct.innerText;
      var astpct = playerAdvanced[11];
      player["AST%"] = astpct.innerText;
      var stlpct = playerAdvanced[12];
      player["STL%"] = stlpct.innerText;
      var blkpct = playerAdvanced[13];
      player["BLK%"] = blkpct.innerText;
      var tovpct = playerAdvanced[14];
      player["TOV%"] = tovpct.innerText;
      var usgpct = playerAdvanced[15];
      player["USG%"] = usgpct.innerText;
      var ows = playerAdvanced[17];
      player["OWS"] = ows.innerText;
      var dws = playerAdvanced[18];
      player["DWS"] = dws.innerText;
      var ws = playerAdvanced[19];
      player["WS"] = ws.innerText;
      var wsfortyeight = playerAdvanced[20];
      player["WS/48"] = wsfortyeight.innerText;
      var obpm = playerAdvanced[22];
      player["OBPM"] = obpm.innerText;
      var dbpm = playerAdvanced[23];
      player["DBPM"] = dbpm.innerText;
      var bpm = playerAdvanced[24];
      player["BPM"] = bpm.innerText;
      var vorp = playerAdvanced[25];
      player["VORP"] = vorp.innerText;
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
  var fileName = "player-csv/player-basic-stats-19.csv";
  var filePath = fs.pathJoin(fs.workingDirectory, fileName);

  fs.write(filePath, result, "w");
  console.log(result);
  return result;
}
