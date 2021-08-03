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
import { useAppDispatch, useAppSelector } from "hooks";
import SearchResults from 'screens/SearchResults';
import RoomsList from 'components/RoomsList';
import UsersList from 'components/UsersList';
import Room from 'components/Room';

function AppRouter() {
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

  return (
    <div className="squid-app max-h-screen min-h-screen w-full flex flex-col wallpaper dark:text-white" >
      <Navigation />
      <div className="flex min-h-full flex-grow border-gray-300" >
        {isLoggedIn ? <RoomsList/> : <span/>}
        <Switch>
          <Route path="/login">
            {isLoggedIn ? <Redirect to="/" /> : <Login />}
          </Route>

          <PrivateRoute path="/profile/:username" component={Profile}> </PrivateRoute> 
          <PrivateRoute path="/searchresults?:query" component={SearchResults}> </PrivateRoute> 
          <PrivateRoute path="/rooms/:roomName" > <Room/> </PrivateRoute> 
          <PrivateRoute path="/"> <Main/> </PrivateRoute>
        </Switch>
        {isLoggedIn ? <UsersList/> : <span/>}
      </div>
      
    </div>
  );
};

interface PrivateRouteProps extends RouteProps {
	children: any;
}

const PrivateRoute = (props: PrivateRouteProps) => {
	const { children : Children, ...rest } = props;
  const loggedIn = useAppSelector(state => state.userState.isLoggedIn);
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

export default AppRouter;