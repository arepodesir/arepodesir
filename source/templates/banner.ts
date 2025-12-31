export const renderBanner = (config: BannerConfig): string => md`
<img src="${config.imagePath}" height="100%" width="100%"/>
<h1 align="center">
  <a href="${config.url}" label="fyi">${config.title}</a>
</h1>

<blockquote align="center">
    <p><i>${config.subtitle ?? ""}</i></p>
</blockquote>
`;
