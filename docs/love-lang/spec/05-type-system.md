# LOVE Language Specification

## Chapter 5: Type System

---

### 5.1 Overview

LOVE employs a **structural type system** with gradual typing. Types are defined at Depth 3 (Ceta) and constrain values at all other depths.

---

### 5.2 Primitive Types

#### 5.2.1 Built-in Types

| Type | Description | Example |
|------|-------------|---------|
| `:integer` | Whole numbers | `42`, `-7`, `0` |
| `:float` | Floating-point | `3.14`, `-0.5` |
| `:string` | Text | `"hello"` |
| `:boolean` | Truth values | `true`, `false` |
| `:symbol` | Interned identifiers | `foo`, `bar-baz` |
| `:nil` | Absence of value | `nil` |

#### 5.2.2 Type Annotations

```love
name . :string
count . :integer
ratio . :float
active . :boolean
```

---

### 5.3 Composite Types

#### 5.3.1 Record Types (Ceta)

```love
[[[Point]]]
x . :float
y . :float

[[[Person]]]
name . :string
age . :integer
active . :boolean
```

#### 5.3.2 List Types

```love
[[[List]]]
:T
items . :T*

// Usage
users . :List[:User]
numbers . :List[:integer]
```

#### 5.3.3 Tuple Types (Proposed)

```love
coordinates . (:float :float :float)
pair . (:string :integer)
```

---

### 5.4 Type Parameters

#### 5.4.1 Generic Types

```love
[[[Container]]]
:T
value . :T
```

#### 5.4.2 Parameterized Instantiation

```love
[box :Container[:integer]]
value is 42

[names :Container[:string]]
value is "Alice"
```

#### 5.4.3 Constraints (Proposed)

```love
[[[Sortable]]]
:T where [:Comparable[:T]]
items . :List[:T]
```

---

### 5.5 Structural Subtyping

LOVE uses **structural subtyping** — types are compatible if their shapes match.

#### 5.5.1 Subtype Rules

```love
[[[Named]]]
name . :string

[[[Person]]]
name . :string
age . :integer

// Person is a subtype of Named (has all required fields)
[greet]
entity :Named -> :string
"Hello, " + ::entity::name
```

#### 5.5.2 Covariance and Contravariance

| Position | Variance | Example |
|----------|----------|---------|
| Return | Covariant | `:List[:Dog]` → `:List[:Animal]` |
| Parameter | Contravariant | `(:Animal) -> X` → `(:Dog) -> X` |
| Field | Invariant | Must match exactly |

---

### 5.6 Type Coercion

#### 5.6.1 Static Coercion Syntax

```love
:[Type]
```

#### 5.6.2 Examples

```love
raw :string is "42"
num :integer is :[integer] raw

value :any is getData[]
user :User is :[User] value
```

#### 5.6.3 Coercion Rules

| From | To | Behavior |
|------|-----|----------|
| `:integer` | `:float` | Implicit widening |
| `:float` | `:integer` | Explicit truncation |
| `:any` | Specific | Runtime check |
| Subtype | Supertype | Implicit |

---

### 5.7 Type Inference

LOVE performs **bidirectional type inference**.

#### 5.7.1 Local Inference

```love
// Type inferred from literal
x is 42              // x : :integer
name is "Alice"      // name : :string

// Type inferred from context
result is @add[1 2]  // result : :integer (from add's return type)
```

#### 5.7.2 Propagation

```love
[[[[identity]]]]
x :T -> :T
x

// Usage infers T
num is @identity[42]       // T = :integer
str is @identity["hello"]  // T = :string
```

---

### 5.8 Special Types

#### 5.8.1 Any Type

```love
value . :any
```

Accepts any value. Escape hatch from type checking.

#### 5.8.2 Never Type

```love
[[[[abort]]]]
-> :never
@panic["Unreachable"]
```

Indicates non-returning computation.

#### 5.8.3 Union Types (Proposed)

```love
result . :string | :integer | :nil
```

#### 5.8.4 Optional Types

```love
name . :string?
// Equivalent to :string | :nil
```

---

### 5.9 Interface Types

#### 5.9.1 Declaration

```love
[[[Showable]]]
show -> :string

[[[Comparable]]]
:T
compare :T -> :integer
```

#### 5.9.2 Implementation

Interfaces are satisfied structurally:

```love
[[[Point]]]
x . :float
y . :float

[[[[show]]]]
self :Point -> :string
"(" + ::self::x + ", " + ::self::y + ")"

// Point now satisfies Showable
```

---

### 5.10 Content Types

Special type annotations for embedded content:

#### 5.10.1 HTML Type

```love
[[[template :html]]]
<div class="container">
    [[slot]]
</div>
```

#### 5.10.2 CSS Type

```love
[[[styles :css]]]
.container {
    display: flex;
}
```

#### 5.10.3 JavaScript Type

```love
[[[script :js]]]
console.log("Interactive");
```

---

### 5.11 Type Checking Modes

#### 5.11.1 Strict Mode (Default)

All type annotations are enforced at compile time.

#### 5.11.2 Gradual Mode

Missing annotations inferred or treated as `:any`.

#### 5.11.3 Configuration

```love
[[[[[[_]]]]]]
typeMode is "strict"  // or "gradual"
```

---

### 5.12 Type Error Messages

Type errors include:

- Expected vs. actual type
- Location in source
- Suggested fixes

```
Error[E0301]: Type mismatch
  --> User.love:15:10
   |
15 |   age is "twenty"
   |          ^^^^^^^^
   |          Expected :integer, found :string
   |
   = help: Use :[integer] to coerce or change the value
```

---

**Next:** [Chapter 6: Functions](./06-functions.md)
