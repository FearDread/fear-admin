import React, { useEffect, useState, Suspense } from "react";
import { Redirect } from "react-router-dom";
import { Router as RouterHistory } from "react-router-dom";
import Router from "router";
import history from "_utils/history";
import store from "_redux/store";
import { Provider } from "react-redux";

function App() {

    /*
    const [stripeApiKey, setStripeApiKey] = useState("");
  
    const dispatch = useDispatch();
  
    // get STRIPE_API_KEY for payment from backend for connection to stripe payment gateway
    async function getStripeApiKey() {
      try {
        const { data } = await axios.get("/api/v1/stripeapikey");
        if (
          data.stripeApiKey !== undefined &&
          data.stripeApiKey !== null &&
          data.stripeApiKey !== ""
        ) {
          sessionStorage.setItem(
            "stripeApiKey",
            JSON.stringify(data.stripeApiKey)
          );
        }
        setStripeApiKey(data.stripeApiKey);
      } catch (error) {
        // Handle error if the API call fails
        console.error("Error fetching Stripe API key:", error);
      }
    }
  
    useEffect(() => {
      const stripeApiKey = sessionStorage.getItem("stripeApiKey");
      if (stripeApiKey) {
        setStripeApiKey(stripeApiKey);
      } else {
        getStripeApiKey();
      }
      // eslint-disable-next-line
    }, []);
  
    useEffect(() => {
      //dispatch(load_UserProfile());
  
      // eslint-disable-next-line
    }, []);

    /*
    return (
        <Switch>
        <Route path="/auth" render={(props) => <AuthLayout {...props} />} />
        <PrivateRoute 
          isAdmin={true}
          path="/admin" 
          component={(props) => <AdminLayout {...props} />} />
        <Route path="/rtl" render={(props) => <RTLLayout {...props} />} />
        <Redirect from="/*" to="/admin/dashboard" />
      </Switch>
    );
    */
    return (
      <RouterHistory history={history}>
        <Provider store={store}>
          <Router />

        </Provider>
      </RouterHistory>
    );
}
    
export default App;