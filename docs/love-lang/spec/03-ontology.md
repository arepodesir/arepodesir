# LOVE Language Specification

## Chapter 3: Ontology

---

### 3.1 The Five-Fold Framework

LOVE's ontology defines five fundamental categories of being within the language. These are not merely syntactic categories—they represent **modes of existence** for computational entities.

| Name | Greek Letter | Depth | Essence |
|------|--------------|-------|---------|
| **Alpha** | Α | 1 | The beginning, unique origins |
| **Beta** | Β | 2 | Repetition, instances |
| **Ceta** | — | 3 | Form, structure, shape |
| **Delta** | Δ | 4 | Change, transformation |
| **Phi** | Φ | 6 | Wisdom, self-knowledge |

> **Note:** Depth 5 (macros) exists as the transformational bridge between Delta and Phi, not named with a Greek letter in the current spec.

---

### 3.2 Alpha (Α) — The Unique

**Depth 1: `[symbol]`**

Alpha represents singular, unique entities. An Alpha form declares something that exists **exactly once** in its namespace.

#### 3.2.1 Properties

| Property | Value |
|----------|-------|
| Uniqueness | Guaranteed unique in scope |
| Overloadability | Can be extended/overloaded |
| Mutability | Immutable once declared |

#### 3.2.2 Syntax

```love
[name :type]
[name :type] @Decorator[params]
```

#### 3.2.3 Examples

```love
[config :Config]
[main]
[Users :Users] @GenerateUsers[[300] :default]
```

#### 3.2.4 Semantics

Alpha forms create **bindings** in the current environment. They are:
- Immediately visible in enclosing scope
- Lazily evaluated (thunks) until first reference
- Subject to overloading via decorators

---

### 3.3 Beta (Β) — The Repeated

**Depth 2: `[[symbol]]`**

Beta represents **singletons** that are non-unique—they can be instantiated multiple times as part of a pattern or collection.

#### 3.3.1 Properties

| Property | Value |
|----------|-------|
| Uniqueness | Non-unique, reusable |
| Identity | Instance-based |
| Cardinality | Multiple instances allowed |

#### 3.3.2 Syntax

```love
[[name]]
[[name]] values...
```

#### 3.3.3 Examples

```love
[[addNumbers]]
1 3 4 5.

[[users]]
@Map[:User ::source]
```

#### 3.3.4 Semantics

Beta forms create:
- Prototypes that can be cloned
- List/sequence elements
- Pattern templates

---

### 3.4 Ceta — The Formed

**Depth 3: `[[[symbol]]]`**

Ceta represents **structure** — types, interfaces, and shapes. It defines *what something is* rather than *what it does*.

#### 3.4.1 Properties

| Property | Value |
|----------|-------|
| Role | Type definition |
| Composition | Structural |
| Instantiation | Via Alpha forms |

#### 3.4.2 Syntax

```love
[[[TypeName]]]
field1 . :type1
field2 . :type2
```

#### 3.4.3 Examples

```love
[[[User]]]
name . :string
age . :integer

[[[Point]]]
x . :float
y . :float

[[[List]]]
head . :T
tail . :List[:T]
```

#### 3.4.4 Semantics

Ceta forms define:
- Record types (product types)
- Interfaces (structural contracts)
- Type aliases

---

### 3.5 Delta (Δ) — The Changing

**Depth 4: `[[[[symbol]]]]`**

Delta represents **transformation** — functions, routines, and callables. It defines *what something does*.

#### 3.5.1 Properties

| Property | Value |
|----------|-------|
| Role | Function/procedure |
| Invocation | Via `@` operator |
| Purity | Encouraged but not enforced |

#### 3.5.2 Syntax

```love
[[[[functionName]]]]
param1 :type1 -> :returnType
body...
```

#### 3.5.3 Examples

```love
[[[[add]]]]
a :integer b :integer -> :integer
a + b

[[[[greet]]]]
user :User -> :string
"Hello, " + ::user::name
```

#### 3.5.4 Semantics

Delta forms are:
- First-class values (can be passed/returned)
- Lexically scoped closures
- Compiled to target-appropriate form

---

### 3.6 Phi (Φ) — The Self-Knowing

**Depth 6: `[[[[[[symbol]]]]]]`**

Phi represents **autology** — the language's ability to describe and modify itself. At this depth, we encounter the evaluator, parser, and runtime environment.

#### 3.6.1 Properties

| Property | Value |
|----------|-------|
| Role | Meta-level, interpreter |
| Access | Restricted/privileged |
| Scope | Global environment |

#### 3.6.2 Syntax

```love
[[[[[[_]]]]]]
name :string is "App Name"
version :string is "1.0.0"
```

#### 3.6.3 Examples

```love
[[[[[[_]]]]]]
name :string is "Love App"
version :string is "1.0.0"
locale :string is "en"
identifier is [combine [::name ::version ::locale]]
```

#### 3.6.4 Semantics

Phi forms define:
- Environment configuration
- Parser rules
- AST transformations
- Interpreter behavior

---

### 3.7 The Depth 5 Bridge: Macros

Between Delta (4) and Phi (6) lies Depth 5 — the realm of **macros**.

**Depth 5: `[[[[[symbol]]]]]`**

Macros operate at compile-time, transforming syntax before evaluation.

```love
[[[[[unless]]]]]
condition body -> 
@if[not ::condition] ::body

// Usage
@unless[::empty?] @process[::data]
```

---

### 3.8 Ontological Ladder

The depths form a **subsumption hierarchy**:

```
Phi (6)
  └── contains all lower depths
  └── can redefine evaluation rules
      │
Macro (5)
  └── transforms syntax at compile-time
  └── produces Delta/Ceta/Beta/Alpha
      │
Delta (4)
  └── transforms values at runtime
  └── operates on Ceta types
      │
Ceta (3)
  └── structures Alpha/Beta instances
  └── defines shape constraints
      │
Beta (2)
  └── repeatable patterns
  └── collections of Alphas
      │
Alpha (1)
  └── unique value bindings
  └── ground-level names
      │
Depth 0
  └── primitives (integers, strings, symbols)
```

---

### 3.9 Philosophical Foundation

The ontology mirrors classical philosophical categories:

| LOVE | Philosophy | Platonic |
|------|------------|----------|
| Depth 0 | Matter | Hyle |
| Alpha | Particular | Instance |
| Beta | Plurality | Many |
| Ceta | Form | Eidos |
| Delta | Change | Kinesis |
| Phi | Mind | Nous |

This isn't mere analogy—LOVE proposes that computation **is** a form of being, and programming languages instantiate ontological categories.

---

**Next:** [Chapter 4: Depth Semantics](./04-depth-semantics.md)
