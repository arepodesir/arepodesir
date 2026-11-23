(ns commands
  (:require [build :as b]
            [utils :refer [defcommand]]))

(defcommand yaml:data:build
  "Build YAML data for a conf (default: developer) and optional template (default: resume)"
  [& [conf template]]
  (b/yaml:data:build (or conf "developer") (utils/now-stamp) (or template "resume")))

(defcommand typst:pdf:compile
  "Compile Typst PDF for a conf (default: developer) and optional template (default: resume)"
  [& [conf template]]
  (b/typst:pdf:compile (or conf "developer") (utils/now-stamp) (or template "resume")))

(defcommand typst:img:render
  "Render PNG images from compiled Typst for a conf (default: developer) and optional template (default: resume)"
  [& [conf template]]
  (b/typst:img:render (or conf "developer") (utils/now-stamp) (or template "resume")))

(defcommand typst:html:export
  "Export HTML from compiled Typst for a conf (default: developer) and optional template (default: resume)"
  [& [conf template]]
  (b/typst:html:export (or conf "developer") (utils/now-stamp) (or template "resume")))

(defcommand resume:all:build
  "Run full pipeline (yaml -> pdf -> img -> html) for a conf or 'all' (default: developer)"
  [& [arg template]]
  (let [target (or arg "developer")
        tmpl (or template "resume")]
    (if (= target "all")
      (doseq [c ["developer" "csr" "it" "pianist"]]
        (b/resume:all:build c tmpl))
      (b/resume:all:build target tmpl))))
