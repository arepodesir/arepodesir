#!/usr/bin/env bb

(require '[clojure.string :as str]
         '[babashka.fs :as fs])

(def root (fs/parent (fs/parent (fs/abspath *file*))))
(def bib-path (fs/file root "BIBLIOGRAPHY.bib"))
(def readme-path (fs/file root "README.md"))

(defn clean-val [v]
  (-> v
      (str/replace #"\\url\{([^}]+)\}" "$1")
      (str/replace #"^\{(.*)\}$" "$1")
      (str/replace #"\s+" " ")
      str/trim))

(defn parse-bib [content]
  (let [entry-re #"@\w+\{([^,]+),([^@]+)"
        field-re #"(\w+)\s*=\s*\{((?:[^{}]|\{[^{}]*\})*)\}"]
    (for [[_ _ body] (re-seq entry-re content)
          :let [fields (into {} (for [[_ k v] (re-seq field-re body)]
                                  [(str/trim k) (clean-val v)]))]
          :when (get fields "title")]
      fields)))

(defn entry->md [{:strs [title author howpublished note]}]
  (let [author-part (if author (str " *" author ".*") "")
        title-md (if (seq howpublished) (format "[%s](%s)" title howpublished) (format "**%s**" title))
        note-part (if note (str " — _" note "_") "")]
    (str "- " title-md author-part note-part)))

(defn generate-section [entries]
  (let [header ["## 📚 Bibliography & Resources"
                ""
                "The following sources directly inform the design constraints and solidarity mission of this project."
                "Full machine-readable citations are in **[BIBLIOGRAPHY.bib](BIBLIOGRAPHY.bib)**."
                ""]]
    (str (str/join "\n" header)
         (str/join "\n" (map entry->md entries))
         "\n\n")))

(defn update-readme! [path new-section]
  (let [readme (slurp path)
        start-re #"(?m)^## 📚 Bibliography.*$"
        end-re #"(?m)\n---\n\n## 📜"]
    (if-let [start-match (re-find start-re readme)]
      (let [start-idx (.indexOf readme start-match)
            tail (subs readme start-idx)
            end-match (re-find end-re tail)
            end-idx (if end-match (+ start-idx (.indexOf tail end-match) 1) (count readme))
            updated (str (subs readme 0 start-idx) new-section (subs readme end-idx))]
        (spit path updated))
      (do (binding [*out* *err*] (println "Could not find Bibliography section in README.md"))
          (System/exit 1)))))

(let [entries (parse-bib (slurp bib-path))]
  (update-readme! readme-path (generate-section entries))
  (println (format "✅ Bibliography section updated — %d entries written." (count entries))))
