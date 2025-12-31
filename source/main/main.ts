import { Effect, Console } from "effect";
import * as prelude from "@/main/prelude"

import { compose, Functional } from "@/lib"
import { MESSAGES } from "@/data"

export async function main(): Promise<void> {

  const { generateReadme, handleError } = prelude

  MESSAGES.print()

  const result = await Functional.runPromise(
    compose(
      generateReadme,
      Effect.catchAll((error) =>
        compose(
          Console.error(handleError(error)),
          Effect.flatMap(() => Effect.fail(error)),
        ),
      ),
    ),
  ).catch(() => {
    console.error("\n❌ Generation failed!");
    process.exit(1);
  });

  if (result) {
    MESSAGES.success(result);
  }
}

await main();
