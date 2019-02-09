const csvFilePath = "./csv-boxscores/2_8_2019.csv";
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
    jsonObj["Date"] = dateArr[0] + " " + dateArr[1] + " " + dateArr[2];
    var month;
    // Add Season column
    if (dateArr[0] === "Oct" || dateArr[0] === "Nov" || dateArr[0] === "Dec") {
      var temp = parseInt(dateArr[2]) + 1;
      jsonObj["Season"] = temp.toString();
    } else {
      jsonObj["Season"] = dateArr[2];
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
            }),
            axios.get("http://localhost:8000/api/teamStats/getBoxScores", {
              params: {
                team: vectors[count]["Home"]
              }
            }),
            axios.get("http://localhost:8000/api/teamStats/getBoxScores", {
              params: {
                team: vectors[count]["Visitor"]
              }
            })
          ])
          .then(
            axios.spread(
              async (homeRes, awayRes, homeSchedule, awaySchedule) => {
                var home = homeRes.data[0];
                var away = awayRes.data[0];
                var homeGames = homeSchedule.data;
                var awayGames = awaySchedule.data;
                var gameVector = {};
                var gameDateArr = vectors[count]["Date"].split(" ");
                var gameMonth = getGameMonth(gameDateArr[0]);
                var gameDay = getGameDay(gameDateArr[1]);
                var gameDate = gameDateArr[2] + "-" + gameMonth + "-" + gameDay;
                var currentGame = new Date(gameDate);
                var homeOneGame = 0;
                var homeTwoGame = 0;
                var homeThreeGame = 0;
                var awayOneGame = 0;
                var awayTwoGame = 0;
                var awayThreeGame = 0;
                for (let i = 0; i < homeGames.length; i++) {
                  let dateArr = homeGames[i]["Date"].split(" ");
                  let month = getGameMonth(dateArr[0]);
                  let day = getGameDay(dateArr[1]);
                  let game = dateArr[2] + "-" + month + "-" + day;
                  let pastGame = new Date(game);
                  let difference = dateDiffInDays(pastGame, currentGame);
                  homeGames[i]["Difference"] = difference;
                  if (difference === 1) {
                    homeOneGame += 1;
                    homeTwoGame += 1;
                    homeThreeGame += 1;
                  }
                  if (difference === 2) {
                    homeTwoGame += 1;
                    homeThreeGame += 1;
                  }
                  if (difference === 3) {
                    homeThreeGame += 1;
                  }
                }
                var homeWins = getLastTenGames(homeGames, home["Name"]);
                var homeWinPct = getHomeWinPercentage(homeGames, home["Name"]);
                for (let i = 0; i < awayGames.length; i++) {
                  let dateArr = awayGames[i]["Date"].split(" ");
                  let month = getGameMonth(dateArr[0]);
                  let day = getGameDay(dateArr[1]);
                  let game = dateArr[2] + "-" + month + "-" + day;
                  let pastGame = new Date(game);
                  let difference = dateDiffInDays(pastGame, currentGame);
                  awayGames[i]["Difference"] = difference;
                  if (difference === 1) {
                    awayOneGame += 1;
                    awayTwoGame += 1;
                    awayThreeGame += 1;
                  }
                  if (difference === 2) {
                    awayTwoGame += 1;
                    awayThreeGame += 1;
                  }
                  if (difference === 3) {
                    awayThreeGame += 1;
                  }
                }
                var awayWins = getLastTenGames(awayGames, away["Name"]);
                var awayWinPct = getAwayWinPercentage(awayGames, away["Name"]);
                var seasonHeadToHead = getHeadToHeadAverage(
                  homeGames,
                  away["Name"]
                );
                var homeDist = await getDistanceTraveled(homeGames, home.Name);
                console.log(home.Name + " " + homeDist);
                var awayDist = await getDistanceTraveled(awayGames, away.Name);
                console.log(away.Name + " " + awayDist);
                gameVector["Travel_Difference_9Day"] =
                  parseInt(homeDist) - parseInt(awayDist);
                gameVector["Home_Away_Impact"] = (
                  homeWinPct - awayWinPct
                ).toFixed(3);
                gameVector["Head_To_Head_Avg_Spread"] =
                  seasonHeadToHead.averageDifference;
                gameVector["Head_To_Head_GP"] = seasonHeadToHead.gamesPlayed;
                gameVector["Last_Ten"] = homeWins.tenGames - awayWins.tenGames;
                gameVector["Last_Five"] =
                  homeWins.fiveGames - awayWins.fiveGames;
                gameVector["GP_One_Day"] = homeOneGame - awayOneGame;
                gameVector["GP_Two_Day"] = homeTwoGame - awayTwoGame;
                gameVector["GP_Three_Day"] = homeThreeGame - awayThreeGame;
                gameVector["Total_Pts"] = vectors[count]["Total_Pts"];
                gameVector["Home_Diff"] = vectors[count]["Home_Diff"];
                gameVector["HW"] = vectors[count]["HW"];
                gameVector["HOME"] = home["Name"];
                gameVector["VISITOR"] = away["Name"];
                // Subtract stats between competing teams to create input vectors
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
                console.log(home.Name + " vs " + away.Name);
                console.log(gameVector);
                finalArr.push(gameVector);
                console.log(
                  Math.floor((finalArr.length / vectors.length) * 100) +
                    "% completed"
                );
                count++;
                next();
              }
            )
          )
          .catch(err => {
            console.log(err);
            count++;
            //next();
          });
      },
      function(err) {
        console.log("All games are done");
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;
        data = finalArr || null;
        if (data == null || !data.length) {
          console.log("No Data Found");
          return null;
        }
        columnDelimiter = finalArr.columnDelimiter || ",";
        lineDelimiter = finalArr.lineDelimiter || "\n";
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
        var fs = require("fs");
        var currentTime = new Date();
        var month = currentTime.getMonth() + 1;
        var day = currentTime.getDate();
        var year = currentTime.getFullYear();
        var fileName =
          "/Users/michaelgriffin/Deep_Learning_A_Z/SDL/ANN/Building_ANN/Artificial_Neural_Networks/test.csv";

        fs.writeFile(fileName, result);
        //console.log(result);
      }
    );
  });

