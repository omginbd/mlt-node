import Matrix from './Matrix';
export default abstract class SupervisedLearner {
    /**
     * Before you call this method, you need to divide your data
     * into a feature matrix and a label matrix.
     * @param features
     * @param labels
     */
    abstract train(features: Matrix, labels: Matrix): void;
    /**
     * A feature vector goes in. A label vector comes out. (Some supervised
     * learning algorithms only support one-dimensional label vectors. Some
     * support multi-dimensional label vectors.)
     * @param features
     * @param labels
     */
    abstract predict(features: number[], labels: number[]): void;
    /**
     * The model must be trained before you call this method. If the label is nominal,
     * it returns the predictive accuracy. If the label is continuous, it returns
     * the root mean squared error (RMSE). If confusion is non-NULL, and the
     * output label is nominal, then confusion will hold stats for a confusion matrix.
     * @param features
     * @param labels
     * @param confusion
     */
    measureAccuracy(features: Matrix, labels: Matrix, confusion: Matrix): number;
}
