import React from 'react';
import User from "./User.js";
import Textarea from 'react-expanding-textarea'
import "./Home.css";


function Home() {
  function submitFormHandler() {
      const response = fetch("http://127.0.0.1:5000/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          netid: document.getElementById("submitTicket").elements[0].value,
          request: document.getElementById("submitTicket").elements[1].value,
          subject: document.getElementById("submitTicket").elements[2].value,
        })
      });
  }

  if(User.isLoggedIn()){
    return(
      <div className="paths">
        <a className="buttons" href ="/open">Open</a>
        <a className="buttons" href ="/closed">Closed</a>
      </div>
    );
  }
  return(
    <div className="submission">
      <form id="submitTicket">
        <div className="inputVal">
          <h1>Submit Ticket</h1>
          <label>
            NetID:
            <input id="NetID" type="text"/>
          </label>
        </div>
        <div className="inputVal">
          <label>
            Subject:
            <input id="Subject" type="text"/>
          </label>
        </div>
        <div className="inputVal">
          <label>
            Request:
            <input id="Request" type="text"/>
          </label>
        </div>
        <div className="submit">
          <button class="submit" onClick={() => {submitFormHandler()}}>Submit</button>
        </div>
      </form>
    </div>
  );


}

export default Home;
