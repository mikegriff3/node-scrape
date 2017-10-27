const Sequelize = require("sequelize");
const db = require("./config");

const Teams = db.define("team", {
  Name: { type: Sequelize.STRING, allowNull: true },
  GP: { type: Sequelize.STRING, allowNull: true },
  FG: { type: Sequelize.STRING, allowNull: true },
  FGA: { type: Sequelize.STRING, allowNull: true },
  FG_PCT: { type: Sequelize.STRING, allowNull: true },
  Three_Pointers: { type: Sequelize.STRING, allowNull: true },
  Three_Pointers_Att: { type: Sequelize.STRING, allowNull: true },
  Three_Pointers_Pct: { type: Sequelize.STRING, allowNull: true },
  Two_Pointers: { type: Sequelize.STRING, allowNull: true },
  Two_Pointers_Att: { type: Sequelize.STRING, allowNull: true },
  Two_Pointers_Pct: { type: Sequelize.STRING, allowNull: true },
  FTM: { type: Sequelize.STRING, allowNull: true },
  FTA: { type: Sequelize.STRING, allowNull: true },
  FT_PCT: { type: Sequelize.STRING, allowNull: true },
  ORB: { type: Sequelize.STRING, allowNull: true },
  DRB: { type: Sequelize.STRING, allowNull: true },
  TRB: { type: Sequelize.STRING, allowNull: true },
  AST: { type: Sequelize.STRING, allowNull: true },
  STL: { type: Sequelize.STRING, allowNull: true },
  BLK: { type: Sequelize.STRING, allowNull: true },
  TOV: { type: Sequelize.STRING, allowNull: true },
  PF: { type: Sequelize.STRING, allowNull: true },
  PTS: { type: Sequelize.STRING, allowNull: true },
  W: { type: Sequelize.STRING, allowNull: true },
  L: { type: Sequelize.STRING, allowNull: true },
  PW: { type: Sequelize.STRING, allowNull: true },
  PL: { type: Sequelize.STRING, allowNull: true },
  MOV: { type: Sequelize.STRING, allowNull: true },
  SOS: { type: Sequelize.STRING, allowNull: true },
  SRS: { type: Sequelize.STRING, allowNull: true },
  ORtg: { type: Sequelize.STRING, allowNull: true },
  DRtg: { type: Sequelize.STRING, allowNull: true },
  PACE: { type: Sequelize.STRING, allowNull: true },
  FTr: { type: Sequelize.STRING, allowNull: true },
  Three_PAr: { type: Sequelize.STRING, allowNull: true },
  OFF_eFG_PCT: { type: Sequelize.STRING, allowNull: true },
  OFF_TOV_PCT: { type: Sequelize.STRING, allowNull: true },
  ORB_PCT: { type: Sequelize.STRING, allowNull: true },
  OFF_FT_FGA: { type: Sequelize.STRING, allowNull: true },
  DEF_eFG_PCT: { type: Sequelize.STRING, allowNull: true },
  DEF_TOV_PCT: { type: Sequelize.STRING, allowNull: true },
  DRB_PCT: { type: Sequelize.STRING, allowNull: true },
  DEF_FT_FGA: { type: Sequelize.STRING, allowNull: true }
});

Teams.sync();
// Teams.sync({ force: true }).then(() => {
//   return Teams.bulkCreate([
//     { Name: "Atlanta Hawks" },
//     { Name: "Brooklyn Nets" },
//     { Name: "Toronto Raptors" },
//     { Name: "Boston Celtics" },
//     { Name: "New York Knicks" },
//     { Name: "Philadelphia 76ers" },
//     { Name: "Portland Trail Blazers" },
//     { Name: "Utah Jazz" },
//     { Name: "Denver Nuggets" },
//     { Name: "Minnesota Timberwolves" },
//     { Name: "Oklahoma City Thunder" },
//     { Name: "Cleveland Cavaliers" },
//     { Name: "Detroit Pistons" },
//     { Name: "Milwaukee Bucks" },
//     { Name: "Indiana Pacers" },
//     { Name: "Chicago Bulls" },
//     { Name: "Los Angeles Clippers" },
//     { Name: "Los Angeles Lakers" },
//     { Name: "Golden State Warriors" },
//     { Name: "Sacramento Kings" },
//     { Name: "Phoenix Suns" },
//     { Name: "Washington Wizards" },
//     { Name: "Orlando Magic" },
//     { Name: "Charlotte Hornets" },
//     { Name: "Miami Heat" },
//     { Name: "Houston Rockets" },
//     { Name: "Memphis Grizzlies" },
//     { Name: "San Antonio Spurs" },
//     { Name: "Dallas Mavericks" },
//     { Name: "New Orleans Pelicans" }
//   ]);
// });

module.exports = { Teams };
