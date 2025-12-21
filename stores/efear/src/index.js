import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import reportWebVitals from './reportWebVitals';
import AuthProvider from "./contexts/Auth";
import Router from "./contexts/Router";
import App from './App';

import { store } from "./features/store";

import './assets/css/bootstrap.min.css';
import './assets/css/owl.carousel.min.css'
import './assets/css/icons.css';
import './assets/css/pace.min.css';
import './assets/css/app.css';
import './assets/css/index.css';


function Providers({ children }) {
  return <Provider store={store}>{children}</Provider>
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Providers>
        <Router>
          <App />
        </Router>
    </Providers>

  );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();