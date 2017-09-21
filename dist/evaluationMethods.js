"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Matrix_1 = require("./Matrix");
function trainingEval(data, learner, verbose) {
    console.log('Calculating accuracy on training set...');
    // Copy all ARFF data except the last column into a new 'features' matrix.
    const features = new Matrix_1.default(data, 0, 0, data.rows(), data.cols() - 1);
    // Copy the last column in the ARFF data into a labels matrix.
    const labels = new Matrix_1.default(data, 0, data.cols() - 1, data.rows(), 1);
    const confusion = new Matrix_1.default();
    const startTime = Date.now();
    learner.train(features, labels);
    const elapsedTime = Date.now() - startTime;
    console.log('Time to train (in seconds): ' + elapsedTime / 1000.0);
    const accuracy = learner.measureAccuracy(features, labels, confusion);
    console.log('Training set accuracy: ' + accuracy);
    if (verbose) {
        console.log('\nConfusion matrix: (Row=target value, Col=predicted value)');
        confusion.print();
        console.log('\n');
    }
}
exports.trainingEval = trainingEval;
function staticEval(data, learner, testFileName, normalize, verbose) {
    const testData = new Matrix_1.default();
    testData.loadArff(testFileName);
    if (normalize) {
        testData.normalize(); // BUG! This may normalize differently from the training data. It should use the same ranges for normalization!
    }
    console.log('Calculating accuracy on separate test set...');
    console.log('Test set name: ' + testFileName);
    console.log('Number of test instances: ' + testData.rows());
    const features = new Matrix_1.default(data, 0, 0, data.rows(), data.cols() - 1);
    const labels = new Matrix_1.default(data, 0, data.cols() - 1, data.rows(), 1);
    const startTime = Date.now();
    learner.train(features, labels);
    const elapsedTime = Date.now() - startTime;
    console.log('Time to train (in seconds): ' + elapsedTime / 1000.0);
    const trainAccuracy = learner.measureAccuracy(features, labels, null);
    console.log('Training set accuracy: ' + trainAccuracy);
    const testFeatures = new Matrix_1.default(testData, 0, 0, testData.rows(), testData.cols() - 1);
    const testLabels = new Matrix_1.default(testData, 0, testData.cols() - 1, testData.rows(), 1);
    const confusion = new Matrix_1.default();
    const testAccuracy = learner.measureAccuracy(testFeatures, testLabels, confusion);
    console.log('Test set accuracy: ' + testAccuracy);
    if (verbose) {
        console.log('\nConfusion matrix: (Row=target value, Col=predicted value)');
        confusion.print();
        console.log('\n');
    }
}
exports.staticEval = staticEval;
function randomEval(data, learner, evalParameter, verbose) {
    console.log('Calculating accuracy on a random hold-out set...');
    const trainPercent = parseFloat(evalParameter);
    if (trainPercent < 0 || trainPercent > 1)
        throw new Error('Percentage for random evaluation must be between 0 and 1');
    console.log('Percentage used for training: ' + trainPercent);
    console.log('Percentage used for testing: ' + (1 - trainPercent));
    data.shuffle();
    const trainSize = Math.floor(trainPercent * data.rows());
    const trainFeatures = new Matrix_1.default(data, 0, 0, trainSize, data.cols() - 1);
    const trainLabels = new Matrix_1.default(data, 0, data.cols() - 1, trainSize, 1);
    const testFeatures = new Matrix_1.default(data, trainSize, 0, data.rows() - trainSize, data.cols() - 1);
    const testLabels = new Matrix_1.default(data, trainSize, data.cols() - 1, data.rows() - trainSize, 1);
    const startTime = Date.now();
    learner.train(trainFeatures, trainLabels);
    const elapsedTime = Date.now() - startTime;
    console.log('Time to train (in seconds): ' + elapsedTime / 1000.0);
    const trainAccuracy = learner.measureAccuracy(trainFeatures, trainLabels, null);
    console.log('Training set accuracy: ' + trainAccuracy);
    const confusion = new Matrix_1.default();
    const testAccuracy = learner.measureAccuracy(testFeatures, testLabels, confusion);
    console.log('Test set accuracy: ' + testAccuracy);
    if (verbose) {
        console.log('\nConfusion matrix: (Row=target value, Col=predicted value)');
        confusion.print();
        console.log('\n');
    }
}
exports.randomEval = randomEval;
function crossEval(data, learner, evalParameter) {
    console.log('Calculating accuracy using cross-validation...');
    const folds = parseInt(evalParameter, 10);
    if (folds <= 0)
        throw new Error('Number of folds must be greater than 0');
    console.log('Number of folds: ' + folds);
    const reps = 1;
    let sumAccuracy = 0;
    let elapsedTime = 0;
    for (let j = 0; j < reps; j++) {
        data.shuffle();
        for (let i = 0; i < folds; i++) {
            const begin = i * data.rows() / folds;
            const end = (i + 1) * data.rows() / folds;
            const trainFeatures = new Matrix_1.default(data, 0, 0, begin, data.cols() - 1);
            const trainLabels = new Matrix_1.default(data, 0, data.cols() - 1, begin, 1);
            const testFeatures = new Matrix_1.default(data, begin, 0, end - begin, data.cols() - 1);
            const testLabels = new Matrix_1.default(data, begin, data.cols() - 1, end - begin, 1);
            trainFeatures.add(data, end, 0, data.rows() - end);
            trainLabels.add(data, end, data.cols() - 1, data.rows() - end);
            const startTime = Date.now();
            learner.train(trainFeatures, trainLabels);
            elapsedTime += Date.now() - startTime;
            const accuracy = learner.measureAccuracy(testFeatures, testLabels, null);
            sumAccuracy += accuracy;
            console.log('Rep=' + j + ', Fold=' + i + ', Accuracy=' + accuracy);
        }
    }
    elapsedTime /= (reps * folds);
    console.log('Average time to train (in seconds): ' + elapsedTime / 1000.0);
    console.log('Mean accuracy=' + (sumAccuracy / (reps * folds)));
}
exports.crossEval = crossEval;
