import SupervisedLearner from './SupervisedLearner';
export { default as BaselineLearner } from './BaselineLearner';
export { default as SupervisedLearner } from './SupervisedLearner';
export { default as Matrix } from './Matrix';
export { parseArgs } from './argParser';
/**
 * Runs a machine learning algorithm
 */
export declare function run(learner: SupervisedLearner): void;
