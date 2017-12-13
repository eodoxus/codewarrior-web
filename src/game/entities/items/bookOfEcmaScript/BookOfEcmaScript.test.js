import BookOfEcmaScript from "./BookOfEcmaScript";
import Vector from "../../../engine/Vector";

let book;
let Entity = BookOfEcmaScript.__proto__.prototype;

beforeEach(async () => {
  fetch.mockResponse("");
  book = new BookOfEcmaScript("test", {}, new Vector(0, 0));
  await book.init();
});

describe("BookOfEcmaScript", () => {
  describe("construction", () => {
    it("should not crash when instantiated", () => {
      expect(book).toBeDefined();
    });
  });

  describe("update", () => {
    it("should make book float up and down, constrained to 2px range", () => {
      // Float up 2px max
      book.update(2000);
      expect(book.getPosition().y).toBe(-2);
      // Float down 1.5px
      book.update(1000);
      expect(book.getPosition().y).toBe(-0.5);
      // Float down to minimum of original y position, 0
      book.update(1000);
      expect(book.getPosition().y).toBe(0);
      // Float up 1.5px
      book.update(1000);
      expect(book.getPosition().y).toBe(-1.5);
      // Float up to a max of 2px from original y position, 0
      book.update(10000);
      expect(book.getPosition().y).toBe(-2);
    });
  });
});
