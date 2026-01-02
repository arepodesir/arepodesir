/**
 * Terminal Output Service
 * Refactored output flow using TUI components for rich terminal display
 * 
 * @module services/Terminal
 */

import { Effect } from "effect";
import {
    definePanel,
    defineProgress,
    defineStatus,
    defineHeader,
    defineKeyValue,
    defineSection,
    defineRule,
} from "../lib/tui.js";
import { styled, Symbols } from "../lib/ansi.js";
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
         * Print program banner
         */
        banner(name: string, version: string, description?: string): void {
            write(defineHeader({
                title: `${Symbols.star} ${name}`,
                subtitle: description ? `v${version} — ${description}` : `v${version}`,
                width: 50,
            }));
        },

        /**
         * Print a step indicator
         */
        step(message: string, icon = Symbols.arrow): void {
            write(`${styled.info(icon)} ${message}`);
        },

        /**
         * Print success status
         */
        success(message: string): void {
            write(defineStatus({ type: "success", message }));
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
         * Print generation result summary
         */
        result(result: GenerationResult): void {
            write("");
            write(definePanel({
                title: "README Generated",
                border: "rounded",
                width: 70,
                content: [
                    `${styled.dim("Output:")} ${result.outputPath}`,
                    `${styled.dim("Sections:")} ${result.sections.join(", ")}`,
                    `${styled.dim("Generated:")} ${result.timestamp.toLocaleString()}`,
                ],
            }));
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
         * Print a divider
         */
        divider(width = 50): void {
            write(defineRule(width));
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
        Terminal.banner("WHOISAREPO? [README Generator]", "1.001", "Generating beautiful README files");
    },

    success: (result: GenerationResult) => {
        Terminal.result(result);
    },

    greeting: `${Symbols.star} WHOISAREPO? [README Generator]`,
    separator: defineRule(40),
} as const;
