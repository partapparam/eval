import logo from "../Eval_blue.svg"
import "./App.css"
import React from "react"
import { Navbar } from "../common/navbar"
import { ReviewsList } from "../features/reviews/ReviewsList"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

function App() {
  return (
    <div className="App">
      <Navbar />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <ReviewsList />
    </div>
  )
}

export default App
