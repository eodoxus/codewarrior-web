import BookOfEcmaScript from "./BookOfEcmaScript";

let book;
let Entity = BookOfEcmaScript.__proto__.prototype;

beforeEach(async () => {
  fetch.mockResponse("");
  book = new BookOfEcmaScript();
  await book.loadAssets();
});

describe("BookOfEcmaScript", () => {
  describe("construction", () => {
    it("should not crash when instantiated", () => {
      expect(book).toBeDefined();
    });
  });
});
