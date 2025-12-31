import {
  md,
  html,
  htmlImg,
  htmlA,
  htmlCenter,
  htmlBlockquote,
  table,
  joinSections,
  hr,
  heading,
  link,
  code,
} from "../lib/markdown.js";

export const activities = (activities: readonly ActivityConfig[]): string => {
  const tableContent = table(
    [
      { header: "NAME", align: "left" },
      { header: "KIND", align: "left" },
      { header: "TL;DR", align: "left" },
      { header: "LINK", align: "left" },
      { header: "MACH", align: "left" },
    ],
    activities.map((a) => ({
      cells: [
        a.name,
        a.kind,
        a.description,
        `[@${a.name.toLowerCase().replace(/\s+/g, "")}](${a.link})`,
        `\`${a.mach}\``,
      ],
    })),
  );

  return md`
<h1 align="center">LATEST ACTIVITIES</h1>

${tableContent}
`;
};
