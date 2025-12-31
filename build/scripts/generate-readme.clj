#!/usr/bin/env ./build/bin/bb

(require '[babashka.process :refer [shell]])

(println "🚀 Generating README...")
(shell "bun run source/main/main.ts")
