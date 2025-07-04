# ZK-MLP

This code uses Yarn Package Manager (Yarn) to manage dependencies. To install Yarn, follow the instructions at [Yarn Installation](https://classic.yarnpkg.com/en/docs/install/).

This repository contains MLP main algorithms adapted to zk-SNARKs, using `Zokrates`.

> Zokrates is a toolbox for zkSNARKs, which allows you to write programs in a high-level language and compile them to a circuit, using Groth16 proving system. [Learn more](https://zokrates.github.io/gettingstarted.html).

## Zokrates zk-SNARKs

The folder [zk-sources](./zk-sources/) contains the `.zok` source code for the MLP algorithms. It includes:
- Activation functions.
- Forward and backward propagation algorithms for single-layer MLP.
- Perceptron predict, train_step and train functions.
- Hash comparison routines for checking private input data.

The zk-SNARKs sources are structured as follows:

#### Activation Functions
- `activation/relu.zok` → ReLU activation function.
- `activation/leaky-relu.zok` → Leaky-ReLU activation function.
- `activation/sigmoid.zok` → Sigmoid activation function.

#### Hash Comparison
- `hash/sha256.zok` → Chained SHA-256 hash comparison.
- `hash/poseidon.1.zok` → Single Poseidon hash comparison.
- `hash/poseidon.2.zok` → Chained Poseidon hash comparison.
- `hash/poseidon.3.zok` → Optimized chained (chunk) Poseidon hash comparison.

#### MLP
- `mlp/mlp.1.zok` → MLP forward pass.

#### Perceptron
- `perceptron/predict/predict.zok` → Predict (dot product).
- `perceptron/train_step/train_step.zok` → Weights and bias update.
- `perceptron/train_step_hash/train_step_hash.zok` → Train step with SHA-256 hash comparison.
- `perceptron/train_step_poseidon/train_step_poseidon.zok` → Train step with Poseidon hash comparison.
- `perceptron/train/train.zok` → Combined train step for multiple inputs.

### Input Generation

For every `.zok` file, the [input.ts](./input.ts) script implements a JSON-file generator function for the circuit inputs. The generated JSON file is used to provide the necessary input data for the zk-SNARK witness computation.

To generate JSON input for a specific `.zok` file, change `input.ts` function call and parameters, then run:

```bash
yarn input
```

The `input.json` file will be output to the specified path. 

### Generate proof

To generate a proof for a `.zok` file with a `input.json` entry, you can either:

1. Change [main.ts](./main.ts) file paths and run with `yarn main`

```bash
yarn main
```
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

### Considerations

- Zokrates is not the best framework for large circuits such as MLPs, but it is a good starting point for learning about zk-SNARKs.
- When convert matrix operations to Zokrates, consider float-point convertion to fixed-point by scalar multiplication. The sources use `MAX_VALUE` constant to scale the values. 







