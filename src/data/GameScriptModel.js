import DataModel from "./DataModel";

export default class GameScriptModel extends DataModel {
  static ENDPOINT = "game_scripts";

  constructor(data) {
    super(data, GameScriptModel.ENDPOINT);
  }
}
