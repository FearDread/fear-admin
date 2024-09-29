import { createStore, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";
import { createLogger } from "redux-logger";
import rootReducer from "./reducer.jsx";
import StorePersist from "./persist.jsx";

const logger = createLogger();

let middleware = [thunk];
let configStore = applyMiddleware(...middleware);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

if (process.env.NODE_ENV === "development") {
  middleware = [...middleware, logger];
  configStore = composeEnhancers(applyMiddleware(...middleware));
}

const initialState = StorePersist.get("auth")
  ? { auth:StorePersist.get("auth") }
  : {};

const store = createStore(rootReducer, initialState, configStore);

export default store;