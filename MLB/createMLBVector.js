const csvFilePath = "./mlb-csv-boxscores/input.csv";
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
    // var dateArr = jsonObj["date"].split(" ");
    // jsonObj["date"] = dateArr[0] + " " + dateArr[1] + " " + dateArr[2];
    // var month;
    // // Add Season column
    // if (dateArr[0] === "Oct" || dateArr[0] === "Nov" || dateArr[0] === "Dec") {
    //   var temp = parseInt(dateArr[2]) + 1;
    //   jsonObj["Season"] = temp.toString();
    // } else {
    //   jsonObj["Season"] = dateArr[2];
    // }
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
            axios.get("http://localhost:8000/api/teamStats/getMLBBoxScores", {
              params: {
                team: vectors[count]["Home"]
              }
            }),
            axios.get("http://localhost:8000/api/teamStats/getMLBBoxScores", {
              params: {
                team: vectors[count]["Away"]
              }
            })
          ])
          .then(
            axios.spread(async (homeSchedule, awaySchedule) => {
              var homeGames = homeSchedule.data;
              var awayGames = awaySchedule.data;
              //console.log(awayGames);
              var gameVector = {};
              var gameDateArr = vectors[count]["date"].split(" ");
              var gameMonth = getGameMonth(gameDateArr[0]);
              var gameDay = getGameDay(gameDateArr[1]);
              var gameDate = gameDateArr[2] + "-" + gameMonth + "-" + gameDay;
              var currentGame = new Date(gameDate);
              for (let i = 0; i < homeGames.length; i++) {
                let dateArr = homeGames[i]["Date"].split(" ");
                let month = getGameMonth(dateArr[0]);
                let day = getGameDay(dateArr[1]);
                let game = dateArr[2] + "-" + month + "-" + day;
                let pastGame = new Date(game);
                let difference = dateDiffInDays(pastGame, currentGame);
                homeGames[i]["Difference"] = difference;
              }
              for (let j = 0; j < awayGames.length; j++) {
                let dateArr = awayGames[j]["Date"].split(" ");
                let month = getGameMonth(dateArr[0]);
                let day = getGameDay(dateArr[1]);
                let game = dateArr[2] + "-" + month + "-" + day;
                let pastGame = new Date(game);
                let difference = dateDiffInDays(pastGame, currentGame);
                awayGames[j]["Difference"] = difference;
              }
              var homePastGameAvg = await getPastGamesStats(
                homeGames,
                vectors[count]["Home"]
              );
              var awayPastGameAvg = await getPastGamesStats(
                awayGames,
                vectors[count]["Away"]
              );
              var homeStarter = await getHomeStarterStats(
                homeGames,
                vectors[count]["homeStarter"]
              );
              var awayStarter = await getAwayStarterStats(
                awayGames,
                vectors[count]["awayStarter"]
              );
              var homeScoringMargin = await getScoringMargin(
                homeGames,
                vectors[count]["Home"]
              );
              var awayScoringMargin = await getScoringMargin(
                awayGames,
                vectors[count]["Away"]
              );
              var seasonHeadToHead = await getHeadToHeadAverage(
                homeGames,
                vectors[count]["Away"]
              );
              gameVector["HOME"] = vectors[count]["Home"];
              gameVector["AWAY"] = vectors[count]["Away"];
              gameVector["DATE"] = vectors[count]["date"];
              gameVector["Total_Runs"] = vectors[count]["Total_Runs"];
              gameVector["HW"] = vectors[count]["HW"];
              gameVector["Home_Score"] = vectors[count]["homeRuns"];
              gameVector["Away_Score"] = vectors[count]["awayRuns"];
              gameVector["H2H_Avg_Spread"] = seasonHeadToHead.averageDifference;
              gameVector["H2H_GP"] = seasonHeadToHead.gamesPlayed;
              gameVector["H2H_ERA"] = seasonHeadToHead.H2H_ERA;
              gameVector["H2H_BAVG"] = seasonHeadToHead.H2H_BAVG;
              gameVector["H2H_Hits"] = seasonHeadToHead.H2H_Hits;
              gameVector["H2H_RBI"] = seasonHeadToHead.H2H_RBI;
              gameVector["H2H_OBP"] = seasonHeadToHead.H2H_OBP;
              gameVector["H2H_OPS"] = seasonHeadToHead.H2H_OPS;

              console.log(
                vectors[count]["Away"] + " @ " + vectors[count]["Home"]
              );
              for (var stat in homePastGameAvg) {
                var num =
                  parseFloat(homePastGameAvg[stat]) -
                  parseFloat(awayPastGameAvg[stat]);
                if (num % 1 !== 0) {
                  var n = num.toFixed(3);
                  gameVector[stat] = n;
                } else {
                  gameVector[stat] = num;
                }
              }
              for (var stat in homeStarter) {
                var num =
                  parseFloat(homeStarter[stat]) - parseFloat(awayStarter[stat]);
                if (num % 1 !== 0) {
                  var n = num.toFixed(2);
                  gameVector[stat] = n;
                } else {
                  gameVector[stat] = num;
                }
              }
              gameVector["Home_Away_Margin"] = (
                homeScoringMargin.homeMargin - awayScoringMargin.awayMargin
              ).toFixed(2);
              gameVector["Home_Away_ERA"] = (
                homeScoringMargin.H_ERA - awayScoringMargin.A_ERA
              ).toFixed(2);
              gameVector["Home_Away_BAVG"] = (
                homeScoringMargin.H_BAVG - awayScoringMargin.A_BAVG
              ).toFixed(3);
              gameVector["Home_Away_Hits"] = (
                homeScoringMargin.H_Hits - awayScoringMargin.A_Hits
              ).toFixed(1);
              gameVector["Home_Away_RBI"] = (
                homeScoringMargin.H_RBI - awayScoringMargin.A_RBI
              ).toFixed(1);
              gameVector["Home_Away_OBP"] = (
                homeScoringMargin.H_OBP - awayScoringMargin.A_OBP
              ).toFixed(3);
              gameVector["Home_Away_OPS"] = (
                homeScoringMargin.H_OPS - awayScoringMargin.A_OPS
              ).toFixed(3);
              console.log(gameVector);
              finalArr.push(gameVector);
              console.log(
                Math.floor((finalArr.length / vectors.length) * 100) +
                  "% completed"
              );
              count++;
              next();
            })
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
        // var currentTime = new Date();
        // var month = currentTime.getMonth() + 1;
        // var day = currentTime.getDate();
        // var year = currentTime.getFullYear();
        var fileName =
          "/Users/michaelgriffin/Deep_Learning_A_Z/SDL/ANN/Building_ANN/Artificial_Neural_Networks/MLB_today.csv";

        fs.writeFile(fileName, result);
        console.log(result);
      }
    );
  });

