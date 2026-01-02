/**
 * Skills Section Template
 * Renders skill icon tables using defineTemplate pattern
 * 
 * @module templates/skills
 */

import { md, htmlImg } from "@/lib/markdown";
import type { SkillsConfig, IconConfig } from "@/types";
import { defineTemplate } from "@/utils";

// =============================================================================
// Icon Table Renderer
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

// =============================================================================
// Skills Section
// =============================================================================

export const skills = defineTemplate((config: SkillsConfig) => [md`
${renderIconTable("SOCIALS", config.socials, "left")}

${renderIconTable("LANGUAGES", config.languages, "right")}

${renderIconTable("SKILLS", config.skills, "left")}

${renderIconTable("LINKS", config.links, "right")}
`]);
