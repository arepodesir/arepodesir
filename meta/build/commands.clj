(ns commands
  (:require [build :as b]
            [utils :as u :refer [defcommand]]))

(defn- resolve-confs [args]
  (let [raw (if (seq args) args ["developer"])]
    (mapcat (fn [a]
              (if (= a "all")
                (u/list-conf-names)
                [(u/normalize-conf-name a)]))
            raw)))

(defcommand yaml:data:build
  "Build YAML data for one or more confs (default: developer)"
  [& args]
  (doseq [c (resolve-confs args)]
    (b/yaml:data:build c (u/now-stamp) "resume")))

(defcommand typst:pdf:compile
  "Compile Typst PDF for one or more confs (default: developer)"
  [& args]
  (doseq [c (resolve-confs args)]
    (b/typst:pdf:compile c (u/now-stamp) "resume")))

(defcommand typst:img:render
  "Render PNG images from compiled Typst for one or more confs (default: developer)"
  [& args]
  (doseq [c (resolve-confs args)]
    (b/typst:img:render c (u/now-stamp) "resume")))

(defcommand typst:html:export
  "Export HTML from compiled Typst for one or more confs (default: developer)"
  [& args]
  (doseq [c (resolve-confs args)]
    (b/typst:html:export c (u/now-stamp) "resume")))

(defcommand resume:all:build
  "Run full pipeline (yaml -> pdf -> img -> html) for one or more confs or 'all' (default: developer)"
  [& args]
  (doseq [c (resolve-confs args)]
    (b/resume:all:build c "resume")))
