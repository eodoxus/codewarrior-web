import DataModel from "./DataModel";

export default class AppModel extends DataModel {
  static ENDPOINT = "site";

  constructor(data) {
    super(data, AppModel.ENDPOINT);
  }

  async load() {
    let data = await DataModel.client.get(this.$url);
    return this.absorbData(data);
  }
}
