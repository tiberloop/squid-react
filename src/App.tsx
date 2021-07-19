import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
	RouteProps,
  Redirect,
  useParams,
  Link
} from "react-router-dom";
import { createStore, useStore } from './store/reactive'
import { useToken } from './auth'
import axios from 'axios'

import './assets/css/App.css';
import Login from './Login'
import Main from "./Main";
import Profile from './Profile'

createStore({
  users: [],
  avatars: []
})

function App() {
  const version = "0.4.0"
  const params = useParams()

  const [loggedIn, setLoggedIn] = useState(useToken())

  useEffect(() => {
    setLoggedIn(localStorage.getItem('jwt'))
  }, [params])

  const [users, setUsers] = useStore('users')
  const [avatars, setAvatars] = useStore('avatars')

  useEffect(() => {
    if (loggedIn) {
      axios.get('/users/list').then(res => {
        console.log('USERS', res.data)
        setUsers(res.data)
      })
    }
  }, [loggedIn])

  useEffect(() => {
    let avatarsCollection: any = []

    users.forEach((u: any) => {
      if (u.avatar) {
        axios.get(`/avatar/${u.ID}`, { responseType: "blob" }).then(res => {
          avatarsCollection.push({ userId: u.ID, src: res.data})
        })
        .catch(e => console.log(e))
      }
    })

    setTimeout(() => { setAvatars(avatarsCollection) }, 2000) 
  }, [users]);

  // enable dark mode; use localStorage to persist on reload
  const storedTheme = localStorage.getItem("THEME") === "dark" ? "dark" : "light";
  const [theme, setTheme] = useState(storedTheme);
  const complementTheme = theme === "dark" ? "light" : "dark";
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(complementTheme);
    root.classList.add(theme);
    localStorage.setItem('THEME', theme);
  }, [theme, complementTheme]);

  return ( //data-theme={darkMode ? "dark" : "light"}
    <div className="squid-app max-h-screen min-h-screen w-full flex flex-col wallpaper dark:text-white" >
      <div className="bg-white dark:bg-primaryDark flex justify-between border-b border-gray-300">
        <div className="flex row">
          <Link to="/" className="flex p-2 hover:bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span className="ml-1">Chat</span>
          </Link>
          <button onClick={() => setTheme(complementTheme)}>
            Toggle Dark Mode
          </button>
        </div>
        <code className="p-2 select-none">squid.chat <span className="text-gray-300">{version}</span></code>
				
        {loggedIn && (
          <Link to="/profile" className="flex p-2 hover:bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span className="ml-1">Profile</span>
          </Link>
        )}
      </div>
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

interface PrivateRouteProps extends RouteProps {
	// tslint:disable-next-line:no-any
	children: any;
}

const PrivateRoute = (props: PrivateRouteProps) => {
	const { children : Children, ...rest } = props;
  const loggedIn = useToken();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        loggedIn ? (
          Children
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
