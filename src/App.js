import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useHistory
} from "react-router-dom";
import { useToken } from './auth.js'
import './App.css';
import Login from './Login'

function App() {
  const loggedIn = useToken()
  const history = useHistory()
  const logout = () => {
    localStorage.removeItem('jwt')
    history.push('/login')
  }

  return (
    <div className="min-h-screen w-full bg-blue-50">
      <p className="p-2 bg-white flex justify-between">
        <code>squid.chat</code>
        {loggedIn && (<button type="button" onClick={() => { logout() }}><code>log out</code></button>)}
      </p>
      <Switch>
        {/* If the current URL is /about, this route is rendered
            while the rest are ignored */}
        <Route path="/login">
          {loggedIn ? <Redirect to="/dashboard" /> : <Login />}
        </Route>

        {/* Note how these two routes are ordered. The more specific
            path="/contact/:id" comes before path="/contact" so that
            route will render when viewing an individual contact */}
        <PrivateRoute path="/dashboard">
          <h3>dashboard</h3>
        </PrivateRoute>
        <PrivateRoute path="/contact/:id">
          contact
        </PrivateRoute>
        <PrivateRoute path="/contact">
          contactsSSS
        </PrivateRoute>

        {/* If none of the previous routes render anything,
            this route acts as a fallback.

            Important: A route with path="/" will *always* match
            the URL because all URLs begin with a /. So that's
            why we put this one last of all */}
        <PrivateRoute path="/">
          <h1>home</h1>
        </PrivateRoute>
      </Switch>
    </div>
  );
}

function PrivateRoute({ children, ...rest }) {
  const loggedIn = useToken()
  return (
    <Route
      {...rest}
      render={({ location }) =>
        loggedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export default App;
