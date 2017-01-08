var ENSLib = require('ethereum-ens');
var fs = require('fs');
var AuctionRegistrar = require('../build/contracts/Registrar.sol');
var Web3 = require('web3');

function Registrar(provider, registrarAddress, fromAddress) {
  this.web3 = new Web3(provider);

  AuctionRegistrar.defaults({
    from: fromAddress,
    gas: 1000000
  });
  AuctionRegistrar.setProvider(provider);

  this.registrar = AuctionRegistrar.at(registrarAddress)
}

Registrar.prototype.available = function(name) {
  return this.registrar.entries(this.web3.sha3(name))
    .then(function(entry) {
      var mode = entry[0];
      return mode == 0 || mode == 1;
    });
}

Registrar.prototype.upForAuction = function(name) {
  return this.registrar.entries(this.web3.sha3(name))
    .then(function(entry) {
      var mode = entry[0];
      return mode == 1;
    });
}

Registrar.prototype.startAuction = function(name, options) {
  return this.registrar.startAuction(this.web3.sha3(name), options)
    .then(function() {
      return true;
    });
}

Registrar.prototype.createBid = function(name, account, max, secret) {
  return this.available(name)
    .then(function(available) {
      if (available) {
        return this.upForAuction(name);
      }
      return Promise.reject("Not available");
    }.bind(this))
    .then(function(isUpForAuction) {
      if (!isUpForAuction) {
        return this.startAuction(name, {from: account, gas: 500000});
      } else {
        return Promise.resolve(true);
      }
    }.bind(this))
    .then(function(readyToBid) {
      if (readyToBid) {
        var bid = this.registrar.shaBid(this.web3.sha3(name), account,
                                        this.web3.toWei(max, 'ether'), secret);
        return this.registrar.newBid(bid, {from: account,
                                      value: this.web3.toWei(max, 'ether'),
                                      gas: 500000});
      }
      return Promise.reject('Can\'t start bid');
    }.bind(this))
    .then(function() {
      return Promise.resolve(true);
    })
    .catch(function(err) {
      console.log(err);
    });
}

Registrar.prototype.revealBid = function(name, account, max, secret) {
  return this.registrar.unsealBid(this.web3.sha3(name), account,
                           this.web3.toWei(max, 'ether'), secret,
                           {from: account, gas: 500000});
}

module.exports = Registrar;
