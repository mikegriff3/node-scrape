const csvFilePath = "./csv-boxscores/10_30_2017.csv";
const csv = require("csvtojson");
var axios = require("axios");
var async = require("async");

var vectors = [];
var finalArr = [];

csv()
  .fromFile(csvFilePath)
  .on("json", jsonObj => {
    // combine csv header row and csv line to a json object

    // Format date
    var dateArr = jsonObj["Date"].split(" ");
    jsonObj["Date"] = dateArr[1] + " " + dateArr[3];
    var month;
    if (dateArr[1] === "Oct" || dateArr[1] === "Nov" || dateArr[1] === "Dec") {
      var temp = parseInt(dateArr[3]) + 1;
      jsonObj["Season"] = temp.toString();
    } else {
      jsonObj["Season"] = dateArr[3];
    }
    vectors.push(jsonObj);
  })
  .on("done", error => {
    var count = 0;
    async.whilst(
      function() {
        return count < vectors.length;
      },
      function(next) {
        axios
          .all([
            axios.get("http://localhost:8000/api/teamStats/getTeamStats", {
              params: {
                season: vectors[count]["Season"],
                team: vectors[count]["Home"]
              }
            }),
            axios.get("http://localhost:8000/api/teamStats/getTeamStats", {
              params: {
                season: vectors[count]["Season"],
                team: vectors[count]["Visitor"]
              }
            })
          ])
          .then(
            axios.spread((homeRes, awayRes) => {
              var home = homeRes.data[0];
              var away = awayRes.data[0];
              var gameVector = {};
              gameVector["HW"] = vectors[count]["HW"];
              gameVector["HOME"] = home["Name"];
              gameVector["VISITOR"] = away["Name"];
              for (var stat in home) {
                if (!(stat === "Name" || stat === "GP" || stat === "id")) {
                  var num = parseFloat(home[stat]) - parseFloat(away[stat]);
                  if (num % 1 !== 0) {
                    var n = num.toFixed(3);
                    gameVector[stat] = n;
                  } else {
                    gameVector[stat] = num;
                  }
                }
              }
              //console.log("GAME VECTOR: ", gameVector);
              finalArr.push(gameVector);
              console.log(
                Math.floor(finalArr.length / vectors.length * 100) +
                  "% completed"
              );
              count++;
              next();
            })
          )
          .catch(err => {
            console.log(err);
            count++;
            next();
          });
      },
      function(err) {
        console.log("All things are done");
      }
    );
  });

console.log(finalArr);
