export function md(strings: TemplateStringsArray, ...expressions: any[]): string {
    const result = strings.map((str, i) => {
        const expr = expressions[i] !== undefined ? expressions[i] : '';
        return str + expr;
    }).join('');

    return result.replace(/\r\n/g, '\n').trim();
}
