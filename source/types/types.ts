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

export type TemplateConfiguration<T> = {
    [t: symbol]: T
}


export type TestC = TemplateConfiguration<{
    r: string 
}>


const test: TestC = { r: 1 as any}



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

// =============================================================================
// Education Types
// =============================================================================

export interface EducationEntry {
    readonly institution: string;
    readonly degree: string;
    readonly field?: string;
    readonly years: string;
    readonly logo?: string;
    readonly link?: string;
    readonly description?: string;
}

export interface EducationConfig {
    readonly entries: readonly EducationEntry[];
}

// =============================================================================
// Social Updates Types
// =============================================================================

export interface SocialUpdate {
    readonly platform: string;
    readonly icon: string;
    readonly message: string;
    readonly link?: string;
    readonly timestamp?: string;
}

export interface SocialUpdatesConfig {
    readonly updates: readonly SocialUpdate[];
}

// =============================================================================
// News Feed Types
// =============================================================================

export interface NewsItem {
    readonly title: string;
    readonly source: string;
    readonly link: string;
    readonly date?: string;
    readonly icon?: string;
}

export interface NewsConfig {
    readonly title?: string;
    readonly items: readonly NewsItem[];
}

// =============================================================================
// Funding/Donation Types
// =============================================================================

export interface FundingPlatform {
    readonly platform: string;
    readonly username: string;
    readonly url: string;
    readonly icon?: string;
    readonly badge?: string;
    readonly description?: string;
}

export interface FundingConfig {
    readonly title?: string;
    readonly message?: string;
    readonly platforms: readonly FundingPlatform[];
}

// =============================================================================
// FAQ Types
// =============================================================================

export interface FAQItem {
    readonly question: string;
    readonly answer: string;
    readonly category?: string;
}

export interface FAQConfig {
    readonly title?: string;
    readonly items: readonly FAQItem[];
}

// =============================================================================
// Resume Links Types
// =============================================================================

export interface ResumeLink {
    readonly label: string;
    readonly format: string;
    readonly url: string;
    readonly icon?: string;
    readonly style?: 'button' | 'badge' | 'link';
}

export interface ResumeConfig {
    readonly title?: string;
    readonly links: readonly ResumeLink[];
}

// =============================================================================
// README Plugin Types
// =============================================================================

export interface ReadmePlugin {
    readonly name: string;
    readonly type: 'stats' | 'trophy' | 'activity' | 'quote' | 'snake' | 'custom';
    readonly url: string;
    readonly alt?: string;
    readonly align?: 'left' | 'center' | 'right';
}

export interface PluginsConfig {
    readonly plugins: readonly ReadmePlugin[];
}
