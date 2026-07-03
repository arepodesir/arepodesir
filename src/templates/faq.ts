/**
 * FAQ Template
 * Renders frequently asked questions with collapsible details/summary
 * 
 * @module templates/faq
 */

import { md } from "../lib/markdown.js";
import type { FAQConfig } from "../types/types.js";

/**
 * Render a single FAQ item as collapsible details/summary
 */
const renderFAQItem = (item: { question: string; answer: string; category?: string }): string => {
    const categoryBadge = item.category
        ? `<sup><code>${item.category}</code></sup> `
        : "";

    return `
<details>
<summary><b>${categoryBadge}${item.question}</b></summary>

${item.answer}

</details>`;
};

/**
 * Render the FAQ section
 */
export const renderFAQ = (config: FAQConfig): string => {
    if (!config.items || config.items.length === 0) {
        return "";
    }

    const title = config.title ?? "❓ FAQ";

    const faqItems = config.items.map(renderFAQItem).join("\n");

    return md`
<h2 align="center">${title}</h2>

${faqItems}
`;
};
