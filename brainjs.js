var brain = require("brain.js");

// Create a simple recurrent neural network
// var net = new brain.recurrent.RNN();

// net.train([
//   { input: [0, 1, 2, 3], output: [4] },
//   { input: [4, 5, 6, 7], output: [8] },
//   { input: [8, 9, 10, 11], output: [12] },
//   { input: [12, 13, 14, 15], output: [16] }
// ]);

// var output = net.run([16, 17, 18, 19]); // [0]
// console.log(output);
// output = net.run([20, 21, 22, 23]); // [1]
// console.log(output);
// output = net.run([24, 25, 26, 27]); // [1]
// console.log(output);
// output = net.run([28, 29, 30, 31]); // [0]
// console.log(output);

var net = new brain.recurrent.LSTM();

net.train([
  { input: [0, 0, 10, 12], output: [14] },
  { input: [0, 1, 9, 8], output: [7] },
  { input: [1, 0, 4, 6], output: [8] },
  { input: [1, 1, 3, 9], output: [8] }
]);

var output = net.run([0, 0, 10, 8]); // [0]
console.log(output);
output = net.run([0, 1, 9, 8]); // [1]
output = net.run([1, 0, 4, 6]); // [1]
output = net.run([1, 1, 3, 9]); // [0]
