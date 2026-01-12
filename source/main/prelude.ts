import { manifest } from "@/data";
import { MESSAGES, Terminal } from "@/services";
import { writeReadme } from "@/services/Writer.js";
import { renderReadme } from "@/templates";
import { CONFIG_DIR, loadAllConfigs, PROJECT_ROOT } from "@/utils";
import { Effect, Match, pipe } from "effect";

import type {
  AppError,
  GenerationResult
} from "@/types";


export const handleError = (error: AppError): string =>
  pipe(
    Match.value(error),
    Match.when(
      { _tag: "ConfigNotFoundError" },
      (e) => `Config file not found: ${e.path}`,
    ),
    Match.when(
      { _tag: "ConfigParseError" },
      (e) => `Failed to parse config ${e.path}: ${e.message}`,
    ),
    Match.when(
      { _tag: "WriteError" },
      (e) => `Failed to write file ${e.path}: ${e.message}`,
    ),
    Match.exhaustive,
  );

export const generateReadme: Effect.Effect<GenerationResult, AppError> = pipe(
  Effect.sync(() => Terminal.printArt()),
  Effect.tap(() => Terminal.log("")),

  Effect.tap(() => Terminal.logStep("Loading configuration files...")),
  Effect.flatMap(() => loadAllConfigs(CONFIG_DIR)),
  Effect.tap((configs) =>
    Terminal.logSuccess(`Loaded ${Object.keys(configs).filter(k => {
      const val = configs[k as keyof typeof configs];
      // Count non-empty optional configs
      if (val && typeof val === 'object' && '_tag' in val) {
        return val._tag === 'Some';
      }
      return true;
    }).length} config files`),
  ),

  Effect.tap(() => Terminal.logStep("Rendering README...")),
  Effect.map((configs) => ({
    content: renderReadme(configs),
    configs,
  })),
  Effect.tap(() => Terminal.logSuccess("README rendered")),

  Effect.tap(() => Terminal.logStep("Writing README.md...")),
  Effect.flatMap(({ content }) =>
    pipe(
      writeReadme(PROJECT_ROOT, content),
      Effect.map(() => ({
        outputPath: `${PROJECT_ROOT}/README.md`,
        sections: manifest(),
        timestamp: new Date(),
      })),
    ),
  ),
  Effect.tap((result) =>
    Terminal.logSuccess(`README.md written to ${result.outputPath}`),
  ),

  Effect.tap((result) => Effect.sync(() => Terminal.result(result))),
);

export { MESSAGES, renderReadme, Terminal };

