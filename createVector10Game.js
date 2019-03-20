const csvFilePath = "./csv-boxscores/3_19_2019.csv";
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
                //var homeWinPct = getHomeWinPercentage(homeGames, home["Name"]);
                var homeScoringMargin = await getScoringMargin(
                  homeGames,
                  home["Name"]
                );
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
                var homeTenGameAvg = await getTenGamesStats(
                  homeGames,
                  home["Name"]
                );
                var awayTenGameAvg = await getTenGamesStats(
                  awayGames,
                  away["Name"]
                );
                //var awayWinPct = getAwayWinPercentage(awayGames, away["Name"]);
                var awayScoringMargin = await getScoringMargin(
                  awayGames,
                  away["Name"]
                );
                var seasonHeadToHead = await getHeadToHeadAverage(
                  homeGames,
                  away["Name"]
                );
                // var homeDist = await getDistanceTraveled(homeGames, home.Name);
                // console.log(home.Name + " " + homeDist);
                // var awayDist = await getDistanceTraveled(awayGames, away.Name);
                // console.log(away.Name + " " + awayDist);
                // gameVector["Travel_Difference_9Day"] =
                //   parseInt(homeDist) - parseInt(awayDist);
                gameVector["Last_Game_Margin"] =
                  homeScoringMargin.lastOne - awayScoringMargin.lastOne;
                gameVector["Last_3Game_Margin"] = (
                  homeScoringMargin.lastThree - awayScoringMargin.lastThree
                ).toFixed(1);
                gameVector["Home_Away_Margin"] = (
                  homeScoringMargin.homeMargin - awayScoringMargin.awayMargin
                ).toFixed(1);
                gameVector["Head_To_Head_Avg_Spread"] =
                  seasonHeadToHead.averageDifference;
                gameVector["Head_To_Head_GP"] = seasonHeadToHead.gamesPlayed;
                gameVector["Head_To_Head_3P"] = seasonHeadToHead.threes;
                gameVector["Head_To_Head_3PA"] = seasonHeadToHead.threes_att;
                gameVector["Head_To_Head_AST"] = seasonHeadToHead.ast;
                gameVector["Head_To_Head_BLK_PCT"] = seasonHeadToHead.blk_pct;
                gameVector["Head_To_Head_FGM"] = seasonHeadToHead.fgm;
                gameVector["Head_To_Head_FGA"] = seasonHeadToHead.fga;
                gameVector["Head_To_Head_FTA"] = seasonHeadToHead.fta;
                gameVector["Head_To_Head_FTM"] = seasonHeadToHead.ftm;
                gameVector["Head_To_Head_ORB"] = seasonHeadToHead.orb;
                gameVector["Head_To_Head_ORB_PCT"] = seasonHeadToHead.orb_pct;
                gameVector["Head_To_Head_STL"] = seasonHeadToHead.stl;
                gameVector["Head_To_Head_TOV_PCT"] = seasonHeadToHead.tov_pct;
                gameVector["Head_To_Head_TRB"] = seasonHeadToHead.trb;
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
                gameVector["WinPct"] = (
                  parseInt(home.W) / (parseInt(home.W) + parseInt(home.L)) -
                  parseInt(away.W) / (parseInt(away.W) + parseInt(away.L))
                ).toFixed(3);
                gameVector["MOV"] = homeTenGameAvg.MOV - awayTenGameAvg.MOV;
                gameVector["FG"] = (
                  homeTenGameAvg.FG - awayTenGameAvg.FG
                ).toFixed(1);
                gameVector["FGA"] = (
                  homeTenGameAvg.FGA - awayTenGameAvg.FGA
                ).toFixed(1);
                gameVector["FG_PCT"] = (
                  homeTenGameAvg.FG_PCT - awayTenGameAvg.FG_PCT
                ).toFixed(3);
                gameVector["Three_Pointers"] = (
                  homeTenGameAvg.Three_Pointers - awayTenGameAvg.Three_Pointers
                ).toFixed(1);
                gameVector["Three_Pointers_Att"] = (
                  homeTenGameAvg.Three_Pointers_Att -
                  awayTenGameAvg.Three_Pointers_Att
                ).toFixed(1);
                gameVector["Three_Pointers_Pct"] = (
                  homeTenGameAvg.Three_Pointers_Pct -
                  awayTenGameAvg.Three_Pointers_Pct
                ).toFixed(3);
                // Subtract stats between competing teams to create input vectors
                // for (var stat in home) {
                //   if (
                //     !(
                //       stat === "Name" ||
                //       stat === "GP" ||
                //       stat === "id" ||
                //       stat === "MOV"
                //     )
                //   ) {
                //     var num = parseFloat(home[stat]) - parseFloat(away[stat]);
                //     if (num % 1 !== 0) {
                //       var n = num.toFixed(3);
                //       gameVector[stat] = n;
                //     } else {
                //       gameVector[stat] = num;
                //     }
                //   }
                // }
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
          "/Users/michaelgriffin/Deep_Learning_A_Z/SDL/ANN/Building_ANN/Artificial_Neural_Networks/today.csv";

        fs.writeFile(fileName, result);
        //console.log(result);
      }
    );
  });

