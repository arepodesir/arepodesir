/**
 * TOML Parsing Utilities
 * Re-exports smol-toml parser with Effect-based error handling pattern
 * 
 * @module lib/toml
 */

import { parse as parseToml } from "smol-toml";
import { Effect } from "effect";
import { ConfigParseError } from "../types/types.js";

// =============================================================================
// TOML Parsing
// =============================================================================

/**
 * Parse TOML content into typed object
 */
export const parseTOML = <T>(
    content: string,
    path = "unknown"
): Effect.Effect<T, ConfigParseError> =>
    Effect.try({
        try: () => parseToml(content) as T,
        catch: (e) =>
            new ConfigParseError(path, e instanceof Error ? e.message : String(e)),
    });

// Re-export for convenience
export { parseToml };