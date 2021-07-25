import React, { useEffect, useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSun } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import { useAppSelector } from "hooks";
import { connect } from 'react-redux';
import '.NavigationANOTHER.css';

function Navigation() {
  
  const version = "0.4.0";
  // this selector acts as a watcher that checks if this value has been updated
  const isLoggedIn = useAppSelector(state => state.userState.isLoggedIn);
  const loggedInUser = useAppSelector((state) => state.userState.user);

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

  return (
    <div className="bg-white dark:bg-primaryDark flex justify-between border-b border-gray-300">
        <div className="flex row">
          <Link to="/" className="flex p-2 hover:bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span className="ml-1">Chat</span>
          </Link>
          <button className="theme-switch" onClick={() => setTheme(complementTheme)}>
            Toggle Dark Mode
          </button>
        </div>
        <code className="p-2 select-none">SquidChat <span className="text-gray-300">{version}</span></code>
				
        {isLoggedIn && (
          <Link to={{pathname:`/${loggedInUser.username}`, state: {userId: loggedInUser.ID}}} className="flex p-2 hover:bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span className="ml-1">Profile</span>
          </Link>
        )}
      </div>
  )
}

// const mapStateToProps = useAppSelector((state:any) => state.userState.isLoggedIn);
const mapStateToProps = (state:any) => ({
  isLoggedIn: state.userState.isLoggedIn
});


export default connect(mapStateToProps)(Navigation);