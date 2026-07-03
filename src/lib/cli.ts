/**
 * CLI (Command Line Interface) Framework
 * Provides declarative command definition and argument parsing using the define<Name> pattern
 * 
 * @module lib/cli
 */

import { Effect } from "effect";
import { styled, Symbols } from "./ansi.js";
import { defineHeader, defineStatus } from "./tui.js";

// =============================================================================
// Types
// =============================================================================

export interface CLIOption<T = unknown> {
    readonly name: string;
    readonly alias?: string;
    readonly description: string;
    readonly type: "string" | "boolean" | "number";
    readonly required?: boolean;
    readonly default?: T;
}

export interface CLICommand<TArgs = Record<string, unknown>, TError = unknown, TResult = unknown> {
    readonly name: string;
    readonly description: string;
    readonly options?: readonly CLIOption[];
    readonly examples?: readonly string[];
    readonly handler: (args: TArgs) => Effect.Effect<TResult, TError>;
}

export interface CLIConfig {
    readonly name: string;
    readonly version: string;
    readonly description: string;
    readonly commands: readonly CLICommand[];
    readonly defaultCommand?: string;
}

export interface ParsedArgs {
    readonly command: string;
    readonly options: Record<string, unknown>;
    readonly positional: readonly string[];
}

// =============================================================================
// Argument Parsing
// =============================================================================

/**
 * Parse command line arguments
 */
export function parseArgs(argv: readonly string[], config: CLIConfig): ParsedArgs {
    const args = argv.slice(2); // Skip node/bun and script path

    const options: Record<string, unknown> = {};
    const positional: string[] = [];
    let command = config.defaultCommand ?? "";

    let i = 0;
    while (i < args.length) {
        const arg = args[i];

        if (!arg) {
            i++;
            continue;
        }

        if (arg.startsWith("--")) {
            // Long option
            const [key, value] = arg.slice(2).split("=");
            if (key) {
                options[key] = value ?? true;
            }
        } else if (arg.startsWith("-") && arg.length === 2) {
            // Short option
            const key = arg.slice(1);
            const nextArg = args[i + 1];
            if (nextArg && !nextArg.startsWith("-")) {
                options[key] = nextArg;
                i++;
            } else {
                options[key] = true;
            }
        } else if (!command && config.commands.some(c => c.name === arg)) {
            // Command name
            command = arg;
        } else {
            // Positional argument
            positional.push(arg);
        }

        i++;
    }

    return { command, options, positional };
}

// =============================================================================
// Help Generation
// =============================================================================

/**
 * Generate help text for a command
 */
export function generateCommandHelp(command: CLICommand): string {
    const lines: string[] = [
        "",
        styled.bold(command.name),
        `  ${command.description}`,
        "",
    ];

    if (command.options && command.options.length > 0) {
        lines.push(styled.dim("Options:"));
        for (const opt of command.options) {
            const alias = opt.alias ? `-${opt.alias}, ` : "    ";
            const required = opt.required ? styled.error(" (required)") : "";
            const defaultVal = opt.default !== undefined ? styled.dim(` [default: ${opt.default}]`) : "";
            lines.push(`  ${alias}--${opt.name.padEnd(16)} ${opt.description}${required}${defaultVal}`);
        }
        lines.push("");
    }

    if (command.examples && command.examples.length > 0) {
        lines.push(styled.dim("Examples:"));
        for (const example of command.examples) {
            lines.push(`  ${styled.info("$")} ${example}`);
        }
        lines.push("");
    }

    return lines.join("\n");
}

/**
 * Generate full help text for CLI
 */
export function generateHelp(config: CLIConfig): string {
    const lines: string[] = [
        "",
        defineHeader({
            title: config.name,
            subtitle: `v${config.version} - ${config.description}`,
            width: 50,
        }),
        "",
        styled.dim("Usage:"),
        `  ${config.name} <command> [options]`,
        "",
        styled.dim("Commands:"),
    ];

    for (const cmd of config.commands) {
        lines.push(`  ${cmd.name.padEnd(16)} ${cmd.description}`);
    }

    lines.push("");
    lines.push(styled.dim(`Run '${config.name} <command> --help' for more information on a command.`));
    lines.push("");

    return lines.join("\n");
}

// =============================================================================
// CLI Definition Factory
// =============================================================================

/**
 * Define a CLI command with typed handler
 */
export function defineCLI<TArgs, TError, TResult>(
    config: CLICommand<TArgs, TError, TResult>
): CLICommand<TArgs, TError, TResult> {
    return config;
}

/**
 * Define a complete CLI application
 */
export function defineProgram(config: CLIConfig) {
    return {
        config,

        /**
         * Parse arguments and return the matched command
         */
        parse(argv: readonly string[] = process.argv): ParsedArgs {
            return parseArgs(argv, config);
        },

        /**
         * Show help for the CLI or a specific command
         */
        showHelp(commandName?: string): void {
            if (commandName) {
                const cmd = config.commands.find(c => c.name === commandName);
                if (cmd) {
                    console.log(generateCommandHelp(cmd));
                } else {
                    console.log(styled.error(`Unknown command: ${commandName}`));
                }
            } else {
                console.log(generateHelp(config));
            }
        },

        /**
         * Run the CLI with provided arguments
         */
        async run(argv: readonly string[] = process.argv): Promise<void> {
            const parsed = this.parse(argv);

            // Handle help flag
            if (parsed.options["help"] || parsed.options["h"]) {
                this.showHelp(parsed.command || undefined);
                return;
            }

            // Handle version flag
            if (parsed.options["version"] || parsed.options["v"]) {
                console.log(`${config.name} v${config.version}`);
                return;
            }

            // Find command
            const command = config.commands.find(c => c.name === parsed.command);

            if (!command) {
                if (parsed.command) {
                    console.log(defineStatus({
                        type: "error",
                        message: `Unknown command: ${parsed.command}`,
                    }));
                }
                this.showHelp();
                return;
            }

            // Execute command
            try {
                await Effect.runPromise(command.handler(parsed.options as any));
            } catch (error) {
                console.error(defineStatus({
                    type: "error",
                    message: error instanceof Error ? error.message : String(error),
                }));
                process.exit(1);
            }
        },
    };
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Prompt confirmation (for dangerous operations)
 */
export function confirm(message: string): Effect.Effect<boolean, never> {
    return Effect.sync(() => {
        console.log(`${styled.warning(Symbols.warning)} ${message}`);
        console.log(styled.dim("  (This is a placeholder - real implementation would read stdin)"));
        return true; // Placeholder - real implementation would read stdin
    });
}

/**
 * Print a success message
 */
export function success(message: string): void {
    console.log(defineStatus({ type: "success", message }));
}

/**
 * Print an error message
 */
export function error(message: string): void {
    console.log(defineStatus({ type: "error", message }));
}

/**
 * Print an info message
 */
export function info(message: string): void {
    console.log(defineStatus({ type: "info", message }));
}

/**
 * Print a warning message
 */
export function warn(message: string): void {
    console.log(defineStatus({ type: "warning", message }));
}

// =============================================================================
// Export CLI Module
// =============================================================================

export const CLI = {
    defineCLI,
    defineProgram,
    parseArgs,
    generateHelp,
    generateCommandHelp,
    confirm,
    success,
    error,
    info,
    warn,
} as const;
