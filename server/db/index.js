const Sequelize = require("sequelize");
const db = require("./config").db;
const dbmlb = require("./config").dbmlb;

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

const Scores = db.define("score", {
  Date: { type: Sequelize.STRING, allowNull: true },
  HW: { type: Sequelize.INTEGER, allowNull: true },
  Total_Pts: { type: Sequelize.INTEGER, allowNull: true },
  Home: { type: Sequelize.STRING, allowNull: true },
  Home_Pts: { type: Sequelize.STRING, allowNull: true },
  Visitor: { type: Sequelize.STRING, allowNull: true },
  Visitor_Pts: { type: Sequelize.STRING, allowNull: true },
  Home_Diff: { type: Sequelize.INTEGER, allowNull: true },
  Start_Time: { type: Sequelize.STRING, allowNull: true },
  Away_3P: { type: Sequelize.STRING, allowNull: true },
  Away_3PA: { type: Sequelize.STRING, allowNull: true },
  Away_AST: { type: Sequelize.STRING, allowNull: true },
  Away_BLK_PCT: { type: Sequelize.STRING, allowNull: true },
  Away_FG: { type: Sequelize.STRING, allowNull: true },
  Away_FGA: { type: Sequelize.STRING, allowNull: true },
  Away_FTA: { type: Sequelize.STRING, allowNull: true },
  Away_FTM: { type: Sequelize.STRING, allowNull: true },
  Away_ORB: { type: Sequelize.STRING, allowNull: true },
  Away_ORB_PCT: { type: Sequelize.STRING, allowNull: true },
  Away_STL: { type: Sequelize.STRING, allowNull: true },
  Away_TOV_PCT: { type: Sequelize.STRING, allowNull: true },
  Away_TRB: { type: Sequelize.STRING, allowNull: true },
  Home_3P: { type: Sequelize.STRING, allowNull: true },
  Home_3PA: { type: Sequelize.STRING, allowNull: true },
  Home_AST: { type: Sequelize.STRING, allowNull: true },
  Home_BLK_PCT: { type: Sequelize.STRING, allowNull: true },
  Home_FG: { type: Sequelize.STRING, allowNull: true },
  Home_FGA: { type: Sequelize.STRING, allowNull: true },
  Home_FTA: { type: Sequelize.STRING, allowNull: true },
  Home_FTM: { type: Sequelize.STRING, allowNull: true },
  Home_ORB: { type: Sequelize.STRING, allowNull: true },
  Home_ORB_PCT: { type: Sequelize.STRING, allowNull: true },
  Home_ST: { type: Sequelize.STRING, allowNull: true },
  Home_TOV_PCT: { type: Sequelize.STRING, allowNull: true },
  Home_TRB: { type: Sequelize.STRING, allowNull: true },
  Injuries: { type: Sequelize.TEXT, allowNull: true },
  Referees: { type: Sequelize.TEXT, allowNull: true }
});

