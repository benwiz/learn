(ns pterotype.interceptors
  (:require [clj-uuid :as uuid]
            [clojure.instant :as inst]
            [clojure.walk :refer [keywordize-keys]]
            [crux.api :as crux]
            [geheimtur.impl.http-basic :as g-http-basic]
            [geheimtur.util.auth :as g-auth])
  (:import [org.eclipse.jetty.util UrlEncoded MultiMap]))

(defn parse-query-string
  [query]
  (let [params (MultiMap.)]
    (UrlEncoded/decodeTo query params "UTF-8")
    (into {}
          ;; For some reason values are lists
          (map (fn [[k v]]
                 [k (first v)]))
          params)))

;; don't use this, use input coersion
#_(def query-string
  {:enter (fn [{:keys [request] :as context}]
            (assoc-in context [:request :query-params]
                      (some-> (:query-string request)
                              parse-query-string
                              keywordize-keys)))})

(def db
  (fn [node]
    {:enter (fn [ctx]
              (assoc ctx :node node))
     :leave (fn [ctx]
              (if (:tx ctx)
                (assoc ctx :tx-result
                       (crux/submit-tx
                         (:node ctx)
                         (:tx ctx)))
                ctx))}))

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
                                    {:id       (-> d first first)
                                     :user     (-> d first second)
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

(def auth-key
  "Hijack some geheimtur features while bypassing Pedestal interceptors.
   See g/http-basic to see Pedestal implementation."
  {:enter (fn [{request :request :as context}]
            (if-not (g-auth/authenticated? request)
              (if (-> request :headers (get "x-pterotype-api-key") (= "mysupersecretkey"))
                (assoc context :request
                       (g-auth/authenticate request {:user  :user/api-key-admin
                                                     :roles #{:user :admin}}))
                context)
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

(def tx-keyevents
  {:enter (fn [{{body-params                              :body-params
                 {identity :geheimtur.util.auth/identity} :session} :request
                :as                                                 ctx}]
            (let [{:keys [keyevents start end]} body-params
                  bucket-id                     (uuid/squuid)
                  user-id                       (-> identity :id)]
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

(def q-keyevents
  {:enter (fn [{{{identity :geheimtur.util.auth/identity} :session} :request
                node                                                :node
                :as                                                 ctx}]
            (let [user (:id identity)]
              (assoc-in ctx [:request :result]
                     (->> (crux/q (crux/db node)
                                  {:find  '[?e ?k1 ?k2 ?d ?start ?end ?n]
                                   :where '[[?u :crux.db/id ?uid]
                                            [?u :user/name ?n]
                                            [?b :bucket/user ?u]
                                            [?b :bucket/start ?start]
                                            [?b :bucket/end ?end]
                                            [?e :keyevent/bucket ?b]
                                            [?e :keyevent/key1 ?k1]
                                            [?e :keyevent/key2 ?k2]
                                            [?e :keyevent/delay ?d]]
                                   :args  [{'?uid user}]})
                          (into []
                                (map (fn [[_ key1 key2 delay start end username]]
                                       {:key1  key1
                                        :key2  key2
                                        :delay delay
                                        :start start
                                        :end   end
                                        :user  username})))))))})

(def q-buckets
  {:enter (fn [{{{identity :geheimtur.util.auth/identity} :session} :request
                node                                                :node
                :as                                                 ctx}]
            (let [user (:id identity)]
              (assoc-in ctx [:request :result]
                     (->> (crux/q (crux/db node)
                                  {:find  '[?n ?b ?start ?end]
                                   :where '[[?u :crux.db/id ?uid]
                                            [?u :user/name ?n]
                                            [?b :bucket/user ?u]
                                            [?b :bucket/start ?start]
                                            [?b :bucket/end ?end]]
                                   :args  [{'?uid user}]})
                          (into []
                                (map (fn [[username bucket start end]]
                                       {:user   username
                                        :bucket bucket
                                        :start  start
                                        :end    end})))))))})

(def tx-users
  {:enter (fn [{{body-params                              :body-params
                 #_#_{identity :geheimtur.util.auth/identity} :session} :request
                :as                                                 ctx}]
            (let [{:keys [users]} body-params]
              (prn "tx")
              (assoc ctx :tx
                     (into []
                           (map (fn [{:keys [name password]}]
                                  [:crux.tx/put {:crux.db/id    (keyword "user" name)
                                                 :user/name     name
                                                 :user/password password
                                                 :user/roles    #{:user :admin}}]))
                           users))))})
