# LOVE Language Specification

## Chapter 8: Environment (PHI)

---

### 8.1 Overview

The **Phi level** (Depth 6) represents the interpreter, environment, and autological capabilities of LOVE.

### 8.2 Environment Declaration

```love
[[[[[[_]]]]]]
name :string is "Love App".
version :string is "1.0.0".
locale :string is "en".
identifier is [combine [::name ::version ::locale]]
```

The underscore `_` represents the current environment.

### 8.3 Configuration Options

| Key | Type | Description |
|-----|------|-------------|
| `name` | `:string` | Application name |
| `version` | `:string` | Semantic version |
| `locale` | `:string` | Language locale |
| `typeMode` | `:string` | `"strict"` or `"gradual"` |
| `target` | `:string` | Compilation target |

### 8.4 Parser Customization

```love
[[[[[[_]]]]]]
operators is [
  ["++" :concat :left 6]
  ["=>" :arrow :right 2]
]
```

### 8.5 AST Access

Phi forms can inspect and modify the AST:

```love
[[[[[[_]]]]]]
transform is [
  @match[:FunctionDef]
    @inject-logging[]
]
```

### 8.6 Interpreter Hooks

```love
[[[[[[_]]]]]]
onEval is [@logExpression]
onError is [@customErrorHandler]
```

---

**Next:** [Chapter 9: Embedding](./09-embedding.md)
