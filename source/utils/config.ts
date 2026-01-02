/**
 * TOML Config Loader
 * Loads and parses TOML configuration files with Effect-based error handling
 */
import { parse as parseToml } from "smol-toml";
import { Effect, pipe, Option } from "effect";
import { ConfigNotFoundError, ConfigParseError } from "../types/types.js";
import type {
    BannerConfig,
    HeaderConfig,
    FooterConfig,
    SkillsConfig,
    ActivityConfig,
    SocialStatusConfig,
    BadgesConfig,
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

// =============================================================================
// Config Loaders
// =============================================================================

/**
 * Load and parse a TOML config file
 */
export const loadConfig = <T>(
    path: string
): Effect.Effect<T, ConfigNotFoundError | ConfigParseError> =>
    pipe(
        readFile(path),
        Effect.flatMap((content) => parseTOML<T>(path, content))
    );

/**
 * Load a config file, returning None if not found (for optional configs)
 */
export const loadOptionalConfig = <T>(
    path: string
): Effect.Effect<Option.Option<T>, ConfigParseError> =>
    pipe(
        loadConfig<T>(path),
        Effect.map(Option.some),
        Effect.catchTag("ConfigNotFoundError", () => Effect.succeed(Option.none()))
    );

/**
 * Load banner configuration
 */
export const loadBannerConfig = (
    configDir: string
): Effect.Effect<BannerConfig, ConfigNotFoundError | ConfigParseError> =>
    loadConfig<BannerConfig>(`${configDir}/banner.conf.toml`);

/**
 * Load header configuration
 */
export const loadHeaderConfig = (
    configDir: string
): Effect.Effect<HeaderConfig, ConfigNotFoundError | ConfigParseError> =>
    loadConfig<HeaderConfig>(`${configDir}/header.conf.toml`);

/**
 * Load footer configuration
 */
export const loadFooterConfig = (
    configDir: string
): Effect.Effect<FooterConfig, ConfigNotFoundError | ConfigParseError> =>
    loadConfig<FooterConfig>(`${configDir}/footer.conf.toml`);

/**
 * Load skills configuration
 */
export const loadSkillsConfig = (
    configDir: string
): Effect.Effect<SkillsConfig, ConfigNotFoundError | ConfigParseError> =>
    loadConfig<SkillsConfig>(`${configDir}/skills.conf.toml`);

/**
 * Load activities configuration
 */
export const loadActivitiesConfig = (
    configDir: string
): Effect.Effect<
    { activities: readonly ActivityConfig[] },
    ConfigNotFoundError | ConfigParseError
> => loadConfig<{ activities: readonly ActivityConfig[] }>(`${configDir}/activities.conf.toml`);

/**
 * Load social status configuration (optional)
 */
export const loadSocialStatusConfig = (
    configDir: string
): Effect.Effect<Option.Option<SocialStatusConfig>, ConfigParseError> =>
    loadOptionalConfig<SocialStatusConfig>(`${configDir}/social-status.conf.toml`);

/**
 * Load badges configuration (optional)
 */
export const loadBadgesConfig = (
    configDir: string
): Effect.Effect<Option.Option<BadgesConfig>, ConfigParseError> =>
    loadOptionalConfig<BadgesConfig>(`${configDir}/badges.conf.toml`);

// =============================================================================
// Aggregate Loader
// =============================================================================

export interface LoadedConfigs {
    readonly banner: BannerConfig;
    readonly header: HeaderConfig;
    readonly footer: FooterConfig;
    readonly skills: SkillsConfig;
    readonly activities: readonly ActivityConfig[];
    readonly socialStatus: Option.Option<SocialStatusConfig>;
    readonly badges: Option.Option<BadgesConfig>;
}

/**
 * Load all configuration files from a directory
 */
export const loadAllConfigs = (
    configDir: string
): Effect.Effect<LoadedConfigs, ConfigNotFoundError | ConfigParseError> =>
    Effect.all({
        banner: loadBannerConfig(configDir),
        header: loadHeaderConfig(configDir),
        footer: loadFooterConfig(configDir),
        skills: loadSkillsConfig(configDir),
        activities: pipe(
            loadActivitiesConfig(configDir),
            Effect.map((c) => c.activities)
        ),
        socialStatus: loadSocialStatusConfig(configDir),
        badges: loadBadgesConfig(configDir),
    });