function getTenGamesStats(games, team) {
  var tenGameStats = {
    MOV: 0,
    FG: 0,
    FGA: 0,
    FG_PCT: 0.0,
    Three_Pointers: 0,
    Three_Pointers_Att: 0,
    Three_Pointers_Pct: 0.0,
    FT: 0,
    FTA: 0,
    FT_PCT: 0.0
  };

  games.sort(function(a, b) {
    return parseInt(a.Difference) - parseInt(b.Difference);
  });
  // Remove games that have not been played yet and games from other seasons.
  var arr = games.filter(function(game) {
    return game.Difference > 0 && game.Difference < 240;
  });
  if (arr.length > 0) {
    // Iterate last ten games stats
    for (let i = 0; i < 10; i++) {
      console.log(arr[i]);
      if (arr[i].Home === team) {
        tenGameStats.MOV += arr[i].Home_Diff;
        tenGameStats.FG += parseFloat(arr[i].Home_FG);
        tenGameStats.FGA += parseFloat(arr[i].Home_FGA);
        tenGameStats.FG_PCT +=
          parseFloat(arr[i].Home_FG) / parseFloat(arr[i].Home_FGA);
        tenGameStats.Three_Pointers += parseFloat(arr[i].Home_3P);
        tenGameStats.Three_Pointers_Att += parseFloat(arr[i].Home_3PA);
        tenGameStats.Three_Pointers_Pct +=
          parseFloat(arr[i].Home_3P) / parseFloat(arr[i].Home_3PA);
        tenGameStats.FT += parseFloat(arr[i].Home_FT);
        tenGameStats.FTA += parseFloat(arr[i].Home_FTA);
        tenGameStats.FT_PCT +=
          parseFloat(arr[i].Home_FT) / parseFloat(arr[i].Home_FTA);
      }
      if (arr[i].Home !== team) {
        tenGameStats.MOV -= arr[i].Home_Diff;
        tenGameStats.FG += parseFloat(arr[i].Away_FG);
        tenGameStats.FGA += parseFloat(arr[i].Away_FGA);
        tenGameStats.FG_PCT +=
          parseFloat(arr[i].Away_FG) / parseFloat(arr[i].Away_FGA);
        tenGameStats.Three_Pointers += parseFloat(arr[i].Away_3P);
        tenGameStats.Three_Pointers_Att += parseFloat(arr[i].Away_3PA);
        tenGameStats.Three_Pointers_Pct +=
          parseFloat(arr[i].Away_3P) / parseFloat(arr[i].Away_3PA);
        tenGameStats.FT += parseFloat(arr[i].Away_FT);
        tenGameStats.FTA += parseFloat(arr[i].Away_FTA);
        tenGameStats.FT_PCT +=
          parseFloat(arr[i].Away_FT) / parseFloat(arr[i].Away_FTA);
      }
    }
  }
  //console.log(tenGameStats.MOV);
  tenGameStats.MOV = parseFloat(tenGameStats.MOV / 10);
  tenGameStats.FG = parseFloat(tenGameStats.FG / 10);
  tenGameStats.FGA = parseFloat(tenGameStats.FGA / 10);
  tenGameStats.FG_PCT = parseFloat(tenGameStats.FG_PCT / 10);
  tenGameStats.Three_Pointers = parseFloat(tenGameStats.Three_Pointers / 10);
  tenGameStats.Three_Pointers_Att = parseFloat(
    tenGameStats.Three_Pointers_Att / 10
  );
  tenGameStats.Three_Pointers_Pct = parseFloat(
    tenGameStats.Three_Pointers_Pct / 10
  );
  tenGameStats.FT = parseFloat(tenGameStats.FT / 10);
  tenGameStats.FTA = parseFloat(tenGameStats.FTA / 10);
  tenGameStats.FT_PCT = parseFloat(tenGameStats.FT_PCT / 10);
  console.log(team + ": " + tenGameStats.FG);

  return tenGameStats;
}

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

