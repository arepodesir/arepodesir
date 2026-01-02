import { defineTemplate } from "@/utils/utils.js";
import type { BannerConfig } from "../types/types.js";

export const renderBanner = defineTemplate((config: BannerConfig) => {
  return [
    `<img src="${config.imagePath}" height="100%" width="100%"/>`,
    `<h1 align="center">`,
    `  <a href="${config.url}" label="fyi">${config.title}</a>`,
    `</h1>`,
    `<blockquote align="center">`,
    `  <p><i>${config.subtitle ?? ""}</i></p>`,
    `</blockquote>`,
  ];
});
