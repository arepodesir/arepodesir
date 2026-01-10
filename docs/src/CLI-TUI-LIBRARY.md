# CLI/TUI Library Documentation

> A lean, zero-dependency CLI/TUI library for Bun built with the `define<Name>` pattern.

## Overview

This library provides a complete terminal user interface system consisting of three core modules:

| Module | Purpose |
|--------|---------|
| `ansi.ts` | ANSI escape codes, colors, styles, box-drawing |
| `tui.ts` | TUI components using `define<Name>` factories |
| `cli.ts` | CLI framework with command definition and argument parsing |

## Installation

The library is embedded in the project. Import from `@/lib`:

```typescript
import { 
  // ANSI
  Colors, Styles, BoxChars, Symbols, styled,
  
  // TUI
  definePanel, defineProgress, defineSpinner, defineStatus, defineTable,
  
  // CLI
  defineCLI, defineProgram, parseArgs,
} from "@/lib";
```

---

## ANSI Module (`ansi.ts`)

### Colors

```typescript
import { Colors, style, styled } from "@/lib";

// Direct color codes
console.log(`${Colors.red}Error!${Colors.reset}`);

// Style function
console.log(style("Hello", "green", "bold"));

// Semantic helpers
console.log(styled.success("Done!"));   // Green
console.log(styled.error("Failed!"));   // Red
console.log(styled.warning("Caution")); // Yellow
console.log(styled.info("Note"));       // Cyan
console.log(styled.dim("muted"));       // Dim gray
```

### Available Colors

| Standard | Bright | Background |
|----------|--------|------------|
| `black` | `brightBlack` | `bgBlack` |
| `red` | `brightRed` | `bgRed` |
| `green` | `brightGreen` | `bgGreen` |
| `yellow` | `brightYellow` | `bgYellow` |
| `blue` | `brightBlue` | `bgBlue` |
| `magenta` | `brightMagenta` | `bgMagenta` |
| `cyan` | `brightCyan` | `bgCyan` |
| `white` | `brightWhite` | `bgWhite` |

### Styles

| Style | Code |
|-------|------|
| `bold` | `\x1b[1m` |
| `dim` | `\x1b[2m` |
| `italic` | `\x1b[3m` |
| `underline` | `\x1b[4m` |
| `inverse` | `\x1b[7m` |
| `strikethrough` | `\x1b[9m` |

### Box-Drawing Characters

```typescript
import { BoxChars } from "@/lib";

const chars = BoxChars.rounded;
// ╭───────╮
// │ Hello │
// ╰───────╯

// Available styles: single, double, rounded, heavy
```

### Symbols

```typescript
import { Symbols } from "@/lib";

Symbols.success      // ✓
Symbols.error        // ✗
Symbols.warning      // ⚠
Symbols.info         // ℹ
Symbols.bullet       // •
Symbols.arrow        // →
Symbols.progressFull // █
Symbols.progressEmpty // ░
```

---

## TUI Module (`tui.ts`)

### definePanel

Create bordered panels with optional titles:

```typescript
import { definePanel } from "@/lib";

const panel = definePanel({
  title: "Status Report",
  content: [
    "Files processed: 42",
    "Errors: 0",
    "Duration: 1.2s",
  ],
  border: "rounded",  // single | double | rounded | heavy
  width: 40,
  padding: 1,
});

console.log(panel);
// ╭─────── Status Report ───────╮
// │                             │
// │ Files processed: 42         │
// │ Errors: 0                   │
// │ Duration: 1.2s              │
// │                             │
// ╰─────────────────────────────╯
```

### defineProgress

Create progress bars:

```typescript
import { defineProgress } from "@/lib";

console.log(defineProgress({
  label: "Downloading",
  current: 75,
  total: 100,
  width: 30,
  showPercentage: true,
  showCount: true,
}));
// Downloading [████████████████████░░░░░░░░░░] 75% (75/100)
```

### defineSpinner

Create animated spinners:

```typescript
import { defineSpinner } from "@/lib";

const spinner = defineSpinner();

spinner.start("Loading...", (frame) => {
  process.stdout.write(`\r${frame}`);
});

// Later...
console.log(spinner.success("Done!"));  // ✓ Done!
// or
console.log(spinner.error("Failed!")); // ✗ Failed!
```

### defineStatus

Create status lines:

```typescript
import { defineStatus } from "@/lib";

console.log(defineStatus({ type: "success", message: "Build complete" }));
// ✓ Build complete

console.log(defineStatus({ type: "error", message: "Test failed" }));
// ✗ Test failed

console.log(defineStatus({ type: "warning", message: "Deprecated API" }));
// ⚠ Deprecated API

console.log(defineStatus({ type: "info", message: "Using cache" }));
// ℹ Using cache
```

### defineTable

Create bordered tables:

```typescript
import { defineTable } from "@/lib";

console.log(defineTable({
  headers: ["Name", "Type", "Size"],
  rows: [
    ["index.ts", "TypeScript", "1.2KB"],
    ["main.ts", "TypeScript", "0.8KB"],
  ],
  border: "single",
}));
// ┌──────────┬────────────┬──────┐
// │ Name     │ Type       │ Size │
// ├──────────┼────────────┼──────┤
// │ index.ts │ TypeScript │ 1.2KB│
// │ main.ts  │ TypeScript │ 0.8KB│
// └──────────┴────────────┴──────┘
```

### defineSection

Create labeled sections with bullets:

