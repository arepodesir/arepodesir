import { md } from "@/lib/markdown";

export const renderFooter = (config: FooterConfig): string => {
  const now = new Date().toISOString();

  return md`
<table align="left">
<tr>
<th align="center"><blockquote>"${config.quote}" - ${config.author}</blockquote></th>
</tr>

<tr align="center">
<th align="center">Made with &nbsp; <3 &nbsp; by Arepo Desir | <code>${Date.now()}© ${config.copyright}</code> | <code>MACH ${config.mach}</code></th>
</tr>

<tr align="center">
<th align="center"><i>Last Updated:</i> <code>${now}</code></th>
</tr>

</table>
`;
};
