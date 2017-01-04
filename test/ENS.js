var ENSLib = require('ethereum-ens');
var ENSAuction = require('../lib/ensAuction');

contract("ENS integration", function(accounts) {
  var ens;
  var registrar;
  var auctionRegistrar;

  before("set up ENS Library", function() {
    ens = new ENSLib(web3, ENS.deployed().address);
  });

  //before("set up registrar owner", function() {
    //registrar = TestRegistrar.deployed().address;
    //ens.registry.setOwner(ens.namehash('test'), registrar, {from: accounts[0]});
  //});

  before("set up auction registrar", function() {
    auctionRegistrar = new ENSAuction(web3, Registrar.deployed().address);
  });

  it("demonstrates that the domain name isn't up for auction", function() {
    //TestRegistrar.deployed().register(web3.sha3('lame'), accounts[0])
      //.then(function() {
        //assert.equal(ens.owner('lame.test'), accounts[0], "The owner of lame.test isn't correct");
      //});
    // 0 means the name is avaiable and no auction has been started.
    assert.isTrue(auctionRegistrar.available('test'), 'test is available as a domain name');
    assert.isFalse(auctionRegistrar.upForAuction('test'), 'test isn\'t up for auction');
  });

  it("can start an auction", function() {
    //var auctionStartedEvent = Registrar.deployed().AuctionStarted(function(err, res) {
      //assert.isNull(err, 'no error on the auction');
      //assert.equal(res.args.hash, web3.sha3('test'), 'res created the auction for the name `test`');
    //});
    auctionRegistrar.startAuction('test', {from: accounts[0], gas: 1000000}, function() {
      assert.isTrue(auctionRegistrar.upForAuction('test'), '`test` is officially up for auction');
    });
  });
});
