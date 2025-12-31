import { pipe } from "effect";
import type {
  BannerConfig,
  HeaderConfig,
  FooterConfig,
  SkillsConfig,
  ActivityConfig,
  IconConfig,
} from "../types/types.js";
import {
  md,
  html,
  htmlImg,
  htmlA,
  htmlCenter,
  htmlBlockquote,
  table,
  joinSections,
  hr,
  heading,
  link,
  code,
} from "../lib/markdown.js";

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
}

export const renderReadme = (data: ReadmeData): string =>
  joinSections(
    renderBanner(data.banner),
    renderHeader(data.header),
    renderActivities(data.activities),
    renderSkills(data.skills),
    renderFooter(data.footer),
  );
