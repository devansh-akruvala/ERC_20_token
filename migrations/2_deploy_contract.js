var DsvToken = artifacts.require("DvsToken.sol");

module.exports = function (deployer) {
  deployer.deploy(DsvToken,1000000);
};
