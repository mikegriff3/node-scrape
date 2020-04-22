const csvFilePath = "./csv-current-averages/currentAverages19.csv";
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
      .put("http://localhost:3000/api/teams/updateTeams", {
        data: teamAverages
      })
      .then(data => {
        console.log("SAVED SUCCESSFULLY");
      })
      .catch(err => {
        console.log("Error posting to server", err);
      });
  });
