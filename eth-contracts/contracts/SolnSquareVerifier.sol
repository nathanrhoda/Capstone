pragma solidity >=0.4.21 <0.6.0;

import "./ERC721MintableComplete.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>


// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721MintableComplete{

    address verifierContract;

    constructor(address addr, string memory name, string memory symbol)
        ERC721MintableComplete(name, symbol)
        public
    {
        verifierContract = Verifier(addr);
    }

    // TODO define a solutions struct that can hold an index & an address
    struct Solutions {
        uint256 index;
        address addr;
    }

    // TODO define an array of the above struct    
    Solutions[] solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(uint256 -> Solution) uniqueSolutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 id);    

    modifier IsUnique(uint256 index, address addr)
    {        
        Solution sol = solutions[index];
        for(uint256 i=0; i<solutions.length; i++) {
            require(solutions[i].index != index && solutions[i].addr != addr, "Solution is not unique");
        }                
        _;
    }

    // TODO Create a function to add the solutions to the array and emit the event
    function add
            (
                uint256 index, 
                address addr
            ) 
            isUnique(index, addr)
    {
        
        Solution solution = Solution({
                                        index: index,
                                        addr: addr,       
                                    });

        solutions.push(solution);        
        emit SolutionAdded(index);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mint
                (
                    uint256 index,
                    address addr
                ) 
            external 
            isUnique(index, addr)
    {                
        // Need to check verify and require it is correct
        
        uniqueSolutions[index] = solution;
        super.mint(addr, index);        
    }
}






  


























