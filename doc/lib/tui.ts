/**
 * TUI (Terminal User Interface) Component Library
 * Provides declarative terminal UI components using the define<Name> pattern
 * 
 * @module lib/tui
 */

import { BoxChars, Colors, Symbols, styled, stripAnsi, type BoxStyle } from "./ansi.js";

// =============================================================================
// Types
// =============================================================================

export interface PanelConfig {
    readonly title?: string;
    readonly content: readonly string[];
    readonly border?: BoxStyle;
    readonly width?: number;
    readonly padding?: number;
    readonly color?: keyof typeof Colors;
}

export interface ProgressConfig {
    readonly label: string;
    readonly current: number;
    readonly total: number;
    readonly width?: number;
    readonly showPercentage?: boolean;
    readonly showCount?: boolean;
}

export interface SpinnerConfig {
    readonly frames?: readonly string[];
    readonly interval?: number;
}

export interface TableConfig {
    readonly headers: readonly string[];
    readonly rows: readonly (readonly string[])[];
    readonly border?: BoxStyle;
    readonly columnWidths?: readonly number[];
}

export interface StatusConfig {
    readonly type: "success" | "error" | "warning" | "info" | "pending";
    readonly message: string;
    readonly prefix?: string;
}

export interface SectionConfig {
    readonly title: string;
    readonly items: readonly string[];
    readonly indent?: number;
    readonly bullet?: string;
}

// =============================================================================
// Panel Component
// =============================================================================

/**
 * Create a bordered panel with optional title
 */
export function definePanel(config: PanelConfig): string {
    const {
        title,
        content,
        border = "rounded",
        width = 60,
        padding = 1,
        color,
    } = config;

    const chars = BoxChars[border];
    const innerWidth = width - 2; // Account for left/right borders
    const padStr = " ".repeat(padding);

    const colorStart = color ? Colors[color] : "";
    const colorEnd = color ? Colors.reset : "";

    // Helper to pad/truncate content to fit width
    const fitLine = (line: string): string => {
        const visible = stripAnsi(line);
        const visLen = visible.length;
        const targetLen = innerWidth - (padding * 2);
        if (visLen > targetLen) {
            return line.slice(0, targetLen - 1) + "…";
        }
        return line + " ".repeat(targetLen - visLen);
    };

    const lines: string[] = [];

    // Top border with optional title
    if (title) {
        const titleText = ` ${title} `;
        const titleLen = titleText.length;
        const leftLen = Math.floor((innerWidth - titleLen) / 2);
        const rightLen = innerWidth - titleLen - leftLen;
        lines.push(
            `${colorStart}${chars.topLeft}${chars.horizontal.repeat(leftLen)}${titleText}${chars.horizontal.repeat(rightLen)}${chars.topRight}${colorEnd}`
        );
    } else {
        lines.push(
            `${colorStart}${chars.topLeft}${chars.horizontal.repeat(innerWidth)}${chars.topRight}${colorEnd}`
        );
    }

    // Padding line
    if (padding > 0) {
        lines.push(
            `${colorStart}${chars.vertical}${" ".repeat(innerWidth)}${chars.vertical}${colorEnd}`
        );
    }

    // Content lines
    for (const line of content) {
        lines.push(
            `${colorStart}${chars.vertical}${padStr}${fitLine(line)}${padStr}${chars.vertical}${colorEnd}`
        );
    }

    // Padding line
    if (padding > 0) {
        lines.push(
            `${colorStart}${chars.vertical}${" ".repeat(innerWidth)}${chars.vertical}${colorEnd}`
        );
    }

    // Bottom border
    lines.push(
        `${colorStart}${chars.bottomLeft}${chars.horizontal.repeat(innerWidth)}${chars.bottomRight}${colorEnd}`
    );

    return lines.join("\n");
}

// =============================================================================
// Progress Bar Component
// =============================================================================

/**
 * Create a progress bar with optional label and stats
 */
export function defineProgress(config: ProgressConfig): string {
    const {
        label,
        current,
        total,
        width = 40,
        showPercentage = true,
        showCount = false,
    } = config;

    const percentage = Math.min(100, Math.round((current / total) * 100));
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;

    const bar = `${styled.success(Symbols.progressFull.repeat(filled))}${styled.dim(Symbols.progressEmpty.repeat(empty))}`;

    const parts: string[] = [label, `[${bar}]`];

    if (showPercentage) {
        parts.push(styled.bold(`${percentage}%`));
    }

    if (showCount) {
        parts.push(styled.dim(`(${current}/${total})`));
    }

    return parts.join(" ");
}

// =============================================================================
// Spinner Component
// =============================================================================

const DEFAULT_SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"] as const;

/**
 * Create a spinner animation controller
 */
export function defineSpinner(config: SpinnerConfig = {}) {
    const frames = config.frames ?? DEFAULT_SPINNER_FRAMES;
    const interval = config.interval ?? 80;

    let currentFrame = 0;
    let timer: ReturnType<typeof setInterval> | null = null;
    let isRunning = false;

    return {
        get frame(): string {
            return styled.info(frames[currentFrame] ?? "");
        },

        start(message: string, onFrame?: (frame: string) => void): void {
            if (isRunning) return;
            isRunning = true;

            timer = setInterval(() => {
                currentFrame = (currentFrame + 1) % frames.length;
                onFrame?.(`${this.frame} ${message}`);
            }, interval);
        },

        stop(): void {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
            isRunning = false;
        },

        success(message: string): string {
            this.stop();
            return `${styled.success(Symbols.success)} ${message}`;
        },

        error(message: string): string {
            this.stop();
            return `${styled.error(Symbols.error)} ${message}`;
        },
    };
}

