import "whatwg-fetch";

export default class RestClient {
  delete(url, id, configOverrides = {}) {
    let config = Object.assign(configOverrides, {
      method: "DELETE"
    });
    return fetch(url, fetchConfig(config))
      .then(response => validate(response))
      .catch(e => {
        console.error("REST PUT failed", this.url, e);
        throw e;
      });
  }

  get(url, configOverrides = {}) {
    return fetch(url, fetchConfig(configOverrides))
      .then(response => validate(response))
      .catch(e => {
        console.error("REST GET failed", this.url, e);
        throw e;
      });
  }

  post(url, data, configOverrides = {}) {
    let config = Object.assign(configOverrides, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      }
    });
    return fetch(url, fetchConfig(config))
      .then(response => validate(response))
      .catch(e => {
        console.error("REST POST failed", this.url, e);
        throw e;
      });
  }

  put(url, data, configOverrides = {}) {
    let config = Object.assign(configOverrides, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    return fetch(url, fetchConfig(config))
      .then(response => validate(response))
      .catch(e => {
        console.error("REST PUT failed", this.url, e);
        throw e;
      });
  }
}

function fetchConfig(overrides) {
  let defaults = {
    credentials: "same-origin"
  };
  return Object.assign(defaults, overrides);
}

function validate(response) {
  if (response.status >= 200 && response.status < 300) {
    return response.json();
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}
