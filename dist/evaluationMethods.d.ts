import SupervisedLearner from './SupervisedLearner';
import Matrix from './Matrix';
export declare function trainingEval(data: Matrix, learner: SupervisedLearner, verbose: boolean): void;
export declare function staticEval(data: Matrix, learner: SupervisedLearner, testFileName: string, normalize: boolean, verbose: boolean): void;
export declare function randomEval(data: Matrix, learner: SupervisedLearner, evalParameter: string, verbose: boolean): void;
export declare function crossEval(data: Matrix, learner: SupervisedLearner, evalParameter: string): void;
