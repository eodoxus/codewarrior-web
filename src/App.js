import React, { Component } from "react";
import Layout from "./components/layout";

class App extends Component {
  static SITE_URL = "/";

  render() {
    return (
      <Layout.Header
        email="jason.m.gordon@gmail.com"
        phone="+1 714-614-8144"
        url={App.SITE_URL}
      />
    );
  }
}

export default App;
