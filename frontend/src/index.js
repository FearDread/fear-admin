import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import './css/index.css';
import './css/App.css'
import './css/Common.css'
import App from './App';
import * as serviceWorker from './serviceWorker';
import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
