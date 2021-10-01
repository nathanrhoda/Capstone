var Verifier = artifacts.require('Verifier');
var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
var Proof = require('./proof1.json');
const truffleAssert = require('truffle-assertions');


contract('SolnSquareVerifier', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('SolnSquareVerifier Tests', function () {
        beforeEach(async function () {   
            const verifier = await Verifier.new({from: account_one});          
            this.contract = await SolnSquareVerifier.new(verifier.address, "UDACITY TOKEN", "UDC");            
        }) 

        //Test if a new solution can be added for contract - SolnSquareVerifier
        it('should be able to add a new solution to contract', async function () {             
                    
            let tx = await this.contract.add(Proof.proof.a, Proof.proof.b, Proof.proof.c, Proof.inputs, {from: account_one});                          
            truffleAssert.eventEmitted(tx, 'SolutionAdded', (ev) => {
                return ev.id == 1;
            });                                    
        })

        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('should be able to mint a ERC21 Token', async function () { 
            let isMinted = await this.contract.getUniqueSolutionByIndex.call(1);
            assert.equal(isMinted, false, "Coin should not be minted");
            await this.contract.add(Proof.proof.a, Proof.proof.b, Proof.proof.c, Proof.inputs, {from: account_one});                          
            let tx = await this.contract.mint(account_one);
            truffleAssert.eventEmitted(tx, 'Minted', (ev) => {                
                return ev.isMinted == true;
            });              

            isMinted = await this.contract.getUniqueSolutionByIndex.call(1);
            assert.equal(isMinted, true, "Coin should be minted");
        })  
    });
})    