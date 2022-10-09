---
title: "Digital Circuits and Verilog Review"
date: 2022-09-26T04:20:37-04:00
lastmod: 2022-10-02T04:20:37-04:00
slug: 2022-09-26-digital-circuits-and-verilog-review
type: posts
draft: false
categories:
  - default
tags:
  - work
  - school
---


I have a job interview coming up that requires knowledge of digital circuits and Verilog. Of course I've already forgotten everything I learned in ECE253 so I've decided to make some notes as a post for review.


# Part 1: Logic Circuits

### Logic Expressions and Logic Gates
- transistors are essentially on (x = 1) / off (x = 0) switches
    - can imagine them as a varying value resistor
- we can make a simple circuit using the switch and a lightbulb:

{{<figure src="images/lxx.png" width="300px" height="" caption="Simple connection of a light switch to battery.">}}

- if x = 1, then L = 1; if x = 0, then L = 0
- i.e. L(x) = x
- this is an example of a basic logic function/expression

### Basic Logic Gates: AND, OR, NOT
1. AND: two switches in series
{{<figure src="images/andCircuit.png" width="300px" height="" caption="Logical AND circuit.">}}
    - L turns on only if both x1 and x2 are 1
    - i.e. L = x1 * x2
    - '*' means AND

2. OR: two switches in parallel
{{<figure src="images/orCircuit.png" width="300px" height="" caption="Logical OR circuit.">}}
    - L turns on if either or both x1 = 1, x2 = 1
    - i.e. L = x1 + x2
    - '+' means OR

3. NOT: switch and light in parallel
    - when x = 1, L = 0; x = 0, L = 1
    - i.e. L = !x

### Truth Tables
- tables that display inputs and outputs of a logic function
- e.g. truth table for AND and OR:
{{<figure src="images/truthTable.png" width="200px" height="" caption="Truth table for AND and OR.">}}

### Logic Gate Circuits
- also called "gate level schematics"
- logic gate circuit symbols for AND, OR, and NOT:
{{<figure src="images/logicGates.png" width="300px" height="" caption="Logic gate circuit symbols.">}}

### Boolean Algebra
- an effective means to describe logic circuits
- consists of a set of rules derived from axioms

#### Axioms
1. 0 * 0 = 0
2. 1 * 1 = 1
3. 0 * 1 = 1 * 0 = 0
4. if x = 0, !x = 1

- **Duality**: we can swap 0 with 1 and * with + in a logic expression and it will remain the same

#### Rules derived from axioms

#### Identities
 

### Terminology and Notation
- **Literal**: any variable or its complement (e.g. x, !y)
- **Product term**: synonym for AND
- **Sum term**: synonym for OR
- **Sum of products (SOP)**: an OR of ANDs (e.g. xy + !x!y)
- **Minterm**: a product term that evaluates to 1 for exactly 1 row of the truth table
- **Canonical SOP**: SOP expression for a function that comprises ts minterms
- **Maxterm**: sum term that is 0 for exactly 1 row of truth table
- **Canonical POS**: product of sums (POS) expression for a function that comprises its maxterms

{{<figure src="images/minMaxTerms.png" width="300px" height="" caption="Three-variable minterms and maxterms.">}}

- Example: f(x, y, z) = sum[m(0, 1, 2, 3, 6, 7)]
    - canonical SOP: f = !x!y!z + !x!yz + !xy!z + !xyz + xy!z + xyz
    - simplifying the expression gives: f = !x + y
- for ANY given function, we can cover its 1s using SOP or its 0s using POS

### NAND and NOR
- NAND = NOT AND
- NOR = NOT OR
- every SOP circuit can be implemented as NAND-NAND, i.e. NAND gates are functionally complete (can implement all logic functions)
- every POS circuit can be implemented as NOR-NOR


