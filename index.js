module.exports = function(callback) {
  var Registrar = require('./lib/ensAuction');
  var Web3 = require("web3");

  var provider = new Web3(new Web3.providers.HttpProvider("http://testrpc:8545"));
  var registrar = new Registrar(provider, "0xe4afb8dc81ce8d18fc5c860455be624c6873c64e");
  registrar.createBid("test", "0x6d423144f23e7d854f415b1b6e0b1d096907e9f2", "1.123", "0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658", function() {
    console.log("Created bid.");
  });
}