function getPastGamesStats(games, team) {
  var pastGameStats = {
    MOV: 0,
    Runs: 0,
    ERA: 0,
    BAVG: 0.0,
    PA: 0,
    AB: 0,
    Hits: 0,
    HR: 0,
    RBI: 0,
    OBP: 0.0,
    SLG: 0.0,
    OPS: 0.0,
    SO: 0,
    Pitches_Seen: 0,
    Strikes_Taken_Pct: 0.0,
    AST: 0,
    PO: 0,
    Errors: 0,
    BB: 0,
    BP_H9: 0,
    BP_HR9: 0,
    BP_BB9: 0,
    BP_IP: 0.0,
    BP_SO9: 0.0,
    BP_WHIP: 0.0,
    BP_FIP: 0.0,
    BP_BF: 0,
    BP_ERA: 0.0,
    BP_StrPct: 0.0,
    Def_Chances: 0,
    Win_Pct: 0.0,
    WPA: 0.0,
    BORA: 0.0
  };
  var wins = 0;

  games.sort(function(a, b) {
    return parseInt(a.Difference) - parseInt(b.Difference);
  });
  // Remove games that have not been played yet and games from other seasons.
  var arr = games.filter(function(game) {
    return game.Difference > 0 && game.Difference < 240;
  });
  var newArr = arr.slice(0, 15);
  if (arr.length > 0) {
    // Iterate last fifteen games stats
    for (let i = 0; i < newArr.length; i++) {
      //console.log(newArr[i]);
      if (newArr[i].Home === team) {
        pastGameStats.MOV +=
          parseInt(newArr[i].Home_Runs) - parseInt(newArr[i].Away_Runs);
        pastGameStats.Runs += parseFloat(newArr[i].Home_Runs);
        pastGameStats.ERA +=
          parseFloat(newArr[i].Home_SP_ERA) + parseFloat(newArr[i].Home_BP_ERA);
        pastGameStats.BAVG += parseFloat(newArr[i].Home_BA);
        pastGameStats.PA += parseFloat(newArr[i].Home_PA);
        pastGameStats.AB += parseFloat(newArr[i].Home_AB);
        pastGameStats.Hits += parseFloat(newArr[i].Home_Hits);
        pastGameStats.HR +=
          parseFloat(newArr[i].Away_SP_HRA) + parseFloat(newArr[i].Away_BP_HRA);
        pastGameStats.RBI += parseFloat(newArr[i].Home_RBI);
        pastGameStats.OBP += parseFloat(newArr[i].Home_OBP);
        pastGameStats.SLG += parseFloat(newArr[i].Home_SLG);
        pastGameStats.OPS += parseFloat(newArr[i].Home_OPS);
        pastGameStats.SO +=
          parseFloat(newArr[i].Away_SP_SO) + parseFloat(newArr[i].Away_BP_SO);
        pastGameStats.Pitches_Seen += parseFloat(newArr[i].Home_Pitches_Seen);
        pastGameStats.Strikes_Taken_Pct +=
          parseFloat(newArr[i].Home_Strikes_Taken) /
          parseFloat(newArr[i].Home_Pitches_Seen);
        pastGameStats.AST += parseFloat(newArr[i].Home_AST);
        pastGameStats.PO += parseFloat(newArr[i].Home_PO);
        pastGameStats.Errors += parseFloat(newArr[i].Home_Errors);
        pastGameStats.BB += parseFloat(newArr[i].Home_BB);
        if (parseFloat(newArr[i].Home_BP_IP) === 0) {
          pastGameStats.BP_H9 += 0;
          pastGameStats.BP_HR9 += 0;
          pastGameStats.BP_BB9 += 0;
          pastGameStats.BP_SO9 += 0;
          pastGameStats.BP_WHIP += 0;
          pastGameStats.BP_FIP += 0;
        } else {
          pastGameStats.BP_H9 +=
            (parseFloat(newArr[i].Home_BP_HA) * 9) /
            parseFloat(newArr[i].Home_BP_IP);
          pastGameStats.BP_HR9 +=
            (parseFloat(newArr[i].Home_BP_HRA) * 9) /
            parseFloat(newArr[i].Home_BP_IP);
          pastGameStats.BP_BB9 +=
            (parseFloat(newArr[i].Home_BP_BB) * 9) /
            parseFloat(newArr[i].Home_BP_IP);
          pastGameStats.BP_SO9 +=
            (parseFloat(newArr[i].Home_BP_SO) * 9) /
            parseFloat(newArr[i].Home_BP_IP);
          pastGameStats.BP_WHIP +=
            (parseFloat(newArr[i].Home_BP_HA) +
              parseFloat(newArr[i].Home_BP_BB)) /
            parseFloat(newArr[i].Home_BP_IP);
          pastGameStats.BP_FIP +=
            (13 * parseFloat(newArr[i].Home_BP_HRA) +
              3 * parseFloat(newArr[i].Home_BP_BB) -
              2 * parseFloat(newArr[i].Home_BP_SO)) /
              parseFloat(newArr[i].Home_BP_IP) +
            3.2;
        }
        pastGameStats.BP_IP += parseFloat(newArr[i].Home_BP_IP);
        pastGameStats.Def_Chances +=
          parseFloat(newArr[i].Home_Errors) +
          parseFloat(newArr[i].Home_AST) +
          parseFloat(newArr[i].Home_PO);
        pastGameStats.BP_BF += parseFloat(newArr[i].Home_BP_BF);
        pastGameStats.BP_ERA += parseFloat(newArr[i].Home_BP_ERA);
        if (parseFloat(newArr[i].Home_Runs) > parseFloat(newArr[i].Away_Runs))
          wins += 1;
        pastGameStats.WPA += parseFloat(newArr[i].Home_WPA);
        pastGameStats.BORA += parseFloat(newArr[i].Home_BORA);
      }
      if (newArr[i].Home !== team) {
        pastGameStats.MOV -=
          parseInt(newArr[i].Home_Runs) - parseInt(newArr[i].Away_Runs);
        pastGameStats.Runs += parseFloat(newArr[i].Away_Runs);
        pastGameStats.ERA +=
          parseFloat(newArr[i].Away_SP_ERA) + parseFloat(newArr[i].Away_BP_ERA);
        pastGameStats.BAVG += parseFloat(newArr[i].Away_BA);
        pastGameStats.PA += parseFloat(newArr[i].Away_PA);
        pastGameStats.AB += parseFloat(newArr[i].Away_AB);
        pastGameStats.Hits += parseFloat(newArr[i].Away_Hits);
        pastGameStats.HR +=
          parseFloat(newArr[i].Home_SP_HRA) + parseFloat(newArr[i].Home_BP_HRA);
        pastGameStats.RBI += parseFloat(newArr[i].Away_RBI);
        pastGameStats.OBP += parseFloat(newArr[i].Away_OBP);
        pastGameStats.SLG += parseFloat(newArr[i].Away_SLG);
        pastGameStats.OPS += parseFloat(newArr[i].Away_OPS);
        pastGameStats.AST += parseFloat(newArr[i].Away_AST);
        pastGameStats.PO += parseFloat(newArr[i].Away_PO);
        pastGameStats.Errors += parseFloat(newArr[i].Away_Errors);
        pastGameStats.BB += parseFloat(newArr[i].Away_BB);
        if (parseFloat(newArr[i].Away_BP_IP) === 0) {
          pastGameStats.BP_H9 += 0;
          pastGameStats.BP_HR9 += 0;
          pastGameStats.BP_BB9 += 0;
          pastGameStats.BP_SO9 += 0;
          pastGameStats.BP_WHIP += 0;
          pastGameStats.BP_FIP += 0;
        } else {
          pastGameStats.BP_H9 +=
            (parseFloat(newArr[i].Away_BP_HA) * 9) /
            parseFloat(newArr[i].Away_BP_IP);
          pastGameStats.BP_HR9 +=
            (parseFloat(newArr[i].Away_BP_HRA) * 9) /
            parseFloat(newArr[i].Away_BP_IP);
          pastGameStats.BP_BB9 +=
            (parseFloat(newArr[i].Away_BP_BB) * 9) /
            parseFloat(newArr[i].Away_BP_IP);
          pastGameStats.BP_SO9 +=
            (parseFloat(newArr[i].Away_BP_SO) * 9) /
            parseFloat(newArr[i].Away_BP_IP);
          pastGameStats.BP_WHIP +=
            (parseFloat(newArr[i].Away_BP_HA) +
              parseFloat(newArr[i].Away_BP_BB)) /
            parseFloat(newArr[i].Away_BP_IP);
          pastGameStats.BP_FIP +=
            (13 * parseFloat(newArr[i].Away_BP_HRA) +
              3 * parseFloat(newArr[i].Away_BP_BB) -
              2 * parseFloat(newArr[i].Away_BP_SO)) /
              parseFloat(newArr[i].Away_BP_IP) +
            3.2;
        }
        pastGameStats.BP_IP += parseFloat(newArr[i].Away_BP_IP);
        pastGameStats.Def_Chances +=
          parseFloat(newArr[i].Away_Errors) +
          parseFloat(newArr[i].Away_AST) +
          parseFloat(newArr[i].Away_PO);
        pastGameStats.SO +=
          parseFloat(newArr[i].Home_SP_SO) + parseFloat(newArr[i].Home_BP_SO);
        pastGameStats.Pitches_Seen += parseFloat(newArr[i].Away_Pitches_Seen);
        pastGameStats.Strikes_Taken_Pct +=
          parseFloat(newArr[i].Away_Strikes_Taken) /
          parseFloat(newArr[i].Away_Pitches_Seen);
        pastGameStats.BP_BF += parseFloat(newArr[i].Away_BP_BF);
        pastGameStats.BP_ERA += parseFloat(newArr[i].Away_BP_ERA);
        if (parseFloat(newArr[i].Away_Runs) > parseFloat(newArr[i].Home_Runs))
          wins += 1;
        pastGameStats.WPA += parseFloat(newArr[i].Away_WPA);
        pastGameStats.BORA += parseFloat(newArr[i].Away_BORA);
      }
      //console.log(pastGameStats.BP_H9);
    }
  }
  pastGameStats.MOV = parseFloat(pastGameStats.MOV / newArr.length);
  pastGameStats.Runs = parseFloat(pastGameStats.Runs / newArr.length);
  pastGameStats.ERA = parseFloat(pastGameStats.ERA / newArr.length);
  pastGameStats.BAVG = parseFloat(pastGameStats.BAVG / newArr.length);
  pastGameStats.PA = parseFloat(pastGameStats.PA / newArr.length);
  pastGameStats.AB = parseFloat(pastGameStats.AB / newArr.length);
  pastGameStats.Hits = parseFloat(pastGameStats.Hits / newArr.length);
  pastGameStats.HR = parseFloat(pastGameStats.HR / newArr.length);
  pastGameStats.RBI = parseFloat(pastGameStats.RBI / newArr.length);
  pastGameStats.OBP = parseFloat(pastGameStats.OBP / newArr.length);
  pastGameStats.SLG = parseFloat(pastGameStats.SLG / newArr.length);
  pastGameStats.OPS = parseFloat(pastGameStats.OPS / newArr.length);
  pastGameStats.AST = parseFloat(pastGameStats.AST / newArr.length);
  pastGameStats.PO = parseFloat(pastGameStats.PO / newArr.length);
  pastGameStats.Errors = parseFloat(pastGameStats.Errors / newArr.length);
  pastGameStats.SO = parseFloat(pastGameStats.SO / newArr.length);
  pastGameStats.Pitches_Seen = parseFloat(
    pastGameStats.Pitches_Seen / newArr.length
  );
  pastGameStats.Strikes_Taken_Pct = parseFloat(
    pastGameStats.Strikes_Taken_Pct / newArr.length
  );
  pastGameStats.BB = parseFloat(pastGameStats.BB / newArr.length);
  pastGameStats.BP_H9 = parseFloat(pastGameStats.BP_H9 / newArr.length);
  pastGameStats.BP_HR9 = parseFloat(pastGameStats.BP_HR9 / newArr.length);
  pastGameStats.BP_BB9 = parseFloat(pastGameStats.BP_BB9 / newArr.length);
  pastGameStats.BP_IP = parseFloat(pastGameStats.BP_IP / newArr.length);
  pastGameStats.BP_SO9 = parseFloat(pastGameStats.BP_SO9 / newArr.length);
  pastGameStats.BP_WHIP = parseFloat(pastGameStats.BP_WHIP / newArr.length);
  pastGameStats.BP_FIP = parseFloat(pastGameStats.BP_FIP / newArr.length);
  pastGameStats.BP_BF = parseFloat(pastGameStats.BP_BF / newArr.length);
  pastGameStats.BP_ERA = parseFloat(pastGameStats.BP_ERA / newArr.length);
  pastGameStats.Def_Chances = parseFloat(
    pastGameStats.Def_Chances / newArr.length
  );
  pastGameStats.Win_Pct = parseFloat(wins / newArr.length);
  pastGameStats.WPA = parseFloat(pastGameStats.WPA / newArr.length);
  pastGameStats.BORA = parseFloat(pastGameStats.BORA / newArr.length);

  //console.log(pastGameStats);
  return pastGameStats;
}

