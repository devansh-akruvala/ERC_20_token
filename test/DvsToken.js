var DvsToken = artifacts.require("./DvsToken.sol");

contract('DsvToken',function(accounts){
    it('sets total supply upon deployment',function(){
        return DvsToken.deployed().then(
            function(instance){
                tokenInstance=instance;
                return tokenInstance.totalSupply();
            }
        ).then(function(totalSupply) {
                assert.equal(totalSupply.toNumber(),1000000,"sets the total supply to 1,000,000")
        })
    })
})