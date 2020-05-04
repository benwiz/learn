(ns pterotype.core
  (:require [pterotype.server :as server]))

(defn -main
  []
  (server/start))