const MLBScores = dbmlb.define("score", {
  Date: { type: Sequelize.STRING, allowNull: true },
  HW: { type: Sequelize.INTEGER, allowNull: true },
  Total_Runs: { type: Sequelize.INTEGER, allowNull: true },
  Home: { type: Sequelize.STRING, allowNull: true },
  Home_Runs: { type: Sequelize.STRING, allowNull: true },
  Away: { type: Sequelize.STRING, allowNull: true },
  Away_Runs: { type: Sequelize.STRING, allowNull: true },
  Ballpark: { type: Sequelize.STRING, allowNull: true },
  Home_AB: { type: Sequelize.STRING, allowNull: true },
  Home_Hits: { type: Sequelize.STRING, allowNull: true },
  Home_RBI: { type: Sequelize.STRING, allowNull: true },
  Home_BB: { type: Sequelize.STRING, allowNull: true },
  Home_PA: { type: Sequelize.STRING, allowNull: true },
  Home_BA: { type: Sequelize.STRING, allowNull: true },
  Home_OBP: { type: Sequelize.STRING, allowNull: true },
  Home_SLG: { type: Sequelize.STRING, allowNull: true },
  Home_OPS: { type: Sequelize.STRING, allowNull: true },
  Home_Pitches_Seen: { type: Sequelize.STRING, allowNull: true },
  Home_Strikes_Taken: { type: Sequelize.STRING, allowNull: true },
  Home_WPA: { type: Sequelize.STRING, allowNull: true },
  Home_BORA: { type: Sequelize.STRING, allowNull: true },
  Home_PO: { type: Sequelize.STRING, allowNull: true },
  Home_AST: { type: Sequelize.STRING, allowNull: true },
  Home_Starter: { type: Sequelize.STRING, allowNull: true },
  Home_SP_IP: { type: Sequelize.STRING, allowNull: true },
  Home_SP_HA: { type: Sequelize.STRING, allowNull: true },
  Home_SP_ERA: { type: Sequelize.STRING, allowNull: true },
  Home_SP_BB: { type: Sequelize.STRING, allowNull: true },
  Home_SP_HRA: { type: Sequelize.STRING, allowNull: true },
  Home_SP_SO: { type: Sequelize.STRING, allowNull: true },
  Home_SP_BF: { type: Sequelize.STRING, allowNull: true },
  Home_SP_Pit: { type: Sequelize.STRING, allowNull: true },
  Home_SP_Str: { type: Sequelize.STRING, allowNull: true },
  Home_SP_GB: { type: Sequelize.STRING, allowNull: true },
  Home_SP_FB: { type: Sequelize.STRING, allowNull: true },
  Home_SP_LD: { type: Sequelize.STRING, allowNull: true },
  Home_BP_IP: { type: Sequelize.STRING, allowNull: true },
  Home_BP_HA: { type: Sequelize.STRING, allowNull: true },
  Home_BP_ERA: { type: Sequelize.STRING, allowNull: true },
  Home_BP_BB: { type: Sequelize.STRING, allowNull: true },
  Home_BP_HRA: { type: Sequelize.STRING, allowNull: true },
  Home_BP_SO: { type: Sequelize.STRING, allowNull: true },
  Home_BP_BF: { type: Sequelize.STRING, allowNull: true },
  Home_BP_Pit: { type: Sequelize.STRING, allowNull: true },
  Home_BP_Str: { type: Sequelize.STRING, allowNull: true },
  Home_BP_GB: { type: Sequelize.STRING, allowNull: true },
  Home_BP_FB: { type: Sequelize.STRING, allowNull: true },
  Home_BP_LD: { type: Sequelize.STRING, allowNull: true },
  Home_Errors: { type: Sequelize.STRING, allowNull: true },
  Away_AB: { type: Sequelize.STRING, allowNull: true },
  Away_Hits: { type: Sequelize.STRING, allowNull: true },
  Away_RBI: { type: Sequelize.STRING, allowNull: true },
  Away_BB: { type: Sequelize.STRING, allowNull: true },
  Away_PA: { type: Sequelize.STRING, allowNull: true },
  Away_BA: { type: Sequelize.STRING, allowNull: true },
  Away_OBP: { type: Sequelize.STRING, allowNull: true },
  Away_SLG: { type: Sequelize.STRING, allowNull: true },
  Away_OPS: { type: Sequelize.STRING, allowNull: true },
  Away_Pitches_Seen: { type: Sequelize.STRING, allowNull: true },
  Away_Strikes_Taken: { type: Sequelize.STRING, allowNull: true },
  Away_WPA: { type: Sequelize.STRING, allowNull: true },
  Away_BORA: { type: Sequelize.STRING, allowNull: true },
  Away_PO: { type: Sequelize.STRING, allowNull: true },
  Away_AST: { type: Sequelize.STRING, allowNull: true },
  Away_Starter: { type: Sequelize.STRING, allowNull: true },
  Away_SP_IP: { type: Sequelize.STRING, allowNull: true },
  Away_SP_HA: { type: Sequelize.STRING, allowNull: true },
  Away_SP_ERA: { type: Sequelize.STRING, allowNull: true },
  Away_SP_BB: { type: Sequelize.STRING, allowNull: true },
  Away_SP_HRA: { type: Sequelize.STRING, allowNull: true },
  Away_SP_SO: { type: Sequelize.STRING, allowNull: true },
  Away_SP_BF: { type: Sequelize.STRING, allowNull: true },
  Away_SP_Pit: { type: Sequelize.STRING, allowNull: true },
  Away_SP_Str: { type: Sequelize.STRING, allowNull: true },
  Away_SP_GB: { type: Sequelize.STRING, allowNull: true },
  Away_SP_FB: { type: Sequelize.STRING, allowNull: true },
  Away_SP_LD: { type: Sequelize.STRING, allowNull: true },
  Away_BP_IP: { type: Sequelize.STRING, allowNull: true },
  Away_BP_HA: { type: Sequelize.STRING, allowNull: true },
  Away_BP_ERA: { type: Sequelize.STRING, allowNull: true },
  Away_BP_BB: { type: Sequelize.STRING, allowNull: true },
  Away_BP_HRA: { type: Sequelize.STRING, allowNull: true },
  Away_BP_SO: { type: Sequelize.STRING, allowNull: true },
  Away_BP_BF: { type: Sequelize.STRING, allowNull: true },
  Away_BP_Pit: { type: Sequelize.STRING, allowNull: true },
  Away_BP_Str: { type: Sequelize.STRING, allowNull: true },
  Away_BP_GB: { type: Sequelize.STRING, allowNull: true },
  Away_BP_FB: { type: Sequelize.STRING, allowNull: true },
  Away_BP_LD: { type: Sequelize.STRING, allowNull: true },
  Away_Errors: { type: Sequelize.STRING, allowNull: true }
});