### Multiplexers
- say we design a circuit that controls a light f from either of 2 switches, x or y (called data inputs)
- the switch that selects x or y is controlled by input s (called the select input)
- if s = 0, f is controlled by x; else y
- logic function: f = !sx + sy
- this logic circuit is called a **2 to 1 multiplexer (MUX)**
{{<figure src="images/multiplexer.png" width="400px" height="" caption="">}}
- we can have multi-bit wide multiplexers as well


### Exclusive-OR and Adders
- XOR: f = !xy + x!y 
- in Verilog: f = x^y
- when one of the inputs is logic 1, the output is inverse of second input
{{<figure src="images/xor.png" width="400px" height="" caption="XOR representations.">}}

#### Binary Addition
- circuit component called "full adder" that performs binary addition
- takes 3 inputs: x, y, and c_in (carry in)
- 2 outputs: s (sum) and c_out (carry out)
- logic function for c_out = xy + xc_in + yc_in 
    - c_out = 1 if two or more inputs are 1
- logic function for s = c_in^x^y
    - s = 1 if there are an odd number of inputs that are 1
- 3-bit ripple carry adder:
    - performs addition of 2 3-bit numbers
    - the carry (c_out) can ripple from least significant bit to most significant bit


### Verilog Introduction
- example: 2 to 1 MUX
```
module mux2to1(x, y, s, f);
    input x, y, s;
    output f;
    assign f = (~s & x) | (s & y)
end module
```
- keywords in Verilog:
    - **module** -- kind of like function declaration
    - **end module** -- ends the module declaration
    - **input/output** -- specifies input/output signal
    - **assign** -- kind of like variable assignment; assigns a logic expression to signal but think of it as wiring up signals to produce a continuously driven value
        - assign statements occur concurrently so order of assign statements doesn't matter
- the signal names inside the brackets after the module name are the name of input/output **ports** of the module
- to actually build this on the DE1-SoC board, we need to map the signal/port names to the actual switch and LED components on the board
- say we use switch 1 and 0 for x and y, switch 9 for s, and f to appear on LED 0:
```
module mux2to1(SW, LEDR);
    input [9:0]SW; // the [9:0] tells us SW is 10 bits long
    output[9:0]LEDR;
    wire x, y, s, f;
    assign s = SW[9];
    assign y = SW[1];
    assign x = SW[0];
    assign f = (~s & x) | (s & y)
    assign LEDR[0] = f;
end module
```
- **wire** data type that represents intermediate signals -- can think of them as literally physical wires connecting signals

#### Hierarchical Verilog
- similar to functions in programming
- example: we will create a full adder, then use instances of it to create a 3 bit ripple carry adder:
```
module FA(a, b, cin, s, cout);
    input a, b, cin;
    output s, cout;
    assign s = a ^ b ^ cin;
    assign cout = (a & b) | (a & cin) | (b & cin);
end module

/* this is a top level module -
- it uses FA module within and no other modules use adder3 in them */
module adder3(A, B, cin, S, cout);
    input [2:0] A, B;
    input cin;
    output [2:0] S;
    output cout;
    wire c1, c2;
    FA U0(A[0], B[0], cin, S[0], c1);
    FA U1(A[1], B[1], c1, S[1], c2);
    FA U2(A[2], B[2], c2, S[2], cout);
end module 
```

### Introduction to FPGAs and CAD Tools
- for most chips, function is fixed at the time of manufacture
- Field Programmable Gate Arrays (FPGAs) are configurable by user 
    - programmable hardware -- can implement any digital circuit
    - reconfigurable
    - cheaper than custom chips in moderate volume
- implementing logic in FPGAs:
    - often done with look-up tables (LUTs) -- hardware implementation of truth table, has small memory that holds output values for each input combination
- CAD -- computer aided design tool to turn HDL into bitstream


### More Verilog Examples
#### 2 to 1 MUX 2-bit
```
module mux2to1-2bit(X, Y, s, F);
    input s;
    input [1:0] X, Y;
    output [1:0] F;
    assign F[1] = (~s & X[1]) | (s & Y[1]);
    assign F[0] = (~s & X[0]) | (s & Y[0]);
end module
```
- note: we must assign an expression to each bit of F individually because s is only 1 bit, while X and Y are 2 bits
    - Verilog will turn s into a vector (like X and Y) by adding zeros
    - this won't work properly if s is 1
