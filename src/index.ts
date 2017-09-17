import SupervisedLearner from './SupervisedLearner';
import Matrix from './Matrix';
import { parseArgs } from './argParser';
import { trainingEval, staticEval, randomEval, crossEval } from './evaluationMethods';

export { default as BaselineLearner } from './BaselineLearner';
export { default as SupervisedLearner } from './SupervisedLearner';
export { default as Matrix } from './Matrix';
export { parseArgs } from './argParser';
/**
 * Runs a machine learning algorithm
 */
export function run(learner: SupervisedLearner) {
  //Parse the command line arguments
  const {
    learnerName,
    fileName,
    evalMethod,
    normalize,
    evalParameter,
    verbose
  } = parseArgs();

  // Load the ARFF file
  const data = new Matrix();
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
      trainingEval(data, learner, verbose);
      break;
    case 'static':
      staticEval(data, learner, evalParameter, normalize, verbose);
      break;
    case 'random':
      randomEval(data, learner, evalParameter, verbose);
      break;
    case 'cross':
      crossEval(data, learner, evalParameter);
      break;
    default:
      throw new Error('The arg parser must have a bug. Please submit a PR');
  }
}
