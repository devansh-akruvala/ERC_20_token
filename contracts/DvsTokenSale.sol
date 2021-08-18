pragma solidity 0.5.16; 

import "./DvsToken.sol";
contract DvsTokenSale{
     
    address admin;
    DvsToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(
        address _buyer,
        uint256 _amount
    );

     constructor(DvsToken _tokenContract, uint256 _tokenPrice) public{
         //Assing an admin
        admin = msg.sender;
         // token contract
        tokenContract = _tokenContract;
         // token price
         tokenPrice = _tokenPrice;
     }
    // multiply
    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

     //buy tokens
     function buyTokens(uint256 _numberOfTokens) public payable{
        
        // require that value is equal to tokens
        require(msg.value == multiply(_numberOfTokens,tokenPrice)); 
        // require that contract has enough token
         require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
        // requires that a transfer is successful
         require(tokenContract.transfer(msg.sender, _numberOfTokens));
        //keeps track of number of token sold.
        tokensSold += _numberOfTokens;
        //trigger(emit sell event)
        emit Sell(msg.sender, _numberOfTokens);  
     } 

    // ending token dsvtoken sale
    function endSale() public{
        // requires admin(only admin can do this)
        require(msg.sender == admin);
        // transfer remaning Dvs token to admin
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
        // remove this contract
        selfdestruct(msg.sender);
    }


}