- we could use **bit concatenation** {} to make a vector:
    - i.e. F = ({~s, ~s} & X) | ({s, s} & Y)


### Introduction to Karnaugh Maps
- **Karnaugh Map**: type of truth table used to easily minimize logic expressions -- minterms that can be combined to form a term are adjacent
{{<figure src="images/kmap.png" width="250px" height="" caption="4 variable K-map.">}}

#### K-Map Terminology
- **Implicant**: a product term P is an implicant of boolean function F if P imples F, i.e. F = 1 whenever P = 1
- **Prime Implicant (PI)**: an implicant that can't be accounted/covered for by a more general (fewer literals) implicant
- **Essential PI**: a PI that covers at least 1 minterm not covered by any other PI
- **Cover**: any set of implicants that cover all minterms of a function -- describes the function, always want to find minimum cost cover
    - cost = # gates + # inputs
    - product terms that cover more adjacent cells are cheaper

#### Procedure for Finding Min-Cost Cover:
1. Find PIs
2. Identify essential PIs and include in the cover
3. Choose other PIs as needed until all minterms are covered such that # of literals is minimized
    - don't always choose largest group of 1's -- some special cases where choosing smaller groups end up being cheaper

#### Don't Cares
- sometimes we know specific values of inputs won't occur, or if they do, we don't care what output is produced in those cases
- e.g. a 7-seg display can only show up to decimal 9, which requires 4 bits to represent in binary, but 4 bits can represent up to 15 in decimal, so for input numbers 10-15, it doesn't matter what the output of the 7-seg display is since we know it will never happen




# Part 2: Sequential Circuits
- **Combinational Circuits**: output only determined by present input
- **Sequential Circuits**: output determined by present and previous inputs
    - allows us to store information

### RS Latch
- think of an alarm clock -- need to be able to *set* it off and also *reset* it
- RS = reset/set
- memory circuits have feedback loops in the circuit since they need to reference previous values in the circuit
- RS latch: cross coupled NOR gates
{{<figure src="images/rsLatch.png" width="400px" height="" caption="RS latch circuit and characteristic table.">}}
- when S = R = 0, the output of their NOR gates will be the opposite of the other input, so we'll either have Q = 1 and !Q = 0, or Q = 0 and !Q = 1
- when you reset the latch (R = 1), the output Q will be 0 no matter what
- when you set the latch (S = 1), the output !Q will be 0 no matter what, and given that R = 0, then Q = 1 (alarm is set off)
- when you set S = R = 1, both Q and !Q equal 0 -- this violates the purpose of Q and !Q
    - is bad and can lead to oscillations in Q and !Q
    - if you simultaneously turn S and R to 0, it causes Q and !Q to both change to 1, but if they're both 1, they must be 0 since they are each other's inputs, but if both 0 then they are 1...

### Gated D Latch and the Clock Signal
- add a clock input (square wave) to RS latch to disable/enable it
- AND the clock input with the R and S input so when clock = 0, R' and S' are 0
- when R' and S' are 0, the value of Q and !Q are stored
{{<figure src="images/gatedSRLatch.png" width="500px" height="" caption="Gated SR Latch.">}}
- we can also represent the circuit using only NAND gates

#### Gated D Latch
- if we let D = S, !D = R, we can avoid the S = R = 1 case, and have created a gated D latch:
{{<figure src="images/gatedDLatch.png" width="500px" height="" caption="Gated D Latch.">}}
- D is the "data input"
- when clock = 0, Q's value is stored
- when clock = 1, Q follows D

