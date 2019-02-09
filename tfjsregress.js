var tf = require("@tensorflow/tfjs");

// Define a model for linear regression.
const model = tf.sequential();
model.add(
  tf.layers.dense({
    units: 3,
    inputShape: 5
  })
);
// model.add(
//   tf.layers.lstm({
//     units: 1
//   })
// );

// Prepare the model for training: Specify the loss and the optimizer.
model.compile({ loss: "meanSquaredError", optimizer: "adam" });

// Generate some synthetic data for training
const xs = tf.tensor([
  [40, 50, 66, 77, 78], // Harden
  [47, 64, 51, 87, 94], // Curry
  [34, 50, 72, 64, 76], // Westbrook
  [32, 56, 85, 70, 80], // Durant
  [29, 48, 48, 72, 68], // Boogie
  [24, 29, 24, 32, 50], // Demar
  [24, 22, 42, 45, 45] // DJ
]);
const ys = tf.tensor([
  [95, 84, 100],
  [111, 125, 92],
  [70, 97, 98],
  [99, 105, 75],
  [60, 76, 76],
  [37, 59, 60],
  [63, 70, 65]
]);

// Train the model using the data
model.fit(xs, ys, { epochs: 1000 }).then(() => {
  // Use the model to do inference on a data point the model hasn't seen before:
  model.predict(tf.tensor([[38, 50, 62, 66, 48]])).print();
});

// [60, 54, 64]
