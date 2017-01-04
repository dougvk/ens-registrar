module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.autolink();
  deployer.deploy(MetaCoin);

  // The hex string reolves to the TLD 'eth'
  deployer.deploy(ENS, '0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae')
    .then(function() {
      deployer.deploy(Registrar, ENS.deployed().address, '0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae');
    });
  deployer.deploy(PublicResolver);
};
