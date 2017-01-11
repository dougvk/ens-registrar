module.exports = {
  build: {
    "index.html": "index.html",
    "app.js": [
      "javascripts/app.js"
    ],
    "app.css": [
      "stylesheets/app.css"
    ],
    "images/": "images/"
  },
  networks: {
    "ropsten": {
      network_id: 1,
      host: "159.203.82.211",
      port: 7002
    },
    "staging": {
      network_id: 1,
      host: "159.203.82.211",
      port: 7003
    },
    "development": {
      network_id: "default"
    }
  },
  rpc: {
    host: "testrpc",
    port: 8545
  }
};
