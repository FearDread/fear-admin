function App() {
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
      dispatch(load_UserProfile());
  
      // eslint-disable-next-line
    }, []);

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
}
    
export default App;