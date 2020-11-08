const localStorageKey = "codewarrior-data";

export default class LocalStorageClient {
  constructor() {
    try {
      const data = localStorage.getItem(localStorageKey) || "{}";
      this.data = JSON.parse(data);
    } catch (e) {
      this.data = {};
    }
  }

  get(key) {
    let data = this.data[key];
    if (!data) {
      const keyWithoutId = key.substr(0, key.lastIndexOf("/"));
      data = this.data[keyWithoutId];
    }
    return data;
  }

  post(key, data) {
    return this.put(key, data);
  }

  put(key, data) {
    this.data[key] = typeof data === 'string' ? JSON.parse(data) : data;
    this._updateLocalStorage();
  }

  delete(key) {
    delete this.data[key];
    this._updateLocalStorage();
  }

  _updateLocalStorage() {
    localStorage.setItem(localStorageKey, JSON.stringify(this.data));
  }
}