// a and b are javascript Date objects
function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

function getScoringMargin(games, team) {
  var scoringMargin = {
    homeMargin: 0,
    awayMargin: 0,
    H_ERA: 0.0,
    H_BAVG: 0.0,
    H_Hits: 0.0,
    H_RBI: 0.0,
    H_OBP: 0.0,
    H_OPS: 0.0,
    A_ERA: 0.0,
    A_BAVG: 0.0,
    A_Hits: 0.0,
    A_RBI: 0.0,
    A_OBP: 0.0,
    A_OPS: 0.0
  };
  var homeGamesCount = 0;
  var awayGamesCount = 0;
  games.sort(function(a, b) {
    return parseInt(a.Difference) - parseInt(b.Difference);
  });
  // Remove games that have not been played yet and games from other seasons.
  var arr = games.filter(function(game) {
    return game.Difference > 0 && game.Difference < 240;
  });
  //console.log(arr);
  if (arr.length > 0) {
    // Get Season home and away margin
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].Home === team) {
        homeGamesCount += 1;
        scoringMargin.homeMargin +=
          parseFloat(arr[i].Home_Runs) - parseFloat(arr[i].Away_Runs);
        scoringMargin.H_ERA +=
          parseFloat(arr[i].Home_SP_ERA) + parseFloat(arr[i].Home_BP_ERA);
        scoringMargin.H_BAVG += parseFloat(arr[i].Home_BA);
        scoringMargin.H_Hits += parseFloat(arr[i].Home_Hits);
        scoringMargin.H_RBI += parseFloat(arr[i].Home_RBI);
        scoringMargin.H_OBP += parseFloat(arr[i].Home_OBP);
        scoringMargin.H_OPS += parseFloat(arr[i].Home_OPS);
      }
      if (arr[i].Home !== team) {
        awayGamesCount += 1;
        scoringMargin.awayMargin -=
          parseFloat(arr[i].Home_Runs) - parseFloat(arr[i].Away_Runs);
        scoringMargin.A_ERA +=
          parseFloat(arr[i].Away_SP_ERA) + parseFloat(arr[i].Away_BP_ERA);
        scoringMargin.A_BAVG += parseFloat(arr[i].Away_BA);
        scoringMargin.A_Hits += parseFloat(arr[i].Away_Hits);
        scoringMargin.A_RBI += parseFloat(arr[i].Away_RBI);
        scoringMargin.A_OBP += parseFloat(arr[i].Away_OBP);
        scoringMargin.A_OPS += parseFloat(arr[i].Away_OPS);
      }
    }
    // Average season margins
    scoringMargin.homeMargin = (scoringMargin.homeMargin / arr.length).toFixed(
      1
    );
    scoringMargin.awayMargin = (scoringMargin.awayMargin / arr.length).toFixed(
      1
    );
    scoringMargin.H_ERA = (scoringMargin.H_ERA / homeGamesCount).toFixed(2);
    scoringMargin.H_BAVG = (scoringMargin.H_BAVG / homeGamesCount).toFixed(3);
    scoringMargin.H_Hits = (scoringMargin.H_Hits / homeGamesCount).toFixed(1);
    scoringMargin.H_RBI = (scoringMargin.H_RBI / homeGamesCount).toFixed(1);
    scoringMargin.H_OBP = (scoringMargin.H_OBP / homeGamesCount).toFixed(3);
    scoringMargin.H_OPS = (scoringMargin.H_OPS / homeGamesCount).toFixed(3);
    scoringMargin.A_ERA = (scoringMargin.A_ERA / awayGamesCount).toFixed(2);
    scoringMargin.A_BAVG = (scoringMargin.A_BAVG / awayGamesCount).toFixed(3);
    scoringMargin.A_Hits = (scoringMargin.A_Hits / awayGamesCount).toFixed(1);
    scoringMargin.A_RBI = (scoringMargin.A_RBI / awayGamesCount).toFixed(1);
    scoringMargin.A_OBP = (scoringMargin.A_OBP / awayGamesCount).toFixed(3);
    scoringMargin.A_OPS = (scoringMargin.A_OPS / awayGamesCount).toFixed(3);
  }
  //console.log(team + " SCORING: ", scoringMargin);
  return scoringMargin;
}

