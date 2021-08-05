import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faSearch, faComments, faRestroom, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import { useAppSelector } from "hooks";
import { connect } from 'react-redux';
import SearchBar from 'components/SearchBar';
import './Navigation.css';

function Navigation() {
  
  const version = "0.4.0";
  // this selector acts as a watcher that checks if this value has been updated
  const isLoggedIn = useAppSelector(state => state.userState.isLoggedIn);
  const loggedInUser = useAppSelector((state) => state.userState.user);
  const isMobile = useAppSelector(state => state.environmentState.isMobile);

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
    <div className={`bg-white dark:bg-primaryDark flex ${!isMobile ? "justify-between" : "justify-around" } items-center border-b border-gray-300`}>
        <Link to={!isMobile ? "/" : "/rooms"} className="flex items-center p-2 hover:text-gray-500">
          <span className="flex items-center justify-center" style={{width: "40px", height: "40px"}}>
            <FontAwesomeIcon icon={faRestroom} size="2x"/>
          </span>
          {!isMobile ? <span className="ml-1">Rooms</span> : <span/>}
        </Link>
        {!isMobile ? <code className="p-2 select-none">SquidChat <span className="text-gray-300">{version}</span></code> : <span style={{display: "none"}}/>}
        {isMobile ? 
          <Link to="/userslist" className="flex p-2 hover:text-gray-500">
            <span className="flex items-center justify-center" style={{width: "40px", height: "40px"}}>
              <FontAwesomeIcon icon={faComments} size="2x"/>
            </span>
          </Link> 
          : 
          <span style={{display: "none"}}/>
        }
				{!isMobile ?
          <SearchBar theme={theme}/>
          :
          <Link to="/" className="flex p-2 hover:text-gray-500">
            <span className="flex items-center justify-center" style={{width: "40px", height: "40px"}}>
              <FontAwesomeIcon icon={faSearch} size="2x" />
            </span>
          </Link>
        }
        <div className="flex row items-center" style={isMobile && !isLoggedIn ? {display: "none"} : {}}>
          {!isMobile ?
          <div className="flex p-2">
            <label id="theme-switch" className={`theme-switch ${theme}`}>
              <FontAwesomeIcon icon={faMoon} color="#dcf8ff" className={`sun ${complementTheme}`} />
              <FontAwesomeIcon icon={faSun} color="#ffd900" className={`moon ${complementTheme}`} />
              <div className={`cursor-pointer ball ${theme}`} onClick={() => setTheme(complementTheme)}></div>
            </label>      
          </div>
          : <span style={{display: "none"}}/> }  
          {isLoggedIn && (
            <Link to={{pathname:`/profile/${loggedInUser.username}`, state: {userId: loggedInUser.ID}}} className="flex p-2 hover:text-gray-500 items-center">
              <span className="flex items-center justify-center" style={{width: "40px", height: "40px"}}>
                <FontAwesomeIcon icon={faUserCircle} size="2x"/>
              </span>
              {!isMobile ? <span className="ml-1">Profile</span> : <span style={{display: "none"}}/>}
            </Link>
          )}
          </div>
        
      </div>
  )
}
// const mapStateToProps = useAppSelector((state:any) => state.userState.isLoggedIn);
const mapStateToProps = (state:any) => ({
  isLoggedIn: state.userState.isLoggedIn
});


export default connect(mapStateToProps)(Navigation);