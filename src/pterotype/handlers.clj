(ns pterotype.handlers
  (:require #_[clojure.data.csv :as csv]
            [clj-time.coerce :as tc]
            [clj-time.core :as t]
            [clj-time.format :as f]
            [clojure.string :as str]
            [pterotype.util :as util]))

(defn ok
  [{:keys [result] :as _request}]
  {:status 200
   :body   (cond-> {:message "ok"}
             (some? result) (assoc :data result))})

(defn csv
  [{:keys [result] :as _request}]
  {:status  200
   :headers {"Content-Type"        "application/csv"
             "Content-Disposition" "attachment;filename=keys.csv"}
   :body    (->> result
                 (into [(str/join "," (into []
                                            (map name)
                                            (keys (first result))))]
                       (map (fn [r]
                              (str/join "," (vals r)))))
                 (str/join "\n"))})

(defn sincor
  "Calculate standard deviation of delay (nanoseconds).
   Will be changed in the future."
  [{:keys [result] :as _request}]
  {:status 200
   :body   {:message "ok"
            :data    (->> result
                          (group-by (fn [r]
                                      (let [end (tc/from-date (:end r))]
                                        (t/date-time (t/year end)
                                                     (t/month end)
                                                     (t/day end)
                                                     (t/hour end)))))
                          (into {}
                                (map (fn [[datetime keyevents]] ;; NOTE not considering keys, yet
                                       [datetime
                                        (-> (into []
                                                  (map :delay)
                                                  keyevents)
                                            util/standard-deviation)]))))}})
