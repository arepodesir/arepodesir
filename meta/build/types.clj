(ns types)

(defrecord ConfContext [conf-name template ts version data-hash resolved out-dir yaml-path])

(defrecord BuildResult [conf template version hash generated-at status output])

(defrecord CommandMeta [name doc args-spec])

(defn make-conf-context
  [{:keys [conf-name template ts version data-hash resolved out-dir yaml-path]}]
  (->ConfContext conf-name (or template "resume") ts version data-hash resolved out-dir yaml-path))

(defn make-build-result
  [{:keys [conf template version hash generated-at status output]}]
  (->BuildResult conf (or template "resume") version hash generated-at (or status "generated") output))
