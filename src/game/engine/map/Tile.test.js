import Size from "../Size";
import Tile from "./Tile";
import Vector from "../Vector";

const tile = new Tile(0, new Vector(20, 30), new Size(8, 8));
let testTile;

describe("Tile", () => {
  describe("intersects", () => {
    it("returns true if tiles overlap in upper left", () => {
      testTile = new Tile(0, new Vector(15, 25), new Size(8, 8));
      expect(tile.intersects(testTile)).toBe(true);

      testTile = new Tile(0, new Vector(11, 0), new Size(10, 80));
      expect(tile.intersects(testTile)).toBe(true);

      testTile = new Tile(0, new Vector(0, 25), new Size(80, 10));
      expect(tile.intersects(testTile)).toBe(true);
    });

    it("returns true if tiles overlap in upper right", () => {
      testTile = new Tile(0, new Vector(25, 25), new Size(8, 8));
      expect(tile.intersects(testTile)).toBe(true);

      testTile = new Tile(0, new Vector(15, 0), new Size(10, 80));
      expect(tile.intersects(testTile)).toBe(true);

      testTile = new Tile(0, new Vector(10, 35), new Size(80, 10));
      expect(tile.intersects(testTile)).toBe(true);
    });

    it("returns true if tiles overlap in bottom left", () => {
      testTile = new Tile(0, new Vector(25, 35), new Size(8, 8));
      expect(tile.intersects(testTile)).toBe(true);

      testTile = new Tile(0, new Vector(15, 25), new Size(10, 80));
      expect(tile.intersects(testTile)).toBe(true);

      testTile = new Tile(0, new Vector(0, 35), new Size(80, 10));
      expect(tile.intersects(testTile)).toBe(true);
    });

    it("returns true if tiles overlap in bottom right", () => {
      testTile = new Tile(0, new Vector(25, 25), new Size(8, 8));
      expect(tile.intersects(testTile)).toBe(true);

      testTile = new Tile(0, new Vector(15, 25), new Size(10, 80));
      expect(tile.intersects(testTile)).toBe(true);

      testTile = new Tile(0, new Vector(0, 35), new Size(80, 10));
      expect(tile.intersects(testTile)).toBe(true);
    });

    it("returns false if tiles don't overlap", () => {
      testTile = new Tile(0, new Vector(20, 20), new Size(8, 8));
      expect(tile.intersects(testTile)).toBe(false);

      testTile = new Tile(0, new Vector(10, 30), new Size(8, 8));
      expect(tile.intersects(testTile)).toBe(false);

      testTile = new Tile(0, new Vector(30, 30), new Size(8, 8));
      expect(tile.intersects(testTile)).toBe(false);

      testTile = new Tile(0, new Vector(20, 40), new Size(8, 8));
      expect(tile.intersects(testTile)).toBe(false);
    });
  });
});
