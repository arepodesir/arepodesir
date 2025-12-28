# LOVE Language Specification

> **L**ist **O**riented **V**irtualized **E**valuator

---

## Overview

LOVE is a homoiconic, multi-target programming language designed for seamless compilation to WebAssembly, JavaScript, Gleam, and Erlang. It is bootstrapped from Gleam and embodies a unique depth-based syntactic ontology that unifies data, types, functions, and metaprogramming constructs.

## Design Philosophy

LOVE operates on the principle that **syntax depth corresponds to semantic complexity**. This creates a natural hierarchy where simpler constructs live at shallow depths, and more powerful abstractions emerge at deeper nesting levels.

## Documentation Index

| Document | Description |
|----------|-------------|
| [**spec/01-introduction.md**](./spec/01-introduction.md) | Language vision, goals, and design rationale |
| [**spec/02-lexical-structure.md**](./spec/02-lexical-structure.md) | Tokens, symbols, literals, and scanning rules |
| [**spec/03-ontology.md**](./spec/03-ontology.md) | The five-fold ontological foundation |
| [**spec/04-depth-semantics.md**](./spec/04-depth-semantics.md) | Depth levels 0-6 and their meanings |
| [**spec/05-type-system.md**](./spec/05-type-system.md) | Types, interfaces, and structural typing |
| [**spec/06-functions.md**](./spec/06-functions.md) | Functions, routines, and callables |
| [**spec/07-macros.md**](./spec/07-macros.md) | Compile-time metaprogramming |
| [**spec/08-environment.md**](./spec/08-environment.md) | PHI level: interpreter and autology |
| [**spec/09-embedding.md**](./spec/09-embedding.md) | HTML, CSS, JS embedding and web targets |
| [**spec/10-module-system.md**](./spec/10-module-system.md) | Imports, exports, and package management |
| [**spec/11-compilation-targets.md**](./spec/11-compilation-targets.md) | WASM, JS, Gleam, Erlang backends |
| [**spec/12-standard-library.md**](./spec/12-standard-library.md) | Core primitives and built-in forms |
| [**CRITIQUE.md**](./CRITIQUE.md) | Critical analysis and recommendations |
| [**LETTER.md**](./LETTER.md) | Letter to the author |

## Quick Reference

```love
// Depth 0: Primitives
zero :symbol . 0 :integer

// Depth 1: Alpha - Unique, overloadable symbols
[Users :Users]

// Depth 2: Beta - Non-unique singletons
[[addNumbers]]

// Depth 3: Types/Interfaces
[[[User]]]
name . :string
age . :integer

// Depth 4: Delta - Functions/Callables
[[[[compute]]]]

// Depth 5: Macros
[[[[[transform]]]]]

// Depth 6: Phi - Environment/Interpreter
[[[[[[_]]]]]]
```

## Invocation Syntax

| Syntax | Meaning |
|--------|---------|
| `@[<symbol>]` | Invocation (runtime call) |
| `:[<symbol>]` | Static coercion (type cast) |
| `::[<symbol>]` | Named reference (lookup) |

---

**Version:** 0.1.0 (Draft Specification)  
**Target Implementations:** WASM · JavaScript · Gleam · Erlang  
**Bootstrap Language:** Gleam
