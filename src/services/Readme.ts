/**
 * Readme Service
 * High-level service for README rendering with Effect-based composition
 * 
 * @module services/Readme
 */

import { defineService } from "src/utils";
import { joinSections } from "src/lib";
import { Effect } from "effect";

export const Readme = defineService(() => {
    return {
        /**
         * Render multiple sections into a single README string
         */
        render: (...sections: string[]) => Effect.succeed(joinSections(...sections)),
    };
});
