"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Matrix_1 = require("./Matrix");
const argParser_1 = require("./argParser");
const evaluationMethods_1 = require("./evaluationMethods");
var BaselineLearner_1 = require("./BaselineLearner");
exports.BaselineLearner = BaselineLearner_1.default;
var SupervisedLearner_1 = require("./SupervisedLearner");
exports.SupervisedLearner = SupervisedLearner_1.default;
var Matrix_2 = require("./Matrix");
exports.Matrix = Matrix_2.default;
var argParser_2 = require("./argParser");
exports.parseArgs = argParser_2.parseArgs;
/**
 * Runs a machine learning algorithm
 */
function run(learner) {
    //Parse the command line arguments
    const { learnerName, fileName, evalMethod, normalize, evalParameter, verbose } = argParser_1.parseArgs();
    // Load the ARFF file
    const data = new Matrix_1.default();
    data.loadArff(fileName);
    if (normalize) {
        console.log('Using normalized data\n');
        data.normalize();
    }
    // Print some stats
    console.log('');
    console.log('Dataset name: ' + fileName);
    console.log('Number of instances: ' + data.rows());
    console.log('Number of attributes: ' + data.cols());
    console.log('Learning algorithm: ' + learnerName);
    console.log('Evaluation method: ' + evalMethod);
    console.log('');
    switch (evalMethod) {
        case 'training':
            evaluationMethods_1.trainingEval(data, learner, verbose);
            break;
        case 'static':
            evaluationMethods_1.staticEval(data, learner, evalParameter, normalize, verbose);
            break;
        case 'random':
            evaluationMethods_1.randomEval(data, learner, evalParameter, verbose);
            break;
        case 'cross':
            evaluationMethods_1.crossEval(data, learner, evalParameter);
            break;
        default:
            throw new Error('The arg parser must have a bug. Please submit a PR');
    }
}
exports.run = run;