function getScoringMargin(games, team) {
  var scoringMargin = {
    lastThree: 0,
    lastOne: 0,
    homeMargin: 0,
    awayMargin: 0
  };
  games.sort(function(a, b) {
    return parseInt(a.Difference) - parseInt(b.Difference);
  });
  // Remove games that have not been played yet and games from other seasons.
  var arr = games.filter(function(game) {
    return game.Difference > 0 && game.Difference < 240;
  });
  //console.log(arr);
  if (arr.length > 0) {
    // Get last game played margin
    if (arr[0].Home === team) {
      scoringMargin.lastOne += arr[0].Home_Diff;
    } else {
      scoringMargin.lastOne -= arr[0].Home_Diff;
    }
    // Get Season home and away margin
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].Home === team) {
        scoringMargin.homeMargin += arr[i].Home_Diff;
      }
      if (arr[i].Home !== team) {
        scoringMargin.awayMargin -= arr[i].Home_Diff;
      }
    }
    // Get last three games margin
    for (let j = 0; j < 3; j++) {
      if (arr[j].Home === team) {
        scoringMargin.lastThree += arr[j].Home_Diff;
      }
      if (arr[j].Home !== team) {
        scoringMargin.lastThree -= arr[j].Home_Diff;
      }
    }
    // Average season margins
    scoringMargin.homeMargin = (scoringMargin.homeMargin / arr.length).toFixed(
      1
    );
    scoringMargin.awayMargin = (scoringMargin.awayMargin / arr.length).toFixed(
      1
    );
    scoringMargin.lastThree = (scoringMargin.lastThree / 3).toFixed(1);
  }
  //console.log(team + " SCORING: ", scoringMargin);
  return scoringMargin;
}

