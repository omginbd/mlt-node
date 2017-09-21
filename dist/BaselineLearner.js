"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SupervisedLearner_1 = require("./SupervisedLearner");
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