const Nineteen = db.define("Nineteen", {
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
  DEF_FT_FGA: { type: Sequelize.STRING, allowNull: true },
  oFG: { type: Sequelize.STRING, allowNull: true },
  oFGA: { type: Sequelize.STRING, allowNull: true },
  oFGPCT: { type: Sequelize.STRING, allowNull: true },
  o3P: { type: Sequelize.STRING, allowNull: true },
  o3PA: { type: Sequelize.STRING, allowNull: true },
  o3PCT: { type: Sequelize.STRING, allowNull: true },
  o2P: { type: Sequelize.STRING, allowNull: true },
  o2PA: { type: Sequelize.STRING, allowNull: true },
  o2PCT: { type: Sequelize.STRING, allowNull: true },
  oFTM: { type: Sequelize.STRING, allowNull: true },
  oFTA: { type: Sequelize.STRING, allowNull: true },
  oFTPCT: { type: Sequelize.STRING, allowNull: true },
  oORB: { type: Sequelize.STRING, allowNull: true },
  oDRB: { type: Sequelize.STRING, allowNull: true },
  oTRB: { type: Sequelize.STRING, allowNull: true },
  oAST: { type: Sequelize.STRING, allowNull: true },
  oSTL: { type: Sequelize.STRING, allowNull: true },
  oBLK: { type: Sequelize.STRING, allowNull: true },
  oTOV: { type: Sequelize.STRING, allowNull: true },
  oPF: { type: Sequelize.STRING, allowNull: true },
  oPTS: { type: Sequelize.STRING, allowNull: true }
});

const Eighteen = db.define("eighteen", {
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
  DEF_FT_FGA: { type: Sequelize.STRING, allowNull: true },
  oFG: { type: Sequelize.STRING, allowNull: true },
  oFGA: { type: Sequelize.STRING, allowNull: true },
  oFGPCT: { type: Sequelize.STRING, allowNull: true },
  o3P: { type: Sequelize.STRING, allowNull: true },
  o3PA: { type: Sequelize.STRING, allowNull: true },
  o3PCT: { type: Sequelize.STRING, allowNull: true },
  o2P: { type: Sequelize.STRING, allowNull: true },
  o2PA: { type: Sequelize.STRING, allowNull: true },
  o2PCT: { type: Sequelize.STRING, allowNull: true },
  oFTM: { type: Sequelize.STRING, allowNull: true },
  oFTA: { type: Sequelize.STRING, allowNull: true },
  oFTPCT: { type: Sequelize.STRING, allowNull: true },
  oORB: { type: Sequelize.STRING, allowNull: true },
  oDRB: { type: Sequelize.STRING, allowNull: true },
  oTRB: { type: Sequelize.STRING, allowNull: true },
  oAST: { type: Sequelize.STRING, allowNull: true },
  oSTL: { type: Sequelize.STRING, allowNull: true },
  oBLK: { type: Sequelize.STRING, allowNull: true },
  oTOV: { type: Sequelize.STRING, allowNull: true },
  oPF: { type: Sequelize.STRING, allowNull: true },
  oPTS: { type: Sequelize.STRING, allowNull: true }
});

