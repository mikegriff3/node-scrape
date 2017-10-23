var request = require("request");
var cheerio = require("cheerio");

var urls = [];

request("https://www.basketball-reference.com/", function(err, resp) {
  //console.log("RESPONSE: ", resp);
  if (!err) {
    var $ = cheerio.load(resp.body);

    $("div.game_summary.expanded.nohover").each(function(index, element) {
      var winner = $(element)
        .find(".winner")
        .children()
        .first()
        .text();
      var loser = $(element)
        .find(".loser")
        .children()
        .first()
        .text();
      console.log("winner: ", winner);
      console.log("loser: ", loser);
    });
  } else {
    console.log("ERROR: ", err);
  }

  console.log("REDDIT URLS: ", urls);
});
