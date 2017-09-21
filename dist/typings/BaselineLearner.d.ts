import SupervisedLearner from './SupervisedLearner';
import Matrix from './Matrix';
/**
 * For nominal labels, this model simply returns the majority class. For
 * continuous labels, it returns the mean value.
 * If the learning model you're using doesn't do as well as this one,
 * it's time to find a new learning model.
 */
export default class BaselineLearner extends SupervisedLearner {
    private m_labels;
    train(features: Matrix, labels: Matrix): void;
    predict(features: number[], labels: number[]): void;
}
