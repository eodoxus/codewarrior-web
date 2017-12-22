import DataModel from "./DataModel";
import RestClient from "../lib/RestClient";

export default class DataCollection {
  $className;

  static create(className) {
    return new DataCollection(className);
  }

  constructor(className) {
    this.$className = className;
    this.$url = new className().$url;
  }

  async list(params) {
    let query = this.$url + RestClient.toQueryString(params);
    let list = await DataModel.client.get(query);
    if (list && list instanceof Array) {
      return list.map(data => new this.$className(data));
    }
    return [];
  }
}
