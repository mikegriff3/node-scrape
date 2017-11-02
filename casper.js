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
  var url = "https://www.basketball-reference.com/teams/" + team + "/2018.html";
  var teamBasicStats;

  casper.thenOpen(url, function() {
    if (this.exists("#advanced tr")) {
      this.echo("found element!!!", "INFO");
    } else {
      this.echo("Did not find element!!", "ERROR");
    }
  });
  casper.then(function() {
    //GET TEAM BASIC STATS
    casper.wait(60000, function() {
      teamBasicStats = this.evaluate(getTeamBasicTotalStats);
      allTeamStatsArr.push(teamBasicStats[0]);
      //this.echo("TEAM BASIC STATS");
      require("utils").dump(allTeamStatsArr);
    });

    // // GET TEAM ADVANCED STATS
    // casper.wait(60000, function() {
    //   this.echo("I just waited 1 minute");
    //   var teamAdvancedStats = this.evaluate(getTeamAdvancedStats);
    //   this.echo("TEAM ADVANCED STATS");
    //   require("utils").dump(teamAdvancedStats);
    // });
    // // GET OPPONENT BASIC STATS
    // casper.wait(60000, function() {
    //   this.echo("I just waited 1 minute");
    //   var opponentBasicStats = this.evaluate(getOpponentBasicTotalStats);
    //   this.echo("OPPONENT BASIC STATS");
    //   require("utils").dump(opponentBasicStats);
    // });
    // // GET PLAYER BASIC STATS
    // casper.wait(60000, function() {
    //   this.echo("I just waited 1 minute");
    //   var playerBasicStats = this.evaluate(getPlayerBasicStats);
    //   this.echo("PLAYER BASIC STATS");
    //   require("utils").dump(playerBasicStats);
    // });
    // // GET PLAYER ADVANCED STATS
    // casper.wait(60000, function() {
    //   this.echo("I just waited 1 minute");
    //   var playerAdvancedStats = this.evaluate(getPlayerAdvancedStats);
    //   this.echo("PLAYER ADVANCED STATS");
    //   require("utils").dump(playerAdvancedStats);
    // });
  });
}

// casper.then(function() {
//   require("utils").dump(allTeamStatsArr);
//   casper.open(
//     "http://localhost:8000/api/teamStats/updateTeam",
//     {
//       method: "post",
//       data: allTeamStatsArr
//     },
//     this.echo("POST sent")
//   );
// });

// var saveStats = function(stats) {
//   casper.echo("HERE ARE STATS");
//   require("utils").dump(stats);
//   casper.open(
//     "http://localhost:8000/api/teamStats/updateTeam",
//     {
//       method: "post",
//       data: stats
//     },
//     casper.echo("POST sent")
//   );
// };