const Seventeen = db.define("seventeen", {
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
  DEF_FT_FGA: { type: Sequelize.STRING, allowNull: true },
  oFG: { type: Sequelize.STRING, allowNull: true },
  oFGA: { type: Sequelize.STRING, allowNull: true },
  oFGPCT: { type: Sequelize.STRING, allowNull: true },
  o3P: { type: Sequelize.STRING, allowNull: true },
  o3PA: { type: Sequelize.STRING, allowNull: true },
  o3PCT: { type: Sequelize.STRING, allowNull: true },
  o2P: { type: Sequelize.STRING, allowNull: true },
  o2PA: { type: Sequelize.STRING, allowNull: true },
  o2PCT: { type: Sequelize.STRING, allowNull: true },
  oFTM: { type: Sequelize.STRING, allowNull: true },
  oFTA: { type: Sequelize.STRING, allowNull: true },
  oFTPCT: { type: Sequelize.STRING, allowNull: true },
  oORB: { type: Sequelize.STRING, allowNull: true },
  oDRB: { type: Sequelize.STRING, allowNull: true },
  oTRB: { type: Sequelize.STRING, allowNull: true },
  oAST: { type: Sequelize.STRING, allowNull: true },
  oSTL: { type: Sequelize.STRING, allowNull: true },
  oBLK: { type: Sequelize.STRING, allowNull: true },
  oTOV: { type: Sequelize.STRING, allowNull: true },
  oPF: { type: Sequelize.STRING, allowNull: true },
  oPTS: { type: Sequelize.STRING, allowNull: true }
});

const Sixteen = db.define("sixteen", {
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
  DEF_FT_FGA: { type: Sequelize.STRING, allowNull: true },
  oFG: { type: Sequelize.STRING, allowNull: true },
  oFGA: { type: Sequelize.STRING, allowNull: true },
  oFGPCT: { type: Sequelize.STRING, allowNull: true },
  o3P: { type: Sequelize.STRING, allowNull: true },
  o3PA: { type: Sequelize.STRING, allowNull: true },
  o3PCT: { type: Sequelize.STRING, allowNull: true },
  o2P: { type: Sequelize.STRING, allowNull: true },
  o2PA: { type: Sequelize.STRING, allowNull: true },
  o2PCT: { type: Sequelize.STRING, allowNull: true },
  oFTM: { type: Sequelize.STRING, allowNull: true },
  oFTA: { type: Sequelize.STRING, allowNull: true },
  oFTPCT: { type: Sequelize.STRING, allowNull: true },
  oORB: { type: Sequelize.STRING, allowNull: true },
  oDRB: { type: Sequelize.STRING, allowNull: true },
  oTRB: { type: Sequelize.STRING, allowNull: true },
  oAST: { type: Sequelize.STRING, allowNull: true },
  oSTL: { type: Sequelize.STRING, allowNull: true },
  oBLK: { type: Sequelize.STRING, allowNull: true },
  oTOV: { type: Sequelize.STRING, allowNull: true },
  oPF: { type: Sequelize.STRING, allowNull: true },
  oPTS: { type: Sequelize.STRING, allowNull: true }
});

const Fifteen = db.define("fifteen", {
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
  DEF_FT_FGA: { type: Sequelize.STRING, allowNull: true },
  oFG: { type: Sequelize.STRING, allowNull: true },
  oFGA: { type: Sequelize.STRING, allowNull: true },
  oFGPCT: { type: Sequelize.STRING, allowNull: true },
  o3P: { type: Sequelize.STRING, allowNull: true },
  o3PA: { type: Sequelize.STRING, allowNull: true },
  o3PCT: { type: Sequelize.STRING, allowNull: true },
  o2P: { type: Sequelize.STRING, allowNull: true },
  o2PA: { type: Sequelize.STRING, allowNull: true },
  o2PCT: { type: Sequelize.STRING, allowNull: true },
  oFTM: { type: Sequelize.STRING, allowNull: true },
  oFTA: { type: Sequelize.STRING, allowNull: true },
  oFTPCT: { type: Sequelize.STRING, allowNull: true },
  oORB: { type: Sequelize.STRING, allowNull: true },
  oDRB: { type: Sequelize.STRING, allowNull: true },
  oTRB: { type: Sequelize.STRING, allowNull: true },
  oAST: { type: Sequelize.STRING, allowNull: true },
  oSTL: { type: Sequelize.STRING, allowNull: true },
  oBLK: { type: Sequelize.STRING, allowNull: true },
  oTOV: { type: Sequelize.STRING, allowNull: true },
  oPF: { type: Sequelize.STRING, allowNull: true },
  oPTS: { type: Sequelize.STRING, allowNull: true }
});

