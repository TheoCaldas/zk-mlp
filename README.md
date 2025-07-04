# ZK-MLP

This code uses Yarn Package Manager (Yarn) to manage dependencies. To install Yarn, follow the instructions at [Yarn Installation](https://classic.yarnpkg.com/en/docs/install/).

This repository contains MLP main algorithms adapted to ZK-SNARKs, using `Zokrates`.

> Zokrates is a toolbox for zkSNARKs, which allows you to write programs in a high-level language and compile them to a circuit, using Groth16 proving system. [Learn more](https://zokrates.github.io/gettingstarted.html).

## Zokrates zk-SNARKs

The folder [zk-sources](./zk-sources/) contains the `.zok` source code for the MLP algorithms. It includes:
- ReLU and Leaky-ReLU activation functions.
- Forward and backward propagation algorithms for single-layer MLP.
- Perceptron predict, train_step and train functions.
- Hash comparison routines for checking private input data (SHA256 and Poseidon).

### Generate proof

To generate a proof for a `.zok` file with a `input.json` entry, you can either:

1. Change [main.ts](./main.ts) file paths and run with `yarn main`

> This will log elapsed times for each step to `/logs` folder.

2. Run the script directly:

```bash
bash prove.sh <program_zok_path> <input_json_path> <output_folder>
``` 

> This will output `proof.json` and verification key to `<output_folder>`

### Verify proof

To verify a proof, run:

```bash
bash verify.sh <output_folder>
```

Where `<output_folder>` is the folder containing the proof and verification key.









