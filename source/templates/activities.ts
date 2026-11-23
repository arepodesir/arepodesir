import type { ActivityConfig } from "source/types/types.js";
import { defineTemplate } from "source/utils/utils.js";
import { md, table } from "source/lib"

export const activities = defineTemplate((activities: readonly ActivityConfig[]) => {
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

  return [md`
<h1 align="center">LATEST ACTIVITIES</h1>

${tableContent}
`]
});
