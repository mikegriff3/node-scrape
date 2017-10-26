var request = require("request");
var cheerio = require("cheerio");
var axios = require("axios");

var teamAbbrv = [
  "ATL",
  "BKN",
  "BOS",
  "CHA",
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
  "PHX",
  "POR",
  "SAC",
  "SAS",
  "TOR",
  "UTA",
  "WAS"
];

var getDailyScores = function() {
  axios.get("https://www.basketball-reference.com/").then(function(response) {
    //console.log("RESPONSE: ", response.data);
    if (response.data) {
      var $ = cheerio.load(response.data);

      $("div.game_summary.expanded.nohover").each(function(index, element) {
        var winner = $(element)
          .find(".winner")
          .children()
          .first()
          .text();
        var winner_score = $(element)
          .find(".winner")
          .children()
          .first()
          .next()
          .text();
        var loser = $(element)
          .find(".loser")
          .children()
          .first()
          .text();
        var loser_score = $(element)
          .find(".loser")
          .children()
          .first()
          .next()
          .text();
        console.log(winner + " " + winner_score);
        console.log(loser + " " + loser_score);
      });
    }
  });
};

var getTeamMeta = function(team, year) {
  axios
    .get(`https://www.basketball-reference.com/teams/${team}/${year}.html`)
    .then(function(data) {
      //console.log("DATA: ", data.data);
      if (data.data) {
        var $ = cheerio.load(data.data);

        var record = $("p", "#meta")
          .eq(2)
          .text();
        var lastGame = $("p", "#meta")
          .eq(3)
          .text();
        var coach = $("p", "#meta")
          .eq(4)
          .text();
        var executive = $("p", "#meta")
          .eq(5)
          .text();
        var pointsPerGame = $("p", "#meta")
          .eq(6)
          .text();
        var srs_pace = $("p", "#meta")
          .eq(8)
          .text();
        var off_def_rating = $("p", "#meta")
          .eq(9)
          .text();
      }
    })
    .catch(function(err) {
      console.log("ERROR: ", err);
    });
};

// var getTeamStats = function(team, year) {
//   axios
//     .get(`https://www.basketball-reference.com/teams/${team}/${year}.html`)
//     .then(function(data) {
//       if (data.data) {
//         var $ = cheerio.load(data.data);
//         $("#team_and_opponent td").each(function(i, element) {
//           console.log(i);
//         });
//         //console.log(gamesPlayed);
//       }
//     })
//     .catch(function(err) {
//       console.log("ERROR: ", err);
//     });
// };

getDailyScores();
//getTeamMeta("LAL", "2018");
//getTeamStats("LAL", "2018");
