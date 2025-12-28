# LOVE Language Specification

## Chapter 2: Lexical Structure

---

### 2.1 Character Set

LOVE source files are UTF-8 encoded. The language distinguishes:

| Category | Characters |
|----------|-----------|
| **Letters** | `a-z`, `A-Z`, Unicode letters |
| **Digits** | `0-9` |
| **Structural** | `[` `]` `(` `)` `{` `}` `<` `>` |
| **Operators** | `.` `:` `@` `+` `-` `*` `/` `=` `!` `?` |
| **Whitespace** | Space, Tab, Newline, Carriage Return |

---

### 2.2 Tokens

#### 2.2.1 Symbols

A **symbol** is the fundamental identifier in LOVE:

```
symbol ::= letter (letter | digit | '_' | '-' | '?' | '!')*
```

Examples:
```love
name
user-id
valid?
mutate!
x1
_internal
```

#### 2.2.2 Numeric Literals

```
integer ::= '-'? digit+
float   ::= '-'? digit+ '.' digit+
```

Examples:
```love
0
42
-7
3.14159
-0.5
```

#### 2.2.3 String Literals

Strings are enclosed in double quotes:

```
string ::= '"' (escape | non-quote)* '"'
escape ::= '\' ('n' | 't' | 'r' | '"' | '\')
```

Examples:
```love
"Hello, World!"
"Line 1\nLine 2"
"Tab:\there"
"Quote: \"nested\""
```

#### 2.2.4 Type Annotations

Type annotations begin with colon:

```
type-annotation ::= ':' symbol
```

Examples:
```love
:string
:integer
:boolean
:User
:List
```

---

### 2.3 Structural Delimiters

#### 2.3.1 Bracket Depth

The core structural element is the nested bracket:

| Depth | Syntax | Category |
|-------|--------|----------|
| 1 | `[ ]` | Alpha |
| 2 | `[[ ]]` | Beta |
| 3 | `[[[ ]]]` | Ceta |
| 4 | `[[[[ ]]]]` | Delta |
| 5 | `[[[[[ ]]]]]` | Macro |
| 6 | `[[[[[[ ]]]]]]` | Phi |

#### 2.3.2 Bracket Matching

Brackets must be balanced. The scanner tracks depth:

```love
// Valid
[[[Type]]]
[[[[function]]]]

// Invalid - unbalanced
[[[Type]]
[[function]]]
```

---

### 2.4 Operators and Punctuation

#### 2.4.1 Invocation Operators

| Operator | Syntax | Meaning |
|----------|--------|---------|
| Invoke | `@[expr]` | Runtime execution |
| Coerce | `:[type]` | Static type cast |
| Reference | `::[name]` | Name lookup |

#### 2.4.2 Assignment and Binding

```love
name . value         // Binding (immutable)
name is value        // Assignment (in context)
name -> result       // Arrow (function signature)
```

#### 2.4.3 Accessor

```love
::object::property   // Property access
::module::function   // Module member access
```

---

### 2.5 Comments

#### 2.5.1 Line Comments

```love
// This is a line comment
[main]  // Inline comment
```

#### 2.5.2 Block Comments (Proposed)

```love
/* 
   Multi-line
   block comment
*/
```

---

### 2.6 Special Forms

#### 2.6.1 Scan Directive

```love
@scan[::input ::new_line]
```

The `@scan` form reads input according to patterns.

#### 2.6.2 Conditional

```love
@if[condition then-expr else-expr]
```

#### 2.6.3 Predicates

Predicates end with `?`:

```love
exists?
valid?
empty?
```

---

### 2.7 Reserved Words

The following symbols have special meaning:

| Word | Purpose |
|------|---------|
| `is` | Assignment/equality |
| `or` | Logical disjunction |
| `and` | Logical conjunction |
| `not` | Logical negation |
| `if` | Conditional |
| `import` | Module import |
| `nil` | Null/empty value |
| `true` | Boolean true |
| `false` | Boolean false |

---

### 2.8 Lexical Grammar Summary

```ebnf
program       ::= form*
form          ::= depth-form | primitive | comment
depth-form    ::= bracket-n symbol body? bracket-n
bracket-n     ::= '['{n} (n = 1..6)
primitive     ::= symbol | number | string
body          ::= (form | operator-expr)*
operator-expr ::= invoke | coerce | reference | binding
invoke        ::= '@' form
coerce        ::= ':' type-annotation
reference     ::= '::' symbol ('::' symbol)*
binding       ::= symbol '.' primitive type-annotation?
```

---

### 2.9 Whitespace Sensitivity

LOVE is **whitespace-insensitive** for parsing, but conventionally uses:

- Newlines to separate forms
- Indentation for nesting clarity
- Spaces around operators

```love
// Equivalent
[[[User]]] name . :string age . :integer

// Preferred style
[[[User]]]
name . :string
age . :integer
```

---

**Next:** [Chapter 3: Ontology](./03-ontology.md)
