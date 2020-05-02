(ns pterotype.interceptors
  (:require [clj-uuid :as uuid]
            [clojure.instant :as inst]
            [crux.api :as crux]))

(def auth
  {:enter (fn [ctx] ctx)
   :leave (fn [ctx] ctx)})

(def db
  (fn [node]
    {:enter (fn [ctx]
              (assoc ctx :node node))
     :leave (fn [ctx]
              (prn "tx" (:tx ctx))
              (assoc ctx :tx-result
                     (crux/submit-tx
                       (:node ctx)
                       (:tx ctx))))}))

(def keyevents
  {:enter (fn [{{body-params :body-params} :request
                :as                        ctx}]
            (let [{:keys [keyevents start end]} body-params
                  bucket-id                     (uuid/squuid)]
              (prn "bucket-id" bucket-id)
              (assoc ctx :tx
                     (into [[:crux.tx/put {:crux.db/id   bucket-id
                                           :bucket/start (inst/read-instant-date start)
                                           :bucket/end   (inst/read-instant-date end)}]]
                           (map (fn [{:keys [key1 key2 delay]}]
                                  [:crux.tx/put {:crux.db/id      (uuid/squuid)
                                                 :keyevent/bucket bucket-id
                                                 :keyevent/key1   key1
                                                 :keyevent/key2   key2
                                                 :keyevent/delay  delay}]))
                           keyevents))))})
