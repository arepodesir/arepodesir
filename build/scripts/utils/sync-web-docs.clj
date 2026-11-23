#!/usr/bin/env bb
;; ═══════════════════════════════════════════════════════════════════
;; sync-web-docs.clj — Sync docs from CODE repo to Astro site
;; ═══════════════════════════════════════════════════════════════════
;; Usage: bb sync-web-docs.clj
;; Reads .md/.MD files from /CODE/translux/docs/ and converts them
;; into Astro-compatible .mdx files in the Starlight content directory
;; at web/src/content/docs/reference/.
;;
;; Each file gets Astro frontmatter (title, description) prepended.
;; The original markdown body is preserved as-is.
;; ═══════════════════════════════════════════════════════════════════

(ns sync-web-docs
  (:require [babashka.fs :as fs]
            [clojure.string :as str]))

(def code-docs "/home/arepo/LOGOS/PRAGMA/CODE/translux/docs")
(def web-docs "/home/arepo/LOGOS/PRAGMA/CODE/translux/web/src/content/docs/reference")

;; Map filenames to clean Astro titles
(defn filename->title [fname]
  (-> fname
      (str/replace #"\.(md|MD)$" "")
      (str/replace #"[_-]" " ")
      (str/split #" ")
      (->> (map str/capitalize)
           (str/join " "))))

;; Generate Astro frontmatter
(defn make-frontmatter [title]
  (str "---\n"
       "title: \"" title "\"\n"
       "description: \"TRANSLUX documentation — " title "\"\n"
       "---\n\n"))

;; Strip existing frontmatter if present
(defn strip-frontmatter [content]
  (if (str/starts-with? content "---")
    (let [parts (str/split content #"---" 3)]
      (if (>= (count parts) 3)
        (str/trim (nth parts 2))
        content))
    content))

(println "🌐 TRANSLUX Web Docs Sync")
(println (str "  Source: " code-docs))
(println (str "  Target: " web-docs))
(println "────────────────────────────────────────")

(when-not (fs/exists? code-docs)
  (println "❌ Source docs directory not found!")
  (System/exit 1))

(fs/create-dirs web-docs)

(let [doc-files (fs/list-dir code-docs)
      synced (atom 0)]
  (doseq [src-path doc-files]
    (when (and (fs/regular-file? src-path)
              (re-matches #".*\.(md|MD)$" (str (fs/file-name src-path))))
      (let [fname (str (fs/file-name src-path))
            base-name (str/replace fname #"\.(md|MD)$" "")
            slug (str/lower-case base-name)
            dst-path (str web-docs "/" slug ".mdx")
            title (filename->title fname)
            content (slurp (str src-path))
            body (strip-frontmatter content)
            final (str (make-frontmatter title) body)]
        (spit dst-path final)
        (swap! synced inc)
        (println (str "  ✅ " fname " → reference/" slug ".mdx")))))
  (println "────────────────────────────────────────")
  (println (str "📦 Synced: " @synced " docs to Astro site"))
  (println "✅ Web docs sync complete!"))
