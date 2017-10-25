import * as q from "q";
import * as _ from "lodash";
import RestClient from "../lib/RestClient";

const BASE_URL =
  process.env.NODE_ENV === "development" ? process.env.REACT_APP_BASE_URL : "";
const client = new RestClient();

export default class DataModel {
  static API_URL = "api";
  static client = client;

  constructor(data, endpoint) {
    this.absorbData(data).$url =
      BASE_URL + "/" + DataModel.API_URL + "/" + endpoint;
  }

  load() {
    if (this.id) {
      return client
        .get(`${this.$url}/${this.id}`)
        .then(data => this.absorbData(data));
    }
    return q.when(this);
  }

  delete() {
    if (this.id) {
      return client.delete(`${this.$url}/${this.id}`).then(() => this);
    }
    return q.when(this);
  }

  save() {
    let method = this.id ? "put" : "post";
    return client[method](this.$url, this.toJson()).then(data =>
      this.absorbData(data)
    );
  }

  absorbData(data) {
    Object.assign(this, data);
    return this;
  }

  toJson() {
    let out = {};
    Object.keys(this).forEach(key => {
      if (!_.isFunction(this[key]) && !_.startsWith(key, "$")) {
        out[key] = this[key];
      }
    });
    return JSON.stringify(out);
  }

  toPojo() {
    return JSON.parse(this.toJson());
  }
}