function getHeadToHeadAverage(games, opponent) {
  var headToHeadSeason = {
    averageDifference: 0,
    gamesPlayed: 0,
    H2H_ERA: 0.0,
    H2H_BAVG: 0.0,
    H2H_Hits: 0.0,
    H2H_RBI: 0.0,
    H2H_OBP: 0.0,
    H2H_OPS: 0.0
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
      if (arr[i].Away === opponent) {
        count += parseFloat(arr[i].Home_Runs) - parseFloat(arr[i].Away_Runs);
        headToHeadSeason.H2H_ERA +=
          parseFloat(arr[i].Home_SP_ERA) +
          parseFloat(arr[i].Home_BP_ERA) -
          (parseFloat(arr[i].Away_SP_ERA) + parseFloat(arr[i].Away_BP_ERA));
        headToHeadSeason.H2H_BAVG +=
          parseFloat(arr[i].Home_BA) - parseFloat(arr[i].Away_BA);
        headToHeadSeason.H2H_Hits +=
          parseFloat(arr[i].Home_Hits) - parseFloat(arr[i].Away_Hits);
        headToHeadSeason.H2H_RBI +=
          parseFloat(arr[i].Home_RBI) - parseFloat(arr[i].Away_RBI);
        headToHeadSeason.H2H_OBP +=
          parseFloat(arr[i].Home_OBP) - parseFloat(arr[i].Away_OBP);
        headToHeadSeason.H2H_OPS +=
          parseFloat(arr[i].Home_OPS) - parseFloat(arr[i].Away_OPS);
      } else {
        count -= parseFloat(arr[i].Home_Runs) - parseFloat(arr[i].Away_Runs);
        headToHeadSeason.H2H_ERA -=
          parseFloat(arr[i].Home_SP_ERA) +
          parseFloat(arr[i].Home_BP_ERA) -
          (parseFloat(arr[i].Away_SP_ERA) + parseFloat(arr[i].Away_BP_ERA));
        headToHeadSeason.H2H_BAVG -=
          parseFloat(arr[i].Home_BA) - parseFloat(arr[i].Away_BA);
        headToHeadSeason.H2H_Hits -=
          parseFloat(arr[i].Home_Hits) - parseFloat(arr[i].Away_Hits);
        headToHeadSeason.H2H_RBI -=
          parseFloat(arr[i].Home_RBI) - parseFloat(arr[i].Away_RBI);
        headToHeadSeason.H2H_OBP -=
          parseFloat(arr[i].Home_OBP) - parseFloat(arr[i].Away_OBP);
        headToHeadSeason.H2H_OPS -=
          parseFloat(arr[i].Home_OPS) - parseFloat(arr[i].Away_OPS);
      }
    }
    headToHeadSeason.averageDifference = (count / arr.length).toFixed(1);
    headToHeadSeason.H2H_ERA = (headToHeadSeason.H2H_ERA / arr.length).toFixed(
      2
    );
    headToHeadSeason.H2H_BAVG = (
      headToHeadSeason.H2H_BAVG / arr.length
    ).toFixed(3);
    headToHeadSeason.H2H_Hits = (
      headToHeadSeason.H2H_Hits / arr.length
    ).toFixed(1);
    headToHeadSeason.H2H_RBI = (headToHeadSeason.H2H_RBI / arr.length).toFixed(
      1
    );
    headToHeadSeason.H2H_OBP = (headToHeadSeason.H2H_OBP / arr.length).toFixed(
      3
    );
    headToHeadSeason.H2H_OPS = (headToHeadSeason.H2H_OPS / arr.length).toFixed(
      3
    );

    headToHeadSeason.gamesPlayed = arr.length;
  }
  //console.log(headToHeadSeason);
  return headToHeadSeason;
}

