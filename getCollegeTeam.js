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
  "mississippi-state",
  "wichita-state",
  "connecticut",
  "georgia-tech",
  "davidson",
  "st-bonaventure",
  "iowa-state",
  "marquette",
  "georgetown",
  "indiana",
  "wisconsin",
  "northwestern",
  "minnesota",
  "illinois",
  "iowa",
  "loyola-il",
  "nevada",
  "boise-state",
  "new-mexico",
  "san-diego-state",
  "georgia",
  "south-carolina",
  "vanderbilt",
  "saint-marys-ca",
  "brigham-young",
  "virginia-commonwealth",
  "pittsburgh"
];

for (var i = 0; i < teamAbbrv.length; i++) {
  var team = teamAbbrv[i];
  var url =
    "https://www.sports-reference.com/cbb/schools/" + team + "/2018.html";
  var playerBasicStats;

  casper.thenOpen(url, function() {
    if (this.exists("#team_stats tr")) {
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
  var rows = document.querySelectorAll("#team_stats td");
  var stats = [];
  var statObj = {};
  var divisor = parseInt(rows[0].innerText);

  // Get stats and add them to stat object
  var name = metas[1];
  statObj["team"] = name.innerText;
  var games = rows[0];
  statObj["games"] = games.innerText;
  var fg = rows[2];
  statObj["FG"] = (parseInt(fg.innerText) / divisor).toFixed(2);
  var fga = rows[3];
  statObj["FGA"] = (parseInt(fga.innerText) / divisor).toFixed(2);
  var fgpct = rows[4];
  statObj["FGPCT"] = fgpct.innerText;
  var threes = rows[8];
  statObj["3P"] = (parseInt(threes.innerText) / divisor).toFixed(2);
  var threesAtt = rows[9];
  statObj["3PA"] = (parseInt(threesAtt.innerText) / divisor).toFixed(2);
  var threesPct = rows[10];
  statObj["3PCT"] = threesPct.innerText;
  var twos = rows[5];
  statObj["2P"] = (parseInt(twos.innerText) / divisor).toFixed(2);
  var twosAtt = rows[6];
  statObj["2PA"] = (parseInt(twosAtt.innerText) / divisor).toFixed(2);
  var twosPct = rows[7];
  statObj["2PCT"] = twosPct.innerText;
  var ft = rows[11];
  statObj["FTM"] = (parseInt(ft.innerText) / divisor).toFixed(2);
  var fta = rows[12];
  statObj["FTA"] = (parseInt(fta.innerText) / divisor).toFixed(2);
  var ftp = rows[13];
  statObj["FTPCT"] = ftp.innerText;
  var orb = rows[14];
  statObj["ORB"] = (parseInt(orb.innerText) / divisor).toFixed(2);
  var drb = rows[15];
  statObj["DRB"] = (parseInt(drb.innerText) / divisor).toFixed(2);
  var trb = rows[16];
  statObj["TRB"] = (parseInt(trb.innerText) / divisor).toFixed(2);
  var ast = rows[17];
  statObj["AST"] = (parseInt(ast.innerText) / divisor).toFixed(2);
  var stl = rows[18];
  statObj["STL"] = (parseInt(stl.innerText) / divisor).toFixed(2);
  var blk = rows[19];
  statObj["BLK"] = (parseInt(blk.innerText) / divisor).toFixed(2);
  var tov = rows[20];
  statObj["TOV"] = (parseInt(tov.innerText) / divisor).toFixed(2);
  var pf = rows[21];
  statObj["PF"] = (parseInt(pf.innerText) / divisor).toFixed(2);
  var pts = rows[22];
  statObj["PTS"] = (parseInt(pts.innerText) / divisor).toFixed(2);

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
  var fileName = "csv-college-team/collegeTeamStats2.csv";
  var filePath = fs.pathJoin(fs.workingDirectory, fileName);

  fs.write(filePath, result, "w");
  console.log(result);
  return result;
}
