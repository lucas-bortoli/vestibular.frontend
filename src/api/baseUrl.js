const DEV = false;

let port = window["location"].port;

if (DEV) {
  port = 8000;
}

const baseUrl = `${window["location"].protocol}//${window["location"].hostname}:${port}/api`;

export default baseUrl;
