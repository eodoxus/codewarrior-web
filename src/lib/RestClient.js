import "whatwg-fetch";

const _inFlight = [];

export default class RestClient {
  static enqueue(key, url, config) {
    const promise = new Promise((resolve, reject) => {
      fetch(url, fetchConfig(config))
        .then(response => {
          const iDx = _inFlight.findIndex(request => request.key === key);
          _inFlight.splice(iDx, 1);
          resolve(validate(response));
        })
        .catch(e => reject(e));
    });
    _inFlight.push({ key, promise });
    return promise;
  }

  static isInFlight(key) {
    const request = _inFlight.find(request => request.key === key);
    if (request) {
      return request.promise;
    }
  }

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
    const requestKey = url + JSON.stringify(config);
    const request = RestClient.isInFlight(requestKey);
    const response = request
      ? await request
      : await RestClient.enqueue(requestKey, url, config);
    return response;
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