var getTeamBasicTotalStats = function() {
  var metas = document.querySelectorAll("#meta span");
  var rows = document.querySelectorAll("#team_and_opponent td");
  var advanced = document.querySelectorAll("#team_misc td");
  var stats = [];
  var statObj = {};

  // Get stats and add them to stat object
  var name = metas[1];
  statObj["team"] = name.innerText;
  var gp = rows[0];
  statObj["gamesPlayed"] = gp.innerText;
  var fg = rows[2];
  statObj["FG"] = fg.innerText;
  var fga = rows[3];
  statObj["FGA"] = fga.innerText;
  var fgpct = rows[4];
  statObj["FGPCT"] = fgpct.innerText;
  var threes = rows[5];
  statObj["3P"] = threes.innerText;
  var threesAtt = rows[6];
  statObj["3PA"] = threesAtt.innerText;
  var threesPct = rows[7];
  statObj["3PCT"] = threesPct.innerText;
  var twos = rows[8];
  statObj["2P"] = twos.innerText;
  var twosAtt = rows[9];
  statObj["2PA"] = twosAtt.innerText;
  var twosPct = rows[10];
  statObj["2PCT"] = twosPct.innerText;
  var ft = rows[11];
  statObj["FTM"] = ft.innerText;
  var fta = rows[12];
  statObj["FTA"] = fta.innerText;
  var ftp = rows[13];
  statObj["FTPCT"] = ftp.innerText;
  var orb = rows[14];
  statObj["ORB"] = orb.innerText;
  var drb = rows[15];
  statObj["DRB"] = drb.innerText;
  var trb = rows[16];
  statObj["TRB"] = trb.innerText;
  var ast = rows[17];
  statObj["AST"] = ast.innerText;
  var stl = rows[18];
  statObj["STL"] = stl.innerText;
  var blk = rows[19];
  statObj["BLK"] = blk.innerText;
  var tov = rows[20];
  statObj["TOV"] = tov.innerText;
  var pf = rows[21];
  statObj["PF"] = pf.innerText;
  var pts = rows[22];
  statObj["PTS"] = pts.innerText;

  // ***** ADVANCED *****
  var w = advanced[0];
  statObj["W"] = w.innerText;
  var l = advanced[1];
  statObj["L"] = l.innerText;
  var pw = advanced[2];
  statObj["PW"] = pw.innerText;
  var pl = advanced[3];
  statObj["PL"] = pl.innerText;
  var mov = advanced[4];
  statObj["MOV"] = mov.innerText;
  var sos = advanced[5];
  statObj["SOS"] = sos.innerText;
  var srs = advanced[6];
  statObj["SRS"] = srs.innerText;
  var ortg = advanced[7];
  statObj["ORtg"] = ortg.innerText;
  var drtg = advanced[8];
  statObj["DRtg"] = drtg.innerText;
  var pace = advanced[9];
  statObj["PACE"] = pace.innerText;
  var ftr = advanced[10];
  statObj["FTr"] = ftr.innerText;
  var threePar = advanced[11];
  statObj["3PAr"] = threePar.innerText;
  var oefg = advanced[12];
  statObj["OFF-eFG%"] = oefg.innerText;
  var otov = advanced[13];
  statObj["OFF-TOV%"] = otov.innerText;
  var orb = advanced[14];
  statObj["ORB%"] = orb.innerText;
  var oftfga = advanced[15];
  statObj["OFF-FT/FGA"] = oftfga.innerText;
  var defg = advanced[16];
  statObj["DEF-eFG%"] = defg.innerText;
  var dtov = advanced[17];
  statObj["DEF-TOV%"] = dtov.innerText;
  var drb = advanced[18];
  statObj["DRB%"] = drb.innerText;
  var dftfga = advanced[19];
  statObj["DEF-FT/FGA"] = dftfga.innerText;

  stats.push(statObj);

  return stats;
};

var getTeamAdvancedStats = function() {
  var rows = document.querySelectorAll("#team_misc td");
  var stats = [];
  var statObj = {};

  // ***** ADVANCED *****
  var w = rows[0];
  statObj["W"] = w.innerText;
  var l = rows[1];
  statObj["L"] = l.innerText;
  var pw = rows[2];
  statObj["PW"] = pw.innerText;
  var pl = rows[3];
  statObj["PL"] = pl.innerText;
  var mov = rows[4];
  statObj["MOV"] = mov.innerText;
  var sos = rows[5];
  statObj["SOS"] = sos.innerText;
  var srs = rows[6];
  statObj["SRS"] = srs.innerText;
  var ortg = rows[7];
  statObj["ORtg"] = ortg.innerText;
  var drtg = rows[8];
  statObj["DRtg"] = drtg.innerText;
  var pace = rows[9];
  statObj["PACE"] = pace.innerText;
  var ftr = rows[10];
  statObj["FTr"] = ftr.innerText;
  var threePar = rows[11];
  statObj["3PAr"] = threePar.innerText;
  var oefg = rows[12];
  statObj["OFF-eFG%"] = oefg.innerText;
  var otov = rows[13];
  statObj["OFF-TOV%"] = otov.innerText;
  var orb = rows[14];
  statObj["ORB%"] = orb.innerText;
  var oftfga = rows[15];
  statObj["OFF-FT/FGA"] = oftfga.innerText;
  var defg = rows[16];
  statObj["DEF-eFG%"] = defg.innerText;
  var dtov = rows[17];
  statObj["DEF-TOV%"] = dtov.innerText;
  var drb = rows[18];
  statObj["DRB%"] = drb.innerText;
  var dftfga = rows[19];
  statObj["DEF-FT/FGA"] = dftfga.innerText;

  stats.push(statObj);

  return stats;
};

