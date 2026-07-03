
import { md } from "../lib/markdown.js";
import type { ResumeConfig, ResumeLink } from "../types/types.js";


const renderLink = (link: ResumeLink): string => {
    const icon = link.icon ?? "📄";

    switch (link.style) {
        case "button":
            return `<a href="${link.url}"><kbd>${icon} ${link.label}</kbd></a>`;
        case "badge":
            // Create a shields.io style badge
            const encodedLabel = encodeURIComponent(link.label);
            const encodedFormat = encodeURIComponent(link.format);
            return `[![${link.label}](https://img.shields.io/badge/${encodedLabel}-${encodedFormat}-blue?style=for-the-badge)](${link.url})`;
        case "link":
        default:
            return `${icon} [${link.label}](${link.url}) *(${link.format})*`;
    }
};

export const renderResume = (config: ResumeConfig): string => {
    if (!config.links || config.links.length === 0) {
        return "";
    }

    const title = config.title ?? "📄 RESUME";

    const linksContent = config.links.map(renderLink).join(" &nbsp; ");

    return md`
<h2 align="center">${title}</h2>

<p align="center">
${linksContent}
</p>
`;
};
