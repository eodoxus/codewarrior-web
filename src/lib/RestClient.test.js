import RestClient from "./RestClient";

let url = "/test";
let client = new RestClient();
let responseData = { id: "test" };

beforeAll(() => {
  console.error = jest.fn();
});

beforeEach(() => {
  fetch.mockClear();
  console.error.mockClear();
});

describe("get", () => {
  it("returns response as JSON when response is 200", () => {
    fetch.mockResponse(JSON.stringify(responseData));
    return client.get(url).then(data => {
      expect(fetch.mock.calls.length).toBe(1);
      expect(data).toEqual(responseData);
    });
  });

  it("logs an error and throws when request fails", () => {
    fetch.mockReject();
    return client.get(url).catch(e => {
      expect(console.error.mock.calls.length).toBe(1);
      expect(console.error.mock.calls[0][0]).toBe("REST GET failed");
    });
  });
});

describe("put", () => {
  let putData = {
    id: "testPut"
  };

  it("returns response as JSON when response is 200", () => {
    fetch.mockResponse(JSON.stringify(responseData));
    return client.put(url, putData).then(data => {
      expect(data).toEqual(responseData);
    });
  });

  it("sets method to PUT and correct headers", () => {
    fetch.mockResponse(JSON.stringify(responseData));
    return client.put(url, putData).then(data => {
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0][0]).toEqual(url);
      expect(fetch.mock.calls[0][1]).toEqual({
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "text/plain"
        },
        body: JSON.stringify(putData)
      });
    });
  });

  it("logs an error and throws when request fails", () => {
    fetch.mockReject();
    return client.put(url, putData).catch(e => {
      expect(console.error.mock.calls.length).toBe(1);
      expect(console.error.mock.calls[0][0]).toBe("REST POST failed");
    });
  });
});

describe("post", () => {
  let postData = {
    id: "testPost"
  };

  it("returns response as JSON when response is 200", () => {
    fetch.mockResponse(JSON.stringify(responseData));
    return client.post(url, postData).then(data => {
      expect(data).toEqual(responseData);
    });
  });

  it("sets method to POST and correct headers", () => {
    fetch.mockResponse(JSON.stringify(responseData));
    return client.post(url, postData).then(data => {
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0][0]).toEqual(url);
      expect(fetch.mock.calls[0][1]).toEqual({
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "text/plain"
        },
        body: JSON.stringify(postData)
      });
    });
  });

  it("logs an error and throws when request fails", () => {
    fetch.mockReject();
    return client.post(url, postData).catch(e => {
      expect(console.error.mock.calls.length).toBe(1);
      expect(console.error.mock.calls[0][0]).toBe("REST POST failed");
    });
  });
});

describe("delete", () => {
  it("returns response as JSON when response is 200", () => {
    fetch.mockResponse(JSON.stringify(responseData));
    return client.delete(url).then(data => {
      expect(data).toEqual(responseData);
    });
  });

  it("sets method to DELETE and correct headers", () => {
    fetch.mockResponse(JSON.stringify(responseData));
    return client.delete(url).then(data => {
      expect(fetch.mock.calls.length).toBe(1);
      expect(fetch.mock.calls[0][0]).toEqual(url);
      expect(fetch.mock.calls[0][1]).toEqual({
        method: "DELETE",
        credentials: "same-origin"
      });
    });
  });

  it("logs an error and throws when request fails", () => {
    fetch.mockReject();
    return client.delete(url).catch(e => {
      expect(console.error.mock.calls.length).toBe(1);
      expect(console.error.mock.calls[0][0]).toBe("REST DELETE failed");
    });
  });
});
