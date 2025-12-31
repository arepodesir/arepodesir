import { defineTemplate } from "@/utils";
import { h2, p } from "@/lib/markdown";

export const support = defineTemplate(() => {
  return [
    h2`<h2>Support</h2>`,
    p`<p>If you have any questions or need assistance, please feel free to reach out to us.</p>
`,
  ];
});
