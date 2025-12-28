# LOVE Language Specification

## Chapter 6: Functions

---

### 6.1 Overview

Functions in LOVE are **Delta forms** (Depth 4). They represent transformations — taking inputs and producing outputs.

---

### 6.2 Function Declaration

#### 6.2.1 Basic Syntax

```love
[[[[functionName]]]]
param1 :type1 param2 :type2 -> :returnType
body-expressions
```

#### 6.2.2 Examples

```love
[[[[add]]]]
a :integer b :integer -> :integer
a + b

[[[[greet]]]]
name :string -> :string
"Hello, " + name + "!"

[[[[identity]]]]
x :T -> :T
x
```

---

### 6.3 Parameters

#### 6.3.1 Required Parameters

```love
[[[[multiply]]]]
x :integer y :integer -> :integer
x * y
```

#### 6.3.2 Optional Parameters

```love
[[[[greet]]]]
name :string greeting :string? -> :string
@if[greeting]
  greeting + ", " + name
  "Hello, " + name
```

#### 6.3.3 Variadic Parameters

```love
[[[[sum]]]]
numbers :integer::* -> :integer
@reduce[numbers @add 0]
```

The `::*` suffix indicates zero or more arguments.

#### 6.3.4 Named Parameters

```love
[[[[createUser]]]]
name: :string age: :integer -> :User
@User[name age]

// Invocation
@createUser[name: "Alice" age: 30]
```

---

### 6.4 Return Types

#### 6.4.1 Explicit Return

```love
[[[[classify]]]]
n :integer -> :string
@if[n < 0]
  "negative"
  @if[n = 0]
    "zero"
    "positive"
```

#### 6.4.2 Implicit Return

The last expression is the return value:

```love
[[[[square]]]]
x :integer -> :integer
x * x  // Returned implicitly
```

#### 6.4.3 Unit Return

```love
[[[[logMessage]]]]
msg :string -> :unit
@Console::Print[msg]
```

---

### 6.5 Invocation

#### 6.5.1 Basic Invocation

```love
@functionName[arg1 arg2]
```

#### 6.5.2 Chained Invocation

```love
@outer[@middle[@inner[x]]]
```

#### 6.5.3 Method-Style (Proposed)

```love
::user.@greet["Hi"]
// Equivalent to
@greet[::user "Hi"]
```

---

### 6.6 Closures

Functions capture their lexical environment:

```love
[[[[makeAdder]]]]
n :integer -> (:integer -> :integer)

  [[[[adder]]]]
  x :integer -> :integer
  x + n  // Captures 'n' from outer scope
  
  adder

// Usage
add5 is @makeAdder[5]
result is @add5[10]  // 15
```

---

### 6.7 Higher-Order Functions

#### 6.7.1 Functions as Parameters

```love
[[[[map]]]]
list :List[:A] fn (:A -> :B) -> :List[:B]
@match[list]
  [] -> []
  [head ...tail] -> [@fn[head] ...@map[tail fn]]
```

#### 6.7.2 Functions as Return Values

```love
[[[[compose]]]]
f (:B -> :C) g (:A -> :B) -> (:A -> :C)

  [[[[composed]]]]
  x :A -> :C
  @f[@g[x]]
  
  composed
```

---

### 6.8 Recursion

#### 6.8.1 Direct Recursion

```love
[[[[factorial]]]]
n :integer -> :integer
@if[n <= 1]
  1
  n * @factorial[n - 1]
```

#### 6.8.2 Tail Recursion

LOVE implementations should optimize tail calls:

```love
[[[[factorial-iter]]]]
n :integer acc :integer -> :integer
@if[n <= 1]
  acc
  @factorial-iter[n - 1  n * acc]  // Tail position
```

#### 6.8.3 Mutual Recursion

```love
[[[[isEven]]]]
n :integer -> :boolean
@if[n = 0] true @isOdd[n - 1]

[[[[isOdd]]]]
n :integer -> :boolean
@if[n = 0] false @isEven[n - 1]
```

---

### 6.9 Pattern Matching in Functions

#### 6.9.1 Match Expressions

```love
[[[[describe]]]]
value :any -> :string
@match[value]
  :integer n -> "Number: " + n
  :string s -> "Text: " + s
  :nil -> "Nothing"
  _ -> "Unknown"
```

#### 6.9.2 Destructuring

```love
[[[[getX]]]]
point :Point -> :float
@match[point]
  [x: x y: _] -> x
```

---

### 6.10 Built-in Functions

#### 6.10.1 Arithmetic

| Function | Signature | Description |
|----------|-----------|-------------|
| `add` | `(:integer :integer) -> :integer` | Addition |
| `sub` | `(:integer :integer) -> :integer` | Subtraction |
| `mul` | `(:integer :integer) -> :integer` | Multiplication |
| `div` | `(:integer :integer) -> :integer` | Division |
| `mod` | `(:integer :integer) -> :integer` | Modulo |

#### 6.10.2 Comparison

| Function | Signature | Description |
|----------|-----------|-------------|
| `eq` | `(:any :any) -> :boolean` | Equality |
| `lt` | `(:integer :integer) -> :boolean` | Less than |
| `gt` | `(:integer :integer) -> :boolean` | Greater than |
| `lte` | `(:integer :integer) -> :boolean` | Less or equal |
| `gte` | `(:integer :integer) -> :boolean` | Greater or equal |

#### 6.10.3 List Operations

| Function | Signature | Description |
|----------|-----------|-------------|
| `head` | `(:List[:T]) -> :T` | First element |
| `tail` | `(:List[:T]) -> :List[:T]` | All but first |
| `cons` | `(:T :List[:T]) -> :List[:T]` | Prepend |
| `length` | `(:List[:any]) -> :integer` | Length |

---

### 6.11 Target-Specific Functions

#### 6.11.1 JavaScript Target

```love
[[[[javascript]]]]
// Implementation provided by JavaScript runtime
```

#### 6.11.2 Erlang Target

```love
[[[[erlang]]]]
// Implementation via Erlang FFI
```

---

### 6.12 Function Attributes

#### 6.12.1 Pure Functions

```love
[[[[pure:add]]]]
a :integer b :integer -> :integer
a + b
```

#### 6.12.2 Inline Hint

```love
[[[[inline:square]]]]
x :integer -> :integer
x * x
```

#### 6.12.3 Memoized

```love
[[[[memo:fib]]]]
n :integer -> :integer
@if[n <= 1] n @fib[n-1] + @fib[n-2]
```

---

**Next:** [Chapter 7: Macros](./07-macros.md)