```typescript
import { defineSection } from "@/lib";

console.log(defineSection({
  title: "Features",
  items: ["Fast", "Type-safe", "Zero dependencies"],
  bullet: "•",
  indent: 2,
}));
// Features
//   • Fast
//   • Type-safe
//   • Zero dependencies
```

### defineKeyValue

Create aligned key-value displays:

```typescript
import { defineKeyValue } from "@/lib";

console.log(defineKeyValue({
  entries: [
    { key: "Version", value: "1.0.1" },
    { key: "Author", value: "Arepo Desir" },
    { key: "License", value: "MIT" },
  ],
  separator: ":",
}));
// Version: 1.0.1
// Author : Arepo Desir
// License: MIT
```

### defineHeader

Create styled headers:

```typescript
import { defineHeader } from "@/lib";

console.log(defineHeader({
  title: "README Generator",
  subtitle: "v1.0.1 — Generate beautiful READMEs",
  width: 50,
}));
// ──────────────────────────────────────────────────
// README Generator
// v1.0.1 — Generate beautiful READMEs
// ──────────────────────────────────────────────────
```

---

## CLI Module (`cli.ts`)

### defineCLI

Define CLI commands with typed handlers:

```typescript
import { defineCLI } from "@/lib";
import { Effect } from "effect";

const buildCommand = defineCLI({
  name: "build",
  description: "Build the project",
  options: [
    {
      name: "watch",
      alias: "w",
      description: "Watch for changes",
      type: "boolean",
      default: false,
    },
    {
      name: "output",
      alias: "o",
      description: "Output directory",
      type: "string",
      default: "dist",
    },
  ],
  examples: [
    "myapp build",
    "myapp build --watch",
    "myapp build -o build",
  ],
  handler: (args) => Effect.sync(() => {
    console.log("Building with options:", args);
  }),
});
```

### defineProgram

Define complete CLI applications:

```typescript
import { defineProgram } from "@/lib";

const program = defineProgram({
  name: "myapp",
  version: "1.0.0",
  description: "My CLI application",
  commands: [buildCommand, testCommand],
  defaultCommand: "build",
});

// Parse arguments
const parsed = program.parse(process.argv);

// Show help
program.showHelp();          // Full help
program.showHelp("build");   // Command help

// Run the CLI
await program.run(process.argv);
```

### Helper Functions

```typescript
import { CLI } from "@/lib";

CLI.success("Build complete");  // ✓ Build complete
CLI.error("Build failed");      // ✗ Build failed
CLI.info("Using cache");        // ℹ Using cache
CLI.warn("Deprecated");         // ⚠ Deprecated
```

---

## Terminal Service (`services/Terminal.ts`)

### defineTerminal

Create a terminal output service:

```typescript
import { defineTerminal } from "@/services";

const terminal = defineTerminal({
  verbose: true,
  quiet: false,
  color: true,
});

terminal.banner("My App", "1.0.0", "Description");
terminal.step("Processing files...");
terminal.success("Done!");
terminal.error("Failed!");
terminal.progress("Loading", 50, 100);
terminal.section("Features", ["Fast", "Safe"]);
```

### Effect Integration

All methods have Effect-returning variants:

```typescript
import { Terminal } from "@/services";
import { pipe, Effect } from "effect";

const program = pipe(
  Terminal.logStep("Starting..."),
  Effect.flatMap(() => doWork()),
  Effect.tap(() => Terminal.logSuccess("Complete!")),
);
```

---

## Architecture

```
source/lib/
├── ansi.ts       # ANSI escape codes & primitives
├── tui.ts        # TUI components (definePanel, etc.)
├── cli.ts        # CLI framework (defineCLI, etc.)
└── index.ts      # Barrel exports

source/services/
├── Terminal.ts   # Terminal output service
└── index.ts      # Barrel exports
```

### Design Patterns

1. **Factory Pattern**: All `define<Name>` functions return configured components
2. **Module Pattern**: Namespaced exports (`Colors`, `Symbols`, `TUI`, `CLI`)
3. **Effect Integration**: Effect-returning methods for functional composition

### Type Safety

All components are fully typed:

```typescript
interface PanelConfig {
  readonly title?: string;
  readonly content: readonly string[];
  readonly border?: BoxStyle;  // "single" | "double" | "rounded" | "heavy"
  readonly width?: number;
  readonly padding?: number;
}
```

---

## Examples

### Complete CLI Application

```typescript
import { Effect } from "effect";
import { defineCLI, defineProgram, Terminal } from "@/lib";

const generate = defineCLI({
  name: "generate",
  description: "Generate README",
  handler: () => Effect.gen(function* () {
    yield* Terminal.logStep("Loading configs...");
    // ... do work
    yield* Terminal.logSuccess("README generated!");
  }),
});

const program = defineProgram({
  name: "readme-gen",
  version: "1.0.0", 
  description: "README Generator",
  commands: [generate],
  defaultCommand: "generate",
});

await program.run();
```

### Rich Dashboard

```typescript
import { definePanel, defineKeyValue, defineProgress } from "@/lib";

console.log(definePanel({
  title: "Build Status",
  content: [
    defineProgress({ label: "Compile", current: 100, total: 100, width: 20 }),
    defineProgress({ label: "Bundle", current: 45, total: 100, width: 20 }),
    "",
    defineKeyValue({
      entries: [
        { key: "Started", value: "10:30:00" },
        { key: "Elapsed", value: "2m 15s" },
      ],
    }),
  ],
  border: "double",
  width: 50,
}));
```
