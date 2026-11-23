#!/usr/bin/env bb
;; ═══════════════════════════════════════════════════════════════════
;; sync-spec.clj — Sync IEEE-830 Spec from SOFTWARE/TRANSLUX to CODE
;; ═══════════════════════════════════════════════════════════════════
;; Usage: bb sync-spec.clj
;; Syncs spec/*.typ and spec/bib files from the canonical SOFTWARE
;; repo to the CODE repo, ensuring the implementation always has
;; an up-to-date copy of the specification.
;; ═══════════════════════════════════════════════════════════════════

(ns sync-spec
  (:require [babashka.fs :as fs]
            [clojure.string :as str]))

(def software-dir "/home/arepo/LOGOS/PRAGMA/SOFTWARE/TRANSLUX")
(def code-dir "/home/arepo/LOGOS/PRAGMA/CODE/translux")
(def spec-src (str software-dir "/spec"))
(def spec-dst (str code-dir "/spec"))

(println "🔄 TRANSLUX Spec Sync")
(println (str "  Source: " spec-src))
(println (str "  Target: " spec-dst))
(println "────────────────────────────────────────")

;; Verify source exists
(when-not (fs/exists? spec-src)
  (println "❌ Source spec directory not found!")
  (System/exit 1))

;; Create target if missing
(fs/create-dirs spec-dst)

;; Sync all files
(let [spec-files (fs/glob spec-src "**/*" {:hidden false})
      copied (atom 0)
      skipped (atom 0)]
  (doseq [src-path spec-files]
    (when (fs/regular-file? src-path)
      (let [rel (str (fs/relativize spec-src src-path))
            dst-path (str spec-dst "/" rel)
            dst-dir (fs/parent (fs/path dst-path))]
        ;; Create parent dirs
        (when dst-dir (fs/create-dirs dst-dir))
        ;; Copy if source is newer or target doesn't exist
        (if (or (not (fs/exists? dst-path))
                (pos? (compare (fs/last-modified-time src-path)
                               (fs/last-modified-time dst-path))))
          (do
            (fs/copy src-path dst-path {:replace-existing true})
            (swap! copied inc)
            (println (str "  ✅ " rel)))
          (do
            (swap! skipped inc))))))
  (println "────────────────────────────────────────")
  (println (str "📦 Synced: " @copied " files | Skipped: " @skipped " (up-to-date)"))
  (println "✅ Spec sync complete!"))
