import { pipe as EffectPipe } from "effect";
import { Match as EffectMatch } from "effect";
import { Console as EffectConsole } from "effect";
import { Effect as EffectFunctional } from "effect"

import { PROGRAM } from "@/data";

// Type-safe exports that preserve Effect's complex generic types and overloads
export const compose = EffectPipe
export const pattern = EffectMatch
export const console = EffectConsole
export const Functional = EffectFunctional
