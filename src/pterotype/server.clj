(ns pterotype.serverexample.server
  (:require [clojure.java.io :as io]
            [crux.api :as crux]
            [geheimtur.interceptor :as g]
            [muuntaja.interceptor]
            [pterotype.handlers :as h]
            [pterotype.interceptors :as i]
            [reitit.http :as http]
            [reitit.interceptor.sieppari]
            [reitit.ring :as ring]
            [ring.adapter.jetty :as jetty]))


;; [crux.kafka.embedded :as ek]
;; (defn start-embedded-kafka
;;   [kafka-port storage-dir]
;;   (ek/start-embedded-kafka {:crux.kafka.embedded/zookeeper-data-dir (str (io/file storage-dir "zk-data"))
;;                             :crux.kafka.embedded/kafka-log-dir      (str (io/file storage-dir "kafka-log"))
;;                             :crux.kafka.embedded/kafka-port         kafka-port}))
;; (defn start-node
;;   [kafka-port storage-dir]
;;   (crux/start-node {:crux.node/topology           '[crux.kafka/topology crux.kv.rocksdb/kv-store]
;;                     :crux.kafka/bootstrap-servers (str "localhost:" kafka-port)
;;                     :crux.kv/db-dir               (str (io/file storage-dir "db"))}))

(defn start-node ^crux.api.ICruxAPI
  [storage-dir]
  (crux/start-node {:crux.node/topology              '[crux.standalone/topology crux.kv.rocksdb/kv-store]
                    :crux.kv/db-dir                  (str (io/file storage-dir "db"))
                    :crux.kv/sync?                   true
                    :crux.standalone/event-log-dir   (str (io/file storage-dir "eventlog-1"))
                    :crux.standalone/event-log-sync? true}))

;; This is absolutely not the way I want to start a node. But
;; will probably tide me over for a while until using either
;; an external database or using Integrant to start the node.
(defonce node (start-node "resources/crux-store"))

(def app
  (http/ring-handler
    (http/router
      ["/api"
       {:interceptors [(i/db node)
                       i/auth
                       (i/guard #{:user :admin}
                                ;; unauthenticated
                                (g/access-forbidden-handler false)
                                ;; unauthorized
                                (g/access-forbidden-handler false :type :unauthorized))
                       i/query-string]}

       ["/keyevents"
        {:interceptors []
         :post         {:interceptors [i/tx-keyevents]
                        :handler      h/ok}
         :get          {:interceptors [i/q-keyevents]
                        :handler      h/ok}}]


       ["/buckets"
        {:interceptors []
         :get          {:interceptors [i/q-buckets]
                        :handler      h/ok}}]])

    (ring/create-default-handler)
    {:executor     reitit.interceptor.sieppari/executor
     :interceptors [(muuntaja.interceptor/format-interceptor)]}))

(defn start
  []
  (let [port (or (System/getenv "PORT") 3000)]
    (println "starting server on port" port)
    (jetty/run-jetty #'app {:port port, :join? false, :async? true})))

;; I also don't really like starting the server like this
(defonce server (start))

(comment
  (.stop server) ;; Should never need stop, just re-compile files, here for reference
  (.start server)



  ;; Tx a user
  (crux/submit-tx node
                  [[:crux.tx/put {:crux.db/id    :user/ben
                                  :user/name     "ben"
                                  :user/password "227spain"
                                  :user/roles         #{:user :admin}}]
                   [:crux.tx/put {:crux.db/id    :user/bill
                                  :user/name     "bill"
                                  :user/password "227spain"
                                  :user/roles         #{:user :admin}}]])
  (some-> (crux/q (crux/db node)
              '{:find  [?e ?n ?p ?r]
                :where [[?e :user/name ?n]
                        [?e :user/password ?p]
                        [?e :user/roles ?r]]
                :args  [{?n "ben1"}]})
      (->> (remove #(some nil? %)))
      (->> (partition-by first))
      first
      (as-> d
          {:user     (-> d first second)
           :password (-> d first (nth 2))
           :roles    (into #{}
                           (map last)
                           d)}))


  ;; get all buckets for user
  (->> (crux/q (crux/db node)
               {:find  '[?n ?b ?start ?end]
                :where '[[?u :crux.db/id ?uid]
                         [?u :user/name ?n]
                         [?b :bucket/user ?u]
                         [?b :bucket/start ?start]
                         [?b :bucket/end ?end]]
                :args  [{'?uid :user/ben}]})
       (into []
             (map (fn [[username bucket start end]]
                    {:user   username
                     :bucket bucket
                     :start  start
                     :end    end}))))

  ;; Get all keyevents that belong to a user with bucket time range
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
                :args  [{'?n "ben"}]})
       (into []
             ;; TODO need to aggregate delays on k1 & k2 and maybe start & end
             (map (fn [[_id key1 key2 delay start end username]]
                    {:key1    key1
                     :key2    key2
                     :delay   delay
                     :start   start
                     :end     end
                     :user    username}))))

  )

;; TODO api for csv
;; TODO api for sincore
;; TODO deploy
