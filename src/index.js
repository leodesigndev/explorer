import React from 'react';
import ReactDOM from 'react-dom';

import { PersistGate } from "redux-persist/integration/react";
import {Provider} from "react-redux" ;
import { persistor, store } from "./redux";
import { BrowserRouter } from "react-router-dom";

import reportWebVitals from './reportWebVitals';
import history from "./redux/history";
import App from './App';

import 'mapbox-gl/dist/mapbox-gl.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jspanel4/dist/jspanel.min.css';
import './index.css';

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading="<Loader/>" persistor={persistor}>
      <BrowserRouter history={history}>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
