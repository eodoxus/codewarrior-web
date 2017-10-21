import * as q from "q";
import RestClient from "../lib/RestClient";

let client = new RestClient();

export default class DataModel {
  static client = client;
  static apiUrl = "api";

  constructor(endpoint) {
    this.url = window.baseUrl + "/" + DataModel.apiUrl + "/" + endpoint;
  }

  save() {
    let method = this.id ? "put" : "post";
    return client[method](this.url, JSON.stringify(this)).then(() => this);
  }

  load() {
    if (this.id) {
      return client
        .get(`${this.url}/${this.id}`)
        .then(data => this.loadJson(data));
    }
    return q.when(this);
  }

  delete() {
    if (this.id) {
      return client.delete(`${this.url}/${this.id}`).then(() => this);
    }
    return q.when(this);
  }

  loadJson(data) {
    Object.keys(data).forEach(key => {
      this[key] = data[key];
    });
    return this;
  }

  toJson() {
    return JSON.stringify(this);
  }

  toPojo() {
    return JSON.parse(JSON.stringify(this));
  }
}
