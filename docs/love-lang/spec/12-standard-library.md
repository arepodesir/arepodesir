# LOVE Language Specification

## Chapter 12: Standard Library

---

### 12.1 Core Module

#### Arithmetic
```love
@add[a b]    @sub[a b]    @mul[a b]
@div[a b]    @mod[a b]    @pow[a b]
```

#### Comparison
```love
@eq[a b]     @neq[a b]    @lt[a b]
@gt[a b]     @lte[a b]    @gte[a b]
```

#### Logic
```love
@and[a b]    @or[a b]     @not[a]
```

### 12.2 List Module

```love
@head[list]      // First element
@tail[list]      // Rest of list
@cons[x list]    // Prepend
@append[a b]     // Concatenate
@length[list]    // Count
@reverse[list]   // Reverse
@map[list fn]    // Transform each
@filter[list predicate]  // Keep matching
@reduce[list fn init]    // Fold
```

### 12.3 String Module

```love
@concat[a b]     @split[str delim]
@trim[str]       @upper[str]
@lower[str]      @replace[str from to]
```

### 12.4 IO Module

```love
@Console::Print[msg]
@Console::ReadLine[]
@File::Read[path]
@File::Write[path content]
```

### 12.5 Math Module

```love
@Math::abs[n]    @Math::sqrt[n]
@Math::sin[n]    @Math::cos[n]
@Math::floor[n]  @Math::ceil[n]
```

### 12.6 Result Type

```love
[[[Result]]]
:T :E
Ok . :T | Err . :E

@unwrap[result]
@unwrap-or[result default]
@map-result[result fn]
```

---

**End of Specification**
