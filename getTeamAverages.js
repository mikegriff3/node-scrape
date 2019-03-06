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
  // "BOS",
  // "CHO",
  // "CHI",
  // "CLE",
  "DAL",
  "DEN",
  //"DET",
  // "GSW",
  //"HOU",
  //"IND",
  "LAC",
  "LAL",
  //"MEM",
  "MIA",
  "MIL",
  //"MIN",
  "NOP",
  "NYK",
  //"OKC",
  //"ORL",
  // "PHI",
  "PHO",
  //"POR",
  "SAC",
  "SAS",
  //"TOR",
  "UTA"
  //"WAS"
];

for (var i = 0; i < teamAbbrv.length; i++) {
  var team = teamAbbrv[i];
  var url = "https://www.basketball-reference.com/teams/" + team + "/2019.html";
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
  var rows = document.querySelectorAll("#team_and_opponent td");
  var advanced = document.querySelectorAll("#team_misc td");
  var stats = [];
  var statObj = {};

  // Get stats and add them to stat object
  var name = metas[1];
  statObj["team"] = name.innerText;
  var fg = rows[25];
  statObj["FG"] = fg.innerText;
  var fga = rows[26];
  statObj["FGA"] = fga.innerText;
  var fgpct = rows[27];
  statObj["FGPCT"] = fgpct.innerText;
  var threes = rows[28];
  statObj["3P"] = threes.innerText;
  var threesAtt = rows[29];
  statObj["3PA"] = threesAtt.innerText;
  var threesPct = rows[30];
  statObj["3PCT"] = threesPct.innerText;
  var twos = rows[31];
  statObj["2P"] = twos.innerText;
  var twosAtt = rows[32];
  statObj["2PA"] = twosAtt.innerText;
  var twosPct = rows[33];
  statObj["2PCT"] = twosPct.innerText;
  var ft = rows[34];
  statObj["FTM"] = ft.innerText;
  var fta = rows[35];
  statObj["FTA"] = fta.innerText;
  var ftp = rows[36];
  statObj["FTPCT"] = ftp.innerText;
  var orb = rows[37];
  statObj["ORB"] = orb.innerText;
  var drb = rows[38];
  statObj["DRB"] = drb.innerText;
  var trb = rows[39];
  statObj["TRB"] = trb.innerText;
  var ast = rows[40];
  statObj["AST"] = ast.innerText;
  var stl = rows[41];
  statObj["STL"] = stl.innerText;
  var blk = rows[42];
  statObj["BLK"] = blk.innerText;
  var tov = rows[43];
  statObj["TOV"] = tov.innerText;
  var pf = rows[44];
  statObj["PF"] = pf.innerText;
  var pts = rows[45];
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

  //***** Opponent Basic Stats *****//
  var fg = rows[117];
  statObj["oFG"] = fg.innerText;
  var fga = rows[118];
  statObj["oFGA"] = fga.innerText;
  var fgpct = rows[119];
  statObj["oFGPCT"] = fgpct.innerText;
  var threes = rows[120];
  statObj["o3P"] = threes.innerText;
  var threesAtt = rows[121];
  statObj["o3PA"] = threesAtt.innerText;
  var threesPct = rows[122];
  statObj["o3PCT"] = threesPct.innerText;
  var twos = rows[123];
  statObj["o2P"] = twos.innerText;
  var twosAtt = rows[124];
  statObj["o2PA"] = twosAtt.innerText;
  var twosPct = rows[125];
  statObj["o2PCT"] = twosPct.innerText;
  var ft = rows[126];
  statObj["oFTM"] = ft.innerText;
  var fta = rows[127];
  statObj["oFTA"] = fta.innerText;
  var ftp = rows[128];
  statObj["oFTPCT"] = ftp.innerText;
  var orb = rows[129];
  statObj["oORB"] = orb.innerText;
  var drb = rows[130];
  statObj["oDRB"] = drb.innerText;
  var trb = rows[131];
  statObj["oTRB"] = trb.innerText;
  var ast = rows[132];
  statObj["oAST"] = ast.innerText;
  var stl = rows[133];
  statObj["oSTL"] = stl.innerText;
  var blk = rows[134];
  statObj["oBLK"] = blk.innerText;
  var tov = rows[135];
  statObj["oTOV"] = tov.innerText;
  var pf = rows[136];
  statObj["oPF"] = pf.innerText;
  var pts = rows[137];
  statObj["oPTS"] = pts.innerText;

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
  var fileName = "csv-current-averages/currentAverages19.csv";
  var filePath = fs.pathJoin(fs.workingDirectory, fileName);

  fs.write(filePath, result, "w");
  console.log(result);
  return result;
}
