import React, { Component } from "react"
import "../css/home.css"
import Tasks from "./task"
import Firebase from "firebase"
import config from "../config"
import ReactLoading from "react-loading"

class Home extends Component {
  state = {
    edit: "",
    loading: true,
    input: "",
    task: [],
    taskid: 0,
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
    Firebase.firestore()
      .collection("TEmp")
      .doc("taskno")
      .get()
      .then((doc) => {
        this.setState({ taskid: doc.data().task })
      })
  }

  handleDelete = (taskID) => {
    const tasks = this.state.task.filter((t) => t.id !== taskID)
    this.setState({ task: tasks })
    Firebase.firestore()
      .collection("TEmp")
      .doc("task")
      .set({ task: tasks })
      .then(console.log("Data Deleted"))
      .catch((error) => {
        console.log("Error in updating task: ", error)
      })
  }

  handleChange = (taskID, val) => {
    if (!this.state.loading) {
      return (
        <>
          <ReactLoading
            type={"bubbles"}
            color={"black"}
            height={300}
            width={200}
          />
        </>
      )
    }
    var t
    for (var temp in this.state.task) {
      if (this.state.task[temp].id === taskID) {
        t[temp] = { id: this.state.task[temp].id, value: val }
      } else {
        t[temp] = {
          id: this.state.task[temp].id,
          value: this.state.task[temp].value,
        }
      }
    }
    Firebase.firestore()
      .collection("TEmp")
      .doc("task")
      .set({ task: t })
      .then(console.log("Data Edited"))
      .catch((error) => {
        console.log("Error in updating task: ", error)
      })
    this.setState({ task: t })
  }

  setValue = (e) => {
    let val = e.target.value
    console.log(e)
    this.setState({ input: val })
  }

  handleNew = () => {
    if (this.state.input === "") {
      console.log("No Data Added")
      return
    }
    var tid = this.state.taskid + 1
    this.setState({
      task: this.state.task.concat([
        {
          id: this.state.taskid === 0 ? 0 : tid,
          value: this.state.input,
        },
      ]),
      taskid: tid,
    })
    Firebase.firestore()
      .collection("TEmp")
      .doc("task")
      .set({
        task: this.state.task.concat([
          {
            id: this.state.taskid === 0 ? 0 : tid,
            value: this.state.input,
          },
        ]),
      })
      .then(console.log("Data Added: "), this.setState({ input: "" }))
      .catch((error) => {
        console.log("Error in updating task: ", error)
      })
    Firebase.firestore()
      .collection("TEmp")
      .doc("taskno")
      .set({ task: tid })
      .then(console.log("Task id updated"))
      .catch((error) => {
        console.log("Error in updating task: ", error)
      })
    console.log("Data Added: ", this.state.task)
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
            placeholder="Enter New Task Here.."
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
