# LOVE Language Specification

## Chapter 4: Depth Semantics

---

### 4.1 Overview

Depth is the organizing principle of LOVE. The number of nested brackets determines the **semantic category** of a form. This chapter details each depth level's precise semantics.

---

### 4.2 Depth 0: Primitives

Depth 0 forms require no brackets—they are the **atomic values** of the language.

#### 4.2.1 Symbols

```love
zero :symbol
one :symbol
name :symbol
```

Symbols are interned strings used as identifiers.

#### 4.2.2 Integers

```love
0 :integer
1 :integer
-42 :integer
```

Arbitrary-precision integers (implementation may vary by target).

#### 4.2.3 Strings

```love
name :value . @scan[::input ::new_line] :string
```

UTF-8 encoded text sequences.

#### 4.2.4 Booleans

```love
exists? :predicate . @if[name one zero] :boolean
```

Truth values, often derived from predicates.

#### 4.2.5 Binding Syntax

```love
symbol :type-hint . value :type-annotation
```

The dot `.` binds a symbol to a value with optional type annotations.

---

### 4.3 Depth 1: Alpha Forms

**Syntax:** `[symbol]` or `[symbol :type]`

Alpha forms declare **unique, overloadable** bindings.

#### 4.3.1 Simple Declaration

```love
[main]
@Console::Print["Hello, World!"]
```

#### 4.3.2 Typed Declaration

```love
[config :AppConfig]
```

#### 4.3.3 With Decorators

```love
[Users :Users] @GenerateUsers[[300] :default] @Satisfies[:Users]
```

Decorators (`@Decorator`) modify the declaration's behavior.

#### 4.3.4 Semantics

| Aspect | Behavior |
|--------|----------|
| Scope | Lexical, visible in enclosing module |
| Uniqueness | One definition per name per scope |
| Overloading | Via decorators or type-based dispatch |
| Evaluation | Lazy (thunk until referenced) |

---

### 4.4 Depth 2: Beta Forms

**Syntax:** `[[symbol]]`

Beta forms create **non-unique singletons** — instances or patterns that may repeat.

#### 4.4.1 Value Lists

```love
[[addNumbers]]
1 3 4 5.
```

Creates a sequence of values associated with `addNumbers`.

#### 4.4.2 Pattern Instances

```love
[[user]]
name is "Jeffrey"
```

#### 4.4.3 Route Definitions

```love
[[index :appRoute]]
path is "/".
method is "GET".
```

#### 4.4.4 Semantics

| Aspect | Behavior |
|--------|----------|
| Scope | Local to containing form |
| Uniqueness | Multiple instances allowed |
| Identity | Each instance is distinct |
| Pattern | May be used as template |

---

### 4.5 Depth 3: Ceta Forms (Types)

**Syntax:** `[[[symbol]]]`

Ceta forms define **structural types, interfaces, and shapes**.

#### 4.5.1 Record Types

```love
[[[User]]]
name . :string
age . :integer
```

#### 4.5.2 Parameterized Types

```love
[[[List]]]
:T
head . :T
tail . :List[:T]
```

#### 4.5.3 Interface Types

```love
[[[Printable]]]
toString -> :string
```

#### 4.5.4 Embedded Content Types

```love
[[[container :html]]]
<html>
    <body>Content</body>
</html>

[[[style :css]]]
body { color: red; }
```

#### 4.5.5 Semantics

| Aspect | Behavior |
|--------|----------|
| Role | Type definition |
| Fields | Named with type annotations |
| Instantiation | Via Alpha forms |
| Subtyping | Structural (shape-based) |

---

### 4.6 Depth 4: Delta Forms (Functions)

**Syntax:** `[[[[symbol]]]]`

Delta forms define **functions, routines, and callables**.

#### 4.6.1 Basic Function

```love
[[[[add]]]]
a :integer b :integer -> :integer
a + b
```

#### 4.6.2 Method-like Functions

```love
[[[[greet]]]]
user :User -> :string
"Hello, " + ::user::name + "!"
```

#### 4.6.3 Handler Functions

```love
[[[handler :js]]]
console.log(@index...);
```

#### 4.6.4 Target-Specific Functions

```love
[[[[javascript]]]]
// JavaScript-specific implementation
```

#### 4.6.5 Semantics

| Aspect | Behavior |
|--------|----------|
| Role | Computation unit |
| Invocation | `@function[args]` |
| Closure | Captures lexical environment |
| Return | Last expression or explicit |

---

### 4.7 Depth 5: Macro Forms

**Syntax:** `[[[[[symbol]]]]]`

Macros operate at **compile-time**, transforming syntax before evaluation.

#### 4.7.1 Declaration

```love
[[[[[when]]]]]
condition :expr body :expr -> :expr
@if[::condition ::body nil]
```

#### 4.7.2 Usage

```love
@when[::authenticated]
  @showDashboard[]
```

#### 4.7.3 Semantics

| Aspect | Behavior |
|--------|----------|
| Evaluation | Compile-time only |
| Input | Syntax trees (AST) |
| Output | Transformed AST |
| Hygiene | Lexically scoped |

---

### 4.8 Depth 6: Phi Forms (Environment)

**Syntax:** `[[[[[[symbol]]]]]]`

Phi forms configure the **interpreter, parser, and environment**.

#### 4.8.1 Application Metadata

```love
[[[[[[_]]]]]]
name :string is "Love App".
version :string is "1.0.0".
locale :string is "en".
identifier is [combine [::name ::version ::locale]]
```

#### 4.8.2 Special Symbol `_`

The underscore `_` represents the **current environment** or **anonymous context**.

#### 4.8.3 Semantics

| Aspect | Behavior |
|--------|----------|
| Role | Meta-configuration |
| Scope | Global/module-level |
| Access | Privileged operations |
| Effect | Modifies evaluation |

---

### 4.9 Depth Transition Rules

#### 4.9.1 Nesting

Forms can nest **downward** in depth:

```love
[[[[processUsers]]]]        // Depth 4: function
  [[[User]]]                 // Depth 3: type (invalid here!)
```

**Correction:** Types must be defined before use:

```love
[[[User]]]                   // Depth 3: type
name . :string

[[[[processUsers]]]]         // Depth 4: function
users :List[:User] -> :Result
```

#### 4.9.2 Reference

Lower depths can **reference** higher:

```love
// Depth 0 referencing Depth 4
result is @compute[x y]
```

#### 4.9.3 Containment

Higher depths **contain** lower:

```love
[[[[outer]]]]               // Depth 4
  [inner :LocalType]        // Depth 1 inside Depth 4
  result . 42               // Depth 0 inside Depth 4
```

---

### 4.10 Depth Diagnostic

When encountering a form, count brackets to determine semantics:

```
[ ]       → 1 bracket  → Alpha  → Unique binding
[[ ]]     → 2 brackets → Beta   → Pattern/instance
[[[ ]]]   → 3 brackets → Ceta   → Type/struct
[[[[ ]]]] → 4 brackets → Delta  → Function
[[[[[ ]]]]] → 5 brackets → Macro
[[[[[[ ]]]]]] → 6 brackets → Phi → Environment
```

---

**Next:** [Chapter 5: Type System](./05-type-system.md)
