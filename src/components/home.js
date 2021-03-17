import React, { Component } from "react"
import "../css/home.css"
import Tasks from "./task"
import Firebase from "firebase"
import config from "../config"
import ReactLoading from "react-loading"

class Home extends Component {
  state = {
    loading: true,
    input: "",
    task: [],
  }
  constructor() {
    super()
    if (!Firebase.apps.length) {
      Firebase.initializeApp({ ...config })
    }
    Firebase.firestore()
      .collection("TEmp")
      .doc("task")
      .get()
      .then((doc) => {
        this.setState({ task: doc.data().task, loading: false })
      })
  }

  handleDelete = (taskID) => {
    const tasks = this.state.task.filter((t) => t.id !== taskID)
    this.setState({ task: tasks })
    Firebase.firestore()
      .collection("TEmp")
      .doc("task")
      .set({ task: this.state.task.filter((t) => t.id !== taskID) })
      .then(console.log("Data Deleted"))
      .catch((error) => {
        console.log("Error in updating task: ", error)
      })
  }

  setValue = (e) => {
    let val = e.target.value
    this.setState({ input: val })
  }

  handleNew = () => {
    if (this.state.input === "") {
      console.log("No Data Added")
      return
    }
    this.setState({
      task: this.state.task.concat([
        {
          id: Math.max(this.state.task.map((i) => i.id)) + 1,
          value: this.state.input,
        },
      ]),
    })
    Firebase.firestore()
      .collection("TEmp")
      .doc("task")
      .set({
        task: this.state.task.concat([
          {
            id: Math.max(this.state.task.map((i) => i.id)) + 1,
            value: this.state.input,
          },
        ]),
      })
      .then(console.log("Data Addes"))
      .catch((error) => {
        console.log("Error in updating task: ", error)
      })
  }

  handleChange = () => {
    console.log("hello")
  }
  render() {
    return (
      <div>
        <nav className="navbar">
          <span>
            <b>To Do List</b>
          </span>
          <input
            type="text"
            onChange={this.setValue}
            value={this.state.input}
          />
          <button onClick={this.handleNew} style={{ marginLeft: "2vw" }}>
            <b>Add Task</b>
          </button>
        </nav>
        <div className="main-container">
          {this.state.loading === true ? (
            <ReactLoading
              type={"bubbles"}
              color={"black"}
              height={300}
              width={200}
            />
          ) : this.state.task.length !== 0 ? (
            <div className="task-container">
              {this.state.task.map((t) => (
                <Tasks
                  key={t.id}
                  value={t.value}
                  id={t.id}
                  onDelete={this.handleDelete}
                  onEdit={this.handleChange}
                />
              ))}
            </div>
          ) : (
            <h1>No Task</h1>
          )}
        </div>
      </div>
    )
  }
}

export default Home
