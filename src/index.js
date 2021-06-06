import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { checkAuthentication } from './auth'

import {
  BrowserRouter as Router,
} from "react-router-dom";

const auth = checkAuthentication()

axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
// axios.defaults.baseURL = "http://192.168.0.150:5000/"
axios.defaults.baseURL = "http://localhost:5000/api/"

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
reportWebVitals();
