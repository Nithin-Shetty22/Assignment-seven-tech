import React, { useState, useEffect } from 'react';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import MainHeader from './components/MainHeader/MainHeader';
import { ToastContainer, toast } from "react-toastify";
import { injectStyle } from "react-toastify/dist/inject-style";

if (typeof window !== "undefined") {
  injectStyle();
}


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() =>{
    const temp = localStorage.getItem('isLoggedIn');
    if(temp === '1') {
      setIsLoggedIn(true);
    }
  },[]);
 
  const loginHandler =  async (email, password) =>  {
    await fetch('https://crmdevapi.seventech.co/api/auth/login', { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body:JSON.stringify({
        "email":email,
        "password":password,
        "location":{}
    })
  }).then(response => response.json())
  .then(data =>{
    if(data.status === 200){
      localStorage.setItem('isLoggedIn','1');
      localStorage.setItem('username',data.username);
      setIsLoggedIn(true);
      toast.success("Login successful");
    }
    if(data.status === 401){
      toast.warning("wrong password!");
      return;
    }
    if(data.status === 404){
      toast.error("User not found!");
      return;
    }
  })
  };

  const logoutHandler = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
  };

  return (
    <React.Fragment>
      <MainHeader isAuthenticated={isLoggedIn} onLogout={logoutHandler} />
      <main>
        {!isLoggedIn && <Login onLogin={loginHandler} />}
        {isLoggedIn && <Home onLogout={logoutHandler} />}
      </main>
      <ToastContainer />
    </React.Fragment>
  );
}

export default App;
