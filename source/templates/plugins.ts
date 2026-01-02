/**
 * README Plugins Template
 * Renders free GitHub README plugins and widgets
 * 
 * @module templates/plugins
 */

import { md } from "../lib/markdown.js";
import type { PluginsConfig, ReadmePlugin } from "../types/types.js";

/**
 * Render a single plugin widget
 */
const renderPlugin = (plugin: ReadmePlugin): string => {
    const align = plugin.align ?? "center";
    const alt = plugin.alt ?? plugin.name;

    return `
<p align="${align}">
  <img src="${plugin.url}" alt="${alt}" />
</p>`;
};

/**
 * Render the plugins section with organized sections
 */
export const renderPlugins = (config: PluginsConfig): string => {
    if (!config.plugins || config.plugins.length === 0) {
        return "";
    }

    const pluginWidgets = config.plugins.map(renderPlugin).join("\n");

    return md`
<h2 align="center">📈 GITHUB METRICS</h2>

${pluginWidgets}
`;
};

/**
 * Render specific plugin types (for selective inclusion)
 */
export const renderPluginsByType = (
    config: PluginsConfig,
    types: readonly string[]
): string => {
    const filtered = config.plugins.filter((p) => types.includes(p.type));

    if (filtered.length === 0) {
        return "";
    }

    return filtered.map(renderPlugin).join("\n");
};
