import * as _ from "lodash";
import RestClient from "../lib/RestClient";
import Url from "../lib/Url";

const client = new RestClient();

export default class DataModel {
  static API_URL = "api";
  static client = client;

  constructor(data, endpoint) {
    this.$url = Url.BASE + DataModel.API_URL + "/" + endpoint;
    this.absorbData(data);
  }

  async load() {
    if (this.id) {
      let data = await client.get(`${this.$url}/${this.id}`);
      return this.absorbData(data);
    }
    return this;
  }

  async delete() {
    if (this.id) {
      await client.delete(`${this.$url}/${this.id}`);
    }
    return this;
  }

  async save() {
    let method = this.id ? "put" : "post",
      data = await client[method](this.$url, this.toJson());
    this.absorbData(data);
    return this;
  }

  absorbData(data) {
    Object.assign(this, data);
    return this;
  }

  isLoaded() {
    return this.$isLoaded;
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
