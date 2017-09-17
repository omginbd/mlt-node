/**
 * Processes command line arguments. Exits if args are invalid.
 */
export declare function parseArgs(): {
    fileName: string;
    learnerName: string;
    evalMethod: string;
    evalParameter: string;
    verbose: boolean;
    normalize: boolean;
};
