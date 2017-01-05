var ENSLib = require('ethereum-ens');
var fs = require('fs');

var registrarABI = JSON.parse(fs.readFileSync('contracts/ens/abi/Registrar.abi',
                                              'utf8'));

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

Registrar.prototype.createBid = function(name, account, max, secret, callback) {
  if (this.available(name)) {
    if (!this.upForAuction(name)) {
      this.startAuction(
        name,
        {from: account, gas: 1000000},
        this.createBid(name, account, max, secret, callback)
      );
    } else {
      var bid = this.registrar.shaBid(this.web3.sha3(name), account,
                                      this.web3.toWei(max, 'ether'), secret);
      this.registrar.newBid(bid, {from: account,
                                  value: this.web3.toWei(max, 'ether'),
                                  gas: 1000000}, callback);
    }
  } else {
    console.log('NOT AVAILABLE');
  }
}

Registrar.prototype.revealBid = function(name, account, max, secret, callback) {
  this.registrar.unsealBid(this.web3.sha3(name), account,
                           this.web3.toWei(max, 'ether'), secret,
                           {from: account, gas: 1000000}, callback);
}

module.exports = Registrar;
