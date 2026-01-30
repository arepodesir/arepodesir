import { defineTemplate } from "@/utils";
import type { BannerConfig } from "@/types";

const banner_template = (config: BannerConfig) => {
  return [
    `<img src="${config.imagePath}" height="100%" width="100%"/>`,
    `<h1 align="center">`,
    `  <a href="${config.url}" label="fyi">${config.title}</a>`,
    `</h1>`,
    `<blockquote align="center">`,
    `  <p><i>${config.subtitle ?? ""}</i></p>`,
    `</blockquote>`,
  ];
}

export const banner = defineTemplate(banner_template);