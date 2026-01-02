import { Effect } from "effect";
import { WriteError } from "../types/types.js";

export const writeFile = (
  path: string,
  content: string,
): Effect.Effect<void, WriteError> =>
  Effect.tryPromise({
    try: async () => {
      await Bun.write(path, content);
    },
    catch: (e) =>
      new WriteError(path, e instanceof Error ? e.message : String(e)),
  });

/**
 * Write README.md to the project root
 */
export const writeReadme = (
  projectRoot: string,
  content: string,
): Effect.Effect<void, WriteError> =>
  writeFile(`${projectRoot}/README.md`, content);

/**
 * Write to build output directory
 */
export const writeBuildOutput = (
  buildDir: string,
  filename: string,
  content: string,
): Effect.Effect<void, WriteError> =>
  writeFile(`${buildDir}/${filename}`, content);

export default {
  writeFile,
  writeReadme,
  writeBuildOutput,
};