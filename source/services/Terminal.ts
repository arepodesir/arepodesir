/**
 * Terminal Output Service
 * Refactored output flow using TUI components for rich terminal display
 * 
 * @module services/Terminal
 */

import { Effect } from "effect";
import {
    defineProgress,
    defineStatus,
    defineKeyValue,
    defineSection,
    defineRule,
} from "../lib/tui.js";
import { styled, Symbols, Colors, Styles, BoxChars } from "../lib/ansi.js";
import type { GenerationResult } from "../types/types.js";

// =============================================================================
// Types
// =============================================================================

export interface TerminalConfig {
    readonly verbose?: boolean;
    readonly quiet?: boolean;
    readonly color?: boolean;
}

// =============================================================================
// Pretty Girly ASCII Art
// =============================================================================

const RESET = "\x1b[0m";

/**
 * Pink/Magenta color palette for girly aesthetic
 */
const PinkPalette = {
    hotPink: "\x1b[38;5;199m",
    pink: "\x1b[38;5;213m",
    lightPink: "\x1b[38;5;218m",
    magenta: Colors.brightMagenta,
    sparkle: "\x1b[38;5;225m",
    heart: "\x1b[38;5;197m",
    lavender: "\x1b[38;5;183m",
    rose: "\x1b[38;5;211m",
} as const;

/**
 * Fabulous girly messages
 */
const FABULOUS_MESSAGES = [
    "💖 Slaying the README game! 💖",
    "✨ Absolutely iconic! ✨",
    "💅 Serving README realness! 💅",
    "🌸 Gorgeously generated! 🌸",
    "💕 Flawlessly fabulous! 💕",
    "🦋 Beautifully crafted! 🦋",
    "🌺 Stunning work, bestie! 🌺",
    "💎 Perfection achieved! 💎",
] as const;

const getRandomFabulousMessage = (): string =>
    FABULOUS_MESSAGES[Math.floor(Math.random() * FABULOUS_MESSAGES.length)] ?? FABULOUS_MESSAGES[0]!;

/**
 * ASCII Art banner for AREPODESIR with girly styling
 */
const AREPODESIR_ART = `
${PinkPalette.sparkle}    ✨ ･ﾟ✧ ･ﾟ✧ ･ﾟ✧ ･ﾟ✧ ･ﾟ✧ ･ﾟ✧ ･ﾟ✧ ･ﾟ✧ ･ﾟ✧ ･ﾟ✧ ･ﾟ✧ ･ﾟ✧ ✨${RESET}

${PinkPalette.hotPink}     █████╗ ${PinkPalette.pink}██████╗ ${PinkPalette.lightPink}███████╗${PinkPalette.magenta}██████╗  ${PinkPalette.pink}██████╗ ${RESET}
${PinkPalette.hotPink}    ██╔══██╗${PinkPalette.pink}██╔══██╗${PinkPalette.lightPink}██╔════╝${PinkPalette.magenta}██╔══██╗${PinkPalette.pink}██╔═══██╗${RESET}
${PinkPalette.hotPink}    ███████║${PinkPalette.pink}██████╔╝${PinkPalette.lightPink}█████╗  ${PinkPalette.magenta}██████╔╝${PinkPalette.pink}██║   ██║${RESET}
${PinkPalette.hotPink}    ██╔══██║${PinkPalette.pink}██╔══██╗${PinkPalette.lightPink}██╔══╝  ${PinkPalette.magenta}██╔═══╝ ${PinkPalette.pink}██║   ██║${RESET}
${PinkPalette.hotPink}    ██║  ██║${PinkPalette.pink}██║  ██║${PinkPalette.lightPink}███████╗${PinkPalette.magenta}██║     ${PinkPalette.pink}╚██████╔╝${RESET}
${PinkPalette.hotPink}    ╚═╝  ╚═╝${PinkPalette.pink}╚═╝  ╚═╝${PinkPalette.lightPink}╚══════╝${PinkPalette.magenta}╚═╝     ${PinkPalette.pink} ╚═════╝ ${RESET}

${PinkPalette.lightPink}    ██████╗ ${PinkPalette.pink}███████╗${PinkPalette.hotPink}███████╗${PinkPalette.magenta}██╗${PinkPalette.pink}██████╗ ${RESET}
${PinkPalette.lightPink}    ██╔══██╗${PinkPalette.pink}██╔════╝${PinkPalette.hotPink}██╔════╝${PinkPalette.magenta}██║${PinkPalette.pink}██╔══██╗${RESET}
${PinkPalette.lightPink}    ██║  ██║${PinkPalette.pink}█████╗  ${PinkPalette.hotPink}███████╗${PinkPalette.magenta}██║${PinkPalette.pink}██████╔╝${RESET}
${PinkPalette.lightPink}    ██║  ██║${PinkPalette.pink}██╔══╝  ${PinkPalette.hotPink}╚════██║${PinkPalette.magenta}██║${PinkPalette.pink}██╔══██╗${RESET}
${PinkPalette.lightPink}    ██████╔╝${PinkPalette.pink}███████╗${PinkPalette.hotPink}███████║${PinkPalette.magenta}██║${PinkPalette.pink}██║  ██║${RESET}
${PinkPalette.lightPink}    ╚═════╝ ${PinkPalette.pink}╚══════╝${PinkPalette.hotPink}╚══════╝${PinkPalette.magenta}╚═╝${PinkPalette.pink}╚═╝  ╚═╝${RESET}

${PinkPalette.sparkle}    ✨ ･ﾟ✧ ･ﾟ✧ ･ﾟ✧ ･ﾟ✧ ･ﾟ✧ ･ﾟ✧ ･ﾟ✧ ･ﾟ✧ ･ﾟ✧ ･ﾟ✧ ･ﾟ✧ ･ﾟ✧ ✨${RESET}
`;

