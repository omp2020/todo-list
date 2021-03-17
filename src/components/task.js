import React, { Component } from "react"
// import newNote from "../img/newNote.png"
import Trash from "../img/trash.png"
import "../css/task.css"
// import Firebase from "firebase"
// import config from "../config"

class Task extends Component {
  state = {
    text: this.props.value,
    id: this.props.id,
  }

  render() {
    return (
      <div className="main-container">
        <span>{this.state.text}</span>
        {/* <button
          onClick={() => {
            this.props.onEdit(this.props.id)
          }}
        >
          <img src={newNote} alt="New Note" />
        </button> */}
        <button
          onClick={() => {
            this.props.onDelete(this.props.id)
          }}
        >
          <img src={Trash} alt="Trash" />
        </button>
      </div>
    )
  }
}

export default Task
