import React from "react";
import ReactDOM from 'react-dom/client';
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import "./i18n";
import { Provider } from "react-redux";
import store from "./store";

import axios from "axios";

// --- GLOBAL AXIOS CONFIG (IMPORTANT) ---
axios.defaults.baseURL = process.env.REACT_APP_API_URL || "https://api.housecare.tecnavis.in";
axios.defaults.withCredentials = true;  // <--- REQUIRED FOR LOGIN

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <App />
      </BrowserRouter>
    </>
  </Provider>
);

serviceWorker.unregister();
