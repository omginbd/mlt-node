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
