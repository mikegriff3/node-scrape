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
  var teamBasicStats;

  casper.thenOpen(url, function() {
    if (this.exists("#roster tr")) {
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
  var rows = document.querySelectorAll("#roster tr");
  var players = [];
  var schoolInfo = document.querySelectorAll("#meta span");
  var school = schoolInfo[1];

  // rows = array of players
  for (var i = 1; i < rows.length; i++) {
    var playerInfo = rows[i].querySelectorAll("td");
    // playerInfo = array of tds or stats.
    var player = {};
    var playerName = rows[i].querySelector("th");
    player["Name"] = playerName.innerText;
    player["School"] = school.innerText;
    for (var j = 0; j < playerInfo.length; j++) {
      var number = playerInfo[0];
      player["Number"] = number.innerText;
      var year = playerInfo[1];
      player["Class"] = year.innerText;
      var position = playerInfo[2];
      player["Position"] = position.innerText;
      var height = playerInfo[3];
      player["Height"] = height.innerText;
      var weight = playerInfo[4];
      player["Weight"] = weight.innerText;
      var hometown = playerInfo[5];
      var homeStr = hometown.innerText;
      homeStr = homeStr.replace(/,/g, "");
      player["Hometown"] = homeStr;
      var highschool = playerInfo[6];
      player["HighSchool"] = highschool.innerText;
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
  var fileName = "csv-college-player-basic/collegePlayerBasic2.csv";
  var filePath = fs.pathJoin(fs.workingDirectory, fileName);

  fs.write(filePath, result, "w");
  console.log(result);
  return result;
}
