import * as crypto from 'crypto';

// Convert BigInt to 128-bit binary string
export const to128BitBinaryString = (value: bigint): string => {
    const binary = value.toString(2);
    const padded = binary.padStart(128, '0');
    if (padded.length > 128) {
        throw new Error("Value exceeds 128 bits.");
    }
    return padded;
};

export const to128BitDecimalString = (value: bigint): string => {
    return value.toString(10);
};

export const to128BitHexaString = (value: bigint): string => {
    return '0x' + value.toString(16);
};

// Convert binary string to BigInt
export const binaryStringToBigInt = (bin: string): bigint => {
    return BigInt('0b' + bin);
};

// Hash binary string using SHA-256
export const sha256BinaryString = (binStr: string): Buffer => {
    const byteLength = Math.ceil(binStr.length / 8);
    const byteArray = new Uint8Array(byteLength);

    for (let i = 0; i < byteLength; i++) {
        const byte = binStr.slice(i * 8, (i + 1) * 8).padEnd(8, '0');
        byteArray[i] = parseInt(byte, 2);
    }

    return crypto.createHash('sha256').update(byteArray).digest();
};

// Convert Buffer to binary string
export const bufferToBinaryString = (buffer: Buffer): string => {
    return Array.from(buffer)
        .map(byte => byte.toString(2).padStart(8, '0'))
        .join('');
};

// SHA-256 arrays of 4 bigint
export const processAndHash = (input: bigint[]): [bigint, bigint] => {
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
};