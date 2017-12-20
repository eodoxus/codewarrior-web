import React from "react";

export default class MenuComponent extends React.Component {
  listeners;

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  componentWillUnmount() {
    this.listeners && this.listeners.forEach(listener => listener.remove());
    delete this.listeners;
  }

  onClose = e => {
    if (!this.isOpen()) {
      return;
    }
    this.setState({ isOpen: false });
  };

  onClick(e) {
    // Override this
  }

  onOpen = () => {
    if (this.isOpen()) {
      return;
    }
    this.setState({ isOpen: true });
  };

  isOpen() {
    return this.state.isOpen;
  }
}
