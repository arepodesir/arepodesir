import { md } from "@/lib/markdown";

export const skills = (config: SkillsConfig): string => md`
${renderIconTable("SOCIALS", config.socials, "left")}

${renderIconTable("LANGUAGES", config.languages, "right")}

${renderIconTable("SKILLS", config.skills, "left")}

${renderIconTable("LINKS", config.links, "right")}
`;
