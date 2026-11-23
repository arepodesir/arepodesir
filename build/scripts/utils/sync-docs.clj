#!/usr/bin/env bb
;; ═══════════════════════════════════════════════════════════════════
;; sync-docs.clj — Sync Docs from SOFTWARE/TRANSLUX/docs to CODE
;; ═══════════════════════════════════════════════════════════════════
;; Usage: bb sync-docs.clj
;; Copies documentation files (ARCHITECTURE, CONTRIBUTING, SECURITY,
;; ROADMAP, CHANGELOG, README, etc.) from the canonical SOFTWARE repo
;; to the CODE repo's docs/ directory.
;; ═══════════════════════════════════════════════════════════════════

(ns sync-docs
  (:require [babashka.fs :as fs]
            [clojure.string :as str]))

(def software-docs "/home/arepo/LOGOS/PRAGMA/SOFTWARE/TRANSLUX/docs")
(def code-docs "/home/arepo/LOGOS/PRAGMA/CODE/translux/docs")

;; Only sync these extensions
(def allowed-exts #{".md" ".MD" ".bib" ".txt"})

(println "📄 TRANSLUX Docs Sync")
(println (str "  Source: " software-docs))
(println (str "  Target: " code-docs))
(println "────────────────────────────────────────")

(when-not (fs/exists? software-docs)
  (println "❌ Source docs directory not found!")
  (System/exit 1))

(fs/create-dirs code-docs)

(let [doc-files (fs/list-dir software-docs)
      copied (atom 0)
      skipped (atom 0)]
  (doseq [src-path doc-files]
    (when (fs/regular-file? src-path)
      (let [fname (str (fs/file-name src-path))
            ext (when (str/includes? fname ".")
                  (str "." (last (str/split fname #"\."))))
            dst-path (str code-docs "/" fname)]
        (if (or (nil? ext) (contains? allowed-exts ext))
          (if (or (not (fs/exists? dst-path))
                  (pos? (compare (fs/last-modified-time src-path)
                                 (fs/last-modified-time dst-path))))
            (do
              (fs/copy src-path dst-path {:replace-existing true})
              (swap! copied inc)
              (println (str "  ✅ " fname)))
            (swap! skipped inc))
          (swap! skipped inc)))))
  (println "────────────────────────────────────────")
  (println (str "📦 Synced: " @copied " files | Skipped: " @skipped))
  (println "✅ Docs sync complete!"))
