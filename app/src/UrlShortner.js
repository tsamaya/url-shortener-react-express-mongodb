const postURL = url => {
  const api = '/api/v1/short';
  // const api = 'http://localhost/api/v1/short';
  return fetch(api, {
    method: 'POST',
    body: JSON.stringify({
      url,
      secret_key: null,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    // credentials: 'same-origin',
  }).then(
    response =>
      // response.status; //= > number 100–599
      // response.statusText; //= > String
      // response.headers; //= > Headers
      // response.url; //= > String

      response.text(),
    error => error.message //= > String
  );
};

export default postURL;
