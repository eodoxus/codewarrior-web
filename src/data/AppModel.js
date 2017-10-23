import DataModel from "./DataModel";

export default class AppModel extends DataModel {
  static ENDPOINT = "site";

  avatar = "";
  email = "...";
  name = "...";
  phone = "...";
  slogan = "...";
  home = "/";

  constructor() {
    super(AppModel.ENDPOINT);
  }

  load() {
    return DataModel.client.get(this.url).then(data => this.loadJson(data));
  }
}
