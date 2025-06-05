pragma circom 2.0.0;

// Template for the Dot Product operation
template DotProduct (size) {
    // Declaration of signals
    signal input a[size];  
    signal input b[size];  
    signal output c;  
    
    // Constraints
    signal products[size];
    for (var i = 0; i < size; i++) {  
        products[i] <== a[i] * b[i];  
    }
    var sum = 0;
    for (var i = 0; i < size; i++) {  
        sum += products[i];
    }
    c <== sum;
}

// Template for the Perceptron prediction
template PerceptronPredict(n) {
    signal input inputs[n];  
    signal input weights[n];  
    signal input bias;        
    signal output out;

    component dotProduct = DotProduct(n);
    dotProduct.a <== inputs;
    dotProduct.b <== weights;
    var sum = dotProduct.c;
    out <== sum + bias;
}

// Main template
template Main(n) {
    signal input inputs[n];   
    signal input weights[n];  
    signal input bias;        
    signal output out;

    component perceptron = PerceptronPredict(n);
    
    for (var i = 0; i < n; i++) {
        perceptron.inputs[i] <== inputs[i];
        perceptron.weights[i] <== weights[i];
    }
    perceptron.bias <== bias;

    out <== perceptron.out;
}

// Inputs are PUBLIC
component main {public [inputs]} = Main(12);
