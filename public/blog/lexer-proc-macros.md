---
title: "Lexer Generation with Proc Macros"
date: "2024-02-10"
category: "Rust"
excerpt: "How Lachs uses Rust's powerful proc macro system to automatically generate lexers from enum definitions, making compiler frontend development faster and more maintainable."
tags: ["Rust", "Macros", "Metaprogramming", "Compilers"]
---

# Lexer Generation with Proc Macros

When building a compiler, one of the first tasks is creating a lexer to tokenize input. Traditionally, this involves writing a lot of boilerplate code. With Rust's procedural macros, we can automate this entirely.

## The Problem

Writing a lexer by hand typically involves:

1. Defining token types
2. Writing pattern matching logic
3. Managing token positions
4. Handling whitespace and comments
5. Error handling

This is tedious and error-prone. What if we could just describe our tokens and have the lexer generated for us?

## Enter Lachs

Lachs is a lightweight lexer generator that uses proc macros to generate lexers from enum definitions. Here's how it works:

```rust
use lachs::token;

#[token]
pub enum Token {
    #[terminal("+")]
    Plus,
    
    #[terminal("-")]
    Minus,
    
    #[literal("[0-9]+")]
    Integer,
    
    #[literal("[a-zA-Z_][a-zA-Z0-9_]*")]
    Identifier,
}
```

That's it! The `#[token]` macro generates:

- A complete lexer implementation
- Position tracking for all tokens
- Value extraction for literals (regex-based)
- A `Token::lex()` function

## How It Works

### 1. Macro Expansion

The proc macro expands the enum to include position information:

```rust
pub enum Token {
    Plus {
        position: lachs::Span,
    },
    Integer {
        value: String,
        position: lachs::Span,
    },
    // ... more variants
}
```

### 2. Lexer Generation

Behind the scenes, Lachs generates a lexer that:
- Compiles all regex patterns
- Tries to match each pattern at the current position
- Returns the longest match (greedy matching)
- Handles whitespace automatically

### 3. Error Handling

The lexer returns `Result<Vec<Token>, LexError>`, making error handling clean and composable.

## Real-World Usage

I use Lachs in Y-lang's lexer. Here's a snippet:

```rust
#[token]
pub enum Token {
    // Keywords
    #[terminal("fn")]
    Fn,
    #[terminal("let")]
    Let,
    #[terminal("if")]
    If,
    
    // Operators
    #[terminal("+")]
    Plus,
    #[terminal("->")]
    Arrow,
    
    // Literals
    #[literal(r#"[0-9]+"#)]
    Integer,
    #[literal(r#""[^"]*""#)]
    String,
}
```

## Performance Considerations

Proc macros run at compile time, so there's:
- **No runtime overhead**: The generated code is as efficient as hand-written
- **Compile-time errors**: Regex errors are caught during compilation
- **Type safety**: All tokens are strongly typed

## Limitations and Trade-offs

While Lachs is powerful, it has some trade-offs:

- **Regex-based**: Not suitable for context-sensitive lexing
- **Name collisions**: Generated code might conflict with existing names
- **Limited customization**: Less flexible than hand-written lexers

For most use cases, especially in compiler development, these trade-offs are acceptable.

## Conclusion

Proc macros enable powerful metaprogramming in Rust. Lachs demonstrates how they can eliminate boilerplate and make compiler development more enjoyable.

Check out [Lachs on GitHub](https://github.com/H1ghBre4k3r/lachs) to try it in your next compiler project!
