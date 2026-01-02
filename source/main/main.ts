import * as prelude from "@/main";
import { compose, Functional } from "@/lib";
import { Terminal } from "@/services";

export async function main(): Promise<void> {
  const { generateReadme, handleError } = prelude;
  const { runPromise, catchAll, flatMap, fail } = Functional;

  await runPromise(
    compose(
      generateReadme,
      catchAll((error) =>
        compose(
          Terminal.logError(handleError(error)),
          flatMap(() => fail(error)),
        ),
      ),
    ),
  ).catch(() => {
    Terminal.error("Generation failed!");
    process.exit(1);
  });
}

await main();
