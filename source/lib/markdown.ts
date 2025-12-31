export const md = (
    strings: TemplateStringsArray,
    ...expressions: unknown[]
): string => {
    const result = strings
        .map((str, i) => {
            const expr = expressions[i] !== undefined ? String(expressions[i]) : "";
            return str + expr;
        })
        .join("");

    return result.replace(/\r\n/g, "\n").trim();
};

export const html = md;



export const heading = (level: 1 | 2 | 3 | 4 | 5 | 6, text: string): string =>
    `${"#".repeat(level)} ${text}`;

/** Create bold text */
export const bold = (text: string): string => `**${text}**`;

/** Create italic text */
export const italic = (text: string): string => `*${text}*`;

/** Create a link */
export const link = (text: string, url: string): string => `[${text}](${url})`;

/** Create an image */
export const image = (alt: string, src: string): string => `![${alt}](${src})`;

/** Create inline code */
export const code = (text: string): string => `\`${text}\``;

/** Create a horizontal rule */
export const hr = (): string => "---";

export const blockquote = (text: string): string =>
    text
        .split("\n")
        .map((line) => `> ${line}`)
        .join("\n");


export const br = (): string => "\n";

export const joinSections = (...sections: string[]): string =>
    sections.filter(Boolean).join("\n\n");

export interface TableColumn {
    readonly header: string;
    readonly align?: "left" | "center" | "right";
}

export interface TableRow {
    readonly cells: readonly string[];
}

const alignmentChar = (align?: "left" | "center" | "right"): string => {
    switch (align) {
        case "center":
            return ":---:";
        case "right":
            return "---:";
        default:
            return ":---";
    }
};

export const table = (
    columns: readonly TableColumn[],
    rows: readonly TableRow[]
): string => {
    const headerRow = `| ${columns.map((c) => c.header).join(" | ")} |`;
    const separatorRow = `| ${columns.map((c) => alignmentChar(c.align)).join(" | ")} |`;
    const dataRows = rows.map((r) => `| ${r.cells.join(" | ")} |`).join("\n");

    return [headerRow, separatorRow, dataRows].join("\n");
};


export interface ImageAttrs {
    readonly src: string;
    readonly height?: string;
    readonly width?: string;
    readonly alt?: string;
}

export const htmlImg = (attrs: ImageAttrs): string => {
    const parts = [`src="${attrs.src}"`];
    if (attrs.height) parts.push(`height="${attrs.height}"`);
    if (attrs.width) parts.push(`width="${attrs.width}"`);
    if (attrs.alt) parts.push(`alt="${attrs.alt}"`);
    return `<img ${parts.join(" ")}/>`;
};

export const htmlA = (href: string, content: string, label?: string): string =>
    `<a href="${href}"${label ? ` label="${label}"` : ""}>${content}</a>`;

export const htmlCenter = (content: string): string =>
    `<h1 align="center">\n  ${content}\n</h1>`;

export const htmlBlockquote = (
    content: string,
    align: "left" | "center" | "right" = "center"
): string => `<blockquote align="${align}">\n    ${content}\n</blockquote>`;

export const htmlTable = (
    rows: readonly string[],
    align: "left" | "right" = "left"
): string => {
    const rowsHtml = rows.map((r) => `    <th>${r}</th>`).join("\n");
    return `<table align="${align}">\n<tr>\n${rowsHtml}\n</tr>\n</table>`;
};

export const htmlTr = (
    cells: readonly string[],
    align?: "left" | "center" | "right"
): string => {
    const alignAttr = align ? ` align="${align}"` : "";
    const cellsHtml = cells.map((c) => `<th${alignAttr}>${c}</th>`).join("\n    ");
    return `<tr${alignAttr}>\n    ${cellsHtml}\n</tr>`;
};


export const Markdown = {
    md: md,
    html: html,
    htmlTable,

}

