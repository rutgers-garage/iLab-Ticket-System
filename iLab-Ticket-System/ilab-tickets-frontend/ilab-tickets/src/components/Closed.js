import React from "react"
import Ticket from "./Ticket.js"
import User from "./User.js"

class Closed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tickets: []
    };
  }

  componentDidMount() {
    const respone = fetch("http://127.0.0.1:5000/closed", {
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
              <Ticket subject = {ticket.subject} netid = {ticket.netid} request = {ticket.request} iLab = {ticket.iLab} />
            </div>
          );
        })}
      </div>
    )
  }
}
export default Closed;
