var ENSLib = require('ethereum-ens');
var ENSAuction = require('../lib/ensAuction');

contract("ENS integration", function(accounts) {
  var ens;
  var registrar;
  var auctionRegistrar;

  before("set up ENS Library", function() {
    ens = new ENSLib(web3, ENS.deployed().address);
  });

  before("set up auction registrar", function() {
    registrar = Registrar.deployed();
    auctionRegistrar = new ENSAuction(web3, registrar.address);
  });

  it("demonstrates that the domain name isn't up for auction", function() {
    assert.isTrue(auctionRegistrar.available('test'), 'test is available as a domain name');
    assert.isFalse(auctionRegistrar.upForAuction('test'), 'test isn\'t up for auction');
  });

  it("can start an auction", function() {
    auctionRegistrar.startAuction('test', {from: accounts[0], gas: 1000000}, function() {
      assert.isTrue(auctionRegistrar.upForAuction('test'), '`test` is officially up for auction');
    });
  });

  it("can start a bid", function() {
    auctionRegistrar.createBid('test', accounts[0], '1.123', web3.sha3('secret'), function() {
      registrar.entries(web3.sha3('test'))
        .then(function() {
          assert.isAbove(arguments[0][2].toNumber() * 1000, Date.now(), 'the end date of the bid is greater than now');
        });
    })
  });
});
