import {Link, useNavigate} from 'react-router-dom';
import {useContext, useEffect, useState} from "react";
import {UserContext} from "./UserContext";

export default function Header () {

  const {setUserInfo, userInfo} = useContext(UserContext);
  // const [redirect,setRedirect] = useState(false);
  const Navigate = useNavigate();
  
  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  }, []);
  
  
  function logout() {
    fetch('http://localhost:4000/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo('');
    Navigate('/');
  }
  
  const username = userInfo?.username;
  
  return (
    <header>
      <Link to="/" className="logo">TravelBlog</Link>
      <nav>
        {username && (
          <>
            <Link to="/mypost">My Post</Link>
            <Link to="/create">Create new post</Link>
            <a onClick={logout}>Logout ({username}) </a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  )
}