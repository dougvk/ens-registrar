// The hex string reolves to the TLD 'eth'
module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.autolink();
  deployer.deploy(MetaCoin);
  deployer.deploy(ENS, '0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae')
    .then(function() {
      //deployer.deploy(TestRegistrar, ENS.deployed().address, '0x04f740db81dc36c853ab4205bddd785f46e79ccedca351fc6dfcbd8cc9a33dd6');
      deployer.deploy(Registrar, ENS.deployed().address, '0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae');
    });
  deployer.deploy(PublicResolver);
};
