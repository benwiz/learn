(ns pterotype.ui
  (:require  [clojure.java.io :as io]))

(defn home
  [request]
  {:status 200
   :body   (slurp (io/resource "index.html"))})
