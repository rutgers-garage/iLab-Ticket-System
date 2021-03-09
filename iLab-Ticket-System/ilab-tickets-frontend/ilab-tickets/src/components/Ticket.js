
import Modal from  "react-modal";
import React, { useState } from "react";
import "./ticket.css";

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    width                 : '50%',
    height                : '70%',
    maxHeight: '1000px',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    backgroundColor : '#87CEEB',
    borderRadius: '25px'
  }
};

function Ticket(props) {

    const [modalIsOpen,setIsOpen] = useState(false);
    function openModal() {
      setIsOpen(true);
    }

    function closeModal(){
      console.log("hello\n")
      setIsOpen(false);
      console.log(modalIsOpen)
    }
  
    if(props.iLab == null){
      return(
        <>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <div className="info">
              <h2>NetID: {props.netid}</h2>
              <h2>Subject: {props.subject}</h2>
              <h2>Request: {props.request}</h2>
            </div>
            <button onClick={() => {closeModal();}} className="exit">Exit</button>
          </Modal>
          <div className="ticket" onClick={() => {openModal();}}>
            <ul>
              <li>NetID: {props.netid}</li>
              <li>Subject: {props.subject}</li>
            </ul>
          </div>
        </>
      );
    }
    return(
      <>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="info">
            <h2>NetID: {props.netid}</h2>
            <h2>Subject: {props.subject}</h2>
            <h2>iLab: {props.iLab}</h2>
            <h2>Request: {props.request}</h2>
          </div>
          <button onClick={() => {closeModal();}} className="exit">Exit</button>
        </Modal>
        <div className="ticket" onClick={() => {openModal();}}>
          <ul>
            <li>NetID: {props.netid}</li>
            <li>Subject: {props.subject}</li>
            <li>iLab: {props.iLab}</li>
          </ul>
        </div>
      </>
    );
    
    


}

export default Ticket;
