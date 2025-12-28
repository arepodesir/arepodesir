export type IBANNER = {
    title: string;
    url: string;
}

export function BANNER(props: IBANNER) {
    const { title, url } = props;


    return `
    <img src="./docs/assets/banner.png" height="100%" width="100%"/>
<h1 align="center">
  <a href="https://whoisarepo.fyi" label="fyi">WHOISAREPO❓</a>
</h1>
    `
}