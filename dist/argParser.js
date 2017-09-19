import * as fs from 'fs';
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
export function parseArgs() {
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
