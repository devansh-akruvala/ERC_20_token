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

    // transfer event
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address=>uint256) public balanceOf;
    // allowance
    mapping(address=>mapping(address=>uint256)) public allownace;

    constructor(uint256 _initialSupply) public{
        balanceOf[msg.sender] = _initialSupply;
        totalSupply=_initialSupply;
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
    // approve
    function approve(address _spender, uint256 _value) public returns(bool success){
        //allownace
        allownace[msg.sender][_spender] = _value;
        // Approve event
        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    // transferfrom
    function transferFrom(address _from, address _to, uint256 _value) public returns(bool success){
        // requires from has enough token
        require(_value <= balanceOf[_from]);
        // reqires token is big enough
        require(_value <= allownace[_from][msg.sender]);
        // change balance
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        //update allowance
        allownace[_from][msg.sender] -= _value;
        //Transfer event
        emit Transfer(_from, _to, _value);
        //return bool
        return true;
    }

}