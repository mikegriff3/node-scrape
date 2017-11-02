const csvFilePath = "./csv-team-averages/2013.csv";
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
      .post("http://localhost:8000/api/teamStats/postTeamAverages", {
        data: teamAverages
      })
      .then(data => {
        console.log("SAVED SUCCESSFULLY");
      })
      .catch(err => {
        console.log("Error posting to server", err);
      });
  });
