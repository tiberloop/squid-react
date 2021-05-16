import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import './App.css';
import Login from './Login'

function App() {
  return (
    <div className="min-h-screen w-full bg-blue-50">
      <p className="p-2 bg-white"><code>squid.chat</code></p>
      <Switch>
        {/* If the current URL is /about, this route is rendered
            while the rest are ignored */}
        <Route path="/login">
          <Login />
        </Route>

        {/* Note how these two routes are ordered. The more specific
            path="/contact/:id" comes before path="/contact" so that
            route will render when viewing an individual contact */}
        <Route path="/contact/:id">
          contact
        </Route>
        <Route path="/contact">
          contactsSSS
        </Route>

        {/* If none of the previous routes render anything,
            this route acts as a fallback.

            Important: A route with path="/" will *always* match
            the URL because all URLs begin with a /. So that's
            why we put this one last of all */}
        <Route path="/">
          <h1>home</h1>
        </Route>
      </Switch>
    </div>
  );
}

<style>
  
</style>

export default App;
