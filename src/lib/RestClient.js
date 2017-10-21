import "whatwg-fetch";

export default class RestClient {
  get(url) {
    return fetch(url)
      .then(response => validate(response))
      .catch(e => {
        console.error("REST GET failed", this.url, e);
        throw e;
      });
  }

  put(url, data) {}

  post(url, data) {}

  delete(url, id) {}
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