#### New Verilog Statements for Sequential Circuits
- always block, if-else, case
- example: multiplexer -- s == 0 ? f = x1 : f = x2
```
module mux(x1, x2, s, f);
    input x1, x2, s;
    output reg f;

    always @(x1, x2, s) // the sensitivity list (inside the brackets)
    begin
        if (s == 0)
            f = x1;
        else
            f = x2;
    end

end module
```
- the always block is a procedural block -- statements inside of it are executed *sequentially*
- the sensitivity list gives us the signals that can directly affect assignment mode in always block -- always block is executed whenever a signal in the sensitivity list changes
    - often written as "always @(*)" for combinational circuits, where * means wildcard 
- any signal assigned a value in an always block must be declared as type reg
- some types of statements (if/else, case) must be written in always block
- example: 7 seg display for numbers 0-9:
```
module seg7(SW, HEX0);
    input [3:0]SW;
    output reg [6:0]HEX0;
    always @(*)
    begin
        case(SW)
            4'b0000: HEX0 = 7'b1000000;
            4'b0000: HEX0 = 7'b1111001;
            .
            .
            .
            4'b1001: HEX0 = 7'b0010000;
            default: HEX0 = 7'bxxxxxxx;
        end case
    end
end module
```
- note: default clause covers the cases that were not accounted for -- very important to include since without it, the compiler will generate latches and things will potentially not behave the way they should


### Flip Flops
- FILL IN AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

#### Verilog for Sequential Circuits
The D latch:
```
module D-latch(D, clk, Q);
    input D, clk;
    output reg Q;
    always @(D, clk)
    begin
        if (clk == 1'b1)
            Q = D;
    end
```
- notice how no else clause is used -- a latch is automatically created, i.e. Q is stored if clk != 1'b1, though this is probably bad practice

D Flip-Flop:
```
module D-ff(D, clk, Q)
    input D, clk;
    output reg Q;
    always @(posedge clk)
    begin
        Q <= D;
    end
end module
```
- notice D is not included in sensitivity list this time because changes in D's value don't directly change value of FF
- we refer to signals going from 0 to 1 as **positive (rising) edge** (posedge) and 1 to 0 as **negative (falling) edge** (negedge)
- we use "<=" to assign values in FFs
- one FF can only store 1 bit of information
- **register**: a set of *n* FFs used to store *n* bits of information, all sharing the same clock signal
    - e.g. 8-bit register in Verilog: essentially same as an FF but D and Q are 8 bits long
```
module reg8(D, clk, Q);
    input [7:0]D;
    input clk;
    output reg [7:0]Q;
    always @(posedge clk);
    begin
        Q <= D;
    end
end module
```

### T-Flip Flops, Counters
- useful abstractions for counter designs
{{<figure src="images/tFF.gif" width="300px" height="" caption="T-flip flop circuit.">}}
{{<figure src="images/tFF.png" width="300px" height="" caption="T-flip flop characteristic.">}}
- at rising clock edge:
    - if T = 0, Q(t) is stored
    - if T = 1, !Q(t) is stored
- essentially T FFs toggle when T = 1

#### 3-bit counter
- we can use T-FFs to make a sequential counter (000, 001, 010, etc.)
- count advances at each rising clock edge
{{<figure src="images/3bitCounterTable.png" width="300px" height="" caption="3-bit counter table.">}}
- notice Q0 toggles every cycle
- Q1 toggles when Q0 = 1 in previous cycle
- Q2 toggles when both Q0 = Q1 = 1 in previous cycle
- example of a 4-bit counter:
{{<figure src="images/3bitCounter.png" width="400px" height="" caption="3-bit counter circuit.">}}
- see how in this circuit:
    - Q0 always toggles
    - Q1 toggles when Q0 = 1
    - Q2 toggles when Q0 AND Q1 = 1
- for Qn, T = Q0 * Q1 * Q2 * ... * Q(n-1)

#### 3-bit counter with "enable"
- when "enable" input = 1, count as usual; if enable = 0, stop counting (hold/store value)
- enable is ANDed with the inputs of the FFs so if enable = 0, the inputs into the FFs are 0

