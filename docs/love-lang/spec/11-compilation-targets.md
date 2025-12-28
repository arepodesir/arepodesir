# LOVE Language Specification

## Chapter 11: Compilation Targets

---

### 11.1 Overview

LOVE compiles to multiple backends:

| Target | Runtime | Use Case |
|--------|---------|----------|
| **WASM** | Browser/Edge | Performance-critical |
| **JavaScript** | Browser/Node | Web integration |
| **Gleam** | BEAM | Type safety |
| **Erlang** | BEAM | Distributed systems |

### 11.2 Target Selection

```love
[[[[[[_]]]]]]
target is "javascript"  // or "wasm", "gleam", "erlang"
```

### 11.3 WebAssembly Target

```bash
love build --target=wasm main.love
```

Output: `.wasm` binary with JS bindings.

### 11.4 JavaScript Target

```bash
love build --target=js main.love
```

Output: ES modules compatible with bundlers.

### 11.5 Gleam Target

```bash
love build --target=gleam main.love
```

Output: `.gleam` source files.

### 11.6 Erlang Target

```bash
love build --target=erlang main.love
```

Output: `.erl` and `.hrl` files.

### 11.7 Target-Specific Code

```love
@target-case[
  :wasm -> @wasmOptimized[]
  :js -> @jsPolyfill[]
  :gleam -> @gleamNative[]
  :erlang -> @erlangNative[]
]
```

### 11.8 FFI (Foreign Function Interface)

```love
[[[[extern:js]]]]
alert :string -> :unit

[[[[extern:erlang]]]]
erlang:now -> :integer
```

---

**Next:** [Chapter 12: Standard Library](./12-standard-library.md)
