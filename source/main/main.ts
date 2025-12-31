import { Effect, pipe, Match, Console } from "effect";
import { loadAllConfigs } from "../lib/config-loader.js";
import { renderReadme } from "../templates/sections.js";
import { writeReadme } from "../services/writer.js";
import type {
  ConfigNotFoundError,
  ConfigParseError,
  WriteError,
  GenerationResult,
} from "../types/types.js";
import { WORKING_DIRECTORY } from "../utils/utils.js";

const PROJECT_ROOT = WORKING_DIRECTORY;

const CONFIG_DIR = `${PROJECT_ROOT}/source/configs`;

type AppError = ConfigNotFoundError | ConfigParseError | WriteError;

const handleError = (error: AppError): string =>
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

const generateReadme: Effect.Effect<GenerationResult, AppError> = pipe(
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

export async function main(): Promise<void> {
  console.log("\n🚀 AREPO README Generator\n");
  console.log("─".repeat(40));

  const result = await Effect.runPromise(
    pipe(
      generateReadme,
      Effect.catchAll((error) =>
        pipe(
          Console.error(handleError(error)),
          Effect.flatMap(() => Effect.fail(error)),
        ),
      ),
    ),
  ).catch((error) => {
    console.error("\n❌ Generation failed!");
    process.exit(1);
  });

  console.log("─".repeat(40));
  console.log("\n✅ README generation complete!");
  console.log(`📄 Output: ${result.outputPath}`);
  console.log(`📋 Sections: ${result.sections.join(", ")}`);
  console.log(`🕐 Generated at: ${result.timestamp.toISOString()}\n`);
}

main();
