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
    EducationConfig,
    SocialUpdatesConfig,
    NewsConfig,
    FundingConfig,
    FAQConfig,
    ResumeConfig,
    PluginsConfig,
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

// =============================================================================
// Core Config Loaders
// =============================================================================

export const loadBannerConfig = (configDir: string) =>
    loadConfig<BannerConfig>(`${configDir}/banner.conf.toml`);

export const loadHeaderConfig = (configDir: string) =>
    loadConfig<HeaderConfig>(`${configDir}/header.conf.toml`);

export const loadFooterConfig = (configDir: string) =>
    loadConfig<FooterConfig>(`${configDir}/footer.conf.toml`);

export const loadSkillsConfig = (configDir: string) =>
    loadConfig<SkillsConfig>(`${configDir}/skills.conf.toml`);

export const loadActivitiesConfig = (configDir: string) =>
    loadConfig<{ activities: readonly ActivityConfig[] }>(`${configDir}/activities.conf.toml`);

// =============================================================================
// Optional Config Loaders
// =============================================================================

export const loadSocialStatusConfig = (configDir: string) =>
    loadOptionalConfig<SocialStatusConfig>(`${configDir}/social-status.conf.toml`);

export const loadBadgesConfig = (configDir: string) =>
    loadOptionalConfig<BadgesConfig>(`${configDir}/badges.conf.toml`);

export const loadEducationConfig = (configDir: string) =>
    loadOptionalConfig<EducationConfig>(`${configDir}/education.conf.toml`);

export const loadSocialUpdatesConfig = (configDir: string) =>
    loadOptionalConfig<SocialUpdatesConfig>(`${configDir}/social-updates.conf.toml`);

export const loadNewsConfig = (configDir: string) =>
    loadOptionalConfig<NewsConfig>(`${configDir}/news.conf.toml`);

export const loadFundingConfig = (configDir: string) =>
    loadOptionalConfig<FundingConfig>(`${configDir}/funding.conf.toml`);

export const loadFAQConfig = (configDir: string) =>
    loadOptionalConfig<FAQConfig>(`${configDir}/faq.conf.toml`);

export const loadResumeConfig = (configDir: string) =>
    loadOptionalConfig<ResumeConfig>(`${configDir}/resume.conf.toml`);

export const loadPluginsConfig = (configDir: string) =>
    loadOptionalConfig<PluginsConfig>(`${configDir}/plugins.conf.toml`);

// =============================================================================
// Aggregate Loader
// =============================================================================

export interface LoadedConfigs {
    readonly banner: BannerConfig;
    readonly header: HeaderConfig;
    readonly footer: FooterConfig;
    readonly skills: SkillsConfig;
    readonly activities: readonly ActivityConfig[];
    // Optional sections
    readonly socialStatus: Option.Option<SocialStatusConfig>;
    readonly badges: Option.Option<BadgesConfig>;
    readonly education: Option.Option<EducationConfig>;
    readonly socialUpdates: Option.Option<SocialUpdatesConfig>;
    readonly news: Option.Option<NewsConfig>;
    readonly funding: Option.Option<FundingConfig>;
    readonly faq: Option.Option<FAQConfig>;
    readonly resume: Option.Option<ResumeConfig>;
    readonly plugins: Option.Option<PluginsConfig>;
}

/**
 * Load all configuration files from a directory
 */
export const loadAllConfigs = (
    configDir: string
): Effect.Effect<LoadedConfigs, ConfigNotFoundError | ConfigParseError> =>
    Effect.all({
        // Required configs
        banner: loadBannerConfig(configDir),
        header: loadHeaderConfig(configDir),
        footer: loadFooterConfig(configDir),
        skills: loadSkillsConfig(configDir),
        activities: pipe(
            loadActivitiesConfig(configDir),
            Effect.map((c) => c.activities)
        ),
        // Optional configs
        socialStatus: loadSocialStatusConfig(configDir),
        badges: loadBadgesConfig(configDir),
        education: loadEducationConfig(configDir),
        socialUpdates: loadSocialUpdatesConfig(configDir),
        news: loadNewsConfig(configDir),
        funding: loadFundingConfig(configDir),
        faq: loadFAQConfig(configDir),
        resume: loadResumeConfig(configDir),
        plugins: loadPluginsConfig(configDir),
    });
