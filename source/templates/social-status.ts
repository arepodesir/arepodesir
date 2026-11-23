/**
 * Social Status Template
 * Renders mood, current activity, and GitHub statistics
 * 
 * @module templates/social-status
 */

import { md, table } from "../lib/markdown.js";
import type { SocialStatusConfig } from "../types/types.js";

// =============================================================================
// Social Status Section
// =============================================================================

/**
 * Render the social status section with mood, activity, and stats
 */
export const renderSocialStatus = (config: SocialStatusConfig): string => {
    const statusRows = [
        { cells: ["🎭 **Mood**", config.status.mood] },
        { cells: ["⚡ **Activity**", config.status.activity] },
    ];

    if (config.status.currentProject) {
        statusRows.push({ cells: ["🔨 **Current Project**", `\`${config.status.currentProject}\``] });
    }

    const statusTable = table(
        [
            { header: "Status", align: "left" },
            { header: "Value", align: "left" },
        ],
        statusRows,
    );

    const statsSection = renderStats(config);
    const badgesSection = renderStatusBadges(config);

    const sections = [
        md`<h2 align="center">📊 STATUS</h2>`,
        statusTable,
    ];

    if (statsSection) sections.push(statsSection);
    if (badgesSection) sections.push(badgesSection);

    return sections.join("\n\n");
};

/**
 * Render GitHub statistics (contribution graph, streak, profile views)
 */
const renderStats = (config: SocialStatusConfig): string | null => {
    if (!config.stats) return null;

    const { contributionGraphUrl, streakStatsUrl, profileViewsUrl } = config.stats;
    const parts: string[] = [];

    if (contributionGraphUrl) {
        parts.push(md`
<p align="center">
  <img src="${contributionGraphUrl}" alt="Contribution Graph" />
</p>`);
    }

    if (streakStatsUrl) {
        parts.push(md`
<p align="center">
  <img src="${streakStatsUrl}" alt="GitHub Streak" />
</p>`);
    }

    if (profileViewsUrl) {
        parts.push(md`
<p align="center">
  <img src="${profileViewsUrl}" alt="Profile Views" />
</p>`);
    }

    return parts.length > 0 ? parts.join("\n") : null;
};

/**
 * Render status badges
 */
const renderStatusBadges = (config: SocialStatusConfig): string | null => {
    if (!config.badges || config.badges.length === 0) return null;

    const badgeHtml = config.badges
        .map((badge) => {
            const img = `<img src="${badge.src}" alt="${badge.alt}" />`;
            return badge.link ? `<a href="${badge.link}">${img}</a>` : img;
        })
        .join(" ");

    return md`<p align="center">${badgeHtml}</p>`;
};
