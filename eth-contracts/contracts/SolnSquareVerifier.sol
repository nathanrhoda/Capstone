pragma solidity >=0.4.21 <0.6.0;

import "./ERC721MintableComplete.sol";

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721MintableComplete{

    IVerifier private verifierContract;
    uint8 counter = 0;
    constructor(address addr, string memory name, string memory symbol)
        ERC721MintableComplete(name, symbol)
        public
    {
        verifierContract = IVerifier(addr);        
    }

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint8 index;
        address addr;
        bool minted;
    }

    // TODO define an array of the above struct    
    Solution[] solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(uint256 => Solution) uniqueSolutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 id);    

    event Minted(bool isMinted);    

    modifier isUnique(address addr)
    {                   
        for(uint256 i=0; i<solutions.length; i++) {
            require(solutions[i].addr != addr, "Solution is not unique");
        }                
        _;
    }

    // TODO Create a function to add the solutions to the array and emit the event
    function add
            (
                uint[2] calldata a,
                uint[2][2] calldata b, 
                uint[2] calldata c,
                uint[2] calldata input             
            )             
            external
    {                
        bool verified = verifierContract.verifyTx(a, b, c, input);
        require(verified == true, "Solution could not be verified");
        Solution memory solution = Solution(1,msg.sender,false);

        
        solutions.push(solution);        
        
        uniqueSolutions[solution.index] = solution;
        require(uniqueSolutions[solution.index].addr != address(0), "This address should be valid");                                  
        emit SolutionAdded(solution.index);
        counter++;
    }

    function toString(address account) public pure returns(string memory) {
        return toString(abi.encodePacked(account));
    }

    
function toString(bytes memory data) public pure returns(string memory) {
    bytes memory alphabet = "0123456789abcdef";

    bytes memory str = new bytes(2 + data.length * 2);
    str[0] = "0";
    str[1] = "x";
    for (uint i = 0; i < data.length; i++) {
        str[2+i*2] = alphabet[uint(uint8(data[i] >> 4))];
        str[3+i*2] = alphabet[uint(uint8(data[i] & 0x0f))];
    }
    return string(str);
}

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mint
                (     
                    address addr                                   
                ) 
            external             
    {            
        string memory a = toString(addr);
        bool flag = false;
        uint8 index;                     
        for(uint8 i=0; i<solutions.length; i++){
            flag = true;
            if(solutions[i].addr == msg.sender) {                 
                index = solutions[i].index;                       
            }                    
        }
        
        require(uniqueSolutions[index].minted == false, "This solution has been used before.It is already minted");  
        require(uniqueSolutions[index].addr != address(0), "This address is invalid SolnSquareVerifier");                                  
        super.mint(uniqueSolutions[index].addr, index);        
        uniqueSolutions[index].minted = true;
        emit Minted(uniqueSolutions[index].minted);
    }

    function getUniqueSolutionByIndex
                (
                    uint8 index
                )
                external
                view
                returns (bool)
    {
        return uniqueSolutions[index].minted;
    }
}

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract IVerifier {        
    function verifyTx(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) public returns (bool r); 
}