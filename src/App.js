import React, { Component } from "react";
import Layout from "./components/layout";
import styles from "./App.css";

class App extends Component {
  render() {
    return (
      <Layout.Header email="jason.m.gordon@gmail.com" phone="+1 714-614-8144" />
    );
  }
}

export default App;
