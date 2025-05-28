import { writeToJsonFile } from './config';

const randomFieldValue = (): string => {
    return Math.floor(Math.random() * 100).toString();
};

const randomFieldArray = (count: number): string[] => {
    const values: string[] = [];
    for (let i = 0; i < count; i++) {
        values.push(randomFieldValue());
    }
    return values;
};

const N = 100;
const input = [
    randomFieldArray(N),
    randomFieldArray(N),
    randomFieldValue()
];
const outputFilePath = `zk-sources/perceptron/input.${N}.json`;
writeToJsonFile(outputFilePath, input);