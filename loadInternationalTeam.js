const csvFilePath = "./csv-international-team/iTeamStats.csv";
const csv = require("csvtojson");
var axios = require("axios");

var teamAverages = [];

csv()
  .fromFile(csvFilePath)
  .on("json", jsonObj => {
    // combine csv header row and csv line to a json object
    teamAverages.push(jsonObj);
  })
  .on("done", error => {
    axios
      .put("http://localhost:8000/api/teams/updateiTeams", {
        data: teamAverages
      })
      .then(data => {
        console.log("SAVED SUCCESSFULLY");
      })
      .catch(err => {
        console.log("Error posting to server", err);
      });
  });
