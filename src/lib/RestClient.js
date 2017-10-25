import "whatwg-fetch";

export default class RestClient {
  get(url, config = {}) {
    return executeRequest(url, config);
  }

  put(url, data, config = {}) {
    return executeRequest(
      url,
      Object.assign(config, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
    );
  }

  post(url, data, config = {}) {
    return executeRequest(
      url,
      Object.assign(config, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
    );
  }

  delete(url, id, config = {}) {
    return executeRequest(
      url,
      Object.assign(config, {
        method: "DELETE"
      })
    );
  }
}

async function executeRequest(url, config) {
  try {
    let response = await fetch(url, fetchConfig(config));
    return validate(response);
  } catch (e) {
    console.error(`REST ${config.method || "GET"} failed`, url, e);
    throw e;
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
