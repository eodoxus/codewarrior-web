import "whatwg-fetch";

export default class RestClient {
  static toQueryString(params) {
    return (
      "?" +
      Object.keys(params)
        .map(function(key) {
          return (
            encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
          );
        })
        .join("&")
    );
  }

  get(url, config = {}) {
    return executeRequest(url, config);
  }

  put(url, data, config = {}) {
    return executeRequest(
      url,
      Object.assign(config, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain"
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
          "Content-Type": "text/plain"
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
    //url += (url.includes("?") ? "&" : "?") + "XDEBUG_SESSION_START=Jason";
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
  return response.json();
}
