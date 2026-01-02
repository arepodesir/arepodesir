/**
 * Program Prelude
 * Core orchestration module providing program initialization and the main Effect pipeline
 * 
 * @module main/prelude
 */

import { Effect, pipe, Match } from "effect";
import { loadAllConfigs } from "../utils/config.js";
import { writeReadme } from "@/services/Writer.js";
import { Terminal, MESSAGES } from "@/services";
import { renderReadme } from "@/templates";
import { WORKING_DIRECTORY } from "../utils/utils.js";

import type {
  ConfigNotFoundError,
  ConfigParseError,
  WriteError,
  GenerationResult,
} from "@/types";

// =============================================================================
// Program Constants
// =============================================================================

export const PROJECT_ROOT = WORKING_DIRECTORY;
export const CONFIG_DIR = `${PROJECT_ROOT}/source/configs`;

// =============================================================================
// Section Names for Summary
// =============================================================================

const ALL_SECTIONS = [
  "banner",
  "header",
  "badges",
  "social-status",
  "plugins",
  "activities",
  "education",
  "skills",
  "social-updates",
  "news",
  "resume",
  "funding",
  "faq",
  "footer",
] as const;

// =============================================================================
// Error Types & Handler
// =============================================================================

export type AppError = ConfigNotFoundError | ConfigParseError | WriteError;

/**
 * Exhaustive error handler with pattern matching
 */
export const handleError = (error: AppError): string =>
  pipe(
    Match.value(error),
    Match.when(
      { _tag: "ConfigNotFoundError" },
      (e) => `Config file not found: ${e.path}`,
    ),
    Match.when(
      { _tag: "ConfigParseError" },
      (e) => `Failed to parse config ${e.path}: ${e.message}`,
    ),
    Match.when(
      { _tag: "WriteError" },
      (e) => `Failed to write file ${e.path}: ${e.message}`,
    ),
    Match.exhaustive,
  );

// =============================================================================
// Main Generation Pipeline
// =============================================================================

/**
 * The core README generation Effect pipeline
 * Uses Terminal service for all output with pretty girly styling
 */
export const generateReadme: Effect.Effect<GenerationResult, AppError> = pipe(
  // Step 0: Print pretty ASCII art banner
  Effect.sync(() => Terminal.printArt()),
  Effect.tap(() => Terminal.log("")),

  // Step 1: Load all configs
  Effect.tap(() => Terminal.logStep("Loading configuration files...")),
  Effect.flatMap(() => loadAllConfigs(CONFIG_DIR)),
  Effect.tap((configs) =>
    Terminal.logSuccess(`Loaded ${Object.keys(configs).filter(k => {
      const val = configs[k as keyof typeof configs];
      // Count non-empty optional configs
      if (val && typeof val === 'object' && '_tag' in val) {
        return val._tag === 'Some';
      }
      return true;
    }).length} config files`),
  ),

  // Step 2: Render README
  Effect.tap(() => Terminal.logStep("Rendering README...")),
  Effect.map((configs) => ({
    content: renderReadme(configs),
    configs,
  })),
  Effect.tap(() => Terminal.logSuccess("README rendered")),

  // Step 3: Write to file
  Effect.tap(() => Terminal.logStep("Writing README.md...")),
  Effect.flatMap(({ content }) =>
    pipe(
      writeReadme(PROJECT_ROOT, content),
      Effect.map(() => ({
        outputPath: `${PROJECT_ROOT}/README.md`,
        sections: ALL_SECTIONS,
        timestamp: new Date(),
      })),
    ),
  ),
  Effect.tap((result) =>
    Terminal.logSuccess(`README.md written to ${result.outputPath}`),
  ),

  // Step 4: Show pretty result summary
  Effect.tap((result) => Effect.sync(() => Terminal.result(result))),
);

// =============================================================================
// Re-exports
// =============================================================================

export { Terminal, MESSAGES };
export { renderReadme };