function getHomeStarterStats(games, starter) {
  var starterStats = {
    SP_H9: 0,
    SP_HR9: 0,
    SP_BB9: 0,
    SP_IP: 0.0,
    SP_SO9: 0.0,
    SP_WHIP: 0.0,
    SP_FIP: 0.0,
    SP_BF: 0,
    SP_ERA: 0.0,
    SP_StrPct: 0.0
  };
  games.sort(function(a, b) {
    return parseInt(a.Difference) - parseInt(b.Difference);
  });
  // Remove games that have not been played yet and games from other seasons.
  var arr = games.filter(function(game) {
    return game.Difference >= 0 && game.Difference < 240;
  });
  if (arr.length > 0) {
    //var starter = arr[0]["Home_Starter"];
    var arr2 = games.filter(function(game) {
      return game.Difference > 0 && game.Difference < 240;
    });
    var starterGames = [];
    starterGames = arr2.filter(function(game) {
      return game.Home_Starter === starter || game.Away_Starter === starter;
    });
    if (starterGames.length > 0) {
      var newArr = starterGames.slice(0, 3);
      //console.log(newArr);
      if (newArr.length > 0) {
        for (var i = 0; i < newArr.length; i++) {
          if (newArr[i].Home_Starter === starter) {
            var innings = newArr[i].Home_SP_IP.split(".");
            if (innings.length === 1) {
              newArr[i].Home_SP_IP = innings[0];
            } else if (parseFloat(innings[1]) === 2) {
              newArr[i].Home_SP_IP = innings[0] + ".66";
            } else {
              newArr[i].Home_SP_IP = innings[0] + ".33";
            }
            //console.log(newArr[i].Home_SP_IP);
            starterStats.SP_H9 +=
              (parseFloat(newArr[i].Home_SP_HA) * 9) /
              parseFloat(newArr[i].Home_SP_IP);
            starterStats.SP_HR9 +=
              (parseFloat(newArr[i].Home_SP_HRA) * 9) /
              parseFloat(newArr[i].Home_SP_IP);
            starterStats.SP_BB9 +=
              (parseFloat(newArr[i].Home_SP_BB) * 9) /
              parseFloat(newArr[i].Home_SP_IP);
            starterStats.SP_IP += parseFloat(newArr[i].Home_SP_IP);
            starterStats.SP_SO9 +=
              (parseFloat(newArr[i].Home_SP_SO) * 9) /
              parseFloat(newArr[i].Home_SP_IP);
            starterStats.SP_WHIP +=
              (parseFloat(newArr[i].Home_SP_HA) +
                parseFloat(newArr[i].Home_SP_BB)) /
              parseFloat(newArr[i].Home_SP_IP);
            starterStats.SP_FIP +=
              (13 * parseFloat(newArr[i].Home_SP_HRA) +
                3 * parseFloat(newArr[i].Home_SP_BB) -
                2 * parseFloat(newArr[i].Home_SP_SO)) /
                parseFloat(newArr[i].Home_SP_IP) +
              3.2;
            starterStats.SP_BF += parseFloat(newArr[i].Home_SP_BF);
            starterStats.SP_ERA +=
              (parseFloat(newArr[i].Home_SP_ERA) * 9) /
              parseFloat(newArr[i].Home_SP_IP);
            starterStats.SP_StrPct +=
              parseFloat(newArr[i].Home_SP_Str) /
              (parseFloat(newArr[i].Home_SP_Str) +
                parseFloat(newArr[i].Home_SP_Pit));
          } else {
            var innings = newArr[i].Away_SP_IP.split(".");
            if (innings.length === 1) {
              newArr[i].Away_SP_IP = innings[0];
            } else if (parseFloat(innings[1]) === 2) {
              newArr[i].Away_SP_IP = innings[0] + ".66";
            } else if (parseFloat(innings[1]) === 1) {
              newArr[i].Away_SP_IP = innings[0] + ".33";
            }
            //console.log(newArr[i].Away_SP_IP);
            starterStats.SP_H9 +=
              (parseFloat(newArr[i].Away_SP_HA) * 9) /
              parseFloat(newArr[i].Away_SP_IP);
            starterStats.SP_HR9 +=
              (parseFloat(newArr[i].Away_SP_HRA) * 9) /
              parseFloat(newArr[i].Away_SP_IP);
            starterStats.SP_BB9 +=
              (parseFloat(newArr[i].Away_SP_BB) * 9) /
              parseFloat(newArr[i].Away_SP_IP);
            starterStats.SP_IP += parseFloat(newArr[i].Away_SP_IP);
            starterStats.SP_SO9 +=
              (parseFloat(newArr[i].Away_SP_SO) * 9) /
              parseFloat(newArr[i].Away_SP_IP);
            starterStats.SP_WHIP +=
              (parseFloat(newArr[i].Away_SP_HA) +
                parseFloat(newArr[i].Away_SP_BB)) /
              parseFloat(newArr[i].Away_SP_IP);
            starterStats.SP_FIP +=
              (13 * parseFloat(newArr[i].Away_SP_HRA) +
                3 * parseFloat(newArr[i].Away_SP_BB) -
                2 * parseFloat(newArr[i].Away_SP_SO)) /
                parseFloat(newArr[i].Away_SP_IP) +
              3.2;
            starterStats.SP_BF += parseFloat(newArr[i].Away_SP_BF);
            starterStats.SP_ERA +=
              (parseFloat(newArr[i].Away_SP_ERA) * 9) /
              parseFloat(newArr[i].Away_SP_IP);
            starterStats.SP_StrPct +=
              parseFloat(newArr[i].Away_SP_Str) /
              (parseFloat(newArr[i].Away_SP_Str) +
                parseFloat(newArr[i].Away_SP_Pit));
          }
        }
      }
      starterStats.SP_H9 = parseFloat(starterStats.SP_H9 / newArr.length);
      starterStats.SP_HR9 = parseFloat(starterStats.SP_HR9 / newArr.length);
      starterStats.SP_BB9 = parseFloat(starterStats.SP_BB9 / newArr.length);
      starterStats.SP_IP = parseFloat(starterStats.SP_IP / newArr.length);
      starterStats.SP_SO9 = parseFloat(starterStats.SP_SO9 / newArr.length);
      starterStats.SP_WHIP = parseFloat(starterStats.SP_WHIP / newArr.length);
      starterStats.SP_FIP = parseFloat(starterStats.SP_FIP / newArr.length);
      starterStats.SP_BF = parseFloat(starterStats.SP_BF / newArr.length);
      starterStats.SP_ERA = parseFloat(starterStats.SP_ERA / newArr.length);
      starterStats.SP_StrPct = parseFloat(
        starterStats.SP_StrPct / newArr.length
      );
    }
  }
  //console.log(starterStats);
  return starterStats;
}