/**
 * Pretty pink styled text helpers
 */
const pink = {
    hot: (text: string) => `${PinkPalette.hotPink}${text}${RESET}`,
    light: (text: string) => `${PinkPalette.lightPink}${text}${RESET}`,
    sparkle: (text: string) => `${PinkPalette.sparkle}${text}${RESET}`,
    heart: (text: string) => `${PinkPalette.heart}♥ ${text} ♥${RESET}`,
    bold: (text: string) => `${Styles.bold}${PinkPalette.pink}${text}${RESET}`,
    lavender: (text: string) => `${PinkPalette.lavender}${text}${RESET}`,
    rose: (text: string) => `${PinkPalette.rose}${text}${RESET}`,
};

// =============================================================================
// Terminal Service Factory
// =============================================================================

/**
 * Create a terminal output service with configuration
 */
export function defineTerminal(config: TerminalConfig = {}) {
    const { verbose = false, quiet = false } = config;

    const write = (message: string): void => {
        if (!quiet) {
            console.log(message);
        }
    };

    return {
        /**
         * Print pretty ASCII art banner
         */
        printArt(): void {
            write(AREPODESIR_ART);
        },

        /**
         * Print program banner with girly styling
         */
        banner(name: string, version: string, description?: string): void {
            write(AREPODESIR_ART);
            const subtitle = description
                ? `${pink.sparkle("✧")} v${version} — ${description} ${pink.sparkle("✧")}`
                : `${pink.sparkle("✧")} v${version} ${pink.sparkle("✧")}`;
            write(`${pink.bold("    " + name)}`);
            write(`    ${pink.light(subtitle)}`);
            write("");
        },

        /**
         * Print a step indicator with pink arrow
         */
        step(message: string): void {
            write(`${PinkPalette.pink}${Symbols.arrow}${RESET} ${message}`);
        },

        /**
         * Print success status with sparkles
         */
        success(message: string): void {
            write(`${PinkPalette.lightPink}✧${RESET} ${styled.success(message)}`);
        },

        /**
         * Print error status
         */
        error(message: string): void {
            write(defineStatus({ type: "error", message }));
        },

        /**
         * Print warning status
         */
        warning(message: string): void {
            write(defineStatus({ type: "warning", message }));
        },

        /**
         * Print info status
         */
        info(message: string): void {
            write(defineStatus({ type: "info", message }));
        },

        /**
         * Print verbose message (only in verbose mode)
         */
        verbose(message: string): void {
            if (verbose) {
                write(styled.dim(`  ${message}`));
            }
        },

        /**
         * Print a progress indicator
         */
        progress(label: string, current: number, total: number): void {
            write(defineProgress({ label, current, total, width: 30 }));
        },

        /**
         * Print generation result summary with extra wide pretty pink box
         */
        result(result: GenerationResult, versionHash?: string): void {
            const box = BoxChars.rounded;
            const width = 80;
            const innerWidth = width - 4;
            const pad = (s: string, len: number) => s.padEnd(len);
            const center = (s: string, len: number) => {
                const padding = Math.max(0, len - s.length);
                const left = Math.floor(padding / 2);
                const right = padding - left;
                return " ".repeat(left) + s + " ".repeat(right);
            };

            const fabulousMsg = getRandomFabulousMessage();
            const hash = versionHash ?? "generated";
            const now = result.timestamp;
            const dateStr = now.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            const timeStr = now.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            write("");
            write(`${PinkPalette.pink}${box.topLeft}${"─".repeat(width - 2)}${box.topRight}${RESET}`);
            write(`${PinkPalette.pink}${box.vertical}${RESET}${center(pink.bold("✨ README FABULOUSLY GENERATED! ✨"), innerWidth + 20)}${PinkPalette.pink}${box.vertical}${RESET}`);
            write(`${PinkPalette.pink}${box.vertical}${RESET}${center(pink.lavender(fabulousMsg), innerWidth + 20)}${PinkPalette.pink}${box.vertical}${RESET}`);
            write(`${PinkPalette.pink}├${"─".repeat(width - 2)}┤${RESET}`);

            // Metadata section
            write(`${PinkPalette.pink}${box.vertical}${RESET} ${pink.heart("OUTPUT")}                                                                 ${PinkPalette.pink}${box.vertical}${RESET}`);
            write(`${PinkPalette.pink}${box.vertical}${RESET}   ${pink.rose("💾 File:")} ${pad(result.outputPath, innerWidth - 12)}${PinkPalette.pink}${box.vertical}${RESET}`);
            write(`${PinkPalette.pink}${box.vertical}${RESET}   ${pink.rose("🏷️  Hash:")} ${pad(hash, innerWidth - 12)}${PinkPalette.pink}${box.vertical}${RESET}`);
            write(`${PinkPalette.pink}${box.vertical}${RESET}                                                                              ${PinkPalette.pink}${box.vertical}${RESET}`);

            write(`${PinkPalette.pink}${box.vertical}${RESET} ${pink.heart("STATS")}                                                                  ${PinkPalette.pink}${box.vertical}${RESET}`);
            write(`${PinkPalette.pink}${box.vertical}${RESET}   ${pink.rose("📊 Sections:")} ${pad(String(result.sections.length) + " fabulous sections", innerWidth - 16)}${PinkPalette.pink}${box.vertical}${RESET}`);
            write(`${PinkPalette.pink}${box.vertical}${RESET}   ${pink.rose("📅 Date:")} ${pad(dateStr, innerWidth - 12)}${PinkPalette.pink}${box.vertical}${RESET}`);
            write(`${PinkPalette.pink}${box.vertical}${RESET}   ${pink.rose("⏰ Time:")} ${pad(timeStr, innerWidth - 12)}${PinkPalette.pink}${box.vertical}${RESET}`);
            write(`${PinkPalette.pink}${box.vertical}${RESET}                                                                              ${PinkPalette.pink}${box.vertical}${RESET}`);

            // Section list
            write(`${PinkPalette.pink}${box.vertical}${RESET} ${pink.heart("SECTIONS")}                                                               ${PinkPalette.pink}${box.vertical}${RESET}`);
            const sectionList = result.sections.join(" 💕 ");
            const maxLen = innerWidth - 4;
            const wrapped = sectionList.length > maxLen
                ? sectionList.slice(0, maxLen - 3) + "..."
                : sectionList;
            write(`${PinkPalette.pink}${box.vertical}${RESET}   ${pink.light(wrapped)}${" ".repeat(Math.max(0, innerWidth - wrapped.length - 2))}${PinkPalette.pink}${box.vertical}${RESET}`);

            write(`${PinkPalette.pink}${box.bottomLeft}${"─".repeat(width - 2)}${box.bottomRight}${RESET}`);
            write("");
            write(`${pink.sparkle("    ✨ Your README is serving! Go forth and slay, bestie! ✨")}`);
            write("");
        },

        /**
         * Print a section with items
         */
        section(title: string, items: readonly string[]): void {
            write(defineSection({ title, items }));
        },

        /**
         * Print key-value pairs
         */
        keyValue(entries: readonly { key: string; value: string }[]): void {
            write(defineKeyValue({ entries }));
        },

        /**
         * Print a pink divider
         */
        divider(width = 80): void {
            write(`${PinkPalette.lightPink}${"─".repeat(width)}${RESET}`);
        },

        /**
         * Create an Effect that logs and returns void
         */
        log(message: string): Effect.Effect<void, never> {
            return Effect.sync(() => write(message));
        },

        /**
         * Create an Effect that logs a step
         */
        logStep(message: string): Effect.Effect<void, never> {
            return Effect.sync(() => this.step(message));
        },

        /**
         * Create an Effect that logs success
         */
        logSuccess(message: string): Effect.Effect<void, never> {
            return Effect.sync(() => this.success(message));
        },

        /**
         * Create an Effect that logs error
         */
        logError(message: string): Effect.Effect<void, never> {
            return Effect.sync(() => this.error(message));
        },
    };
}

// =============================================================================
// Default Terminal Instance
// =============================================================================

export const Terminal = defineTerminal();

// =============================================================================
// Legacy Message Compatibility
// =============================================================================

/**
 * Legacy MESSAGES object with TUI-enhanced output
 */
export const MESSAGES = {
    print: () => {
        Terminal.banner("README Generator", "1.001", "Generating beautiful README files");
    },

    success: (result: GenerationResult, hash?: string) => {
        Terminal.result(result, hash);
    },

    greeting: `${Symbols.star} AREPODESIR [README Generator]`,
    separator: defineRule(80),
} as const;
