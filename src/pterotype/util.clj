(ns pterotype.util)

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