// =============================================================================
// Status Line Component
// =============================================================================

/**
 * Create a status line with appropriate icon and color
 */
export function defineStatus(config: StatusConfig): string {
    const { type, message, prefix } = config;

    const icons: Record<typeof type, string> = {
        success: styled.success(Symbols.success),
        error: styled.error(Symbols.error),
        warning: styled.warning(Symbols.warning),
        info: styled.info(Symbols.info),
        pending: styled.dim("○"),
    };

    const colorizers: Record<typeof type, (s: string) => string> = {
        success: styled.success,
        error: styled.error,
        warning: styled.warning,
        info: styled.info,
        pending: styled.dim,
    };

    const icon = icons[type];
    const colorize = colorizers[type];
    const prefixText = prefix ? `${styled.dim(prefix)} ` : "";

    return `${icon} ${prefixText}${colorize(message)}`;
}

// =============================================================================
// Section Component
// =============================================================================

/**
 * Create a labeled section with bulleted items
 */
export function defineSection(config: SectionConfig): string {
    const { title, items, indent = 2, bullet = Symbols.bullet } = config;

    const lines: string[] = [styled.bold(title)];
    const indentStr = " ".repeat(indent);

    for (const item of items) {
        lines.push(`${indentStr}${styled.dim(bullet)} ${item}`);
    }

    return lines.join("\n");
}

// =============================================================================
// Horizontal Rule Component
// =============================================================================

/**
 * Create a horizontal rule
 */
export function defineRule(width = 60, char = "─"): string {
    return styled.dim(char.repeat(width));
}

// =============================================================================
// Header Component
// =============================================================================

interface HeaderConfig {
    readonly title: string;
    readonly subtitle?: string;
    readonly width?: number;
}

/**
 * Create a styled header
 */
export function defineHeader(config: HeaderConfig): string {
    const { title, subtitle, width = 60 } = config;

    const lines: string[] = [
        defineRule(width),
        styled.bold(title),
    ];

    if (subtitle) {
        lines.push(styled.dim(subtitle));
    }

    lines.push(defineRule(width));

    return lines.join("\n");
}

// =============================================================================
// Key-Value Display
// =============================================================================

interface KeyValueConfig {
    readonly entries: readonly { key: string; value: string }[];
    readonly separator?: string;
    readonly keyWidth?: number;
}

/**
 * Create aligned key-value pairs
 */
export function defineKeyValue(config: KeyValueConfig): string {
    const { entries, separator = ":", keyWidth } = config;

    const maxKeyLen = keyWidth ?? Math.max(...entries.map(e => e.key.length));

    return entries
        .map(({ key, value }) => {
            const paddedKey = key.padEnd(maxKeyLen);
            return `${styled.dim(paddedKey)}${separator} ${value}`;
        })
        .join("\n");
}

// =============================================================================
// List Box Component
// =============================================================================

interface ListBoxConfig {
    readonly items: readonly string[];
    readonly selected?: number;
    readonly showNumbers?: boolean;
}

/**
 * Create a selectable list display
 */
export function defineListBox(config: ListBoxConfig): string {
    const { items, selected, showNumbers = false } = config;

    return items
        .map((item, i) => {
            const isSelected = i === selected;
            const prefix = showNumbers ? `${(i + 1).toString().padStart(2)}. ` : "";
            const indicator = isSelected ? styled.info(Symbols.arrowRight) : " ";
            const text = isSelected ? styled.bold(item) : item;
            return `${indicator} ${prefix}${text}`;
        })
        .join("\n");
}

// =============================================================================
// Table Component
// =============================================================================

/**
 * Create a bordered table
 */
export function defineTable(config: TableConfig): string {
    const { headers, rows, border = "single", columnWidths } = config;
    const chars = BoxChars[border];

    // Calculate column widths
    const widths = columnWidths ?? headers.map((h, i) => {
        const headerLen = h.length;
        const maxDataLen = Math.max(...rows.map(r => (r[i] ?? "").length));
        return Math.max(headerLen, maxDataLen);
    });

    // Helper to create a row
    const makeRow = (cells: readonly string[]): string => {
        const paddedCells = cells.map((cell, i) => {
            const w = widths[i] ?? 10;
            return ` ${cell.padEnd(w)} `;
        });
        return `${chars.vertical}${paddedCells.join(chars.vertical)}${chars.vertical}`;
    };

    // Helper to create a separator
    const makeSeparator = (left: string, mid: string, right: string): string => {
        const segments = widths.map(w => chars.horizontal.repeat(w + 2));
        return `${left}${segments.join(mid)}${right}`;
    };

    const lines: string[] = [
        makeSeparator(chars.topLeft, chars.topT, chars.topRight),
        makeRow(headers),
        makeSeparator(chars.leftT, chars.cross, chars.rightT),
        ...rows.map(makeRow),
        makeSeparator(chars.bottomLeft, chars.bottomT, chars.bottomRight),
    ];

    return lines.join("\n");
}

// =============================================================================
// Export TUI Module
// =============================================================================

export const TUI = {
    definePanel,
    defineProgress,
    defineSpinner,
    defineStatus,
    defineSection,
    defineRule,
    defineHeader,
    defineKeyValue,
    defineListBox,
    defineTable,
} as const;
