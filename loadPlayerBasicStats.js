const csvFilePath = "./player-csv/player-basic-stats-20.csv";
const csv = require("csvtojson");
var axios = require("axios");

var statArray = [];

csv()
  .fromFile(csvFilePath)
  .on("json", jsonObj => {
    // combine csv header row and csv line to a json object
    statArray.push(jsonObj);
  })
  .on("done", error => {
    //console.log("statArray: ", statArray);
    axios
      .put("http://localhost:3000/api/teams/updatePlayerStats", {
        data: statArray
      })
      .then(data => {
        console.log("SAVED SUCCESSFULLY");
      })
      .catch(err => {
        console.log("ERROR: \n", err);
      });
  });
