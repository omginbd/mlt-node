# mlt-node

Node port of the BYU CS 478 [machine learning toolkit](http://axon.cs.byu.edu/~martinez/classes/478/stuff/Toolkit.html) written in typescript

## Getting Started

1. Install mlt-node

```bash
npm install mlt-node
```
2. Download some datasets
```bash
mkdir datasets
wget http://axon.cs.byu.edu/~martinez/classes/478/stuff/iris.arff -P datasets/
```
3. Write a program to take in parameters and call the toolkit. This can be as simple as:
```typescript
import { SupervisedLearner, BaselineLearner, run } from 'mlt-node';

function getLearner(model: string): SupervisedLearner {
  switch (model) {
    case 'baseline':
      return new BaselineLearner();
    case 'perceptron':
    // return new Perceptron();
    case 'neuralnet':
    // return new NeuralNet();
    case 'decisiontree':
    // return new DecisionTree();
    case 'knn':
    // return new InstanceBasedLearner();
    default:
      throw new Error('Unrecognized model: ' + model);
  }
}

//Parse the command line arguments
const learnerName = process.argv[3];

run(getLearner(learnerName));
```

4. Compile your typscript program and run
```bash
node compiledProgram.js -L baseline -A datasets/iris.arff -E training
```

## Creating Learners

Creating new learners is as simple as extending the SupervisedLearner class provided by the toolkit. Just make sure to override the `train()` and `predict()` functions of the `SupervisedLearner` base class.

```typescript
import { Matrix, SupervisedLearner } from 'mlt-node';

class MyNewLearner extends SupervisedLearner {

  train(features: Matrix, labels: Matrix) {
    // Your training algorithm here.
  }

	predict(features: number[], labels: number[]) {
    // Your prediction algorithm here.
  }
}
```

## Contributing

There are bound to be bugs in this project. Please help fix them by creating PRs.
