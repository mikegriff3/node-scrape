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
  "olympiakos",
  "barcelona",
  "zalgiris",
  "vitoria",
  "real-madrid",
  "panathinaikos",
  "maccabi-tel-aviv",
  "cska-moscow",
  "ulker-fenerbahce",
  "anadolu-efes",
  "unicaja-malaga",
  "valencia",
  "milano",
  "brose-baskets",
  "khimki",
  "red-star"
];

for (var i = 0; i < teamAbbrv.length; i++) {
  var team = teamAbbrv[i];
  var url =
    "https://www.basketball-reference.com/euro/teams/" +
    team +
    "/2018_euroleague.html";
  var teamBasicStats;

  casper.thenOpen(url, function() {
    if (this.exists("#team_and_opp td")) {
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
  });
}

var getTeamBasicTotalStats = function() {
  var metas = document.querySelectorAll("#meta span");
  var rows = document.querySelectorAll("#team_and_opp td");
  var stats = [];
  var statObj = {};
  var divisor = parseInt(rows[0].innerText);

  // Get stats and add them to stat object
  var name = metas[0];
  var str = name.innerText;
  var strArr = str.split("- ");
  statObj["team"] = strArr[1];
  var games = rows[0];
  statObj["games"] = games.innerText;
  var fg = rows[2];
  statObj["FG"] = (parseInt(fg.innerText) / divisor).toFixed(1);
  var fga = rows[3];
  statObj["FGA"] = (parseInt(fga.innerText) / divisor).toFixed(1);
  var fgpct = rows[4];
  statObj["FGPCT"] = fgpct.innerText;
  var threes = rows[5];
  statObj["3P"] = (parseInt(threes.innerText) / divisor).toFixed(1);
  var threesAtt = rows[6];
  statObj["3PA"] = (parseInt(threesAtt.innerText) / divisor).toFixed(1);
  var threesPct = rows[7];
  statObj["3PCT"] = threesPct.innerText;
  var twos = rows[8];
  statObj["2P"] = (parseInt(twos.innerText) / divisor).toFixed(1);
  var twosAtt = rows[9];
  statObj["2PA"] = (parseInt(twosAtt.innerText) / divisor).toFixed(1);
  var twosPct = rows[10];
  statObj["2PCT"] = twosPct.innerText;
  var ft = rows[11];
  statObj["FTM"] = (parseInt(ft.innerText) / divisor).toFixed(1);
  var fta = rows[12];
  statObj["FTA"] = (parseInt(fta.innerText) / divisor).toFixed(1);
  var ftp = rows[13];
  statObj["FTPCT"] = ftp.innerText;
  var orb = rows[14];
  statObj["ORB"] = (parseInt(orb.innerText) / divisor).toFixed(1);
  var drb = rows[15];
  statObj["DRB"] = (parseInt(drb.innerText) / divisor).toFixed(1);
  var trb = rows[16];
  statObj["TRB"] = (parseInt(trb.innerText) / divisor).toFixed(1);
  var ast = rows[17];
  statObj["AST"] = (parseInt(ast.innerText) / divisor).toFixed(1);
  var stl = rows[18];
  statObj["STL"] = (parseInt(stl.innerText) / divisor).toFixed(1);
  var blk = rows[19];
  statObj["BLK"] = (parseInt(blk.innerText) / divisor).toFixed(1);
  var tov = rows[20];
  statObj["TOV"] = (parseInt(tov.innerText) / divisor).toFixed(1);
  var pf = rows[21];
  statObj["PF"] = (parseInt(pf.innerText) / divisor).toFixed(1);
  var pts = rows[22];
  statObj["PTS"] = (parseInt(pts.innerText) / divisor).toFixed(1);

  // // ***** ADVANCED *****
  // var w = advanced[0];
  // statObj["W"] = w.innerText;
  // var l = advanced[1];
  // statObj["L"] = l.innerText;
  // var mov = advanced[4];
  // statObj["MOV"] = mov.innerText;
  // var sos = advanced[5];
  // statObj["SOS"] = sos.innerText;
  // var srs = advanced[6];
  // statObj["SRS"] = srs.innerText;
  // var ortg = advanced[7];
  // statObj["ORtg"] = ortg.innerText;
  // var drtg = advanced[8];
  // statObj["DRtg"] = drtg.innerText;
  // var pace = advanced[9];
  // statObj["PACE"] = pace.innerText;
  // var ftr = advanced[10];
  // statObj["FTr"] = ftr.innerText;
  // var threePar = advanced[11];
  // statObj["3PAr"] = threePar.innerText;
  // var oefg = advanced[12];
  // statObj["OFF-eFG%"] = oefg.innerText;
  // var otov = advanced[13];
  // statObj["OFF-TOV%"] = otov.innerText;
  // var orb = advanced[14];
  // statObj["ORB%"] = orb.innerText;
  // var oftfga = advanced[15];
  // statObj["OFF-FT/FGA"] = oftfga.innerText;
  // var defg = advanced[16];
  // statObj["DEF-eFG%"] = defg.innerText;
  // var dtov = advanced[17];
  // statObj["DEF-TOV%"] = dtov.innerText;
  // var drb = advanced[18];
  // statObj["DRB%"] = drb.innerText;
  // var dftfga = advanced[19];
  // statObj["DEF-FT/FGA"] = dftfga.innerText;

  stats.push(statObj);

  return stats;
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
  var fileName = "csv-international-team/iTeamStats.csv";
  var filePath = fs.pathJoin(fs.workingDirectory, fileName);

  fs.write(filePath, result, "w");
  console.log(result);
  return result;
}
