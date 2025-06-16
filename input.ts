import { writeToJsonFile } from './config';
import { poseidon6, poseidon2 } from 'poseidon-lite'
import { processAndHash, to128BitDecimalString, to128BitHexaString } from './hash.utils';
import { monitorEventLoopDelay } from 'perf_hooks';

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
    const N = 10000;
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

const train = () => {
    const N = 10;
    const BATCH_SIZE = 10;
    const input = [
        randomFieldArray(N),    // weights
        fieldValue(0),          // bias
        Array.from({length: BATCH_SIZE}, () => randomFieldArray(N)), // inputs
        Array.from({length: BATCH_SIZE}, () => randomTarget()),      // targets
        fieldValue(10)          // rate
    ];
    writeToJsonFile(`zk-sources/perceptron/train/input.${N}.${BATCH_SIZE}.json`, input);
};

const train_step_hash = () => {
    const N = 32;
    const inputs = randomFieldArray(N);

    const hashes: string[][] = [];
    const n4 = N / 4;
    for(let i = 0; i < n4; i++){
        const step = i * 4;
        const sub = inputs.slice(step, step + 4);
        const outputs = processAndHash(sub.map(e => BigInt(e)));
        hashes.push(outputs.map(e => to128BitDecimalString(e)));
    }
 
    // const input = [
    //     inputs,    
    //     outputs.map(e => to128BitDecimaltring(e)),      
    // ];

    const input = [
        inputs,                 // inputs
        hashes,                 // inputs hash
        randomFieldArray(N),    // weights
        fieldValue(0),          // bias
        randomTarget(),         // target
        randomFieldValue(100)   // rate
    ];
    writeToJsonFile(`zk-sources/perceptron/train_step_hash/input.${N}.json`, input);
};

const poseidon_1 = () => {
    const N = 6;
    const inputs = ['0x0a', '0x05', '0x03', '0x04', '0x04', '0x04'];
    const hash = poseidon6(inputs);
    const input = [
        inputs,    // inputs
        to128BitHexaString(hash),    // inputs hash
    ];
    writeToJsonFile(`zk-sources/hash/input.${N}.json`, input);
};

const poseidon_2 = () => {
    const N = 784;
    const inputs = randomFieldArray(N);
    const inputs_int = inputs.map(e => BigInt(e));

    let hash = inputs_int[0];
    for(let i = 1; i < N; i++){
        hash = poseidon2([hash, inputs_int[i]]);
    }
    const input = [
        inputs,    // inputs
        to128BitHexaString(hash), // inputs hash
    ];
    writeToJsonFile(`zk-sources/hash/input.2.${N}.json`, input);
};

const poseidon_3 = () => {
    const N = 780;
    const inputs = randomFieldArray(N);
    const inputs_int = inputs.map(e => BigInt(e));
    const n5 = N / 5;

    let hash = BigInt(0);
    let i5: number;
    for(let i = 0; i < n5; i++){
        i5 = i * 5;
        const chunk = [
            hash,
            inputs_int[i5],
            inputs_int[i5 + 1],
            inputs_int[i5 + 2],
            inputs_int[i5 + 3],
            inputs_int[i5 + 4],
        ];
        hash = poseidon6(chunk);
    }
    const input = [
        inputs,    // inputs
        to128BitHexaString(hash), // inputs hash
    ];
    writeToJsonFile(`zk-sources/hash/input.3.${N}.json`, input);
};

const mlp_1 = () => {
    const N = 780;
    const M = 256;
    const inputs = randomFieldArray(N);
    const inputs_int = inputs.map(e => BigInt(e));
    const n5 = N / 5;

    let hash = BigInt(0);
    let i5: number;
    for(let i = 0; i < n5; i++){
        i5 = i * 5;
        const chunk = [
            hash,
            inputs_int[i5],
            inputs_int[i5 + 1],
            inputs_int[i5 + 2],
            inputs_int[i5 + 3],
            inputs_int[i5 + 4],
        ];
        hash = poseidon6(chunk);
    }

    const weights = Array.from({length: M}, () => randomFieldArray(N));
    const bias = randomFieldArray(M);

    const input = [
        to128BitHexaString(hash), // inputs hash
        inputs,     // inputs
        weights,    // w
        bias        // b
    ];
    writeToJsonFile(`zk-sources/mlp/input.1.${N}.${M}.json`, input);
};

const relu_1 = () => {
    const N = 1000;
    const inputs = randomFieldArray(N);

    const input = [
        inputs,    // inputs
    ];
    writeToJsonFile(`zk-sources/activation/input.relu.${N}.json`, input);
};

const train_step_poseidon = () => {
    const N = 780;
    const inputs = randomFieldArray(N);
    const inputs_int = inputs.map(e => BigInt(e));
    const n5 = N / 5;

    let hash = BigInt(0);
    let i5: number;
    for(let i = 0; i < n5; i++){
        i5 = i * 5;
        const chunk = [
            hash,
            inputs_int[i5],
            inputs_int[i5 + 1],
            inputs_int[i5 + 2],
            inputs_int[i5 + 3],
            inputs_int[i5 + 4],
        ];
        hash = poseidon6(chunk);
    }

    const input = [
        to128BitHexaString(hash),//hash          
        inputs,                 // inputs
        randomFieldArray(N),    // weights
        fieldValue(0),          // bias
        randomTarget(),         // target
        randomFieldValue(100)   // rate
    ];
    writeToJsonFile(`zk-sources/perceptron/train_step_poseidon/input.${N}.json`, input);
};

predict();
//train_step();
// train();
// train_step_hash();
// poseidon_1();
// poseidon_2();
// poseidon_3();
// mlp_1();
// relu_1();
// train_step_poseidon();



