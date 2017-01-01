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

  it("registers the TLD test", function() {
    //TestRegistrar.deployed().register(web3.sha3('lame'), accounts[0])
      //.then(function() {
        //assert.equal(ens.owner('lame.test'), accounts[0], "The owner of lame.test isn't correct");
      //});
    // 0 means the name is avaiable and no auction has been started.
    assert.equal(auctionRegistrar.registrar.entries(web3.sha3('lame'))[0], 0);
  });
});
