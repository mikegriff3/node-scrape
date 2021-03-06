const csvFilePath = "./csv-college-player-basic/collegePlayerStats.csv";
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
      .put("http://localhost:8000/api/teams/updateCollegePlayers", {
        data: statArray
      })
      .then(data => {
        console.log("SAVED SUCCESSFULLY");
      })
      .catch(err => {
        console.log("ERROR: \n", err);
      });
  });
