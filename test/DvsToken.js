var DvsToken = artifacts.require("./DvsToken.sol");

contract('DsvToken',function(accounts){

    var tokenInstance;

    it('initializes the contract with the correct values', function() {
      return DvsToken.deployed().then(function(instance) {
        tokenInstance = instance;
        return tokenInstance.name();
      }).then(function(name) {
        assert.equal(name, 'Dvs Token', 'has the correct name');
        return tokenInstance.symbol();
      }).then(function(symbol) {
        assert.equal(symbol, 'DVS', 'has the correct symbol');
        return tokenInstance.standard();
      }).then(function(standard) {
        assert.equal(standard, 'DVS Token v1.0', 'has the correct standard');
      });
    })
  
    it('allocates the initial supply upon deployment', function() {
        return DvsToken.deployed().then(function(instance) {
          tokenInstance = instance;
          return tokenInstance.totalSupply();
        }).then(function(totalSupply) {
          assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000');
          return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance) {
          assert.equal(adminBalance.toNumber(), 1000000, 'it allocates the initial supply to the admin account');
        });
      });
      it('transfers token ownership', function() {
        return DvsToken.deployed().then(function(instance) {
          tokenInstance = instance;
          // Test `require` statement first by transferring something larger than the sender's balance
          return tokenInstance.transfer.call(accounts[1], 999999999);
        }).then(assert.fail).catch(function(error) {
          assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
          return tokenInstance.transfer.call(accounts[1], 250000, { from: accounts[0] });
        }).then(function(success) {
          assert.equal(success, true, 'it returns true');
          return tokenInstance.transfer(accounts[1], 250000, { from: accounts[0] });
        }).then(function(receipt) {
          assert.equal(receipt.logs.length, 1, 'triggers one event');
          assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
          assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from');
          assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transferred to');
          assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');
          return tokenInstance.balanceOf(accounts[1]);
        }).then(function(balance) {
          assert.equal(balance.toNumber(), 250000, 'adds the amount to the receiving account');
          return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance) {
          assert.equal(balance.toNumber(), 750000, 'deducts the amount from the sending account');
        });
      });

      it("approves token for delegated transfer", function(){
          return DvsToken.deployed().then(function(instacne) {
                tokenInstance = instacne;
                return tokenInstance.approve.call(accounts[1],100);
            }).then(function(success) {
                assert.equal(success,true,"It returns true");
                return tokenInstance.approve(accounts[1],100,{from: accounts[0]});
            }).then(function(receipt){
                assert.equal(receipt.logs.length, 1, 'triggers one event');
                assert.equal(receipt.logs[0].event, 'Approval', 'should be the "Approval" event');
                assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are authorized from');
                assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are authorized to');
                assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer amount');
                return tokenInstance.allownace(accounts[0],accounts[1]);
            }).then(function(allownace){
                assert.equal(allownace,100,'stores the allownace for delegated transfer');
            });
      });
      
    it("handles delegated token transfers",function(){
        return DvsToken.deployed().then(function(instance) {
            tokenInstance = instance;
            fromAccount = accounts[2];
            toAccount = accounts[3];
            spendingAccount = accounts[4];
            // transfer some accounts
            return tokenInstance.transfer(fromAccount,100,{from: accounts[0]});
        }).then(function(receipt){
            // approve spendingAccount to spend token form fromACcount
            return tokenInstance.approve(spendingAccount,10,{from: fromAccount});
        }).then(function(receipt){
            // try transfering something larger than the senders balance
            return tokenInstance.transferFrom(fromAccount, toAccount, 9999, { from: spendingAccount});
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'Cannot transfer value lafrger than balance');
            // try transfering something larger than approved amount
            return tokenInstance.transferFrom(fromAccount, toAccount, 20, {from :spendingAccount});
         }).then(assert.fail).catch(function(error) {
             assert(error.message.indexOf('revert') >=0, 'Cannot transfer value larger than approved amount');
             return tokenInstance.transferFrom.call(fromAccount, toAccount, 10 , { from: spendingAccount});
         }).then(function(success){
             assert.equal(success,true);
             return tokenInstance.transferFrom(fromAccount, toAccount, 10 , { from: spendingAccount});
         }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
            assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the account the tokens are transfer from');
            assert.equal(receipt.logs[0].args._to, toAccount, 'logs the account the tokens are transfered to');
            assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount');     
            return tokenInstance.balanceOf(fromAccount);
         }).then(function(balance){
             assert.equal(balance.toNumber(),90 , 'deducts the amount from sending amount')
             return tokenInstance.balanceOf(toAccount);
         }).then(function(balance){
            assert.equal(balance.toNumber(),10 , 'adds the amount from receiving amount');
            return tokenInstance.allownace(fromAccount,spendingAccount);
        }).then(function(allownace) {
            assert.equal(allownace,0,'deducts the amount from the allowance')
        });
    });
});