// a and b are javascript Date objects
function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

function getHomeWinPercentage(games, team) {
  var arr = games.filter(function(game) {
    return game.Difference > 0 && game.Difference < 220 && game.Home === team;
  });
  var wins = 0;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].HW === 1) wins += 1;
  }
  var homePct = (wins / arr.length).toFixed(3);
  //console.log(team + ": " + homePct);
  return homePct;
}

function getAwayWinPercentage(games, team) {
  var arr = games.filter(function(game) {
    return (
      game.Difference > 0 && game.Difference < 220 && game.Visitor === team
    );
  });
  var wins = 0;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].HW === 0) wins += 1;
  }
  var awayPct = (wins / arr.length).toFixed(3);
  //console.log(team + ": " + awayPct);
  return awayPct;
}

function getHeadToHeadAverage(games, opponent) {
  var headToHeadSeason = {
    averageDifference: 0,
    gamesPlayed: 0
  };
  // Sort games by
  games.sort(function(a, b) {
    return parseInt(a.Difference) - parseInt(b.Difference);
  });
  // Remove games that have not been played yet and that are not against opponent
  var arr = games.filter(function(game) {
    return (
      game.Difference > 0 &&
      game.Difference < 240 &&
      (game.Home === opponent || game.Visitor === opponent)
    );
  });
  //console.log(arr);
  if (arr.length > 0) {
    var count = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].Visitor === opponent) {
        count += arr[i].Home_Diff;
      } else {
        count -= arr[i].Home_Diff;
      }
    }
    headToHeadSeason.averageDifference = (count / arr.length).toFixed(1);
    headToHeadSeason.gamesPlayed = arr.length;
  }
  return headToHeadSeason;
}

function getLastTenGames(games, team) {
  var lastTen = {
    fiveGames: 0,
    tenGames: 0
  };
  games.sort(function(a, b) {
    return parseInt(a.Difference) - parseInt(b.Difference);
  });
  // Remove games that have not been played yet
  var arr = games.filter(function(game) {
    return game.Difference > 0;
  });
  var newArr = arr.slice(0, 10);
  //console.log(newArr);
  if (newArr.length === 10) {
    for (let i = 0; i < newArr.length; i++) {
      if (
        newArr[i]["Home"] === team &&
        parseInt(newArr[i]["Home_Pts"]) > parseInt(newArr[i]["Visitor_Pts"])
      ) {
        if (i < 5) {
          lastTen.fiveGames += 1;
          lastTen.tenGames += 1;
        } else {
          lastTen.tenGames += 1;
        }
      }
      if (
        newArr[i]["Visitor"] === team &&
        parseInt(newArr[i]["Visitor_Pts"]) > parseInt(newArr[i]["Home_Pts"])
      ) {
        if (i < 5) {
          lastTen.fiveGames += 1;
          lastTen.tenGames += 1;
        } else {
          lastTen.tenGames += 1;
        }
      }
    }
  }
  return lastTen;
}