var getOpponentBasicTotalStats = function() {
  var rows = document.querySelectorAll("#team_and_opponent td");
  var stats = [];
  var statObj = {};

  // Get stats and add them to stat object
  var gp = rows[92];
  statObj["GP"] = gp.innerText;
  var fg = rows[94];
  statObj["FG"] = fg.innerText;
  var fga = rows[95];
  statObj["FGA"] = fga.innerText;
  var fgpct = rows[96];
  statObj["FGPCT"] = fgpct.innerText;
  var threes = rows[97];
  statObj["3P"] = threes.innerText;
  var threesAtt = rows[98];
  statObj["3PA"] = threesAtt.innerText;
  var threesPct = rows[99];
  statObj["3PCT"] = threesPct.innerText;
  var twos = rows[100];
  statObj["2P"] = twos.innerText;
  var twosAtt = rows[101];
  statObj["2PA"] = twosAtt.innerText;
  var twosPct = rows[102];
  statObj["2PCT"] = twosPct.innerText;
  var ft = rows[103];
  statObj["FTM"] = ft.innerText;
  var fta = rows[104];
  statObj["FTA"] = fta.innerText;
  var ftp = rows[105];
  statObj["FTPCT"] = ftp.innerText;
  var orb = rows[106];
  statObj["ORB"] = orb.innerText;
  var drb = rows[107];
  statObj["DRB"] = drb.innerText;
  var trb = rows[108];
  statObj["TRB"] = trb.innerText;
  var ast = rows[109];
  statObj["AST"] = ast.innerText;
  var stl = rows[110];
  statObj["STL"] = stl.innerText;
  var blk = rows[111];
  statObj["BLK"] = blk.innerText;
  var tov = rows[112];
  statObj["TOV"] = tov.innerText;
  var pf = rows[113];
  statObj["PF"] = pf.innerText;
  var pts = rows[114];
  statObj["PTS"] = pts.innerText;

  // var unknown = rows[93];
  // statObj["UNKNOWN"] = unknown.innerText;

  stats.push(statObj);

  return stats;
};

var getPlayerBasicStats = function() {
  var rows = document.querySelectorAll("#per_game tr");
  var players = [];

  // rows = array of players
  for (var i = 1; i < rows.length; i++) {
    var playerInfo = rows[i].querySelectorAll("td");
    // playerInfo = array of tds or stats.
    var player = {};
    for (var j = 0; j < playerInfo.length; j++) {
      var name = playerInfo[0];
      player["Name"] = name.innerText;
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
  var rows = document.querySelectorAll("#advanced tr");
  var players = [];

  // rows = array of players
  for (var i = 1; i < rows.length; i++) {
    var playerInfo = rows[i].querySelectorAll("td");
    // playerInfo = array of tds or stats.
    var player = {};
    for (var j = 0; j < playerInfo.length; j++) {
      var name = playerInfo[0];
      player["Name"] = name.innerText;
      var age = playerInfo[1];
      player["Age"] = age.innerText;
      var games = playerInfo[2];
      player["GP"] = games.innerText;
      var minutesPlayed = playerInfo[3];
      player["MP"] = minutesPlayed.innerText;
      var per = playerInfo[4];
      player["PER"] = per.innerText;
      var ts = playerInfo[5];
      player["TS%"] = ts.innerText;
      var threePAr = playerInfo[6];
      player["3PAr"] = threePAr.innerText;
      var ftr = playerInfo[7];
      player["FTr"] = ftr.innerText;
      var orbpct = playerInfo[8];
      player["ORB%"] = orbpct.innerText;
      var drbpct = playerInfo[9];
      player["DRB%"] = drbpct.innerText;
      var trbpct = playerInfo[10];
      player["TRB%"] = trbpct.innerText;
      var astpct = playerInfo[11];
      player["AST%"] = astpct.innerText;
      var stlpct = playerInfo[12];
      player["STL%"] = stlpct.innerText;
      var blkpct = playerInfo[13];
      player["BLK%"] = blkpct.innerText;
      var tovpct = playerInfo[14];
      player["TOV%"] = tovpct.innerText;
      var usgpct = playerInfo[15];
      player["USG%"] = usgpct.innerText;
      var ows = playerInfo[17];
      player["OWS"] = ows.innerText;
      var dws = playerInfo[18];
      player["DWS"] = dws.innerText;
      var ws = playerInfo[19];
      player["WS"] = ws.innerText;
      var wsfortyeight = playerInfo[20];
      player["WS/48"] = wsfortyeight.innerText;
      var obpm = playerInfo[22];
      player["OBPM"] = obpm.innerText;
      var dbpm = playerInfo[23];
      player["DBPM"] = dbpm.innerText;
      var bpm = playerInfo[24];
      player["BPM"] = bpm.innerText;
      var vorp = playerInfo[25];
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
  var fileName = "csv-team-total/" + month + "_" + day + "_" + year + ".csv";
  var filePath = fs.pathJoin(fs.workingDirectory, fileName);

  fs.write(filePath, result, "w");
  console.log(result);
  return result;
}
