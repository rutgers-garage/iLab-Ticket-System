import React from "react"
import Ticket from "./Ticket.js"
import User from "./User.js"
import "./Open.css"

function resolve(ticket){
  const response = fetch("http://127.0.0.1:5000/close", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      iLab: JSON.parse(window.localStorage.getItem('netid')),
      netid: ticket.netid,
      request: ticket.request,
      subject: ticket.subject,
      access_token: User.getAccessToken(),
      refresh_token: User.getRefreshToken(),
    })
  });
}

class Open extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tickets: []
    };
  }

  componentDidMount() {
    const respone = fetch("http://127.0.0.1:5000/open", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_token: User.getAccessToken(),
        refresh_token: User.getRefreshToken(),
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      this.setState({ tickets: data})
     })
  }

  render() {
    return (
      <div>
        {this.state.tickets.map(ticket => {
          return(
            <div className="entry">
              <Ticket subject = {ticket.subject} netid = {ticket.netid} request = {ticket.request} />
              <button className="resolve" onClick={() => resolve(ticket)}>Resolve</button>
            </div>
          );
        })}
      </div>
    )
  }
}

export default Open;
