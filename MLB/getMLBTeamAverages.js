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
  "ARI",
  "ATL",
  "BAL",
  "BOS",
  "CHW",
  "CHC",
  "CIN",
  "CLE",
  "COL",
  "DET",
  "HOU",
  "KCR",
  "LAA",
  "LAD",
  "MIA",
  "MIL",
  "MIN",
  "NYY",
  "NYM",
  "OAK",
  "PHI",
  "PIT",
  "SDP",
  "SFG",
  "SEA",
  "STL",
  "TBR",
  "TEX",
  "TOR",
  "WSN"
];

for (var i = 0; i < teamAbbrv.length; i++) {
  var team = teamAbbrv[i];
  var url = "https://www.baseball-reference.com/teams/" + team + "/2018.shtml";
  var teamBasicStats;

  casper.thenOpen(url, function() {
    if (this.exists("div#meta")) {
      this.echo("found element!!!", "INFO");
      //this.capture("captured.png");
    } else {
      this.echo("Did not find element!!", "ERROR");
    }
  });
  casper.then(function() {
    //GET TEAM BASIC STATS
    casper.wait(30000, function() {
      teamBasicStats = this.evaluate(getTeamBasicTotalStats);
      allTeamStatsArr.push(teamBasicStats[0]);
      //this.echo("TEAM BASIC STATS");
      require("utils").dump(allTeamStatsArr);
    });
  });
}

var getTeamBasicTotalStats = function() {
  var metas = document.querySelectorAll("#meta span");
  var teamBat = document.querySelectorAll("#team_batting tfoot tr td.right");
  var teamPit = document.querySelectorAll("#team_pitching tfoot tr td.right");
  var stats = [];
  var statObj = {};

  // Get stats and add them to stat object
  var name = metas[1];
  statObj["team"] = name.innerText;

  var gamesPlayed = teamBat[1];
  statObj["GP"] = parseInt(gamesPlayed.innerText);
  var gp = parseInt(gamesPlayed.innerText);
  var pa = teamBat[2];
  statObj["PA"] = (parseInt(pa.innerText) / gp).toFixed(1);
  var ab = teamBat[3];
  statObj["AB"] = (parseInt(ab.innerText) / gp).toFixed(1);
  var r = teamBat[4];
  statObj["R"] = (parseInt(r.innerText) / gp).toFixed(1);
  var hits = teamBat[5];
  statObj["H"] = (parseInt(hits.innerText) / gp).toFixed(1);
  var hr = teamBat[8];
  statObj["HR"] = (parseInt(hr.innerText) / gp).toFixed(1);
  var rbi = teamBat[9];
  statObj["RBI"] = (parseInt(rbi.innerText) / gp).toFixed(1);
  var sb = teamBat[10];
  statObj["SB"] = (parseInt(sb.innerText) / gp).toFixed(1);
  var bb = teamBat[12];
  statObj["BB"] = (parseInt(bb.innerText) / gp).toFixed(1);
  var so = teamBat[13];
  statObj["SO"] = (parseInt(so.innerText) / gp).toFixed(1);
  var bavg = teamBat[14];
  statObj["BAVG"] = parseFloat(bavg.innerText);
  var obp = teamBat[15];
  statObj["OBP"] = parseFloat(obp.innerText);
  var slg = teamBat[16];
  statObj["SLG"] = parseFloat(slg.innerText);
  var ops = teamBat[17];
  statObj["OPS"] = parseFloat(ops.innerText);
  var ops_plus = teamBat[18];
  statObj["OPSP"] = parseInt(ops_plus.innerText);
  var tb = teamBat[19];
  statObj["TB"] = (parseInt(tb.innerText) / gp).toFixed(1);

  var w = teamPit[1];
  statObj["W"] = parseInt(w.innerText);
  var l = teamPit[2];
  statObj["L"] = parseInt(l.innerText);
  var winPct = teamPit[3];
  statObj["WinPct"] = parseFloat(winPct.innerText);
  var era = teamPit[4];
  statObj["ERA"] = parseFloat(era.innerText);

  stats.push(statObj);

  return stats;
};

casper.run(function() {
  //outputToCsv(allTeamStatsArr);
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
  var fileName = "csv-current-averages/MLB/currentMLBAverages19.csv";
  var filePath = fs.pathJoin(fs.workingDirectory, fileName);

  fs.write(filePath, result, "w");
  console.log(result);
  return result;
}
