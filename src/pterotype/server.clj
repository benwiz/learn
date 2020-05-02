(ns pterotype.serverexample.server
  (:require [clojure.java.io :as io]
            [crux.api :as crux]
            [muuntaja.interceptor]
            [pterotype.handlers :as h]
            [pterotype.interceptors :as i]
            [reitit.http :as http]
            [reitit.interceptor.sieppari]
            [reitit.ring :as ring]
            [ring.adapter.jetty :as jetty]))


(defn start-standalone-node ^crux.api.ICruxAPI [storage-dir]
  (crux/start-node {:crux.node/topology '[crux.standalone/topology]
                    :crux.kv/db-dir     (str (io/file storage-dir "db"))}))

;; This is absolutely not the way I want to start a node. But
;; will probably tide me over for a while until using either
;; an external database or using Integrant to start the node.
(defonce node (start-standalone-node "crux-store"))

(def app
  (http/ring-handler
    (http/router
      ["/api"
       {:interceptors [i/auth (i/db node)]}

       ["/keyevents"
        {:interceptors []
         :post         {:interceptors [i/keyevents]
                        :handler      h/ok}}]])

    (ring/create-default-handler)
    {:executor     reitit.interceptor.sieppari/executor
     :interceptors [(muuntaja.interceptor/format-interceptor)]}))

(defn start
  []
  (let [port (or (System/getenv "PORT") 3000)]
    (println "starting server on port" port)
    (jetty/run-jetty #'app {:port port, :join? false, :async? true})))

(comment

  (def server (start))
  (.stop server) ;; Should never need stop, just re-compile files, here for reference

  ;; Get all keyevents that belong to a bucket.
  ;; It seems a little hacky to do it like this but I see nothing like a datoms call.
  (crux/q (crux/db node)
          '{:find  [?k1 ?k2 ?d ?start ?end]
            :where [[?e :keyevent/key1 ?k1]
                    [?e :keyevent/key2 ?k2]
                    [?e :keyevent/delay ?d]
                    [?e :keyevent/bucket ?b]
                    [?b :bucket/start ?start]
                    [?b :bucket/end ?end]]})
  )
