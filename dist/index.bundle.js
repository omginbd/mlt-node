/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(1);
class Matrix {
    // Copies the specified portion of that matrix into this matrix
    constructor(that, rowStart, colStart, rowCount, colCount) {
        this.m_data = [];
        this.m_attr_name = [];
        this.m_str_to_enum = [];
        this.m_enum_to_str = [];
        if (that !== undefined) {
            for (let j = 0; j < rowCount; j++) {
                const rowSrc = that.row(rowStart + j);
                const rowDest = [];
                for (let i = 0; i < colCount; i++) {
                    rowDest[i] = rowSrc[colStart + i];
                }
                this.m_data.push(rowDest);
            }
            for (let i = 0; i < colCount; i++) {
                this.m_attr_name.push(that.attrName(colStart + i));
                this.m_str_to_enum.push(that.m_str_to_enum[colStart + i]);
                this.m_enum_to_str.push(that.m_enum_to_str[colStart + i]);
            }
        }
    }
    /**
     * Adds a copy of the specified portion of that matrix to this matrix
     */
    add(that, rowStart, colStart, rowCount) {
        if (colStart + this.cols() > that.cols()) {
            throw new Error('out of range');
        }
        for (let i = 0; i < this.cols(); i++) {
            if (that.valueCount(colStart + i) !== this.valueCount(i)) {
                throw new Error('incompatible relations');
            }
        }
        for (let j = 0; j < rowCount; j++) {
            const rowSrc = that.row(rowStart + j);
            const rowDest = [];
            for (let i = 0; i < this.cols(); i++) {
                rowDest[i] = rowSrc[colStart + i];
            }
            this.m_data.push(rowDest);
        }
    }
    /**
     * Resizes this matrix (and sets all attributes to be continuous)
     * @param rows
     * @param cols
     */
    setSize(rows, cols) {
        this.m_data = [];
        for (let j = 0; j < rows; j++) {
            const row = [];
            this.m_data.push(row);
        }
        this.m_attr_name = [];
        this.m_str_to_enum = [];
        this.m_enum_to_str = [];
        for (let i = 0; i < cols; i++) {
            this.m_attr_name.push('');
            this.m_str_to_enum.push(new Map());
            this.m_enum_to_str.push(new Map());
        }
    }
    /**
     * Loads from an ARFF file
     */
    loadArff(filename) {
        this.m_data = [];
        this.m_attr_name = [];
        this.m_str_to_enum = [];
        this.m_enum_to_str = [];
        let READDATA = false; // Set to true once you read a line with '@DATA'
        fs.readFileSync(filename, 'utf-8').split('\n').forEach((line) => {
            line = line.trim();
            if (line.length > 0 && !line.startsWith('%')) {
                if (!READDATA) {
                    const firstToken = line.split(' ')[0].toUpperCase();
                    switch (firstToken) {
                        case '@RELATION':
                            const datasetName = line.split(' ')[1].toUpperCase();
                            break;
                        case '@ATTRIBUTE':
                            let ste = new Map();
                            let ets = new Map();
                            const lineFields = line.split(/\s+/);
                            this.m_attr_name.push(lineFields[1]);
                            const type = lineFields[2].trim().toUpperCase();
                            if (type !== 'REAL' && type !== 'CONTINUOUS' && type !== 'INTEGER') {
                                try {
                                    const values = line.substring(line.indexOf('{') + 1, line.indexOf('}'))
                                        .split(',')
                                        .map(v => v.trim());
                                    values.forEach((value, i) => {
                                        if (value.length > 0) {
                                            ste.set(value, i);
                                            ets.set(i, value);
                                        }
                                    });
                                }
                                catch (e) {
                                    throw new Error("Error parsing line: " + line + "\n" + e.message);
                                }
                            }
                            this.m_str_to_enum.push(ste);
                            this.m_enum_to_str.push(ets);
                            break;
                        case '@DATA':
                            READDATA = true;
                            break;
                        default:
                            throw new Error('Error processing file. Expected @RELATION, @ATTRIBUTE, or @DATA. Instead got \'' + line + '\'.');
                    }
                }
                else {
                    try {
                        const attributes = line.split(',');
                        const dataRow = attributes.map((attribute, i) => {
                            attribute = attribute.trim();
                            if (attribute.length > 0) {
                                //Missing instances appear in the dataset as undefined
                                if (attribute === '?') {
                                    return undefined;
                                }
                                else if (this.m_enum_to_str[i].size === 0) {
                                    // Continuous values appear in the instance vector as they are
                                    return parseFloat(attribute);
                                }
                                else {
                                    // Discrete values appear as an index to the "name"
                                    // of that value in the "attributeValue" structure
                                    const result = this.m_str_to_enum[i].get(attribute);
                                    if (result === undefined) {
                                        throw new Error(`Error parsing the value '${attribute}' on line: ${line}`);
                                    }
                                    return result;
                                }
                            }
                            else {
                                throw new Error(`Error: attribute '${i + 1}' is missing on line: ${line}`);
                            }
                        });
                        this.m_data.push(dataRow);
                    }
                    catch (e) {
                        throw new Error('Error parsing line: ' + line + '\n' + e.message);
                    }
                }
            }
        });
    }
    /** Returns the number of rows in the matrix */
    rows() {
        return this.m_data.length;
    }
    /** Returns the number of columns (or attributes) in the matrix */
    cols() {
        return this.m_attr_name.length;
    }
    /** Returns the specified row */
    row(r) {
        return this.m_data[r];
    }
    /** Returns the element at the specified row and column */
    get(r, c) {
        return this.m_data[r][c];
    }
    /** Sets the value at the specified row and column */
    set(r, c, v) {
        this.row(r)[c] = v;
    }
    /** Returns the name of the specified attribute */
    attrName(col) {
        return this.m_attr_name[col];
    }
    /** Set the name of the specified attribute */
    setAttrName(col, name) {
        this.m_attr_name[col] = name;
    }
    /** Returns the name of the specified value */
    attrValue(attr, val) {
        return this.m_enum_to_str[attr].get(val);
    }
    /**
     * Returns the number of values associated with the specified attribute (or column)
     * 0=continuous, 2=binary, 3=trinary, etc.
    */
    valueCount(col) {
        return this.m_enum_to_str[col].size;
    }
    /**
     * Shuffles the row order with a buddy matrix.
     * Differs from java toolkit because it doesn't accept the java `Random`
     * construct as the first parameter.
     */
    shuffle(buddy) {
        for (let n = this.rows(); n > 0; n--) {
            const i = Math.floor(Math.random() * n);
            const tmp = this.row(n - 1);
            this.m_data[n - 1] = this.row(i);
            this.m_data[i] = tmp;
            if (buddy) {
                const tmp1 = buddy.row(n - 1);
                buddy.m_data[n - 1] = buddy.row(i);
                buddy.m_data[i] = tmp1;
            }
        }
    }
    /** Returns the mean of the specified column */
    columnMean(col) {
        let sum = 0;
        let count = 0;
        for (let i = 0; i < this.rows(); i++) {
            const v = this.get(i, col);
            if (v !== undefined) {
                sum += v;
                count++;
            }
        }
        return sum / count;
    }
    /** Returns the min value in the specified column */
    columnMin(col) {
        let m = undefined;
        for (let i = 0; i < this.rows(); i++) {
            const v = this.get(i, col);
            if (v !== undefined) {
                if (m === undefined || v < m)
                    m = v;
            }
        }
        return m;
    }
    /** Returns the max value in the specified column */
    columnMax(col) {
        let m = undefined;
        for (let i = 0; i < this.rows(); i++) {
            const v = this.get(i, col);
            if (v !== undefined) {
                if (m === undefined || v > m)
                    m = v;
            }
        }
        return m;
    }
    /** Returns the most common value in the specified column */
    mostCommonValue(col) {
        const tm = new Map();
        for (let i = 0; i < this.rows(); i++) {
            const v = this.get(i, col);
            if (v !== undefined) {
                const count = tm.get(v);
                if (count === undefined) {
                    tm.set(v, 1);
                }
                else {
                    tm.set(v, count + 1);
                }
            }
        }
        let maxCount = 0;
        let val = undefined;
        tm.forEach((value, key) => {
            if (value > maxCount) {
                maxCount = value;
                val = key;
            }
        });
        return val;
    }
    normalize() {
        for (let i = 0; i < this.cols(); i++) {
            if (this.valueCount(i) === 0) {
                const min = this.columnMin(i);
                const max = this.columnMax(i);
                for (let j = 0; j < this.rows(); j++) {
                    const v = this.get(j, i);
                    if (v !== undefined) {
                        this.set(j, i, (v - min) / (max - min));
                    }
                }
            }
        }
    }
    print() {
        console.log('@RELATION Untitled\n');
        for (let i = 0; i < this.m_attr_name.length; i++) {
            console.log('@ATTRIBUTE ' + this.m_attr_name[i]);
            const vals = this.valueCount(i);
            if (vals === 0) {
                console.log(' CONTINUOUS\n');
            }
            else {
                console.log(' {');
                for (let j = 0; j < vals; j++) {
                    if (j > 0) {
                        console.log(', ');
                    }
                    console.log(this.m_enum_to_str[i].get(j));
                }
                console.log('}\n');
            }
        }
        console.log('@DATA\n');
        for (let i = 0; i < this.rows(); i++) {
            const r = this.row(i);
            for (let j = 0; j < r.length; j++) {
                if (j > 0) {
                    console.log(', ');
                }
                if (this.valueCount(j) === 0) {
                    console.log(r[j]);
                }
                else {
                    console.log(this.m_enum_to_str[j].get(r[j]));
                }
            }
            console.log('\n');
        }
    }
}
exports.default = Matrix;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(1);
/**
 * Prints help information and commandline usage
 */
