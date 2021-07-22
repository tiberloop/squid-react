import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'
import './assets/css/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { checkAuthentication } from './services/auth'

import {
  BrowserRouter as Router,
} from "react-router-dom";


const auth = checkAuthentication()

axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
// axios.defaults.baseURL = "http://127.0.0.1:5000/api/"
axios.defaults.baseURL = "https://squid.chat/api/"

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
