import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
	RouteProps,
  Redirect,
  useParams,
  Link
} from 'react-router-dom';
import { createStore, useStore } from 'store/reactive'
import { getToken, refreshTokenEvent, setUserInStore } from 'services/authenticationService'
import axios from 'axios'
import store from 'store'
import 'assets/css/App.css';
import Navigation from 'components/Navigation';
import Login from 'screens/Login'
import Main from 'screens/Main';
import Profile from 'screens/Profile';
import AppRouter from 'components/AppRouter';
import { useAppDispatch, useAppSelector } from "hooks";
import SearchResults from 'screens/SearchResults';

createStore({
  users: [],
  avatars: []
})

function App() {
  // const params = useParams();

  const [isLoading, setLoading] = useState<boolean>(true);

  // const [loggedIn, setLoggedIn] = useState<null | string>(null);

  const isLoggedIn = useAppSelector(state => state.userState.isLoggedIn);
  
  // always call for refresh when the app loads
  useEffect( () => {
    waitForAuthentication();
  }, [])

  const waitForAuthentication = () => {
    refreshTokenEvent().then(() => {
      setTimeout(() => {
        setLoading(false);
      }, 200);
    })
  }

  // watch for changes in params
  // useEffect(() => {
  //   setLoggedIn(localStorage.getItem("jwt"));
  // }, [params])

  const [users, setUsers] = useStore('users')
  const [avatars, setAvatars] = useStore('avatars')

  // watch for changes in loggedIn status to load users
  useEffect(() => {
    if (isLoggedIn) {
      axios.get('/users/list').then(res => {
        console.log('USERS', res.data)
        setUsers(res.data)
      })
    }
  }, [isLoggedIn])

  // watch for changes in users status to load avatar images
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

  // refresh the jwt, called every 7 minutes
  const refreshInterval: number = 420000;
  useEffect(() => {
    const interval = setInterval(async () => {
      await refreshTokenEvent().then(() => {
        console.log('Token Refreshed');
      })
    }, refreshInterval);
  
    return () => clearInterval(interval); // the unmount function to prevent memory leaks.
  })

  if (isLoading) {
    return <div className="squidload full-screen-loader"></div>
  }

  return ( //data-theme={darkMode ? "dark" : "light"}
    <AppRouter/>
  );
}

interface PrivateRouteProps extends RouteProps {
	// tslint:disable-next-line:no-any
	children: any;
}

const PrivateRoute = (props: PrivateRouteProps) => {
	const { children : Children, ...rest } = props;
  const loggedIn = getToken();
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
