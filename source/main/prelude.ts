import { Effect, pipe, Match, Console } from "effect";
import { loadAllConfigs } from "../utils/config.js";
import { writeReadme } from "@/services/Writer.js";


import type {
  ConfigNotFoundError,
  ConfigParseError,
  WriteError,
  GenerationResult,
  BannerConfig,
  HeaderConfig,
  FooterConfig,
  SkillsConfig,
  ActivityConfig,
} from "../types/types.js";

import { WORKING_DIRECTORY } from "../utils/utils.js";
import { renderReadme } from "../templates/sections.js";
export { renderReadme };


export const PROJECT_ROOT = WORKING_DIRECTORY;

export const CONFIG_DIR = `${PROJECT_ROOT}/source/configs`;

export type AppError = ConfigNotFoundError | ConfigParseError | WriteError;

export const handleError = (error: AppError): string =>
  pipe(
    Match.value(error),
    Match.when(
      { _tag: "ConfigNotFoundError" },
      (e) => `❌ Config file not found: ${e.path}`,
    ),
    Match.when(
      { _tag: "ConfigParseError" },
      (e) => `❌ Failed to parse config ${e.path}: ${e.message}`,
    ),
    Match.when(
      { _tag: "WriteError" },
      (e) => `❌ Failed to write file ${e.path}: ${e.message}`,
    ),
    Match.exhaustive,
  );

export const generateReadme: Effect.Effect<GenerationResult, AppError> = pipe(
  // Step 1: Load all configs
  Effect.tap(Effect.void, () =>
    Console.log("📦 Loading configuration files..."),
  ),
  Effect.flatMap(() => loadAllConfigs(CONFIG_DIR)),
  Effect.tap((configs) =>
    Console.log(`✓ Loaded ${Object.keys(configs).length} config files`),
  ),

  // Step 2: Render README
  Effect.tap(() => Console.log("📝 Rendering README...")),
  Effect.map((configs) => ({
    content: renderReadme(configs),
    configs,
  })),
  Effect.tap(() => Console.log("✓ README rendered")),

  // Step 3: Write to file
  Effect.tap(() => Console.log("💾 Writing README.md...")),
  Effect.flatMap(({ content, configs }) =>
    pipe(
      writeReadme(PROJECT_ROOT, content),
      Effect.map(() => ({
        outputPath: `${PROJECT_ROOT}/README.md`,
        sections: ["banner", "header", "activities", "skills", "footer"],
        timestamp: new Date(),
      })),
    ),
  ),
  Effect.tap((result) =>
    Console.log(`✓ README.md written to ${result.outputPath}`),
  ),
);


export interface ReadmeData {
  readonly banner: BannerConfig;
  readonly header: HeaderConfig;
  readonly activities: readonly ActivityConfig[];
  readonly skills: SkillsConfig;
  readonly footer: FooterConfig;
}



