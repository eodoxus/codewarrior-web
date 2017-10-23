import * as q from "q";
import RestClient from "../lib/RestClient";

const BASE_URL =
  process.env.NODE_ENV === "development" ? process.env.REACT_APP_BASE_URL : "";
let client = new RestClient();

export default class DataModel {
  static API_URL = "api";
  static client = client;

  constructor(endpoint) {
    this.url = BASE_URL + "/" + DataModel.API_URL + "/" + endpoint;
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