function getAwayStarterStats(games, starter) {
  var starterStats = {
    SP_H9: 0,
    SP_HR9: 0,
    SP_BB9: 0,
    SP_IP: 0.0,
    SP_SO9: 0.0,
    SP_WHIP: 0.0,
    SP_FIP: 0.0,
    SP_BF: 0,
    SP_ERA: 0.0,
    SP_StrPct: 0.0
  };
  games.sort(function(a, b) {
    return parseInt(a.Difference) - parseInt(b.Difference);
  });
  // Remove games that have not been played yet and games from other seasons.
  var arr = games.filter(function(game) {
    return game.Difference >= 0 && game.Difference < 240;
  });
  if (arr.length > 0) {
    //var starter = arr[0]["Away_Starter"];
    var arr2 = games.filter(function(game) {
      return game.Difference > 0 && game.Difference < 240;
    });
    var starterGames = [];
    starterGames = arr2.filter(function(game) {
      return game.Home_Starter === starter || game.Away_Starter === starter;
    });
    if (starterGames.length > 0) {
      var newArr = starterGames.slice(0, 3);
      if (newArr.length > 0) {
        for (var i = 0; i < newArr.length; i++) {
          if (newArr[i].Home_Starter === starter) {
            var innings = newArr[i].Home_SP_IP.split(".");
            if (innings.length === 1) {
              newArr[i].Home_SP_IP = innings[0];
            } else if (parseFloat(innings[1]) === 2) {
              newArr[i].Home_SP_IP = innings[0] + ".66";
            } else {
              newArr[i].Home_SP_IP = innings[0] + ".33";
            }
            //console.log(newArr[i].Home_SP_IP);
            starterStats.SP_H9 +=
              (parseFloat(newArr[i].Home_SP_HA) * 9) /
              parseFloat(newArr[i].Home_SP_IP);
            starterStats.SP_HR9 +=
              (parseFloat(newArr[i].Home_SP_HRA) * 9) /
              parseFloat(newArr[i].Home_SP_IP);
            starterStats.SP_BB9 +=
              (parseFloat(newArr[i].Home_SP_BB) * 9) /
              parseFloat(newArr[i].Home_SP_IP);
            starterStats.SP_IP += parseFloat(newArr[i].Home_SP_IP);
            starterStats.SP_SO9 +=
              (parseFloat(newArr[i].Home_SP_SO) * 9) /
              parseFloat(newArr[i].Home_SP_IP);
            starterStats.SP_WHIP +=
              (parseFloat(newArr[i].Home_SP_HA) +
                parseFloat(newArr[i].Home_SP_BB)) /
              parseFloat(newArr[i].Home_SP_IP);
            starterStats.SP_FIP +=
              (13 * parseFloat(newArr[i].Home_SP_HRA) +
                3 * parseFloat(newArr[i].Home_SP_BB) -
                2 * parseFloat(newArr[i].Home_SP_SO)) /
                parseFloat(newArr[i].Home_SP_IP) +
              3.2;
            starterStats.SP_BF += parseFloat(newArr[i].Home_SP_BF);
            starterStats.SP_ERA +=
              (parseFloat(newArr[i].Home_SP_ERA) * 9) /
              parseFloat(newArr[i].Home_SP_IP);
            starterStats.SP_StrPct +=
              parseFloat(newArr[i].Home_SP_Str) /
              (parseFloat(newArr[i].Home_SP_Str) +
                parseFloat(newArr[i].Home_SP_Pit));
          } else {
            var innings = newArr[i].Away_SP_IP.split(".");
            if (innings.length === 1) {
              newArr[i].Away_SP_IP = innings[0];
            } else if (parseFloat(innings[1]) === 2) {
              newArr[i].Away_SP_IP = innings[0] + ".66";
            } else if (parseFloat(innings[1]) === 1) {
              newArr[i].Away_SP_IP = innings[0] + ".33";
            }
            //console.log(newArr[i].Away_SP_IP);
            starterStats.SP_H9 +=
              (parseFloat(newArr[i].Away_SP_HA) * 9) /
              parseFloat(newArr[i].Away_SP_IP);
            starterStats.SP_HR9 +=
              (parseFloat(newArr[i].Away_SP_HRA) * 9) /
              parseFloat(newArr[i].Away_SP_IP);
            starterStats.SP_BB9 +=
              (parseFloat(newArr[i].Away_SP_BB) * 9) /
              parseFloat(newArr[i].Away_SP_IP);
            starterStats.SP_IP += parseFloat(newArr[i].Away_SP_IP);
            starterStats.SP_SO9 +=
              (parseFloat(newArr[i].Away_SP_SO) * 9) /
              parseFloat(newArr[i].Away_SP_IP);
            starterStats.SP_WHIP +=
              (parseFloat(newArr[i].Away_SP_HA) +
                parseFloat(newArr[i].Away_SP_BB)) /
              parseFloat(newArr[i].Away_SP_IP);
            starterStats.SP_FIP +=
              (13 * parseFloat(newArr[i].Away_SP_HRA) +
                3 * parseFloat(newArr[i].Away_SP_BB) -
                2 * parseFloat(newArr[i].Away_SP_SO)) /
                parseFloat(newArr[i].Away_SP_IP) +
              3.2;
            starterStats.SP_BF += parseFloat(newArr[i].Away_SP_BF);
            starterStats.SP_ERA +=
              (parseFloat(newArr[i].Away_SP_ERA) * 9) /
              parseFloat(newArr[i].Away_SP_IP);
            starterStats.SP_StrPct +=
              parseFloat(newArr[i].Away_SP_Str) /
              (parseFloat(newArr[i].Away_SP_Str) +
                parseFloat(newArr[i].Away_SP_Pit));
          }
        }
      }
      starterStats.SP_H9 = parseFloat(starterStats.SP_H9 / newArr.length);
      starterStats.SP_HR9 = parseFloat(starterStats.SP_HR9 / newArr.length);
      starterStats.SP_BB9 = parseFloat(starterStats.SP_BB9 / newArr.length);
      starterStats.SP_IP = parseFloat(starterStats.SP_IP / newArr.length);
      starterStats.SP_SO9 = parseFloat(starterStats.SP_SO9 / newArr.length);
      starterStats.SP_WHIP = parseFloat(starterStats.SP_WHIP / newArr.length);
      starterStats.SP_FIP = parseFloat(starterStats.SP_FIP / newArr.length);
      starterStats.SP_BF = parseFloat(starterStats.SP_BF / newArr.length);
      starterStats.SP_ERA = parseFloat(starterStats.SP_ERA / newArr.length);
      starterStats.SP_StrPct = parseFloat(
        starterStats.SP_StrPct / newArr.length
      );
    }
  }
  console.log(starterStats);
  return starterStats;
}

