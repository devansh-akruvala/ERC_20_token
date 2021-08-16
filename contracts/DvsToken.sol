pragma solidity 0.5.16;

contract DvsToken{  
    // name of token
    string public name ="Dvs Token";
    // symbol of token
    string public symbol="DVS";
    // standard of token 
    string public standard="DVS Token v1.0";
   
    uint256 public totalSupply;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );


    mapping(address=>uint256) public balanceOf;

    constructor(uint256 _initialSupply) public{
        balanceOf[msg.sender] = _initialSupply;
        totalSupply=1000000;
        // it allocates initial supply
    }

    function transfer(address _to, uint256 _value) public returns(bool success) {
        
        // Exception if account doesn't have enough token
        require(balanceOf[msg.sender] >= _value);
        //transfer the test
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        //transfer event
        emit Transfer(msg.sender,_to ,_value);

        // retuen bool
        return true;
    }


}