(ns build
  (:require [babashka.fs :as fs]
            [clj-yaml.core :as yaml]
            [types :as t]
            [utils :as u]))

(defn prepare-context
  ([conf-name] (prepare-context conf-name (u/now-stamp) "resume"))
  ([conf-name ts] (prepare-context conf-name ts "resume"))
  ([conf-name ts template]
   (let [data-modules (u/load-data-modules)
         conf (u/load-edn (str u/confs-dir "/" conf-name ".edn"))
         resolved (u/resolve-refs conf data-modules)
         version (u/conf-version resolved)
         data-hash (u/sha256-short (pr-str resolved))
         out-dir (u/dist-conf-dir conf-name version)
         yaml-path (str out-dir "/" conf-name "-" ts ".yaml")]
     (t/make-conf-context
      {:conf-name conf-name
       :template (or template "resume")
       :ts ts
       :version version
       :data-hash data-hash
       :resolved resolved
       :out-dir out-dir
       :yaml-path yaml-path}))))

(defn yaml:data:build
  ([conf-name] (yaml:data:build conf-name (u/now-stamp) "resume"))
  ([conf-name ts] (yaml:data:build conf-name ts "resume"))
  ([conf-name ts template]
   (let [{:keys [version data-hash resolved out-dir yaml-path]} (prepare-context conf-name ts template)
         generated-at (str (java.time.OffsetDateTime/now))
         enriched (assoc resolved :build {:version version
                                          :hash data-hash
                                          :template (or template "resume")
                                          :generated-at generated-at
                                          :status "generated"})]
     (fs/create-dirs out-dir)
     (spit yaml-path (yaml/generate-string enriched :dumper-options {:flow-style :block}))
     (println (format "Built YAML: %s (version=%s, hash=%s, status=generated, date=%s)"
                      yaml-path version data-hash generated-at))
     (t/make-build-result
      {:conf conf-name
       :template template
       :version version
       :hash data-hash
       :generated-at generated-at
       :status "generated"
       :output yaml-path}))))

(defn- ensure-yaml! [conf-name ts template]
  (let [ctx (prepare-context conf-name ts template)]
    (when-not (fs/exists? (:yaml-path ctx))
      (yaml:data:build conf-name ts template))
    ctx))

(defn typst:pdf:compile
  ([conf-name] (typst:pdf:compile conf-name (u/now-stamp) "resume"))
  ([conf-name ts] (typst:pdf:compile conf-name ts "resume"))
  ([conf-name ts template]
   (let [{:keys [out-dir yaml-path]} (ensure-yaml! conf-name ts template)
         pdf-path (str out-dir "/" conf-name "-" ts ".pdf")]
     (fs/create-dirs out-dir)
     (u/run-typst! {:yaml-path yaml-path :template template :out-path pdf-path :extra-args []})
     (println "Compiled PDF:" pdf-path)
     pdf-path)))

(defn typst:img:render
  ([conf-name] (typst:img:render conf-name (u/now-stamp) "resume"))
  ([conf-name ts] (typst:img:render conf-name ts "resume"))
  ([conf-name ts template]
   (let [{:keys [out-dir yaml-path]} (ensure-yaml! conf-name ts template)
         img-pattern (str out-dir "/" conf-name "-" ts "-{p}.png")]
     (fs/create-dirs out-dir)
     (u/run-typst! {:yaml-path yaml-path
                    :template template
                    :out-path img-pattern
                    :extra-args ["--format" "png" "--ppi" "144"]})
     (println "Rendered PNGs in:" out-dir)
     out-dir)))

(defn typst:html:export
  ([conf-name] (typst:html:export conf-name (u/now-stamp) "resume"))
  ([conf-name ts] (typst:html:export conf-name ts "resume"))
  ([conf-name ts template]
   (let [{:keys [out-dir yaml-path]} (ensure-yaml! conf-name ts template)
         html-path (str out-dir "/" conf-name "-" ts ".html")]
     (fs/create-dirs out-dir)
     (u/run-typst! {:yaml-path yaml-path
                    :template template
                    :out-path html-path
                    :extra-args ["--features" "html" "--format" "html" "--input" "format=html"]})
     (println "Exported HTML:" html-path)
     html-path)))

(defn resume:all:build
  ([conf-name] (resume:all:build conf-name "resume"))
  ([conf-name template]
   (let [ts (u/now-stamp)]
     (yaml:data:build conf-name ts template)
     (typst:pdf:compile conf-name ts template)
     (typst:img:render conf-name ts template)
     (typst:html:export conf-name ts template))))
