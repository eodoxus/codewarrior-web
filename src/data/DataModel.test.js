import DataModel from "./DataModel";

const data = {
  id: "test",
  nested: {
    name: "nestedName"
  }
};
const jsonRepresentation = '{"id":"test","nested":{"name":"nestedName"}}';
const mockRequest = jest.fn().mockImplementation(() => {
  return Promise.resolve();
});
const RestClient = DataModel.client;
RestClient.get = mockRequest;
RestClient.put = mockRequest;
RestClient.post = mockRequest;
RestClient.delete = mockRequest;
let model;

beforeEach(() => {
  model = new DataModel(data, "endpoint");
});

afterEach(() => {
  model = undefined;
  RestClient.get.mockClear();
  RestClient.put.mockClear();
  RestClient.post.mockClear();
  RestClient.delete.mockClear();
});

describe("constructor", () => {
  it("assigns all data properties to object and sets url", () => {
    model = new DataModel(data, "endpoint");
    expect(model.id).toBe("test");
    expect(model.nested.name).toBe("nestedName");
    expect(model.$url).toBe("/api/endpoint");
  });
});

describe("load", () => {
  it("calls rest client get with id of the object if it is set", () => {
    return model.load().then(() => {
      expect(RestClient.get.mock.calls.length).toBe(1);
      expect(RestClient.get.mock.calls[0][0]).toBe("/api/endpoint/test");
    });
  });

  it(`resolves but doesn't make a rest client call if object id isn't set`, () => {
    let noIdModel = new DataModel(null, "test");
    return noIdModel.load().then(updatedModel => {
      expect(noIdModel.$url).toEqual("/api/test");
      expect(noIdModel).toEqual(updatedModel);
      expect(RestClient.get.mock.calls.length).toBe(0);
    });
  });

  it(`assigns all properties from response data to the object`, () => {
    RestClient.get.mockReturnValue(
      Promise.resolve({
        id: "testUpdated",
        nested: {
          name: "nestedNameUpdated"
        }
      })
    );
    return model.load().then(() => {
      expect(model.id).toBe("testUpdated");
      expect(model.nested).toEqual({
        name: "nestedNameUpdated"
      });
    });
  });

  describe("delete", () => {
    beforeEach(() => {
      model = new DataModel(data, "endpoint");
      RestClient.delete = jest.fn().mockImplementation(() => {
        return Promise.resolve();
      });
    });

    afterEach(() => {
      RestClient.delete.mockClear();
    });

    it("calls rest client 'delete' with id of the object if it is set", () => {
      return model.delete().then(() => {
        expect(RestClient.delete.mock.calls.length).toBe(1);
        expect(RestClient.delete.mock.calls[0][0]).toBe("/api/endpoint/test");
      });
    });

    it(`resolves but doesn't make a delete call if object id isn't set`, () => {
      let noIdModel = new DataModel(null, "test");
      return noIdModel.delete().then(updatedModel => {
        expect(noIdModel.$url).toEqual("/api/test");
        expect(noIdModel).toEqual(updatedModel);
        expect(RestClient.delete.mock.calls.length).toBe(0);
      });
    });
  });

  describe("save", () => {
    it("calls rest client 'put' if object has id property", () => {
      return model.save().then(() => {
        expect(RestClient.put.mock.calls.length).toBe(1);
        expect(RestClient.put.mock.calls[0][0]).toBe("/api/endpoint");
        expect(RestClient.put.mock.calls[0][1]).toBe(jsonRepresentation);
      });
    });

    it("calls rest client 'post' if object has id property", () => {
      delete model.id;
      return model.save().then(() => {
        expect(RestClient.put.mock.calls.length).toBe(1);
        expect(RestClient.put.mock.calls[0][0]).toBe("/api/endpoint");
        expect(RestClient.put.mock.calls[0][1]).toBe(
          '{"nested":{"name":"nestedName"}}'
        );
      });
    });

    it("updates object with reponse data on create", () => {
      delete model.id;
      RestClient.post.mockReturnValue(
        Promise.resolve({
          id: "testUpdated",
          nested: {
            name: "nestedNameUpdated"
          }
        })
      );
      return model.save().then(() => {
        expect(model.id).toBe("testUpdated");
        expect(model.nested).toEqual({
          name: "nestedNameUpdated"
        });
      });
    });

    it("updates object with reponse data on update", () => {
      RestClient.put.mockReturnValue(
        Promise.resolve({
          id: "testUpdated",
          nested: {
            name: "nestedNameUpdated"
          }
        })
      );
      return model.save().then(() => {
        expect(model.id).toBe("testUpdated");
        expect(model.nested).toEqual({
          name: "nestedNameUpdated"
        });
      });
    });
  });

  describe("absorbData", () => {
    it("assigns all data properties to the object", () => {
      model.absorbData({
        prop: "1",
        prop2: {
          prop3: "4"
        }
      });
      expect(model.prop).toBe("1");
      expect(model.prop2).toEqual({ prop3: "4" });
    });
  });

  describe("toJson", () => {
    it("returns JSON string representation of object", () => {
      expect(model.toJson()).toBe(jsonRepresentation);
    });
  });

  describe("toPojo", () => {
    it("returns plain old javascript representation of object", () => {
      expect(model.toPojo()).toEqual({
        id: "test",
        nested: { name: "nestedName" }
      });
    });
  });
});
