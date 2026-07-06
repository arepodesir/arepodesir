#!/usr/bin/env bb

(require '[clojure.edn :as edn]
         '[clojure.string :as str]
         '[clojure.java.io :as io])

(defn load-config []
  (let [paths ["build/build.edn" "../build.edn" "build.edn"]
        file  (first (filter #(.exists (io/file %)) paths))]
    (if file
      (edn/read-string (slurp file))
      (throw (Exception. "build.edn not found!")))))

(defn assemble-route [route-key route-cfg defaults project-meta sync-ch]
  (let [
        name      (or (:target route-cfg) (name route-key))
        ext       (or (:extension route-cfg) (:extension defaults))
        out-dir   (or (:out route-cfg) (:out defaults))
        src-dir   (or (:src-dir route-cfg) (:src-dir defaults))
        sections  (:sections route-cfg)
        filename  (str name ext)
        dest-path (io/file out-dir filename)]

    (println (str "🔨 Building " filename "..."))

    (if (empty? sections)
      (println "  ⚠️ Skip: No sections defined.")
      (let [content (->> sections
                         (map #(let [f (io/file src-dir (str % ".md"))]
                                 (if (.exists f) 
                                   (str/trim (slurp f))
                                   (do (println "  Missing:" %) ""))))
                         (str/join "\n\n---\n\n"))
            
            ;; Metadata Headers
            id        (str (java.util.UUID/randomUUID))
            hash-val  (Integer/toHexString (hash content))
            header    (str "<!--\n"
                           "  project: " (:project project-meta) "\n"
                           "  author: " (:author project-meta) "\n"
                           "  build-label: " (:build-label project-meta) "\n"
                           "  uuid: " id "\n"
                           "  hash: " hash-val "\n"
                           "-->\n\n")]

        (io/make-parents dest-path)
        (spit dest-path (str header content "\n"))
        (println "  ✅ Success ->" (.getPath dest-path))))
    ;; signal finish for this route
    (deliver sync-ch true)))

(defn main []
  (let [config   (load-config)
        meta     (:metadata config)
        defaults (:defaults config)
        routes   (:routes config)
        route-count (count routes)
        sync-chans (repeatedly route-count promise)]

    (doseq [[idx [rk cfg]]
            (map-indexed vector routes)]
      (future (assemble-route rk cfg defaults meta (nth sync-chans idx))))


    (doseq [ch sync-chans] @ch)

    (println (str "\n🚀Build | " (:build-label meta)))
    (println (str "👤 Author: " (:author meta)))))

(main)