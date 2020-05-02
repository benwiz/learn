(ns pterotype.handlers)

(defn ok
  [{:keys [_body-params] :as _request}]
  {:status 200
   :body   {:message "ok"}})
