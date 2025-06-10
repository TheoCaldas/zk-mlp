import { initialize, ZoKratesProvider, CompilationArtifacts, Proof, SetupKeypair } from "zokrates-js";
import { configLog, readInputFile, readSourceFile } from "./config";

configLog();

const zokFilePath = "zk-sources/mlp/mlp.1.zok";
const inputFilePath = "zk-sources/mlp/input.1.780.256.json";

const main = async () => {
  try{
    const zokratesProvider: ZoKratesProvider = await initialize();

    // Read input data
    const inputData = readInputFile(inputFilePath);

    // Read source file
    const source = readSourceFile(zokFilePath);

    // Compile
    console.time("[INFO] Compile");
    const artifacts: CompilationArtifacts = zokratesProvider.compile(source);
    console.timeEnd("[INFO] Compile");

    // Computation
    console.time("[INFO] Compute Witness");
    const { witness, output } = zokratesProvider.computeWitness(artifacts, inputData);
    console.timeEnd("[INFO] Compute Witness");

    // Run setup
    console.time("[INFO] Keypair Setup");
    const keypair: SetupKeypair = zokratesProvider.setup(artifacts.program);
    console.timeEnd("[INFO] Keypair Setup");
    
    // Generate proof
    console.time("[INFO] Proof Generation");
    const proof: Proof = zokratesProvider.generateProof(artifacts.program, witness, keypair.pk);
    console.timeEnd("[INFO] Proof Generation");
      
    console.log("\n[INFO] Source:", source);
    console.log("\n[INFO] Number of constraints:", artifacts.constraintCount);
    console.log("\n[INFO] Input:", inputData);
    console.log("\n[INFO] Output (witness):", output);
    console.log("\n[INFO] Proof:", proof);
  } catch (error) {
    console.error("[ERROR]", error);
  }
};
main();

