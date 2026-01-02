import { pipe as EffectPipe } from "effect";
import { Match as EffectMatch } from "effect";
import { Console as EffectConsole } from "effect";
import { Effect as EffectFunctional } from "effect"

// Type-safe exports that preserve Effect's complex generic types and overloads
export const compose = EffectPipe
export const pattern = EffectMatch
export const console = EffectConsole
export const Functional = EffectFunctional


/**
 * Functional utilities using Effect library
 * Provides Result patterns, exhaustive matching, and combinators
 */
import { Effect, pipe, Match, Option, Either } from "effect";

// =============================================================================
// Re-exports for convenience
// =============================================================================

export { Effect, pipe, Match, Option, Either };

// =============================================================================
// Result Type Aliases (Effect-style)
// =============================================================================

/**
 * A Result is an Effect that may fail with E or succeed with A
 * No dependencies (R = never)
 */
export type Result<A, E = never> = Effect.Effect<A, E>;

/**
 * An AsyncResult is a Promise-based Result
 */
export type AsyncResult<A, E = never> = Promise<Either.Either<A, E>>;

// =============================================================================
// Constructors
// =============================================================================

export const ok = <A>(value: A): Result<A, never> => Effect.succeed(value);
export const err = <E>(error: E): Result<never, E> => Effect.fail(error);
export const fromNullable = <A, E>(value: A | null | undefined, error: E): Result<A, E> =>
    value != null ? ok(value) : err(error);

// =============================================================================
// Pattern Matching Helpers
// =============================================================================

/**
 * Exhaustive pattern matching for tagged unions
 */
export const matchTag = <T extends { readonly _tag: string }>(value: T) =>
    Match.value(value);

/**
 * Match on Option type
 */
export const matchOption = <A, B>(
    option: Option.Option<A>,
    onNone: () => B,
    onSome: (a: A) => B
): B => Option.match(option, { onNone, onSome });

/**
 * Match on Either type
 */
export const matchEither = <L, R, B>(
    either: Either.Either<R, L>,
    onLeft: (l: L) => B,
    onRight: (r: R) => B
): B => Either.match(either, { onLeft, onRight });

// =============================================================================
// Combinators
// =============================================================================

/**
 * Sequence array of Effects into Effect of array
 */
export const all = <A, E>(effects: readonly Effect.Effect<A, E>[]): Effect.Effect<readonly A[], E> =>
    Effect.all(effects);

/**
 * Map over Effect value
 */
export const map = <A, B>(f: (a: A) => B) =>
    <E>(effect: Effect.Effect<A, E>): Effect.Effect<B, E> =>
        Effect.map(effect, f);

/**
 * FlatMap/chain Effects
 */
export const flatMap = <A, B, E2>(f: (a: A) => Effect.Effect<B, E2>) =>
    <E>(effect: Effect.Effect<A, E>): Effect.Effect<B, E | E2> =>
        Effect.flatMap(effect, f);

/**
 * Tap for side effects without changing value
 */
export const tap = <A>(f: (a: A) => void) =>
    <E>(effect: Effect.Effect<A, E>): Effect.Effect<A, E> =>
        Effect.tap(effect, (a) => {
            f(a);
            return Effect.void;
        });

// =============================================================================
// Async Helpers
// =============================================================================

/**
 * Run an Effect and return a Promise
 */
export const runAsync = <A, E>(effect: Effect.Effect<A, E>): Promise<Either.Either<A, E>> =>
    Effect.runPromise(Effect.either(effect));

/**
 * Run an Effect, throwing on error
 */
export const runUnsafe = <A, E>(effect: Effect.Effect<A, E>): Promise<A> =>
    Effect.runPromise(effect);

// =============================================================================
// Utility Types
// =============================================================================

export type Lazy<A> = () => A;
export type Predicate<A> = (a: A) => boolean;
export type Refinement<A, B extends A> = (a: A) => a is B;
