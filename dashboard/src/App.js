import React, { useEffect, useState, Suspense } from "react";
import { Route, Routes as ReactRoutes } from 'react-router-dom';
import AuthLayout from "layouts/Auth/Auth.js";
import AdminLayout from "layouts/Admin/Admin.js";
import ProtectedRoute from "_routes/ProtectedRoute";

function App() {
  const location = useLocation();
  const history = useHistory();
  const { isLoggedIn } = useSelector((state) => state.auth);


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
    */

    React.useEffect(() => {
      console.log("is Authorized = " , isLoggedIn);
  
     if (isLoggedIn) {
        history.push("/admin/dashboard");
     }
  
    }, [history, isLoggedIn]);
  
    return (
      <Suspense fallback={<Loader />}>
        <ReactRoutes>
          <Route path="/auth" element={(props) => <AuthLayout {...props} />} />
          <ProtectedRoute path="/admin"
            isPublic={false} 
            isAuthorized={isLoggedIn}   
            element={<AdminLayout {...props} />} />
        </ReactRoutes>
      </Suspense>
    );
}   
 

export default App;