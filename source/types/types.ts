/**
 * Core types for README generation
 * Using Effect patterns for functional, type-safe programming
 */

// =============================================================================
// Config Types (mapped from TOML)
// =============================================================================

export interface IconConfig {
    readonly src: string;
    readonly height: string;
    readonly width: string;
    readonly alt?: string;
    readonly link?: string;
}

export interface BannerConfig {
    readonly title: string;
    readonly subtitle?: string;
    readonly url: string;
    readonly imagePath: string;
}

export interface HeaderConfig {
    readonly quote: string;
    readonly author?: string;
    readonly links: readonly LinkConfig[];
}

export interface LinkConfig {
    readonly label: string;
    readonly url: string;
}

export interface ActivityConfig {
    readonly name: string;
    readonly kind: string;
    readonly description: string;
    readonly link: string;
    readonly mach: string;
}

export interface SkillsConfig {
    readonly socials: readonly IconConfig[];
    readonly languages: readonly IconConfig[];
    readonly skills: readonly IconConfig[];
    readonly links: readonly IconConfig[];
}

export interface FooterConfig {
    readonly quote: string;
    readonly author: string;
    readonly copyright: string;
    readonly mach: string;
    readonly lastUpdated: string;
}

export interface ReadmeConfig {
    readonly banner: BannerConfig;
    readonly header: HeaderConfig;
    readonly activities: readonly ActivityConfig[];
    readonly skills: SkillsConfig;
    readonly footer: FooterConfig;
}

// =============================================================================
// Section Types
// =============================================================================

export interface Section<T> {
    readonly kind: string;
    readonly content: T;
}

export type BannerSection = Section<BannerConfig> & { readonly kind: "banner" };
export type HeaderSection = Section<HeaderConfig> & { readonly kind: "header" };
export type ActivitiesSection = Section<readonly ActivityConfig[]> & { readonly kind: "activities" };
export type SkillsSection = Section<SkillsConfig> & { readonly kind: "skills" };
export type FooterSection = Section<FooterConfig> & { readonly kind: "footer" };

export type ReadmeSection =
    | BannerSection
    | HeaderSection
    | ActivitiesSection
    | SkillsSection
    | FooterSection;

// =============================================================================
// Error Types
// =============================================================================

export class ConfigNotFoundError {
    readonly _tag = "ConfigNotFoundError";
    constructor(readonly path: string) { }
}

export class ConfigParseError {
    readonly _tag = "ConfigParseError";
    constructor(
        readonly path: string,
        readonly message: string
    ) { }
}

export class TemplateRenderError {
    readonly _tag = "TemplateRenderError";
    constructor(
        readonly section: string,
        readonly message: string
    ) { }
}

export class WriteError {
    readonly _tag = "WriteError";
    constructor(
        readonly path: string,
        readonly message: string
    ) { }
}

export type AppError =
    | ConfigNotFoundError
    | ConfigParseError
    | TemplateRenderError
    | WriteError;

// =============================================================================
// Social Status Types
// =============================================================================

export interface SocialStatusBadge {
    readonly src: string;
    readonly alt: string;
    readonly link?: string;
}

export interface SocialStatusConfig {
    readonly status: {
        readonly mood: string;
        readonly activity: string;
        readonly currentProject?: string;
    };
    readonly stats?: {
        readonly contributionGraphUrl?: string;
        readonly streakStatsUrl?: string;
        readonly profileViewsUrl?: string;
    };
    readonly badges?: readonly SocialStatusBadge[];
}

// =============================================================================
// Badges Types
// =============================================================================

export interface BadgeConfig {
    readonly src: string;
    readonly alt: string;
    readonly link?: string;
    readonly style?: 'flat' | 'flat-square' | 'plastic' | 'for-the-badge' | 'social';
}

export interface BadgesConfig {
    readonly badges: readonly BadgeConfig[];
}

// =============================================================================
// Generation Result
// =============================================================================

export interface GenerationResult {
    readonly outputPath: string;
    readonly sections: readonly string[];
    readonly timestamp: Date;
}

