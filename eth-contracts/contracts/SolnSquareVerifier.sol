pragma solidity >=0.4.21 <0.6.0;

import "./ERC721MintableComplete.sol";

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721MintableComplete{

    IVerifier private verifierContract;
    uint8 counter = 1;
    constructor(address addr, string memory name, string memory symbol)
        ERC721MintableComplete(name, symbol)
        public
    {
        verifierContract = IVerifier(addr);        
    }

    // TODO define a solutions struct that can hold an key & an address
    struct Solution {
        bytes32 key;
        uint256 index;
        address addr;
        bool minted;
    }

    // TODO define an array of the above struct    
    Solution[] solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) uniqueSolutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 id);    

    event Minted(uint256 id);    

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
                bytes32 solutionKey    
            )             
            external
    {                               
        Solution memory solution = Solution(solutionKey, counter,msg.sender,false);        
        solutions.push(solution);        
        
        uniqueSolutions[solutionKey] = solution;        
        counter++;
        emit SolutionAdded(solution.index);        
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mint
                (     
                    uint[2] calldata a,
                    uint[2][2] calldata b, 
                    uint[2] calldata c,
                    uint[2] calldata input,            
                    address addr                                   
                ) 
            external             
    {            
        bool verified = verifierContract.verifyTx(a, b, c, input);
        require(verified == true, "Solution could not be verified");

        bool flag = false;
        bytes32 key;                     
        for(uint8 i=0; i<solutions.length; i++){
            flag = true;
            if(solutions[i].addr == addr) {                 
                key = solutions[i].key;                       
            }                    
        }
        
        require(uniqueSolutions[key].minted == false, "This solution has been used before.It is already minted");  
        require(uniqueSolutions[key].addr != address(0), "This address is invalid SolnSquareVerifier");                                  
        super.mint(uniqueSolutions[key].addr, uniqueSolutions[key].index);        
        uniqueSolutions[key].minted = true;
        emit Minted(uniqueSolutions[key].index);
    }

    function getUniqueSolutionByKey
                (
                    bytes32 key
                )
                external
                view
                returns (bool)
    {
        
        return uniqueSolutions[key].minted;
    }

    function getUniqueSolutionByIndex
                (
                    uint256 index
                )
                external
                view
                returns (bool)
    {
        bytes32 key;        
        for(uint8 i=0; i<solutions.length; i++){     
            if(solutions[i].index == index) {                 
                key = solutions[i].key;                       
            }                    
        }
        return uniqueSolutions[key].minted;
    }

    function getSolutionKey
        (
                    uint[2] calldata a,
                    uint[2][2] calldata b, 
                    uint[2] calldata c,
                    uint[2] calldata input
        )
        external
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(a, b, c, input));
    }
}

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract IVerifier {        
    function verifyTx(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) public returns (bool r); 
}