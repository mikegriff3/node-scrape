var tf = require("@tensorflow/tfjs");

// Single Series LTSM input reshape
// var data = tf.tensor([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]);
// var ydata = tf.tensor([1.1, 1.2, 1.3, 0, 0, 0, 0, 0, 0, 0]);
// data = data.reshape([1, 10, 1]);
// ydata = ydata.reshape([1, 10, 1]);

// data.print();
// ydata.print();

// // Define a model for linear regression.
// const model = tf.sequential();
// model.add(
//   tf.layers.lstm({
//     units: 1,
//     inputShape: [10, 1],
//     returnSequences: true
//   })
// );

// // Prepare the model for training: Specify the loss and the optimizer.
// model.compile({ loss: "meanSquaredError", optimizer: "adam" });

// // Train the model using the data
// model.fit(data, ydata, { epochs: 1000 }).then(() => {
//   // Use the model to do inference on a data point the model hasn't seen before:
//   model
//     .predict(
//       tf.tensor([
//         [[0.1], [0.2], [0.3], [0.4], [0.5], [0.6], [0.7], [0.8], [0.9], [1]]
//       ])
//     )
//     .print();
// });

// model.add(
//   tf.layers.dense({
//     units: 1,
//     activation: "linear"
//   })
// );

//
// Multiple Series LTSM input reshape
var data = tf.tensor([
  [[100], [86], [105], [122], [118], [96], [107], [118], [100], [85]],
  [[30], [53], [74], [85], [96], [87], [98], [99], [110], [101]],
  [[30], [53], [74], [85], [96], [87], [98], [99], [110], [101]],
  [[30], [53], [74], [85], [96], [87], [98], [99], [110], [101]],
  [[30], [53], [74], [85], [96], [87], [98], [99], [110], [101]],
  [[30], [53], [74], [85], [96], [87], [98], [99], [110], [101]],
  [[30], [53], [74], [85], [96], [87], [98], [99], [110], [101]],
  [[30], [53], [74], [85], [96], [87], [98], [99], [110], [101]]
]);

var y = tf.tensor([[100], [90], [90], [90], [90], [90], [90], [90]]);

const model = tf.sequential();
model.add(tf.layers.dense({ units: 1, inputShape: [10, 1] }));
model.add(
  tf.layers.lstm({
    units: 1
  })
);

model.compile({ loss: "meanSquaredError", optimizer: "adam" });

model.fit(data, y, { epochs: 1000 }).then(() => {
  // Use the model to do inference on a data point the model hasn't seen before:
  model
    .predict(
      tf.tensor([
        [[30], [53], [74], [85], [96], [87], [98], [99], [110], [101]]
      ])
    )
    .print();
});
