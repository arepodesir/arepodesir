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
 * Uses Terminal service for all output instead of Console.log
 */
export const generateReadme: Effect.Effect<GenerationResult, AppError> = pipe(
  // Step 1: Load all configs
  Effect.tap(Effect.void, () =>
    Terminal.logStep("Loading configuration files..."),
  ),
  Effect.flatMap(() => loadAllConfigs(CONFIG_DIR)),
  Effect.tap((configs) =>
    Terminal.logSuccess(`Loaded ${Object.keys(configs).length} config files`),
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
        sections: ["banner", "header", "activities", "skills", "footer"] as const,
        timestamp: new Date(),
      })),
    ),
  ),
  Effect.tap((result) =>
    Terminal.logSuccess(`README.md written to ${result.outputPath}`),
  ),
);

// =============================================================================
// Re-exports
// =============================================================================

export { Terminal, MESSAGES };
export { renderReadme };
