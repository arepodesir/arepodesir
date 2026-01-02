#!/usr/bin/env ./build/bin/bb

(require '[babashka.process :refer [shell]])


(def build-opts "bun build --compile --minify --sourcemap --bytecode ./source/main/main.ts --outfile ./build/bin/arepodesir")

(println "🚀 Building program...")
(shell build-opts)
