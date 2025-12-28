# LOVE Language Specification

## Chapter 7: Macros

---

### 7.1 Overview

Macros in LOVE operate at **Depth 5** (`[[[[[symbol]]]]]`). They transform syntax at compile-time.

### 7.2 Declaration

```love
[[[[[unless]]]]]
condition :expr body :expr -> :expr
@if[not ::condition] ::body nil

[[[[[when]]]]]
condition :expr body :expr -> :expr
@if[::condition] ::body nil
```

### 7.3 Pattern Variables

| Pattern | Matches |
|---------|---------|
| `:expr` | Any expression |
| `:symbol` | Identifiers |
| `:list` | List forms |
| `:type` | Type annotations |

### 7.4 Hygiene

LOVE macros are hygienic by default—they preserve lexical scoping and avoid variable capture.

### 7.5 Common Patterns

```love
[[[[[pipe]]]]]
value :expr ...stages :expr -> :expr
@reduce[stages value [acc stage] -> @::stage[::acc]]
```

---

**Next:** [Chapter 8: Environment](./08-environment.md)
