/**
 * ANSI Terminal Formatting Library
 * Provides styled terminal output with colors, formatting, and box-drawing
 * 
 * @module lib/ansi
 */

// =============================================================================
// ANSI Escape Codes
// =============================================================================

const ESC = "\x1b[";
const RESET = `${ESC}0m`;

// =============================================================================
// Color Definitions
// =============================================================================

export const Colors = {
    // Standard colors
    black: `${ESC}30m`,
    red: `${ESC}31m`,
    green: `${ESC}32m`,
    yellow: `${ESC}33m`,
    blue: `${ESC}34m`,
    magenta: `${ESC}35m`,
    cyan: `${ESC}36m`,
    white: `${ESC}37m`,

    // Bright colors
    brightBlack: `${ESC}90m`,
    brightRed: `${ESC}91m`,
    brightGreen: `${ESC}92m`,
    brightYellow: `${ESC}93m`,
    brightBlue: `${ESC}94m`,
    brightMagenta: `${ESC}95m`,
    brightCyan: `${ESC}96m`,
    brightWhite: `${ESC}97m`,

    // Background colors
    bgBlack: `${ESC}40m`,
    bgRed: `${ESC}41m`,
    bgGreen: `${ESC}42m`,
    bgYellow: `${ESC}43m`,
    bgBlue: `${ESC}44m`,
    bgMagenta: `${ESC}45m`,
    bgCyan: `${ESC}46m`,
    bgWhite: `${ESC}47m`,

    reset: RESET,
} as const;

export type ColorName = keyof typeof Colors;

// =============================================================================
// Text Styles
// =============================================================================

export const Styles = {
    bold: `${ESC}1m`,
    dim: `${ESC}2m`,
    italic: `${ESC}3m`,
    underline: `${ESC}4m`,
    blink: `${ESC}5m`,
    inverse: `${ESC}7m`,
    hidden: `${ESC}8m`,
    strikethrough: `${ESC}9m`,
    reset: RESET,
} as const;

export type StyleName = keyof typeof Styles;

// =============================================================================
// Box Drawing Characters
// =============================================================================

export const BoxChars = {
    single: {
        topLeft: "┌",
        topRight: "┐",
        bottomLeft: "└",
        bottomRight: "┘",
        horizontal: "─",
        vertical: "│",
        leftT: "├",
        rightT: "┤",
        topT: "┬",
        bottomT: "┴",
        cross: "┼",
    },
    double: {
        topLeft: "╔",
        topRight: "╗",
        bottomLeft: "╚",
        bottomRight: "╝",
        horizontal: "═",
        vertical: "║",
        leftT: "╠",
        rightT: "╣",
        topT: "╦",
        bottomT: "╩",
        cross: "╬",
    },
    rounded: {
        topLeft: "╭",
        topRight: "╮",
        bottomLeft: "╰",
        bottomRight: "╯",
        horizontal: "─",
        vertical: "│",
        leftT: "├",
        rightT: "┤",
        topT: "┬",
        bottomT: "┴",
        cross: "┼",
    },
    heavy: {
        topLeft: "┏",
        topRight: "┓",
        bottomLeft: "┗",
        bottomRight: "┛",
        horizontal: "━",
        vertical: "┃",
        leftT: "┣",
        rightT: "┫",
        topT: "┳",
        bottomT: "┻",
        cross: "╋",
    },
} as const;

export type BoxStyle = keyof typeof BoxChars;

// =============================================================================
// Symbols
// =============================================================================

export const Symbols = {
    // Status indicators
    success: "✓",
    error: "✗",
    warning: "⚠",
    info: "ℹ",

    // Progress
    bullet: "•",
    arrow: "→",
    arrowRight: "→",
    arrowLeft: "←",
    arrowUp: "↑",
    arrowDown: "↓",

    // Misc
    star: "★",
    heart: "♥",
    radioOn: "◉",
    radioOff: "○",
    checkboxOn: "☑",
    checkboxOff: "☐",

    // Progress bars
    progressFull: "█",
    progressEmpty: "░",
    progressHalf: "▓",
} as const;

// =============================================================================
// Styling Functions
// =============================================================================

/**
 * Apply color and optional style to text
 */
export const style = (text: string, color?: ColorName, ...styles: StyleName[]): string => {
    const colorCode = color ? Colors[color] : "";
    const styleCodes = styles.map(s => Styles[s]).join("");
    return `${colorCode}${styleCodes}${text}${RESET}`;
};

/**
 * Semantic styling helpers
 */
export const styled = {
    success: (text: string) => style(text, "green"),
    error: (text: string) => style(text, "red"),
    warning: (text: string) => style(text, "yellow"),
    info: (text: string) => style(text, "cyan"),
    dim: (text: string) => style(text, "brightBlack"),
    bold: (text: string) => style(text, undefined, "bold"),
    highlight: (text: string) => style(text, "brightYellow", "bold"),
    muted: (text: string) => `${Styles.dim}${text}${RESET}`,
} as const;

/**
 * Strip ANSI codes from string (for length calculations)
 */
export const stripAnsi = (str: string): string =>
    str.replace(/\x1b\[[0-9;]*m/g, "");

/**
 * Get visible length of string (excluding ANSI codes)
 */
export const visibleLength = (str: string): number =>
    stripAnsi(str).length;

// =============================================================================
// Cursor Control
// =============================================================================

export const Cursor = {
    hide: `${ESC}?25l`,
    show: `${ESC}?25h`,
    up: (n = 1) => `${ESC}${n}A`,
    down: (n = 1) => `${ESC}${n}B`,
    forward: (n = 1) => `${ESC}${n}C`,
    back: (n = 1) => `${ESC}${n}D`,
    moveTo: (row: number, col: number) => `${ESC}${row};${col}H`,
    clearLine: `${ESC}2K`,
    clearScreen: `${ESC}2J`,
    saveCursor: `${ESC}s`,
    restoreCursor: `${ESC}u`,
} as const;

// =============================================================================
// Default Export as Module
// =============================================================================

export const ANSI = {
    Colors,
    Styles,
    BoxChars,
    Symbols,
    Cursor,
    style,
    styled,
    stripAnsi,
    visibleLength,
} as const;
