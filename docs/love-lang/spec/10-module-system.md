# LOVE Language Specification

## Chapter 10: Module System

---

### 10.1 File Structure

Each `.love` file is a module. The filename becomes the module name.

```
project/
├── main.love
├── user.love
└── utils/
    └── string.love
```

### 10.2 Imports

#### Basic Import
```love
[import [:user]]
```

#### Named Import
```love
[import [:user [User createUser]]]
```

#### Aliased Import
```love
[import [:user :as u]]
// Usage: @u::createUser[]
```

#### NPM Import
```love
[import [:npm [react]]]
[import [:npm [lodash [map filter]]]]
```

### 10.3 Exports

By default, all top-level Alpha forms are exported. Use `private:` prefix for internal forms:

```love
[private:helper]
// Not exported

[publicFunction]
// Exported
```

### 10.4 Circular Dependencies

LOVE supports circular dependencies through lazy loading. The compiler detects cycles and defers resolution.

### 10.5 Package Manifest

```love
// package.love
[[[[[[_]]]]]]
name is "my-app"
version is "1.0.0"
dependencies is [
  ["gleam_stdlib" "~> 0.30"]
  ["react" "^18.0.0"]
]
```

---

**Next:** [Chapter 11: Compilation Targets](./11-compilation-targets.md)
