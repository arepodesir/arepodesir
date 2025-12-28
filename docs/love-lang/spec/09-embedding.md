# LOVE Language Specification

## Chapter 9: Embedding

---

### 9.1 Overview

LOVE supports embedding foreign content (HTML, CSS, JS) directly in source files.

### 9.2 HTML Embedding

```love
[[[container :html]]]
<html>
    <head>
        <title>Love App</title>
    </head>
    <body>
        <h1>[[appName]]</h1>
        <p>[[appVersion]]</p>
    </body>
</html>
```

The `[[...]]` syntax interpolates LOVE values.

### 9.3 CSS Embedding

```love
[[[style :css]]]
h1 {
    color: red;
}
.container {
    display: flex;
}
```

### 9.4 JavaScript Embedding

```love
[[[script :js]]]
console.log("Hello World");
document.querySelector('.btn').addEventListener('click', () => {
    @handleClick[]
});
```

### 9.5 Template Interpolation

| Syntax | Meaning |
|--------|---------|
| `[[value]]` | Insert value (escaped) |
| `[[[block]]]` | Insert raw block |
| `@fn[args]` | Call LOVE function |

### 9.6 Web Components

```love
[[[Button :component]]]
props: [label :string onClick :function]

[[[template :html]]]
<button class="btn" onclick="@onClick[]">[[label]]</button>

[[[style :css]]]
.btn { padding: 10px 20px; }
```

---

**Next:** [Chapter 10: Module System](./10-module-system.md)
