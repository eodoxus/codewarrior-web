import Cookies from "universal-cookie";
import GameSaveModel from "./GameSaveModel";

const mockGuid = "10000000-1000-4000-8000-100000000000";

describe("generateSaveToken", () => {
  it("generates a random guid", () => {
    expect(GameSaveModel.generateSaveToken()).toEqual(mockGuid);
  });
});

describe("getToken", () => {
  it("sets token in cookies if not set already", () => {
    expect(GameSaveModel.getToken()).toEqual(mockGuid);
  });

  it("returns token in cookies if set already", () => {
    const cookies = new Cookies();
    cookies.set("codewarrior-token", "test");
    expect(GameSaveModel.getToken()).toEqual("test");
  });
});
