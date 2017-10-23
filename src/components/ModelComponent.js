import { Component } from "react";

export default class ModelComponent extends Component {
  // instantiate DataModel and assign it to this.model in constructor
  model;

  async componentDidMount() {
    await this.loadModel();
    this.setState({ model: this.model });
  }

  loadModel() {
    return this.model.load();
  }
}
