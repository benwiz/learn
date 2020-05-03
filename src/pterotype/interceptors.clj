(ns pterotype.interceptors
  (:require [clj-uuid :as uuid]
            [clojure.instant :as inst]
            [crux.api :as crux]
            [geheimtur.util.auth :as g-auth]
            [geheimtur.impl.http-basic :as g-http-basic]))

(def users
  "A sample user store."
  {"ben"  {:display-name "Ben Wiz"
           :password     "secret"
           :roles        #{:user}} ;; must be a set
   "bill" {:display-name "Bill Wiz"
           :password     "secret"
           :roles        #{:admin}}})

(defn credentials
  [_ {:keys [username password]}]
  (when-let [identity (get users username)]
    (when (= password (:password identity))
      (dissoc identity :password))))

(def auth
  "Hijack some geheimtur features while bypassing Pedestal interceptors.
   See g/http-basic to see Pedestal implementation."
  {:enter (fn [{request :request :as context}]
            (if-not (g-auth/authenticated? request)
              (g-http-basic/http-basic-authenticate context credentials)
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
