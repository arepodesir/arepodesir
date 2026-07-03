/**
 * Badges Template
 * Renders technology and profile badges
 * 
 * @module templates/badges
 */

import { md } from "../lib/markdown.js";
import type { BadgesConfig, BadgeConfig } from "../types/types.js";

// =============================================================================
// Badges Section
// =============================================================================

/**
 * Render a single badge with optional link
 */
const renderBadge = (badge: BadgeConfig): string => {
    const img = `<img src="${badge.src}" alt="${badge.alt}" />`;
    return badge.link ? `<a href="${badge.link}">${img}</a>` : img;
};

/**
 * Render the badges section
 */
export const renderBadges = (config: BadgesConfig): string => {
    if (!config.badges || config.badges.length === 0) {
        return "";
    }

    const badgeHtml = config.badges.map(renderBadge).join(" ");

    return md`
<h2 align="center">🛠️ TECH STACK</h2>

<p align="center">
${badgeHtml}
</p>
`;
};