function getHeadToHeadAverage(games, opponent) {
  var headToHeadSeason = {
    averageDifference: 0,
    gamesPlayed: 0,
    threes: 0,
    threes_att: 0,
    ast: 0,
    blk_pct: 0.0,
    fgm: 0,
    fga: 0,
    fta: 0,
    ftm: 0,
    orb: 0,
    orb_pct: 0.0,
    stl: 0,
    tov_pct: 0.0,
    trb: 0
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
  //console.log("GAME: ", arr);
  // Iterate through games played head to head this season.
  if (arr.length > 0) {
    var count = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].Visitor === opponent) {
        count += arr[i].Home_Diff;
        headToHeadSeason.threes +=
          parseInt(arr[i]["Home_3P"]) - parseInt(arr[i]["Away_3P"]);
        headToHeadSeason.threes_att +=
          parseInt(arr[i]["Home_3PA"]) - parseInt(arr[i]["Away_3PA"]);
        headToHeadSeason.ast +=
          parseInt(arr[i]["Home_AST"]) - parseInt(arr[i]["Away_AST"]);
        headToHeadSeason.blk_pct +=
          parseFloat(arr[i]["Home_BLK_PCT"]) -
          parseFloat(arr[i]["Away_BLK_PCT"]);
        headToHeadSeason.fgm +=
          parseInt(arr[i]["Home_FG"]) - parseInt(arr[i]["Away_FG"]);
        headToHeadSeason.fga +=
          parseInt(arr[i]["Home_FGA"]) - parseInt(arr[i]["Away_FGA"]);
        headToHeadSeason.fta +=
          parseInt(arr[i]["Home_FTA"]) - parseInt(arr[i]["Away_FTA"]);
        headToHeadSeason.ftm +=
          parseInt(arr[i]["Home_FTM"]) - parseInt(arr[i]["Away_FTM"]);
        headToHeadSeason.orb +=
          parseInt(arr[i]["Home_ORB"]) - parseInt(arr[i]["Away_ORB"]);
        headToHeadSeason.orb_pct +=
          parseFloat(arr[i]["Home_ORB_PCT"]) -
          parseFloat(arr[i]["Away_ORB_PCT"]);
        headToHeadSeason.stl +=
          parseInt(arr[i]["Home_ST"]) - parseInt(arr[i]["Away_STL"]);
        headToHeadSeason.tov_pct +=
          parseFloat(arr[i]["Home_TOV_PCT"]) -
          parseFloat(arr[i]["Away_TOV_PCT"]);
        headToHeadSeason.trb +=
          parseInt(arr[i]["Home_TRB"]) - parseInt(arr[i]["Away_TRB"]);
      } else {
        count -= arr[i].Home_Diff;
        headToHeadSeason.threes -=
          parseInt(arr[i]["Home_3P"]) - parseInt(arr[i]["Away_3P"]);
        headToHeadSeason.threes_att -=
          parseInt(arr[i]["Home_3PA"]) - parseInt(arr[i]["Away_3PA"]);
        headToHeadSeason.ast -=
          parseInt(arr[i]["Home_AST"]) - parseInt(arr[i]["Away_AST"]);
        headToHeadSeason.blk_pct -=
          parseFloat(arr[i]["Home_BLK_PCT"]) -
          parseFloat(arr[i]["Away_BLK_PCT"]);
        headToHeadSeason.fgm -=
          parseInt(arr[i]["Home_FG"]) - parseInt(arr[i]["Away_FG"]);
        headToHeadSeason.fga -=
          parseInt(arr[i]["Home_FGA"]) - parseInt(arr[i]["Away_FGA"]);
        headToHeadSeason.fta -=
          parseInt(arr[i]["Home_FTA"]) - parseInt(arr[i]["Away_FTA"]);
        headToHeadSeason.ftm -=
          parseInt(arr[i]["Home_FTM"]) - parseInt(arr[i]["Away_FTM"]);
        headToHeadSeason.orb -=
          parseInt(arr[i]["Home_ORB"]) - parseInt(arr[i]["Away_ORB"]);
        headToHeadSeason.orb_pct -=
          parseFloat(arr[i]["Home_ORB_PCT"]) -
          parseFloat(arr[i]["Away_ORB_PCT"]);
        headToHeadSeason.stl -=
          parseInt(arr[i]["Home_ST"]) - parseInt(arr[i]["Away_STL"]);
        headToHeadSeason.tov_pct -=
          parseFloat(arr[i]["Home_TOV_PCT"]) -
          parseFloat(arr[i]["Away_TOV_PCT"]);
        headToHeadSeason.trb -=
          parseInt(arr[i]["Home_TRB"]) - parseInt(arr[i]["Away_TRB"]);
      }
    }
    headToHeadSeason.averageDifference = (count / arr.length).toFixed(1);
    headToHeadSeason.threes = (headToHeadSeason.threes / arr.length).toFixed(1);
    headToHeadSeason.threes_att = (
      headToHeadSeason.threes_att / arr.length
    ).toFixed(1);
    headToHeadSeason.ast = (headToHeadSeason.ast / arr.length).toFixed(1);
    headToHeadSeason.blk_pct = (headToHeadSeason.blk_pct / arr.length).toFixed(
      1
    );
    headToHeadSeason.fgm = (headToHeadSeason.fgm / arr.length).toFixed(1);
    headToHeadSeason.fga = (headToHeadSeason.fga / arr.length).toFixed(1);
    headToHeadSeason.fta = (headToHeadSeason.fta / arr.length).toFixed(1);
    headToHeadSeason.ftm = (headToHeadSeason.ftm / arr.length).toFixed(1);
    headToHeadSeason.orb = (headToHeadSeason.orb / arr.length).toFixed(1);
    headToHeadSeason.orb_pct = (headToHeadSeason.orb_pct / arr.length).toFixed(
      1
    );
    headToHeadSeason.stl = (headToHeadSeason.stl / arr.length).toFixed(1);
    headToHeadSeason.tov_pct = (headToHeadSeason.tov_pct / arr.length).toFixed(
      1
    );
    headToHeadSeason.trb = (headToHeadSeason.trb / arr.length).toFixed(1);

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