async function getDistanceTraveled(games, team) {
  games.sort(function(a, b) {
    return parseInt(b.Difference) - parseInt(a.Difference);
  });
  // Get games played over last 9 days.
  var arr = games.filter(function(game) {
    return game.Difference >= 0 && game.Difference < 10;
  });
  //console.log(arr);
  var config = {
    headers: {
      "X-RapidAPI-Key": "F1Zpq0CpPumshGjTXVnaYN4cJtljp1asib9jsnfOja4ZdfzOhY"
    }
  };
  var startZip = "";
  var endZip = "";
  var distance = 0;
  for (var i = 0; i < arr.length - 1; i++) {
    startZip = getTeamZipcode(arr[i].Home);
    endZip = getTeamZipcode(arr[i + 1].Home);
    if (startZip !== endZip) {
      await axios
        .get(
          `https://redline-redline-zipcode.p.rapidapi.com/rest/distance.json/${startZip}/${endZip}/mile`,
          config
        )
        .then(response => {
          distance += response.data.distance;
          //console.log(team + ": " + distance);
        })
        .catch(error => {
          console.log("axios error:", error);
          console.log("ERROR WITH TEAM: ", team);
        });
    }
  }
  return distance.toFixed(0);
}

function getTeamZipcode(team) {
  var zipcode;
  switch (team) {
    case "Atlanta Hawks":
      zipcode = "30301";
      break;
    case "Brooklyn Nets":
      zipcode = "11201";
      break;
    case "Boston Celtics":
      zipcode = "02108";
      break;
    case "Charlotte Hornets":
      zipcode = "28201";
      break;
    case "Charlotte Bobcats":
      zipcode = "28201";
      break;
    case "Chicago Bulls":
      zipcode = "60601";
      break;
    case "Cleveland Cavaliers":
      zipcode = "44101";
      break;
    case "Dallas Mavericks":
      zipcode = "75201";
      break;
    case "Denver Nuggets":
      zipcode = "80012";
      break;
    case "Detroit Pistons":
      zipcode = "48201";
      break;
    case "Golden State Warriors":
      zipcode = "94102";
      break;
    case "Houston Rockets":
      zipcode = "77001";
      break;
    case "Indiana Pacers":
      zipcode = "46201";
      break;
    case "Los Angeles Clippers":
      zipcode = "90001";
      break;
    case "Los Angeles Lakers":
      zipcode = "90001";
      break;
    case "Memphis Grizzlies":
      zipcode = "37501";
      break;
    case "Miami Heat":
      zipcode = "33101";
      break;
    case "Milwaukee Bucks":
      zipcode = "53201";
      break;
    case "Minnesota Timberwolves":
      zipcode = "55401";
      break;
    case "New Orleans Pelicans":
      zipcode = "70112";
      break;
    case "New York Knicks":
      zipcode = "10001";
      break;
    case "Oklahoma City Thunder":
      zipcode = "73101";
      break;
    case "Orlando Magic":
      zipcode = "32801";
      break;
    case "Philadelphia 76ers":
      zipcode = "19019";
      break;
    case "Phoenix Suns":
      zipcode = "85001";
      break;
    case "Portland Trail Blazers":
      zipcode = "97086";
      break;
    case "Sacramento Kings":
      zipcode = "94203";
      break;
    case "San Antonio Spurs":
      zipcode = "78201";
      break;
    case "Toronto Raptors":
      zipcode = "14201";
      break;
    case "Utah Jazz":
      zipcode = "84101";
      break;
    case "Washington Wizards":
      zipcode = "20004";
      break;
  }
  return zipcode;
}

function getGameDay(gameDay) {
  if (gameDay.length < 2) {
    return "0" + gameDay;
  }
  return gameDay;
}

function getGameMonth(month) {
  var numMonth;
  switch (month) {
    case "Oct":
      numMonth = "10";
      break;
    case "Nov":
      numMonth = "11";
      break;
    case "Dec":
      numMonth = "12";
      break;
    case "Jan":
      numMonth = "01";
      break;
    case "Feb":
      numMonth = "02";
      break;
    case "Mar":
      numMonth = "03";
      break;
  }
  return numMonth;
}
const _MS_PER_DAY = 1000 * 60 * 60 * 24;
