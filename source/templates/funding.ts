/**
 * Funding Template
 * Renders donation and sponsorship links (mirrors FUNDING.yml)
 * 
 * @module templates/funding
 */

import { md } from "../lib/markdown.js";
import type { FundingConfig } from "../types/types.js";

/**
 * Render the funding/donation section
 */
export const renderFunding = (config: FundingConfig): string => {
    if (!config.platforms || config.platforms.length === 0) {
        return "";
    }

    const title = config.title ?? "💖 SUPPORT MY WORK";
    const message = config.message ?? "If you find my projects useful, consider supporting my open source work!";

    const badgesHtml = config.platforms
        .filter((p) => p.badge)
        .map((p) => `<a href="${p.url}"><img src="${p.badge}" alt="${p.platform}" /></a>`)
        .join(" ");

    const platformsList = config.platforms
        .map((p) => {
            const desc = p.description ? ` — ${p.description}` : "";
            return `| ${p.icon ?? "💝"} | [**${p.platform}**](${p.url}) | @${p.username}${desc} |`;
        })
        .join("\n");

    return md`
<h2 align="center">${title}</h2>

<p align="center"><i>${message}</i></p>

<p align="center">
${badgesHtml}
</p>

| | Platform | Details |
|:-:|:---------|:--------|
${platformsList}
`;
};
