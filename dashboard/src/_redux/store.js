import { createStore, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";
import { createLogger } from "redux-logger";
import { ACCESS_TOKEN_NAME } from "../variables/api.js";

import rootReducer from "./rootReducer";
import storage from "./storage";

const logger = createLogger();

let middleware = [thunk];

let configStore = applyMiddleware(...middleware);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

if (process.env.NODE_ENV === "development") {
  middleware = [...middleware, logger];
  configStore = composeEnhancers(applyMiddleware(...middleware));
}

const initialState = storage.get(ACCESS_TOKEN_NAME)
  ? { auth: storage.get(ACCESS_TOKEN_NAME) }
  : {};

const store = createStore(rootReducer, initialState, configStore);

export default store;