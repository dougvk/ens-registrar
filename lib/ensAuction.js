var ENSLib = require('ethereum-ens');
var fs = require('fs');

var registrarABI = JSON.parse(fs.readFileSync('contracts/ens/abi/Registrar.abi', 'utf8'));

function Registrar(web3, address) {
  this.web3 = web3;
  this.registrar = web3.eth.contract(registrarABI).at(address);
}

module.exports = Registrar;
