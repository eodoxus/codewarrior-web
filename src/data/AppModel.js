import DataModel from "./DataModel";

export default class AppModel extends DataModel {
  constructor() {
    super("site");
  }

  load() {
    return DataModel.client.get(this.url).then(data => this.loadJson(data));
  }
}
