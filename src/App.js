import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useParams,
  Link
} from "react-router-dom";
import { useToken } from './auth.js'
import './App.css';
import Login from './Login'
import Main from "./Main.js";
import Profile from './Profile.js'

function App() {
  const version = "0.4.0"
  const params = useParams()

  const [loggedIn, setLoggedIn] = useState(useToken())

  useEffect(() => {
    setLoggedIn(localStorage.getItem('jwt'))
  }, [params])

  return (
    <div className="max-h-screen min-h-screen w-full flex flex-col wallpaper bg-gray-700">
      <p className="bg-white flex justify-between border-b border-gray-300">
        <Link to="/" className="flex p-2 hover:bg-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          <span className="ml-1">Chat</span>
        </Link>
        <code className="p-2 select-none">squid.chat <span className="text-gray-300">{version}</span></code>
        {loggedIn && (
          <Link to="/profile" className="flex p-2 hover:bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span className="ml-1">Profile</span>
          </Link>
        )}
      </p>
      <Switch>
        {/* If the current URL is /about, this route is rendered
            while the rest are ignored */}
        <Route path="/login">
          {loggedIn ? <Redirect to="/home" /> : <Login />}
        </Route>

        {/* Note how these two routes are ordered. The more specific
            path="/contact/:id" comes before path="/contact" so that
            route will render when viewing an individual contact */}
        <PrivateRoute path="/profile">
          <Profile />
        </PrivateRoute>

        {/* If none of the previous routes render anything,
            this route acts as a fallback.

            Important: A route with path="/" will *always* match
            the URL because all URLs begin with a /. So that's
            why we put this one last of all */}
        <PrivateRoute path="/">
          <Main />
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
