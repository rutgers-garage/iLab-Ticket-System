import React, { useState } from 'react'
import "./Login.css"
import User from "./User.js"

function Login(){


  function submitFormHandler() {
    const response = fetch("http://127.0.0.1:5000/login", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        netid: document.getElementById("loginForm").elements[0].value,
        password: document.getElementById("loginForm").elements[1].value
      })
    })
    .then(response=>response.json())
    .then(data =>{
        if(data && data.success){
            // values must be saved as string in LocalStorage
            console.log(data);
            User.saveAccountInfo(data, data.access_token, data.refresh_token); 
        }
    }) 

  }
  if(User.isLoggedIn()){
    return(
      <div>
        <h1> is logged in</h1>
        <button onClick={() => User.clearAccountInfo()}>Sign Out</button>
      </div>
    );
  }
  return(
    <div className="submission">
      <h1>Sign In</h1>
      <form id="loginForm">
        <label>
          NetID:
          <input id="NetID" type="text"/>
        </label>

        <label>
          Password:
          <input id="Password" type="password" />
        </label>
        <button class="submit" onClick={() => {submitFormHandler()}}>Login</button>
      </form>
    </div>
  );
}
export default Login;
