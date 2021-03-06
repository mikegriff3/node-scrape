var axios = require("axios");

const teamAverages = [
  {
    Name: "Agua Caliente Clippers",
    W: 22,
    L: 22,
    PTS: 109.8,
    STL: 8.9,
    BLK: 4.5,
    FG: 41.4,
    FGA: 91,
    FG_PCT: 0.455,
    Three_Pointers: 9.9,
    Three_Pointers_Att: 31.8,
    Three_Pointers_Pct: 0.313,
    FTM: 10.3,
    FTA: 14.1,
    FT_Pct: 0.734,
    ORB: 12.9,
    DRB: 32.4,
    TRB: 45.2,
    AST: 24,
    TOV: 15.7,
    PF: 20.3,
    MOV: -0.7,
  },
  {
    Name: "Austin Spurs",
    W: 24,
    L: 18,
    PTS: 114.4,
    STL: 9.4,
    BLK: 5.8,
    FG: 43.3,
    FGA: 90,
    FG_PCT: 0.481,
    Three_Pointers: 10.2,
    Three_Pointers_Att: 31.4,
    Three_Pointers_Pct: 0.325,
    FTM: 11.2,
    FTA: 14.6,
    FT_Pct: 0.765,
    ORB: 12.3,
    DRB: 33.9,
    TRB: 46.2,
    AST: 27,
    TOV: 17.7,
    PF: 23.1,
    MOV: 0.8,
  },
  {
    Name: "Canton Charge",
    W: 29,
    L: 14,
    PTS: 114.8,
    STL: 9.9,
    BLK: 5.7,
    FG: 41.3,
    FGA: 87.8,
    FG_PCT: 0.47,
    Three_Pointers: 11.4,
    Three_Pointers_Att: 33.7,
    Three_Pointers_Pct: 0.339,
    FTM: 12.9,
    FTA: 16.7,
    FT_Pct: 0.771,
    ORB: 10.8,
    DRB: 32.2,
    TRB: 43,
    AST: 22.9,
    TOV: 16.3,
    PF: 19.4,
    MOV: 3.2,
  },
  {
    Name: "Capital City Go-Go",
    W: 22,
    L: 21,
    PTS: 113.4,
    STL: 9,
    BLK: 3,
    FG: 41.2,
    FGA: 88.7,
    FG_PCT: 0.464,
    Three_Pointers: 11.3,
    Three_Pointers_Att: 31.9,
    Three_Pointers_Pct: 0.354,
    FTM: 12.2,
    FTA: 16.6,
    FT_Pct: 0.734,
    ORB: 10.8,
    DRB: 32,
    TRB: 42.8,
    AST: 24.2,
    TOV: 17.3,
    PF: 21.4,
    MOV: -0.8,
  },
  {
    Name: "College Park Skyhawks",
    W: 20,
    L: 23,
    PTS: 112.2,
    STL: 9.4,
    BLK: 4.2,
    FG: 40.4,
    FGA: 89,
    FG_PCT: 0.454,
    Three_Pointers: 11.2,
    Three_Pointers_Att: 34.3,
    Three_Pointers_Pct: 0.326,
    FTM: 12.4,
    FTA: 16.5,
    FT_Pct: 0.75,
    ORB: 10.6,
    DRB: 34.1,
    TRB: 44.7,
    AST: 23.7,
    TOV: 17.5,
    PF: 23.1,
    MOV: -0.5,
  },
  {
    Name: "Delaware Blue Coats",
    W: 22,
    L: 21,
    PTS: 115.9,
    STL: 7.7,
    BLK: 7.3,
    FG: 43.1,
    FGA: 91.6,
    FG_PCT: 0.471,
    Three_Pointers: 13.5,
    Three_Pointers_Att: 37.5,
    Three_Pointers_Pct: 0.361,
    FTM: 9.6,
    FTA: 13.2,
    FT_Pct: 0.726,
    ORB: 11.3,
    DRB: 38.3,
    TRB: 49.6,
    AST: 25.1,
    TOV: 19.7,
    PF: 22.3,
    MOV: 0.3,
  },
  {
    Name: "Erie BayHawks",
    W: 13,
    L: 30,
    PTS: 111.3,
    STL: 8.4,
    BLK: 4.7,
    FG: 41.4,
    FGA: 91.9,
    FG_PCT: 0.451,
    Three_Pointers: 13.7,
    Three_Pointers_Att: 39.7,
    Three_Pointers_Pct: 0.343,
    FTM: 9.2,
    FTA: 11.8,
    FT_Pct: 0.778,
    ORB: 12.2,
    DRB: 33.8,
    TRB: 46,
    AST: 23.4,
    TOV: 19.7,
    PF: 19.7,
    MOV: -7.1,
  },
  {
    Name: "Fort Wayne Mad Ants",
    W: 21,
    L: 22,
    PTS: 111.9,
    STL: 8.5,
    BLK: 4.5,
    FG: 41.7,
    FGA: 89.8,
    FG_PCT: 0.464,
    Three_Pointers: 10.3,
    Three_Pointers_Att: 28.3,
    Three_Pointers_Pct: 0.363,
    FTM: 11.5,
    FTA: 16,
    FT_Pct: 0.717,
    ORB: 13.4,
    DRB: 33.6,
    TRB: 47,
    AST: 22.9,
    TOV: 17,
    PF: 20.7,
    MOV: -0.2,
  },
  {
    Name: "Grand Rapids Drive",
    W: 25,
    L: 18,
    PTS: 108,
    STL: 11.2,
    BLK: 5,
    FG: 40.5,
    FGA: 89.7,
    FG_PCT: 0.452,
    Three_Pointers: 10.5,
    Three_Pointers_Att: 32,
    Three_Pointers_Pct: 0.327,
    FTM: 10.3,
    FTA: 14.5,
    FT_Pct: 0.71,
    ORB: 15.1,
    DRB: 34,
    TRB: 49,
    AST: 26.8,
    TOV: 20,
    PF: 22.6,
    MOV: 4.1,
  },
  {
    Name: "Greensboro Swarm",
    W: 9,
    L: 34,
    PTS: 111,
    STL: 8.7,
    BLK: 3.9,
    FG: 40.9,
    FGA: 92.6,
    FG_PCT: 0.442,
    Three_Pointers: 11.9,
    Three_Pointers_Att: 35.3,
    Three_Pointers_Pct: 0.337,
    FTM: 10.5,
    FTA: 14.3,
    FT_Pct: 0.731,
    ORB: 13.1,
    DRB: 32.2,
    TRB: 45.3,
    AST: 23.9,
    TOV: 16.3,
    PF: 20.4,
    MOV: -8.1,
  },
  {
    Name: "Iowa Wolves",
    W: 19,
    L: 24,
    PTS: 119.6,
    STL: 8,
    BLK: 5,
    FG: 43.9,
    FGA: 91.9,
    FG_PCT: 0.478,
    Three_Pointers: 13.6,
    Three_Pointers_Att: 37.6,
    Three_Pointers_Pct: 0.361,
    FTM: 11.4,
    FTA: 16.3,
    FT_Pct: 0.697,
    ORB: 11.3,
    DRB: 34.6,
    TRB: 45.9,
    AST: 25.9,
    TOV: 17.2,
    PF: 21.8,
    MOV: -0.3,
  },
  {
    Name: "Lakeland Magic",
    W: 25,
    L: 17,
    PTS: 109.2,
    STL: 8.9,
    BLK: 5.9,
    FG: 40.4,
    FGA: 86.3,
    FG_PCT: 0.468,
    Three_Pointers: 12.2,
    Three_Pointers_Att: 31.8,
    Three_Pointers_Pct: 0.384,
    FTM: 10.1,
    FTA: 13.1,
    FT_Pct: 0.768,
    ORB: 10,
    DRB: 32.4,
    TRB: 42.4,
    AST: 24.5,
    TOV: 16.2,
    PF: 19.7,
    MOV: 0.5,
  },
  {
    Name: "Long Island Nets",
    W: 19,
    L: 23,
    PTS: 112.5,
    STL: 8.3,
    BLK: 4.6,
    FG: 40.5,
    FGA: 89.7,
    FG_PCT: 0.452,
    Three_Pointers: 13.5,
    Three_Pointers_Att: 39.3,
    Three_Pointers_Pct: 0.343,
    FTM: 11,
    FTA: 15.1,
    FT_Pct: 0.73,
    ORB: 10.5,
    DRB: 37.4,
    TRB: 47.9,
    AST: 24.8,
    TOV: 18.2,
    PF: 20.9,
    MOV: 0.8,
  },
  {
    Name: "Maine Red Claws",
    W: 28,
    L: 14,
    PTS: 116.4,
    STL: 8.1,
    BLK: 5.9,
    FG: 43.1,
    FGA: 91,
    FG_PCT: 0.473,
    Three_Pointers: 14.1,
    Three_Pointers_Att: 39.7,
    Three_Pointers_Pct: 0.354,
    FTM: 10,
    FTA: 14.2,
    FT_Pct: 0.7,
    ORB: 11.9,
    DRB: 37.5,
    TRB: 49.3,
    AST: 24.5,
    TOV: 18,
    PF: 19.2,
    MOV: 4.7,
  },
  {
    Name: "Memphis Hustle",
    W: 26,
    L: 15,
    PTS: 118.2,
    STL: 9.8,
    BLK: 5.2,
    FG: 44.9,
    FGA: 93.8,
    FG_PCT: 0.479,
    Three_Pointers: 12.1,
    Three_Pointers_Att: 33.4,
    Three_Pointers_Pct: 0.362,
    FTM: 10.2,
    FTA: 13.7,
    FT_Pct: 0.742,
    ORB: 11.3,
    DRB: 33.1,
    TRB: 44.4,
    AST: 26.5,
    TOV: 14.1,
    PF: 18.7,
    MOV: 4.8,
  },
  {
    Name: "Northern Arizona Suns",
    W: 8,
    L: 34,
    PTS: 107.3,
    STL: 7.2,
    BLK: 4,
    FG: 39.4,
    FGA: 86.2,
    FG_PCT: 0.457,
    Three_Pointers: 11.4,
    Three_Pointers_Att: 32.8,
    Three_Pointers_Pct: 0.348,
    FTM: 10.5,
    FTA: 14.6,
    FT_Pct: 0.715,
    ORB: 9.9,
    DRB: 32.6,
    TRB: 42.4,
    AST: 23.1,
    TOV: 17.5,
    PF: 22.4,
    MOV: -8.5,
  },
  {
    Name: "Oklahoma City Blue",
    W: 20,
    L: 22,
    PTS: 116,
    STL: 7.1,
    BLK: 5.8,
    FG: 42.5,
    FGA: 88.9,
    FG_PCT: 0.478,
    Three_Pointers: 14,
    Three_Pointers_Att: 39,
    Three_Pointers_Pct: 0.36,
    FTM: 10.1,
    FTA: 14.1,
    FT_Pct: 0.717,
    ORB: 10,
    DRB: 37.9,
    TRB: 47.9,
    AST: 26.8,
    TOV: 18.4,
    PF: 19.9,
    MOV: 2.4,
  },
  {
    Name: "Raptors 905",
    W: 22,
    L: 21,
    PTS: 112.7,
    STL: 10.1,
    BLK: 4.8,
    FG: 41.7,
    FGA: 92,
    FG_PCT: 0.454,
    Three_Pointers: 12.2,
    Three_Pointers_Att: 37.4,
    Three_Pointers_Pct: 0.326,
    FTM: 10.5,
    FTA: 14.3,
    FT_Pct: 0.736,
    ORB: 11,
    DRB: 34.5,
    TRB: 45.6,
    AST: 25.5,
    TOV: 16.8,
    PF: 20.7,
    MOV: 1.1,
  },
  {
    Name: "Rio Grande Valley Vipers",
    W: 15,
    L: 27,
    PTS: 117.6,
    STL: 10.1,
    BLK: 4.8,
    FG: 42.3,
    FGA: 90.6,
    FG_PCT: 0.467,
    Three_Pointers: 13.5,
    Three_Pointers_Att: 41,
    Three_Pointers_Pct: 0.328,
    FTM: 11.7,
    FTA: 16.1,
    FT_Pct: 0.725,
    ORB: 11.9,
    DRB: 31.3,
    TRB: 43.2,
    AST: 26.2,
    TOV: 18.7,
    PF: 21.5,
    MOV: -2.5,
  },
  {
    Name: "Salt Lake City Stars",
    W: 30,
    L: 12,
    PTS: 111,
    STL: 8.5,
    BLK: 4.2,
    FG: 41.4,
    FGA: 86.4,
    FG_PCT: 0.48,
    Three_Pointers: 12.3,
    Three_Pointers_Att: 33.3,
    Three_Pointers_Pct: 0.368,
    FTM: 10.5,
    FTA: 14.5,
    FT_Pct: 0.72,
    ORB: 9.6,
    DRB: 34.9,
    TRB: 44.5,
    AST: 24,
    TOV: 16.7,
    PF: 20.9,
    MOV: 4.9,
  },
  {
    Name: "Santa Cruz Warriors",
    W: 21,
    L: 21,
    PTS: 110.2,
    STL: 9.4,
    BLK: 4.8,
    FG: 41.3,
    FGA: 87.6,
    FG_PCT: 0.471,
    Three_Pointers: 11.9,
    Three_Pointers_Att: 35.1,
    Three_Pointers_Pct: 0.339,
    FTM: 9.8,
    FTA: 13.5,
    FT_Pct: 0.724,
    ORB: 10.1,
    DRB: 33.7,
    TRB: 43.9,
    AST: 23.8,
    TOV: 17.1,
    PF: 21.7,
    MOV: -1.8,
  },
  {
    Name: "Sioux Falls Skyforce",
    W: 22,
    L: 20,
    PTS: 109.1,
    STL: 7.7,
    BLK: 5.1,
    FG: 39.8,
    FGA: 83.2,
    FG_PCT: 0.478,
    Three_Pointers: 11.4,
    Three_Pointers_Att: 32.2,
    Three_Pointers_Pct: 0.354,
    FTM: 11,
    FTA: 14.8,
    FT_Pct: 0.738,
    ORB: 9.7,
    DRB: 33.9,
    TRB: 43.6,
    AST: 24.6,
    TOV: 16.7,
    PF: 21.2,
    MOV: 1.2,
  },
  {
    Name: "South Bay Lakers",
    W: 19,
    L: 25,
    PTS: 124,
    STL: 9.1,
    BLK: 3.4,
    FG: 45.6,
    FGA: 94.1,
    FG_PCT: 0.485,
    Three_Pointers: 13,
    Three_Pointers_Att: 35.6,
    Three_Pointers_Pct: 0.364,
    FTM: 12,
    FTA: 17.3,
    FT_Pct: 0.689,
    ORB: 11.8,
    DRB: 34.9,
    TRB: 46.7,
    AST: 26.7,
    TOV: 18.2,
    PF: 22.8,
    MOV: -2.8,
  },
  {
    Name: "Stockton Kings",
    W: 24,
    L: 19,
    PTS: 120.3,
    STL: 8.7,
    BLK: 3.9,
    FG: 43.2,
    FGA: 93.5,
    FG_PCT: 0.462,
    Three_Pointers: 14,
    Three_Pointers_Att: 37.1,
    Three_Pointers_Pct: 0.378,
    FTM: 12.2,
    FTA: 16.6,
    FT_Pct: 0.736,
    ORB: 13.1,
    DRB: 32.7,
    TRB: 45.8,
    AST: 25.3,
    TOV: 16.9,
    PF: 24.1,
    MOV: 1,
  },
  {
    Name: "Texas Legends",
    W: 24,
    L: 19,
    PTS: 117.3,
    STL: 9.9,
    BLK: 5.3,
    FG: 44.7,
    FGA: 95.9,
    FG_PCT: 0.466,
    Three_Pointers: 12.4,
    Three_Pointers_Att: 36.8,
    Three_Pointers_Pct: 0.337,
    FTM: 9.5,
    FTA: 14.5,
    FT_Pct: 0.652,
    ORB: 14.7,
    DRB: 33.8,
    TRB: 48.5,
    AST: 26.8,
    TOV: 16.6,
    PF: 21.9,
    MOV: 0.9,
  },
  {
    Name: "Westchester Knicks",
    W: 17,
    L: 24,
    PTS: 110.3,
    STL: 7.5,
    BLK: 5.5,
    FG: 41.7,
    FGA: 89.5,
    FG_PCT: 0.466,
    Three_Pointers: 12.1,
    Three_Pointers_Att: 33.7,
    Three_Pointers_Pct: 0.36,
    FTM: 9.2,
    FTA: 13.4,
    FT_Pct: 0.69,
    ORB: 10.9,
    DRB: 34.3,
    TRB: 45.2,
    AST: 24.3,
    TOV: 15.9,
    PF: 22,
    MOV: 0,
  },
  {
    Name: "Windy City Bulls",
    W: 17,
    L: 26,
    PTS: 105.4,
    STL: 11.2,
    BLK: 5.4,
    FG: 39.6,
    FGA: 91.3,
    FG_PCT: 0.434,
    Three_Pointers: 11.8,
    Three_Pointers_Att: 36.2,
    Three_Pointers_Pct: 0.327,
    FTM: 8.7,
    FTA: 12.9,
    FT_Pct: 0.676,
    ORB: 11.5,
    DRB: 32.9,
    TRB: 44.4,
    AST: 24,
    TOV: 16.9,
    PF: 21.2,
    MOV: -2.9,
  },
  {
    Name: "Wisconsin Herd",
    W: 33,
    L: 10,
    PTS: 120.9,
    STL: 7.9,
    BLK: 5.1,
    FG: 43.9,
    FGA: 94,
    FG_PCT: 0.467,
    Three_Pointers: 14.1,
    Three_Pointers_Att: 39,
    Three_Pointers_Pct: 0.363,
    FTM: 12,
    FTA: 16.4,
    FT_Pct: 0.729,
    ORB: 13,
    DRB: 39.5,
    TRB: 52.5,
    AST: 23.8,
    TOV: 18.2,
    PF: 19.1,
    MOV: 6,
  },
];

axios
  .put("http://localhost:3000/api/teams/updategTeams", {
    data: teamAverages,
  })
  .then((data) => {
    console.log("SAVED SUCCESSFULLY");
  })
  .catch((err) => {
    console.log("Error posting to server", err);
  });
