export * from "./activities";
export * from "./sections";
export * from "./social-status";
export * from "./badges";
export * from "./education";
export * from "./social-updates";
export * from "./news";
export * from "./funding";
export * from "./faq";
export * from "./resume";
export * from "./plugins";
export * from "./base";

import { Option } from "effect";
import type {
    BannerConfig,
    HeaderConfig,
    FooterConfig,
    SkillsConfig,
    ActivityConfig,
    IconConfig,
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
import {
    md,
    htmlImg,
    table,
    joinSections,
} from "../lib/markdown.js";
import { renderSocialStatus } from "./social-status.js";
import { renderBadges } from "./badges.js";
import { renderEducation } from "./education.js";
import { renderSocialUpdates } from "./social-updates.js";
import { renderNews } from "./news.js";
import { renderFunding } from "./funding.js";
import { renderFAQ } from "./faq.js";
import { renderResume } from "./resume.js";
import { renderPlugins } from "./plugins.js";
import { renderBaseComment, type BuildMetadata } from "./base.js";

// =============================================================================
// Banner Section
// =============================================================================

export const renderBanner = (config: BannerConfig): string => md`
<img src="${config.imagePath}" height="100%" width="100%"/>
<h1 align="center">
  <a href="${config.url}" label="fyi">${config.title}</a>
</h1>

<blockquote align="center">
    <p><i>${config.subtitle ?? ""}</i></p>
</blockquote>
`;

// =============================================================================
// Header Section
// =============================================================================

export const renderHeader = (config: HeaderConfig): string => {
    const quoteLines = config.quote
        .trim()
        .split("\n")
        .map((line) => `${line.trim()}</br>`)
        .join("\n");

    const linksText = config.links.map((l) => `[${l.label}](${l.url})`).join(" ");

    return md`
<blockquote align="right">
<i>${quoteLines}
</i></blockquote>

---

### *${linksText}*
`;
};

// =============================================================================
// Activities Section
// =============================================================================

export const renderActivities = (
    activities: readonly ActivityConfig[],
): string => {
    const tableContent = table(
        [
            { header: "NAME", align: "left" },
            { header: "KIND", align: "left" },
            { header: "TL;DR", align: "left" },
            { header: "LINK", align: "left" },
            { header: "MACH", align: "left" },
        ],
        activities.map((a) => ({
            cells: [
                a.name,
                a.kind,
                a.description,
                `[@${a.name.toLowerCase().replace(/\s+/g, "")}](${a.link})`,
                `\`${a.mach}\``,
            ],
        })),
    );

    return md`
<h1 align="center">LATEST ACTIVITIES</h1>

${tableContent}
`;
};

// =============================================================================
// Skills/Icons Section
// =============================================================================

const renderIconRow = (icons: readonly IconConfig[]): string =>
    icons.map((icon) => `<th>${htmlImg(icon)}</th>`).join("\n    ");

const renderIconTable = (
    title: string,
    icons: readonly IconConfig[],
    align: "left" | "right" = "left",
): string => md`
<table align="${align}">
<tr title="${title.toLowerCase()}">
<h1 align="${align}">${title} </h1>
    ${renderIconRow(icons)}
</tr>
</table>
`;

export const renderSkills = (config: SkillsConfig): string => md`
${renderIconTable("SOCIALS", config.socials, "left")}

${renderIconTable("LANGUAGES", config.languages, "right")}

${renderIconTable("SKILLS", config.skills, "left")}

${renderIconTable("LINKS", config.links, "right")}
`;

// =============================================================================
// Footer Section
// =============================================================================

export const renderFooter = (config: FooterConfig): string => {
    const now = new Date().toISOString();

    return md`
<table align="left">
<tr>
<th align="center"><blockquote>"${config.quote}" - ${config.author}</blockquote></th>
</tr>

<tr align="center">
<th align="center">Made with &nbsp; <3 &nbsp; by Arepo Desir | <code> ${config.copyright}</code> | <code>MACH ${config.mach}</code></th>
</tr>

<tr align="center">
<th align="center"><i>Last Updated:</i> <code>${now}</code></th>
</tr>

</table>
`;
};

// =============================================================================
// Full README
// =============================================================================

export interface ReadmeData {
    readonly banner: BannerConfig;
    readonly header: HeaderConfig;
    readonly activities: readonly ActivityConfig[];
    readonly skills: SkillsConfig;
    readonly footer: FooterConfig;
    // Optional sections
    readonly socialStatus?: Option.Option<SocialStatusConfig>;
    readonly badges?: Option.Option<BadgesConfig>;
    readonly education?: Option.Option<EducationConfig>;
    readonly socialUpdates?: Option.Option<SocialUpdatesConfig>;
    readonly news?: Option.Option<NewsConfig>;
    readonly funding?: Option.Option<FundingConfig>;
    readonly faq?: Option.Option<FAQConfig>;
    readonly resume?: Option.Option<ResumeConfig>;
    readonly plugins?: Option.Option<PluginsConfig>;
}

/**
 * Helper to conditionally render an optional section
 */
const renderOptional = <T>(
    option: Option.Option<T> | undefined,
    render: (config: T) => string
): string | null => {
    if (!option || !Option.isSome(option)) return null;
    const content = render(option.value);
    return content || null;
};

export interface RenderResult {
    readonly content: string;
    readonly metadata: BuildMetadata;
}

export const renderReadme = (data: ReadmeData): string => {
    // Generate build metadata with version hash
    const { comment: baseComment } = renderBaseComment();

    const sections: string[] = [
        // Add version hash comment at the very top
        baseComment,
        renderBanner(data.banner),
        renderHeader(data.header),
    ];

    // Add badges section
    const badges = renderOptional(data.badges, renderBadges);
    if (badges) sections.push(badges);

    // Add social status section
    const socialStatus = renderOptional(data.socialStatus, renderSocialStatus);
    if (socialStatus) sections.push(socialStatus);

    // Add plugins/metrics section
    const plugins = renderOptional(data.plugins, renderPlugins);
    if (plugins) sections.push(plugins);

    // Core activities section
    sections.push(renderActivities(data.activities));

    // Add education section
    const education = renderOptional(data.education, renderEducation);
    if (education) sections.push(education);

    // Add skills section
    sections.push(renderSkills(data.skills));

    // Add social updates section
    const socialUpdates = renderOptional(data.socialUpdates, renderSocialUpdates);
    if (socialUpdates) sections.push(socialUpdates);

    // Add news/reading list section
    const news = renderOptional(data.news, renderNews);
    if (news) sections.push(news);

    // Add resume links section
    const resume = renderOptional(data.resume, renderResume);
    if (resume) sections.push(resume);

    // Add funding section
    const funding = renderOptional(data.funding, renderFunding);
    if (funding) sections.push(funding);

    // Add FAQ section
    const faq = renderOptional(data.faq, renderFAQ);
    if (faq) sections.push(faq);

    // Footer always last
    sections.push(renderFooter(data.footer));

    return joinSections(...sections);
};
