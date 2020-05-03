(ns pterotype.handlers
  (:require #_[clojure.data.csv :as csv]
            [clojure.string :as str]))

(defn ok
  [{:keys [result] :as _request}]
  {:status 200
   :body   (cond-> {:message "ok"}
             (some? result) (assoc :data result))})

(defn csv
  [{:keys [result] :as _request}]
  {:status              200
   :headers {"Content-Type"        "application/csv"
             "Content-Disposition" "attachment;filename=keys.csv"}
   :body                (->> result
                             (into [(str/join "," (into []
                                                        (map name)
                                                        (keys (first result))))]
                                   (map (fn [r]
                                          (str/join "," (vals r)))))
                             (str/join "\n"))})

(defn sincor
  [{:keys [result] :as _request}]
  {:status 200
   :body   {:sincor [{:timestamp #inst "2020-05-03T20:58:33.719-00:00"
                      :sincor    4.32}]}})
