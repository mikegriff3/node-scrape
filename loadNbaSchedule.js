const csvFilePath = "./nba-schedule-csv/schedule-Mar-20.csv";
const csv = require("csvtojson");
var axios = require("axios");

var games = [];

csv()
  .fromFile(csvFilePath)
  .on("json", (jsonObj) => {
    // combine csv header row and csv line to a json object
    games.push(jsonObj);
  })
  .on("done", (error) => {
    axios
      .post("http://localhost:3000/api/teams/createNbaSchedule", {
        data: games,
      })
      .then((data) => {
        console.log("SAVED SUCCESSFULLY");
      })
      .catch((err) => {
        console.log("Error posting to server", err);
      });
  });