const Fourteen = db.define("fourteen", {
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
  DEF_FT_FGA: { type: Sequelize.STRING, allowNull: true },
  oFG: { type: Sequelize.STRING, allowNull: true },
  oFGA: { type: Sequelize.STRING, allowNull: true },
  oFGPCT: { type: Sequelize.STRING, allowNull: true },
  o3P: { type: Sequelize.STRING, allowNull: true },
  o3PA: { type: Sequelize.STRING, allowNull: true },
  o3PCT: { type: Sequelize.STRING, allowNull: true },
  o2P: { type: Sequelize.STRING, allowNull: true },
  o2PA: { type: Sequelize.STRING, allowNull: true },
  o2PCT: { type: Sequelize.STRING, allowNull: true },
  oFTM: { type: Sequelize.STRING, allowNull: true },
  oFTA: { type: Sequelize.STRING, allowNull: true },
  oFTPCT: { type: Sequelize.STRING, allowNull: true },
  oORB: { type: Sequelize.STRING, allowNull: true },
  oDRB: { type: Sequelize.STRING, allowNull: true },
  oTRB: { type: Sequelize.STRING, allowNull: true },
  oAST: { type: Sequelize.STRING, allowNull: true },
  oSTL: { type: Sequelize.STRING, allowNull: true },
  oBLK: { type: Sequelize.STRING, allowNull: true },
  oTOV: { type: Sequelize.STRING, allowNull: true },
  oPF: { type: Sequelize.STRING, allowNull: true },
  oPTS: { type: Sequelize.STRING, allowNull: true }
});

const Thirteen = db.define("thirteen", {
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
  DEF_FT_FGA: { type: Sequelize.STRING, allowNull: true },
  oFG: { type: Sequelize.STRING, allowNull: true },
  oFGA: { type: Sequelize.STRING, allowNull: true },
  oFGPCT: { type: Sequelize.STRING, allowNull: true },
  o3P: { type: Sequelize.STRING, allowNull: true },
  o3PA: { type: Sequelize.STRING, allowNull: true },
  o3PCT: { type: Sequelize.STRING, allowNull: true },
  o2P: { type: Sequelize.STRING, allowNull: true },
  o2PA: { type: Sequelize.STRING, allowNull: true },
  o2PCT: { type: Sequelize.STRING, allowNull: true },
  oFTM: { type: Sequelize.STRING, allowNull: true },
  oFTA: { type: Sequelize.STRING, allowNull: true },
  oFTPCT: { type: Sequelize.STRING, allowNull: true },
  oORB: { type: Sequelize.STRING, allowNull: true },
  oDRB: { type: Sequelize.STRING, allowNull: true },
  oTRB: { type: Sequelize.STRING, allowNull: true },
  oAST: { type: Sequelize.STRING, allowNull: true },
  oSTL: { type: Sequelize.STRING, allowNull: true },
  oBLK: { type: Sequelize.STRING, allowNull: true },
  oTOV: { type: Sequelize.STRING, allowNull: true },
  oPF: { type: Sequelize.STRING, allowNull: true },
  oPTS: { type: Sequelize.STRING, allowNull: true }
});

Sixteen.sync();
Seventeen.sync();
Eighteen.sync();
Nineteen.sync();
Fifteen.sync();
Fourteen.sync();
Thirteen.sync();
Scores.sync();
MLBScores.sync();
// MLBScores.sync({ force: true }).then(() => {
//   return MLBScores.bulkCreate([{ HW: 0 }]);
// });
//Teams.sync();
// Nineteen.sync({ force: true }).then(() => {
//   return Nineteen.bulkCreate([
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

module.exports = {
  Teams,
  Scores,
  Seventeen,
  Eighteen,
  Nineteen,
  Sixteen,
  Fifteen,
  Fourteen,
  Thirteen,
  MLBScores
};
