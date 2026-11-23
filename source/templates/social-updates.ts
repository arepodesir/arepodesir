/**
 * Social Updates Template
 * Renders latest updates from social platforms
 * 
 * @module templates/social-updates
 */

import { md } from "../lib/markdown.js";
import type { SocialUpdatesConfig } from "../types/types.js";

/**
 * Render the social updates section
 */
export const renderSocialUpdates = (config: SocialUpdatesConfig): string => {
    if (!config.updates || config.updates.length === 0) {
        return "";
    }

    const updatesList = config.updates
        .map((update) => {
            const linkText = update.link
                ? ` [→](${update.link})`
                : "";
            return `| ${update.icon} **${update.platform}** | ${update.message}${linkText} |`;
        })
        .join("\n");

    return md`
<h2 align="center">📢 LATEST UPDATES</h2>

| Platform | Update |
| :------- | :----- |
${updatesList}
`;
};
