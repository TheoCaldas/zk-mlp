import { writeToJsonFile } from './config';
import * as crypto from 'crypto';

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
    // Convert BigInt to 128-bit binary string
    function to128BitBinaryString(value: bigint): string {
        const binary = value.toString(2);
        const padded = binary.padStart(128, '0');
        if (padded.length > 128) {
            throw new Error("Value exceeds 128 bits.");
        }
        return padded;
    }

    function to128BitDecimaltring(value: bigint): string {
        return value.toString(10);
    }
  
    // Convert binary string to BigInt
    function binaryStringToBigInt(bin: string): bigint {
        return BigInt('0b' + bin);
    }
  
    // Hash binary string using SHA-256
    function sha256BinaryString(binStr: string): Buffer {
        const byteLength = Math.ceil(binStr.length / 8);
        const byteArray = new Uint8Array(byteLength);
    
        for (let i = 0; i < byteLength; i++) {
        const byte = binStr.slice(i * 8, (i + 1) * 8).padEnd(8, '0');
        byteArray[i] = parseInt(byte, 2);
        }
    
        return crypto.createHash('sha256').update(byteArray).digest();
    }
  
    // Convert Buffer to binary string
    function bufferToBinaryString(buffer: Buffer): string {
        return Array.from(buffer)
        .map(byte => byte.toString(2).padStart(8, '0'))
        .join('');
    }
  
    // Main function
    function processAndHash(input: bigint[]): [bigint, bigint] {
        if (input.length > 4) {
            throw new Error("Input array bigger than four.");
        }
        
        // Step 1: concatenate 4 x 128-bit binary strings
        const concatenatedBinary = input.map(to128BitBinaryString).join('');
    
        // Step 2: hash using SHA-256
        const hashBuffer = sha256BinaryString(concatenatedBinary);
        
        // Step 3: convert hash buffer to binary string
        const hashBinary = bufferToBinaryString(hashBuffer);  // 256 bits
    
        // Step 4: split into two 128-bit chunks
        const part1 = hashBinary.slice(0, 128);
        const part2 = hashBinary.slice(128, 256);
    
        // Step 5: convert binary strings to BigInt
        const result1 = binaryStringToBigInt(part1);
        const result2 = binaryStringToBigInt(part2);
    
        return [result1, result2];
    }
    const N = 32;
    const inputs = randomFieldArray(N);

    const hashes: string[][] = [];
    const n4 = N / 4;
    for(let i = 0; i < n4; i++){
        const step = i * 4;
        const sub = inputs.slice(step, step + 4);
        const outputs = processAndHash(sub.map(e => BigInt(e)));
        hashes.push(outputs.map(e => to128BitDecimaltring(e)));
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

//predict();
//train_step();
// train();
train_step_hash();




