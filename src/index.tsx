import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'
import 'assets/css/index.css';
import App from './App';
import reportWebVitals from 'reportWebVitals';
import { Provider } from 'react-redux';
import { checkAuthentication } from 'services/authenticationService'

import {
  BrowserRouter as Router,
} from "react-router-dom";

import store from './store';

const auth = checkAuthentication()

axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
// axios.defaults.baseURL = "http://127.0.0.1:5000/api/"
axios.defaults.baseURL = "https://squid.chat/api/"

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <Router>
        <App />
      </Router>
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
