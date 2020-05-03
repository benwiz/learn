(ns pterotype.handlers)

(defn ok
  [{:keys [result] :as _request}]
  {:status 200
   :body   (cond-> {:message "ok"}
             (some? result) (assoc :data result))})
