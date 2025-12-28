# LOVE Language Specification

## Chapter 1: Introduction

---

### 1.1 What is LOVE?

**LOVE** — *List Oriented Virtualized Evaluator* — is a programming language that reimagines the relationship between syntax and semantics through a depth-based ontological framework.

At its core, LOVE proposes that the **nesting depth of bracket structures** directly encodes the **semantic power** of a construct:

- Shallow depths represent simple data and values
- Deeper nesting unlocks types, functions, macros, and finally the interpreter itself

This creates a **self-similar, fractal-like** language where every level mirrors the others but with increased expressive capability.

---

### 1.2 Design Goals

#### 1.2.1 Homoiconicity
LOVE is homoiconic: code and data share identical representation. A LOVE program is a list structure that can be manipulated as data, enabling powerful metaprogramming.

#### 1.2.2 Multi-Target Compilation
LOVE compiles to multiple backends:

| Target | Use Case |
|--------|----------|
| **WebAssembly** | High-performance browser/edge execution |
| **JavaScript** | Browser integration, npm ecosystem access |
| **Gleam** | Type-safe functional programming on BEAM |
| **Erlang** | Distributed, fault-tolerant systems |

#### 1.2.3 Bootstrapping from Gleam
The initial LOVE implementation is written in Gleam, providing:
- Strong static typing for the compiler itself
- BEAM runtime for reliability
- Clean functional semantics

#### 1.2.4 Ontological Clarity
The five-fold ontology (Alpha, Beta, Ceta, Delta, Phi) provides a principled taxonomy for all language constructs. This isn't merely syntactic sugar—it's a philosophical framework for understanding computation.

---

### 1.3 Influences and Inspirations

LOVE draws from several traditions:

| Influence | Contribution |
|-----------|--------------|
| **Lisp/Scheme** | Homoiconicity, macro systems, list orientation |
| **ML Family** | Strong typing, pattern matching |
| **Erlang/Elixir** | Actor model, fault tolerance, BEAM target |
| **Forth** | Stack-based evaluation, minimalism |
| **APL/J** | Array orientation, symbolic density |
| **Smalltalk** | Everything is an object/message |

---

### 1.4 Core Concepts

#### The Bracket Depth Ladder

```
Depth 0:  Primitives      zero . 0 :integer
Depth 1:  [Alpha]         Unique, overloadable symbols
Depth 2:  [[Beta]]        Non-unique singletons
Depth 3:  [[[Ceta]]]      Structs, types, interfaces
Depth 4:  [[[[Delta]]]]   Functions, routines, callables
Depth 5:  [[[[[#]]]]]     Macros (compile-time)
Depth 6:  [[[[[[Phi]]]]]] Environment, interpreter, autology
```

Each depth level **subsumes** the previous: a function (Depth 4) can contain types (Depth 3), which contain values (Depth 0).

#### Invocation Modes

LOVE distinguishes three modes of interaction with symbols:

```love
@[symbol]   // Invoke: execute at runtime
:[symbol]   // Coerce: cast/convert type statically  
::[symbol]  // Reference: look up without executing
```

---

### 1.5 A First Example

```love
// Define a type at Depth 3
[[[Person]]]
name . :string
age . :integer

// Define a function at Depth 4
[[[[greet]]]]
person :Person -> :string
"Hello, " + ::person::name + "!"

// Create an instance at Depth 1
[alice :Person]
name is "Alice"
age is 30

// Execute
[main]
@Console::Print[@greet[::alice]]
```

---

### 1.6 Document Conventions

Throughout this specification:

- `monospace` indicates code or syntax
- **Bold** highlights key terms on first introduction
- *Italic* indicates emphasis or foreign terms
- `[[ ]]` notation shows bracket depth literally
- Examples are annotated with `// comments`

---

### 1.7 Versioning

This specification describes **LOVE version 0.1.0** (Draft).

The language is under active development. Breaking changes may occur in:
- Syntax refinements
- Standard library additions
- Target-specific behaviors

Stable releases will follow semantic versioning once the bootstrap compiler reaches maturity.

---

**Next:** [Chapter 2: Lexical Structure](./02-lexical-structure.md)
