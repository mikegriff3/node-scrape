const csvFilePath = "./mlb-csv-boxscores/update_boxscores_adv.csv";
const csv = require("csvtojson");
var axios = require("axios");

var boxscoreArr = [];

csv()
  .fromFile(csvFilePath)
  .on("json", jsonObj => {
    // combine csv header row and csv line to a json object
    boxscoreArr.push(jsonObj);
  })
  .on("done", error => {
    axios
      .put("http://localhost:8000/api/teamStats/updateMLBAdvStats", {
        data: boxscoreArr
      })
      .then(data => {
        console.log("SAVED SUCCESSFULLY");
      })
      .catch(err => {
        console.log("Error posting to server", err);
      });
  });
