export type ISection<T> = {
   content: T;
}

export type IFooter = ISection<{
    year: number;
    author: string;
}>

export function Footer(props: IFooter) {
    
    const { year, author } = props.content;

 return defineSection(`<footer>
        <p>Copyright ${year} ${author}</p>
    </footer>`)
}

export function defineSection(content: string) {
    return `
    <section>
        ${content}
    </section>
    `
}