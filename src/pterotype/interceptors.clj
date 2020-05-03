(ns pterotype.interceptors
  (:require [clj-uuid :as uuid]
            [clojure.instant :as inst]
            [crux.api :as crux]))

(def auth
  {:enter (fn [ctx]
            ;; tmp auth fake
            (assoc ctx :auth (uuid/squuid)))})

(def db
  (fn [node]
    {:enter (fn [ctx]
              (assoc ctx :node node))
     :leave (fn [ctx]
              (assoc ctx :tx-result
                     (crux/submit-tx
                       (:node ctx)
                       (:tx ctx))))}))

(def keyevents
  {:enter (fn [{{body-params :body-params} :request
                user-id                    :auth
                :as                        ctx}]
            (let [{:keys [keyevents start end]} body-params
                  bucket-id                     (uuid/squuid)]
              (assoc ctx :tx
                     (into [[:crux.tx/put {:crux.db/id   bucket-id
                                           :bucket/start (inst/read-instant-date start)
                                           :bucket/end   (inst/read-instant-date end)
                                           :bucket/user  user-id}]]
                           (map (fn [{:keys [key1 key2 delay]}]
                                  [:crux.tx/put {:crux.db/id      (uuid/squuid)
                                                 :keyevent/bucket bucket-id
                                                 :keyevent/key1   key1
                                                 :keyevent/key2   key2
                                                 :keyevent/delay  delay}]))
                           keyevents))))})