#### 3 bit counter with enable and parallel load
- allows you to preload counter with new value D2, D1, D0
{{<figure src="images/3bitCounterLoad.png" width="300px" height="" caption="3-bit counter circuit with parallel load capability.">}}
- Verilog:
```
module upcount(R, resetn, clock, E, L, Q);
    input [3:0]R;
    input resetn, clock, E, L;
    output reg [3:0]Q;
    always @(posedge clock, negedge resetn)
    begin
        if (!resetn)
            Q <= 4'b0000
        else if (L)
            Q <= R;
        else if (E)
            Q <= Q + 1 // addition
    end
end module
```
- note: adding 0b1111 + 1 should equal 0b10000, but since Q is only 4 bits, it will overflow and will equal 0b0000

#### 3 bit down counter
- Q0 toggles every cycle, Q1 toggles when Q0 = 0, Q2 toggles when Q1 and Q0 = 0


### Resets and Sets on Flip Flops
- we want to make a positive edge triggered FF with **active low synchronous reset**
    - active low: 0 state causes reset
    - synchronous reset: reset happens on clock edge
- we can achieve this by ANDing reset input with the D input so that when reset = 0, the input into the FF is 0
{{<figure src="images/FFwReset.png" width="400px" height="" caption="D-FF with active low synchronous reset.">}}
- in Verilog:
```
module dffreset(D, resetn, clock, Q);
    input D, resetn, clock;
    output reg Q;
    always @(posedge clock)
    begin
        if (resetn = 1'b0)
            Q <= 1'b0;
        else:
            Q <= D;
    end
end module
```
- **active low asynchronous reset**: reset can happen anytime (not just on clock edge)
```
module DFF-resetn(D, resetn, clock, Q);
    input D, resetn, clock;
    output reg Q;
    always @(posedge clock, negedge resetn)
    begin
        if (resetn = 1'b0)
            Q <= 1'b0;
        else
            Q <= D;
    end
end module
```

## Part 3: Finite State Machines
### Introduction to Finite State Machines
- general model of any sequential circuit:
{{<figure src="images/generalSeqCircuit.png" width="400px" height="" caption="General structure of sequential circuit with input w and output z.">}}
- the present state is represented by y1...yk 
- the next states, Y1...Yk, are a function of input w and present state y1...yk through a combinational circuit and are stored in FFs (1 FF needed for each bit)
- the output z is a function of present states y1...yk through a combinational circuit
- to design a sequential circuit
    1. State Diagram
    2. State Table
    3. State Assignment
    4. State-Assigned Table
    5. Synthesize Circuit
{{<figure src="images/stateDiagram.png" width="400px" height="" caption="Example state diagram.">}}
{{<figure src="images/exampleStateTable.png" width="200px" height="" caption="Example state table for the state diagram above.">}}
- note: a series connection of D-FFs is a shift register -- shifts bits through the registers on rising/falling clock edge
- general structure of an FSM in Verilog has 3 sections:
    1. State table
    2. FFs
    3. Output
```
module FSM(w, clock, resetn, z);
    input w, clock, resetn;
    output z;
    reg [2:1] y, Y;

    // can parameterize states here as well
    parameter A = 2'b00, B = 2'b01, ... ;

    // state table (deciding next state based on present and input) using case statement
    always @(w, y)
    begin
        case(y)
            A: if (w) ... else ...
            B: if (w) ... else ...
        endcase
    end

    // FFs -- making y = Y or resetting
    always @(posedge clock)
    begin
        if (!resetn)
            y <= A;
        else
            y <= Y;
    end 

    // FSM Output
    assign z = ...

end module
```

#### 1 Hot Encoding
- using 1 bit to represent each state
    - e.g. 4 states can be represented by only 2 bits, but with 1 hot encoding:
        - A: 0001, B: 0010, C: 0100, D: 1000
- can create logic expressions for next states Y1...Yk and output z by simply inspecting state diagram (sometimes table not needed)
    - this creates different circuits than if we had only used different numbers for different states, but has the same functionality


### Shift Register
- for FSMs detecting patterns, we use shift registers
    - e.g. detect last 3 values of w; if 101, then z = 1

### Signed Numbers and Adder/Subtractor Unit