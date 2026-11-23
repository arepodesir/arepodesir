import * as prelude from "source/main";
import { compose, Functional } from "source/lib";
import { Terminal } from "source/services";

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
  })
}

 main();
