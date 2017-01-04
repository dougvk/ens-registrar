var ENSLib = require('ethereum-ens');
var fs = require('fs');

var registrarABI = JSON.parse(fs.readFileSync('contracts/ens/abi/Registrar.abi', 'utf8'));

function Registrar(web3, address) {
  this.web3 = web3;
  this.registrar = web3.eth.contract(registrarABI).at(address);
}

Registrar.prototype.available = function(name) {
  var mode = this.registrar.entries(this.web3.sha3(name))[0];
  return mode == 0 || mode == 1;
}

Registrar.prototype.upForAuction = function(name) {
  var mode = this.registrar.entries(this.web3.sha3(name))[0];
  return mode == 1;
}

Registrar.prototype.startAuction = function(name, options, callback) {
  return this.registrar.startAuction(this.web3.sha3(name), options, callback);
}

module.exports = Registrar;