function printUsage() {
    console.log('Usage:');
    console.log('    malt -L [learningAlgorithm] -A [ARFF_File] -E [evaluationMethod] {[extraParameters]} [OPTIONS]\n');
    console.log('OPTIONS:');
    console.log('    -V Print the confusion matrix and learner accuracy on individual class values');
    console.log('    -N Use normalized data');
    console.log();
    console.log('Possible evaluation methods are:');
    console.log('    MLSystemManager -L [learningAlgorithm] -A [ARFF_File] -E training');
    console.log('    MLSystemManager -L [learningAlgorithm] -A [ARFF_File] -E static [testARFF_File]');
    console.log('    MLSystemManager -L [learningAlgorithm] -A [ARFF_File] -E random [%_ForTraining]');
    console.log('    MLSystemManager -L [learningAlgorithm] -A [ARFF_File] -E cross [numOfFolds]\n');
}
/**
 * Processes command line arguments. Exits if args are invalid.
 */
function parseArgs() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        printUsage();
        process.exit();
    }
    let result = {
        fileName: '',
        learnerName: '',
        evalMethod: '',
        evalParameter: '',
        verbose: false,
        normalize: false,
    };
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '-V':
                result.verbose = true;
                break;
            case '-N':
                result.normalize = true;
                break;
            case '-L':
                if (i + 1 !== args.length) {
                    result.learnerName = args[++i];
                }
                else {
                    console.log('missing learning type. Exiting...');
                    process.exit();
                }
                break;
            case '-A':
                if (i + 1 !== args.length) {
                    result.fileName = args[++i];
                    if (!fs.existsSync(result.fileName)) {
                        console.log('arff file does not exist. Exiting...');
                        process.exit();
                    }
                }
                else {
                    console.log('missing arff file. Exiting...');
                    process.exit();
                }
                break;
            case '-E':
                if (i + 1 !== args.length) {
                    result.evalMethod = args[++i];
                    if (result.evalMethod === 'static' ||
                        result.evalMethod === 'random' ||
                        result.evalMethod === 'cross') {
                        if (i + 1 !== args.length) {
                            result.evalParameter = args[++i];
                        }
                        else {
                            console.log('missing eval parameter. Exiting...');
                            process.exit();
                        }
                    }
                    else if (result.evalMethod !== 'training') {
                        console.log('Invalid Evaluation Method: ' + result.evalMethod);
                        process.exit();
                    }
                }
                else {
                    console.log('Evaluation method missing. Exiting...');
                    process.exit();
                }
                break;
            default:
                printUsage();
                process.exit();
        }
    }
    return result;
}
exports.parseArgs = parseArgs;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class SupervisedLearner {
    /**
     * The model must be trained before you call this method. If the label is nominal,
     * it returns the predictive accuracy. If the label is continuous, it returns
     * the root mean squared error (RMSE). If confusion is non-NULL, and the
     * output label is nominal, then confusion will hold stats for a confusion matrix.
     * @param features
     * @param labels
     * @param confusion
     */
    measureAccuracy(features, labels, confusion) {
        if (features.rows() !== labels.rows()) {
            throw (new Error("Expected the features and labels to have the same number of rows"));
        }
        if (labels.cols() !== 1) {
            throw (new Error("Sorry, this method currently only supports one-dimensional labels"));
        }
        if (features.rows() === 0) {
            throw (new Error("Expected at least one row"));
        }
        const labelValues = labels.valueCount(0);
        if (labelValues === 0) {
            // The label is continuous, so measure root mean squared error
            const pred = [1];
            let sse = 0;
            for (let i = 0; i < features.rows(); i++) {
                const feat = features.row(i);
                const targ = labels.row(i);
                pred[0] = 0; // make sure the prediction is not biassed by a previous prediction
                this.predict(feat, pred);
                const delta = targ[0] - pred[0];
                sse += (delta * delta);
            }
            return Math.sqrt(sse / features.rows());
        }
        else {
            // The label is nominal, so measure predictive accuracy
            if (confusion !== undefined) {
                confusion.setSize(labelValues, labelValues);
                for (let i = 0; i < labelValues; i++) {
                    confusion.setAttrName(i, labels.attrValue(0, i));
                }
            }
            let correctCount = 0;
            const prediction = [];
            for (let i = 0; i < features.rows(); i++) {
                const feat = features.row(i);
                const targ = labels.get(i, 0);
                if (targ >= labelValues) {
                    throw new Error("The label is out of range");
                }
                this.predict(feat, prediction);
                const pred = prediction[0];
                if (confusion !== undefined) {
                    confusion.set(targ, pred, confusion.get(targ, pred) + 1);
                }
                if (pred === targ) {
                    correctCount++;
                }
            }
            return correctCount / features.rows();
        }
    }
}
exports.default = SupervisedLearner;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Matrix_1 = __webpack_require__(0);
const argParser_1 = __webpack_require__(2);
const evaluationMethods_1 = __webpack_require__(5);
var BaselineLearner_1 = __webpack_require__(6);
exports.BaselineLearner = BaselineLearner_1.default;
var SupervisedLearner_1 = __webpack_require__(3);
exports.SupervisedLearner = SupervisedLearner_1.default;
var Matrix_2 = __webpack_require__(0);
exports.Matrix = Matrix_2.default;
var argParser_2 = __webpack_require__(2);
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


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Matrix_1 = __webpack_require__(0);
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


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const SupervisedLearner_1 = __webpack_require__(3);
/**
 * For nominal labels, this model simply returns the majority class. For
 * continuous labels, it returns the mean value.
 * If the learning model you're using doesn't do as well as this one,
 * it's time to find a new learning model.
 */
class BaselineLearner extends SupervisedLearner_1.default {
    train(features, labels) {
        this.m_labels = [];
        for (let i = 0; i < labels.cols(); i++) {
            if (labels.valueCount(i) === 0)
                this.m_labels[i] = labels.columnMean(i); // continuous
            else
                this.m_labels[i] = labels.mostCommonValue(i); // nominal
        }
    }
    predict(features, labels) {
        for (let i = 0; i < this.m_labels.length; i++) {
            labels[i] = this.m_labels[i];
        }
    }
}
exports.default = BaselineLearner;


/***/ })
/******/ ]);
//# sourceMappingURL=index.bundle.js.map