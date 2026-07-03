/**
 * News Feed Template
 * Renders curated news and reading list
 * 
 * @module templates/news
 */

import { md } from "../lib/markdown.js";
import type { NewsConfig } from "../types/types.js";

/**
 * Render the news/reading list section
 */
export const renderNews = (config: NewsConfig): string => {
    if (!config.items || config.items.length === 0) {
        return "";
    }

    const title = config.title ?? "📰 READING LIST";

    const itemsList = config.items
        .map((item) => {
            const icon = item.icon ?? "📄";
            const date = item.date ? ` *(${item.date})*` : "";
            return `- ${icon} [**${item.title}**](${item.link}) — *${item.source}*${date}`;
        })
        .join("\n");

    return md`
<h2 align="center">${title}</h2>

${itemsList}
`;
};
