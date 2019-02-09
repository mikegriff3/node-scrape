var axios = require("axios");

var stats = [];
axios
  .get("http://localhost:8000/api/teams/getHistoryPlayers")
  .then(data => {
    outputToCsv(data.data);
  })
  .catch(err => {
    console.log(err);
  });

function outputToCsv(statsArr) {
  console.log(statsArr);
  var result, ctr, keys, columnDelimiter, lineDelimiter, data;
  data = statsArr || null;
  if (data == null || !data.length) {
    console.log("No Data Found");
    return null;
  }
  columnDelimiter = statsArr.columnDelimiter || ",";
  lineDelimiter = statsArr.lineDelimiter || "\n";
  keys = Object.keys(data[0]);
  result = "";
  result += keys.join(columnDelimiter);
  result += lineDelimiter;
  data.forEach(function(item) {
    ctr = 0;
    keys.forEach(function(key) {
      if (ctr > 0) result += columnDelimiter;
      result += item[key];
      ctr++;
    });
    result += lineDelimiter;
  });
  //console.log(result);
  var fs = require("file-system");
  var currentTime = new Date();
  var month = currentTime.getMonth() + 1;
  var day = currentTime.getDate();
  var year = currentTime.getFullYear();
  var fileName = "player-csv/history.csv";
  //var filePath = fs.pathJoin(fs.workingDirectory, fileName);

  fs.writeFile(
    "/Users/michaelgriffin/node-scrape/history.csv",
    result,
    function(err) {}
  );
  return result;
}
