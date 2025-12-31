/**
 * TOML Config Loader
 * Loads and parses TOML configuration files with Effect-based error handling
 */
import { parse as parseToml } from "smol-toml";
import { Effect, pipe } from "effect";
import { ConfigNotFoundError, ConfigParseError } from "../types/types.js";
import type {
    BannerConfig,
    HeaderConfig,
    FooterConfig,
    SkillsConfig,
    ActivityConfig,
} from "../types/types.js";

// =============================================================================
// File Reading
// =============================================================================

/**
 * Read a file as text, returning Effect
 */
const readFile = (path: string): Effect.Effect<string, ConfigNotFoundError> =>
    Effect.tryPromise({
        try: () => Bun.file(path).text(),
        catch: () => new ConfigNotFoundError(path),
    });

/**
 * Parse TOML string into object
 */
const parseTOML = <T>(
    path: string,
    content: string
): Effect.Effect<T, ConfigParseError> =>
    Effect.try({
        try: () => parseToml(content) as T,
        catch: (e) =>
            new ConfigParseError(path, e instanceof Error ? e.message : String(e)),
    });