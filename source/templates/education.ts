/**
 * Education Template
 * Renders academic background and certifications
 * 
 * @module templates/education
 */

import { md, table } from "../lib/markdown.js";
import type { EducationConfig } from "../types/types.js";

/**
 * Render the education section
 */
export const renderEducation = (config: EducationConfig): string => {
    if (!config.entries || config.entries.length === 0) {
        return "";
    }

    const tableContent = table(
        [
            { header: "Institution", align: "left" },
            { header: "Degree", align: "left" },
            { header: "Field", align: "left" },
            { header: "Years", align: "center" },
        ],
        config.entries.map((entry) => ({
            cells: [
                entry.link ? `[${entry.institution}](${entry.link})` : entry.institution,
                entry.degree,
                entry.field ?? "",
                entry.years,
            ],
        })),
    );

    return md`
<h2 align="center">🎓 EDUCATION</h2>

${tableContent}
`;
};
