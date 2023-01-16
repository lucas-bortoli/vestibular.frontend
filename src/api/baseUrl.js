const DEV = false;

let port = window["location"].port;

if (DEV) {
  port = 8000;
}

const baseUrl = `${window["location"].protocol}//${window["location"].hostname}:${
  8000 || window["location"].port
}/api`;

export default baseUrl;
