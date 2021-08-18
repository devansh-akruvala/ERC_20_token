var DvsToken = artifacts.require("DvsToken.sol");
var DvsTokenSale = artifacts.require("DvsTokenSale.sol");

module.exports = function (deployer) {
  deployer.deploy(DvsToken,1000000).then(function() {
    // token price is 0.001 ether
    var tokenPrice = 1000000000000000;
    return deployer.deploy(DvsTokenSale,DvsToken.address,tokenPrice);
  }
  );
};
