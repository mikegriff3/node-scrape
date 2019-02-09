//var axios = require("axios");
const csvFilePath = "./csv-boxscores/1_28_2019.csv";
const csv = require("csvtojson");
var allBoxScores = [];

var boxscoreArr = [];

var casper = require("casper").create({
  viewportSize: {
    width: 1024,
    height: 768
  }
});

casper.start();

csv()
  .fromFile(csvFilePath)
  .on("json", function(jsonObj) {
    // combine csv header row and csv line to a json object
    boxscoreArr.push(jsonObj);
  });

console.log(boxscoreArr);
// .on("done", function(error) {
//   for (var i = 0; i < boxscoreArr.length; i++) {
//     var dateArr = boxscoreArr[i]["Date"].split(" ");
//     var year = dateArr[3];
//     var gameMonth = getGameMonth(dateArr[1]);
//     var gameDay = getGameDay(dateArr[2]);
//     var date = year + gameMonth + gameDay + "0";
//     var teamAbr = getTeamAbr(boxscoreArr[i].Home);
//     var input = date + teamAbr;
//     //console.log(input);
//     var url =
//       "https://www.basketball-reference.com/boxscores/" + input + ".html";

//     casper.thenOpen(url, function() {
//       if (this.exists("#content span")) {
//         this.echo("found game!!!", "INFO");
//       } else {
//         this.echo("Did not find game!!", "ERROR");
//       }
//     });
//   }
// });

casper.run(function() {
  this.exit();
});

function getTeamAbr(team) {
  var abr = "";
  switch (team) {
    case "Atlanta Hawks":
      abr = "ATL";
      break;
    case "Brooklyn Nets":
      abr = "BRK";
      break;
    case "Boston Celtics":
      abr = "BOS";
      break;
    case "Charlotte Hornets":
      abr = "CHO";
      break;
    case "Chicago Bulls":
      abr = "CHI";
      break;
    case "Dallas Mavericks":
      abr = "DAL";
      break;
    case "Denver Nuggets":
      abr = "DEN";
      break;
    case "Detroit Pistons":
      abr = "DET";
      break;
    case "Golden State Warriors":
      abr = "GSW";
      break;
    case "Houston Rockets":
      abr = "HOU";
      break;
    case "Indiana Pacers":
      abr = "IND";
      break;
    case "Los Angeles Clippers":
      abr = "LAC";
      break;
    case "Los Angeles Lakers":
      abr = "LAL";
      break;
    case "Memphis Grizzlies":
      abr = "MEM";
      break;
    case "Milwaukee Bucks":
      abr = "MIL";
      break;
    case "Miami Heat":
      abr = "MIA";
      break;
    case "Minnesota Timberwolves":
      abr = "MIN";
      break;
    case "New Orleans Pelicans":
      abr = "NOP";
      break;
    case "New York Knicks":
      abr = "NYK";
      break;
    case "Oklahoma City Thunder":
      abr = "OKC";
      break;
    case "Orlando Magic":
      abr = "ORL";
      break;
    case "Philadelphia 76ers":
      abr = "PHI";
      break;
    case "Phoenix Suns":
      abr = "PHO";
      break;
    case "Portland Trail Blazers":
      abr = "POR";
      break;
    case "Sacramento Kings":
      abr = "SAC";
      break;
    case "San Antonio Spurs":
      abr = "SAS";
      break;
    case "Toronto Raptors":
      abr = "TOR";
      break;
    case "Utah Jazz":
      abr = "UTA";
      break;
    case "Washington Wizards":
      abr = "WAS";
      break;
    case "Cleveland Cavaliers":
      abr = "CLE";
      break;
  }
  return abr;
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
    case "Oct":
      numMonth = "10";
      break;
    case "Nov":
      numMonth = "11";
      break;
    case "Dec":
      numMonth = "12";
      break;
    case "Jan":
      numMonth = "01";
      break;
    case "Feb":
      numMonth = "02";
      break;
    case "Mar":
      numMonth = "03";
      break;
  }
  return numMonth;
}
