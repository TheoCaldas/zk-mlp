import { writeToJsonFile } from './config';

const MAX_VALUE = 1000;

const fieldValue = (n: number) => {
    return Math.floor(n).toString();
}
const randomFieldValue = (max: number | undefined = MAX_VALUE): string => {
    return fieldValue(Math.random() * max);
};
const randomFieldArray = (count: number, max: number | undefined = MAX_VALUE): string[] => {
    const values: string[] = [];
    for (let i = 0; i < count; i++) {
        values.push(randomFieldValue(max));
    }
    return values;
};
const randomTarget = () => {
    return fieldValue(Math.random() > 0.5 ? MAX_VALUE : 0);
}

const predict = () => {
    const N = 100;
    const input = [
        randomFieldArray(N),    // inputs
        randomFieldArray(N),    // weights
        randomFieldValue()      // bias
    ];
    writeToJsonFile(`zk-sources/perceptron/predict/input.${N}.json`, input);
};

const train_step = () => {
    const N = 100;
    const input = [
        randomFieldArray(N),    // inputs
        randomFieldArray(N),    // weights
        fieldValue(0),          // bias
        randomTarget(),         // target
        randomFieldValue(100)   // rate
    ];
    writeToJsonFile(`zk-sources/perceptron/train_step/input.${N}.json`, input);
};

//predict();
train_step();



