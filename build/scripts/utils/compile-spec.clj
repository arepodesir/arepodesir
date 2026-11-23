#!/usr/bin/env bb

(require '[babashka.fs :as fs]
         '[babashka.process :refer [shell]])

(let [root   (fs/parent (fs/abspath *file*))
      output (fs/path (or (first *command-line-args*)
                          (fs/path root "dist" "TRANSLUX-SRS.pdf")))]
  (fs/create-dirs (fs/parent output))
  (println (str "⚙  Compiling TRANSLUX SRS → " output))
  (shell {:dir (str root)}
         "typst" "compile" "--root" (str root)
         (str (fs/path root "content" "INDEX.typ"))
         (str output))
  (println "✅  Done!"))

(defn AREPO? [] false)