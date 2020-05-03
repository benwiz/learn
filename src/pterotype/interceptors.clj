(ns pterotype.interceptors
  (:require [clj-uuid :as uuid]
            [clojure.instant :as inst]
            [crux.api :as crux]
            [geheimtur.util.auth :as g-auth]
            [geheimtur.impl.http-basic :as g-http-basic]))

(def db
  (fn [node]
    {:enter (fn [ctx]
              (assoc ctx :node node))
     :leave (fn [ctx]
              (assoc ctx :tx-result
                     (crux/submit-tx
                       (:node ctx)
                       (:tx ctx))))}))

(defn credentials
  [node]
  (fn [_ {:keys [username password]}]
    (when-let [identity (some-> (crux/q (crux/db node)
                                        {:find  '[?e ?n ?p ?r]
                                         :where '[[?e :user/name ?n]
                                                  [?e :user/password ?p]
                                                  [?e :user/roles ?r]]
                                         :args  [{'?n username}]})
                                (->> (remove #(some nil? %)))
                                (->> (partition-by first))
                                first
                                (as-> d
                                    {:user     (-> d first second)
                                     :password (-> d first (nth 2))
                                     :roles    (into #{}
                                                     (map last)
                                                     d)}))]
      (when (= password (:password identity))
        (dissoc identity :password)))))

(def auth
  "Hijack some geheimtur features while bypassing Pedestal interceptors.
   See g/http-basic to see Pedestal implementation."
  {:enter (fn [{request :request :as context}]
            (if-not (g-auth/authenticated? request)
              (g-http-basic/http-basic-authenticate context (credentials (:node context)))
              context))})

(def guard
  "Hijack some geheimtur features while bypassing Pedestal interceptors.
   See g/guard to see Pedestal implementation."
  (fn [roles unauthorized-fn unauthenticated-fn]
    {:enter (fn [{request :request :as context}]
              (if (g-auth/authenticated? request)
                (if-not (or (empty? roles)
                            (g-auth/authorized? request roles))
                  (unauthorized-fn context)
                  context)
                (unauthenticated-fn context)))}))

(def keyevents
  {:enter (fn [{{body-params :body-params} :request
                ;; user-id                    :auth
                :as                        ctx}]
            (let [{:keys [keyevents start end]} body-params
                  bucket-id                     (uuid/squuid)
                  user-id (uuid/squuid)]
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
