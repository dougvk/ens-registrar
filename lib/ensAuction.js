var AuctionRegistrar = require('../build/contracts/Registrar.sol');
var Deed = require('../build/contracts/Deed.sol');
var Web3 = require('web3');

function Registrar(provider, registrarAddress, fromAddress) {
  this.web3 = new Web3(provider);

  AuctionRegistrar.defaults({
    from: fromAddress,
    gas: 1000000
  });
  AuctionRegistrar.setProvider(provider);
  Deed.setProvider(provider);

  this.registrar = AuctionRegistrar.at(registrarAddress)
}

Registrar.prototype.available = function(name) {
  return this.registrar.entries(this.web3.sha3(name))
    .then(function(entry) {
      var mode = entry[0];
      return Promise.resolve(mode == 0 || mode == 1);
    });
}

Registrar.prototype.upForAuction = function(name) {
  return this.registrar.entries(this.web3.sha3(name))
    .then(function(entry) {
      var mode = entry[0];
      return Promise.resolve(mode == 1);
    });
}

Registrar.prototype.startAuction = function(name, options) {
  return this.registrar.startAuction(this.web3.sha3(name), options)
    .then(function() {
      return Promise.resolve(true);
    });
}

Registrar.prototype.currentWinner = function(name) {
  return this.registrar.entries(this.web3.sha3(name))
    .then(function(entry) {
      return Deed.at(entry[1]);
    })
    .then(function(deed) {
      return deed.owner();
    })
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
        return this.startAuction(name);
      } else {
        return Promise.resolve(true);
      }
    }.bind(this))
    .then(function(readyToBid) {
      if (readyToBid) {
        return this.registrar.shaBid(this.web3.sha3(name), account,
                                        this.web3.toWei(max, 'ether'), secret);
      }
      return Promise.reject('Can\'t start bid');
    }.bind(this))
    .then(function(bid) {
      return this.registrar.newBid(bid, {value: this.web3.toWei(max, 'ether')});
    }.bind(this))
    .then(function() {
      return Promise.resolve(true);
    })
    .catch(console.log.bind(console));
}

Registrar.prototype.revealBid = function(name, account, max, secret) {
  return this.registrar.unsealBid(this.web3.sha3(name), account,
                           this.web3.toWei(max, 'ether'), secret);
}

module.exports = Registrar;
