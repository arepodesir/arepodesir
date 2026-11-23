(ns utils
  (:require [babashka.fs :as fs]
            [babashka.process :as proc]
            [clojure.edn :as edn]
            [clojure.string :as str]
            [clojure.walk :as walk]))

(def root-dir "/home/arepo/Documents/SOFTWARE/AREPODESIR/meta")
(def confs-dir (str root-dir "/confs"))
(def data-dir (str root-dir "/data"))
(def dist-dir (str root-dir "/dist"))
(def templates-dir (str root-dir "/templates"))

(defmacro defcommand
  "Defines a Babashka CLI command function with metadata and standard arg parsing."
  [sym doc-str params & body]
  `(defn ~(with-meta sym {:doc doc-str :command true})
     ~params
     ~@body))

(defn load-edn [path]
  (edn/read-string (slurp path)))

(defn load-data-modules
  "Loads all .edn files from data-dir into a map keyed by filename keyword."
  []
  (into {}
        (for [f (fs/glob data-dir "*.edn")
              :let [k (keyword (fs/strip-ext (fs/file-name f)))]]
          [k (load-edn (str f))])))

(defn- resolve-keyword-ref
  "Resolves a keyword reference, supporting :module/key or top-level module key."
  [k parent-key data-modules]
  (if-let [ns-part (namespace k)]
    (get-in data-modules [(keyword ns-part) (keyword (name k))])
    (or (when parent-key (get-in data-modules [parent-key k]))
        (get data-modules k))))

(defn resolve-refs
  "Resolves keyword references, [module key] pairs, and ordered key-vector selections against data modules."
  [conf data-modules]
  (walk/postwalk
   (fn [node]
     (if (map? node)
       (into {}
             (map (fn [[k v]]
                    [k (cond
                         ;; Explicit [module key] pair
                         (and (vector? v) (= 2 (count v)) (every? keyword? v)
                              (contains? data-modules (first v)))
                         (get-in data-modules v)

                         ;; Vector of keyword references (supports :key or :module/key)
                         (and (vector? v) (seq v) (every? keyword? v)
                              (or (map? (get data-modules k))
                                  (some namespace v)))
                         (mapv #(or (resolve-keyword-ref % k data-modules) %) v)

                         ;; Single keyword reference
                         (and (keyword? v)
                              (some? (resolve-keyword-ref v k data-modules)))
                         (resolve-keyword-ref v k data-modules)

                         :else v)])
                  node))
       node))
   conf))

(defn conf-version [resolved]
  (str "v" (get-in resolved [:metadata :mach] "1.0")))

(defn sha256-short [s]
  (let [digest (.digest (java.security.MessageDigest/getInstance "SHA-256") (.getBytes s "UTF-8"))]
    (subs (apply str (map #(format "%02x" %) digest)) 0 8)))

(defn dist-conf-dir [conf-name version]
  (str dist-dir "/" conf-name "/" version))

(defn now-stamp []
  (.format (java.time.LocalDateTime/now)
           (java.time.format.DateTimeFormatter/ofPattern "yyyyMMdd-HHmmss")))

(defn template-entry [template-name]
  (str templates-dir "/" (or template-name "resume") "/index.typ"))

(defn run-typst!
  "Executes typst compile with common root and data input flags."
  [{:keys [yaml-path template out-path extra-args]}]
  (let [rel-yaml (str/replace yaml-path (str root-dir "/") "")
        args (concat ["typst" "compile" "--root" root-dir]
                     extra-args
                     ["--input" (str "data=" rel-yaml)
                      (template-entry template)
                      out-path])]
    (apply proc/shell {:dir root-dir} args)))
