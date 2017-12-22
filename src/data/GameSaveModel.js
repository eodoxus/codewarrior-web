import Cookies from "universal-cookie";
import DataModel from "./DataModel";

const SAVE_TOKEN = "codewarrior-token";
const cookies = new Cookies();

export default class GameSaveModel extends DataModel {
  static ENDPOINT = "game_saves";

  // Taken from https://stackoverflow.com/a/2117523
  static generateSaveToken() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }

  static getToken() {
    let token = cookies.get(SAVE_TOKEN);
    if (!token) {
      token = GameSaveModel.generateSaveToken();
      cookies.set(SAVE_TOKEN, token);
    }
    return token;
  }

  constructor(data) {
    super(data, GameSaveModel.ENDPOINT);
  }
}
