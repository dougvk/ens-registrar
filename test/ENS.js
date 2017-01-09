var ENSAuction = require('../lib/ensAuction');
var AuctionRegistrar = require('../build/contracts/Registrar.sol');
var Web3 = require('web3');

contract("ENS integration", function(accounts) {
  var registrar;
  var auctionRegistrar;

  before("set up auction registrar", function() {
    registrar = Registrar.deployed();
    auctionRegistrar = new ENSAuction(new Web3.providers.HttpProvider('http://testrpc:8545'), registrar.address, accounts[0]);
  });

  it("demonstrates that the domain name isn't available", function(done) {
    auctionRegistrar.available('test')
      .then(function(isAvailable) {
        assert.isTrue(isAvailable);
        done();
      });
  });

  it("demonstrates that the domain name isn't up for auction", function(done) {
    auctionRegistrar.upForAuction('test')
      .then(function(isUpForAuction) {
        assert.isFalse(isUpForAuction);
        done();
      });
  });

  it("can start an auction", function(done) {
    auctionRegistrar.startAuction('test')
      .then(function(started) {
        assert.isTrue(started);
        done();
      });
  });

  it("can start a bid", function(done) {
    auctionRegistrar.createBid('test', accounts[0], '1.123', web3.sha3('secret'))
      .then(function() {
        return registrar.entries(web3.sha3('test'))
      })
      .then(function(entry) {
        assert.isAbove(entry[2].toNumber() * 1000, Date.now(), 'the end date of the bid is greater than now');
        done();
      });
  });

  it("can reveal a bid", function(done) {
    auctionRegistrar.createBid('test', accounts[0], '.123', web3.sha3('secret'))
      .then(function(bidCreated) {
        assert.isTrue(bidCreated);
        return registrar.entries(web3.sha3('test'))
      })
      .then(function(entry) {
        assert.isAbove(entry[2].toNumber() * 1000, Date.now(), 'the end date of the bid is greater than now');
        return Promise.resolve(true);
      })
      .then(function() {
        return auctionRegistrar.revealBid('test', accounts[0], '.123', web3.sha3('secret'));
      })
      .then(function() {
        return auctionRegistrar.currentWinner('test');
      })
      .then(function(owner) {
        assert.equal(owner, accounts[0], 'owner of the winning bid is correct');
        done();
      })
      .catch(done);
  });
});
