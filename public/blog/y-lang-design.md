---
title: "Building Y: An Expression-Centric Language"
date: "2024-01-15"
category: "Compilers"
excerpt: "Deep dive into the design decisions behind Y-lang, exploring how treating everything as an expression simplifies both the language semantics and the compiler implementation."
tags: ["Rust", "LLVM", "Language Design", "Compilers"]
---

# Building Y: An Expression-Centric Language

When I started building Y, I wanted to create a programming language that felt natural to write while maintaining strong static typing. One of the core design decisions was making everything an expression.

## What Does Expression-Centric Mean?

In most languages, there's a distinction between statements (which perform actions) and expressions (which produce values). In Y, almost everything is an expression that produces a value. This includes:

- **If expressions**: Both branches return values
- **Block expressions**: The last expression in a block is its value
- **While loops**: Can also produce values (though less commonly used)

```why
let result = if x > 10 {
    "large"
} else {
    "small"
};
```

## Benefits of This Approach

### 1. Simplified Semantics

When everything is an expression, the language becomes more uniform. You don't need to remember which constructs are statements and which are expressions.

### 2. Easier Compiler Implementation

The compiler can treat all code uniformly. This simplifies:
- Type checking (everything has a type)
- Code generation (everything produces a value)
- Optimization (uniform representation)

### 3. More Composable Code

Expressions compose naturally. You can use any expression anywhere a value is expected.

## Implementation Challenges

Of course, this design isn't without challenges:

- **Control Flow**: Implementing if/while as expressions requires careful handling of phi nodes in LLVM
- **Type Inference**: Expression-heavy code benefits from good type inference
- **Error Messages**: Need to clearly communicate type mismatches in complex expressions

## The LLVM Backend

Y targets LLVM through Inkwell, which provides Rust bindings. This gives us:

- **Optimization**: LLVM's world-class optimization passes
- **Portability**: Target multiple architectures
- **Tooling**: Integration with existing LLVM tools

## What's Next?

Current development is focused on:
- Improving struct and instance method support
- Implementing lambdas and closures
- Building out the standard library
- Polishing the LSP for better editor integration

Check out the [Y-lang repository](https://github.com/H1ghBre4k3r/y-lang) to see the code and follow development!
