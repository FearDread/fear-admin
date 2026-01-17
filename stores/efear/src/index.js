import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";


import { store } from "./features/store";
import App from './App';

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
    <BrowserRouter>
        <Providers>
          <App />
       </Providers>
    </BrowserRouter>
  );