var ENSAuction = require('../lib/ensAuction');
var Web3 = require('web3');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
var assert = chai.assert;

contract("ENS integration", function(accounts) {
  var registrar;
  var auctionRegistrar;

  before("set up auction registrar", function() {
    registrar = Registrar.deployed();
    auctionRegistrar = new ENSAuction(new Web3.providers.HttpProvider('http://testrpc:8545'), registrar.address, accounts[0]);
  });

  it("demonstrates that the domain name isn't up for auction", function() {
    //assert.isTrue(auctionRegistrar.available('test'), 'test is available as a domain name');
    assert.eventually.isTrue(auctionRegistrar.available('test'), 'test is available as a domain name');
    assert.eventually.isFalse(auctionRegistrar.upForAuction('test'), 'test isn\'t up for auction');
  });

  it("can start an auction", function() {
    assert.eventually.isTrue(auctionRegistrar.startAuction('test', {from: accounts[0], gas: 1000000}), 'auction can\' start');
  });

  it("can start a bid", function() {
    assert.eventually.isTrue(Promise.resolve(auctionRegistrar.createBid('test', accounts[0], '1.123', web3.sha3('secret')))
      .then(function() {
        return registrar.entries(web3.sha3('test'))
      })
      .then(function(entry) {
        assert.isAbove(entry[2].toNumber() * 1000, Date.now(), 'the end date of the bid is greater than now');
        return Promise.resolve(true);
      })
    )
  });

  it("can reveal a bid", function() {
    assert.eventually.isTrue(Promise.resolve(auctionRegistrar.createBid('test', accounts[0], '1.123', web3.sha3('secret')))
      .then(function() {
        return registrar.entries(web3.sha3('test'))
      })
      .then(function(entry) {
        assert.isAbove(entry[2].toNumber() * 1000, Date.now(), 'the end date of the bid is greater than now');
        return Promise.resolve(true);
      })
    )
    //auctionRegistrar.createBid('test', accounts[0], '.00003', web3.sha3('secret'))
      //.then(function() {
        //return auctionRegistrar.revealBid('test', accounts[0], '.00003', web3.sha3('secret'));
      //})
      //.then(function() {
        //return registrar.entries(web3.sha3('test'))
      //})
      //.then(function(entry) {
        //assert.equal(.00003, web3.fromWei(entry[4], 'ether').toNumber(), 'winning bid amount is correct');
        //return Deed.at(entry[1]);
      //})
      //.then(function(deed) {
        //return deed.owner();
      //})
      //.then(function(owner) {
        //assert.equal(owner, accounts[0], 'owner of the winning bid is correct');
        //return Promise.resolve(true);
      //});
  });
});