// async function getDistanceTraveled(games, team) {
//   games.sort(function(a, b) {
//     return parseInt(b.Difference) - parseInt(a.Difference);
//   });
//   // Get games played over last 5 days.
//   var arr = games.filter(function(game) {
//     return game.Difference >= 0 && game.Difference < 6;
//   });
//   //console.log(arr);
//   var config = {
//     headers: {
//       "X-RapidAPI-Key": "F1Zpq0CpPumshGjTXVnaYN4cJtljp1asib9jsnfOja4ZdfzOhY"
//     }
//   };
//   var startZip = "";
//   var endZip = "";
//   var distance = 0;
//   for (var i = 0; i < arr.length - 1; i++) {
//     startZip = getTeamZipcode(arr[i].Home);
//     endZip = getTeamZipcode(arr[i + 1].Home);
//     if (startZip !== endZip) {
//       await axios
//         .get(
//           `https://redline-redline-zipcode.p.rapidapi.com/rest/distance.json/${startZip}/${endZip}/mile`,
//           config
//         )
//         .then(response => {
//           distance += response.data.distance;
//           //console.log(team + ": " + distance);
//         })
//         .catch(error => {
//           console.log("axios error:", error);
//           console.log("ERROR WITH TEAM: ", team);
//         });
//     }
//   }
//   return distance.toFixed(0);
// }

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
    case "March":
      numMonth = "03";
      break;
    case "April":
      numMonth = "04";
      break;
    case "May":
      numMonth = "05";
      break;
    case "June":
      numMonth = "06";
      break;
    case "July":
      numMonth = "07";
      break;
    case "August":
      numMonth = "08";
      break;
    case "September":
      numMonth = "09";
      break;
    case "October":
      numMonth = "10";
      break;
    case "November":
      numMonth = "11";
      break;
  }
  return numMonth;
}
const _MS_PER_DAY = 1000 * 60 * 60 * 24;
