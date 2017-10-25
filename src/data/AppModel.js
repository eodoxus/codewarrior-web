import DataModel from "./DataModel";

export default class AppModel extends DataModel {
  static ENDPOINT = "site";

  constructor(data) {
    super(data, AppModel.ENDPOINT);
  }

  load() {
    return DataModel.client.get(this.$url).then(data => this.absorbData(data));
  }
}
