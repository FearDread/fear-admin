import { createStore, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";
import { createLogger } from "redux-logger";
import rootReducer from "./reducer.jsx";
import cache from "../cache/cache.jsx";

const storage = cache({type: 'local'})
const logger = createLogger();

let middleware = [thunk];
let configStore = applyMiddleware(...middleware);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

if (process.env.NODE_ENV === "development") {
  middleware = [...middleware, logger];
  configStore = composeEnhancers(applyMiddleware(...middleware));
}

const initialState = { 
  auth: storage.get("auth") ? storage.get("auth") : {},
  cart: storage.get("cart") ? storage.get("cart") : {} 
};

const store = createStore(rootReducer, initialState, configStore);

export default store;