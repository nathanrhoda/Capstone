var Verifier = artifacts.require('Verifier');
var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
var Proof1 = require('./proof1.json');
var Proof2 = require('./proof2.json');
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
                    
            let key = await this.contract.getSolutionKey.call(Proof1.proof.a, Proof1.proof.b, Proof1.proof.c, Proof1.inputs);
            let tx = await this.contract.add(key, {from: account_one});                          
            truffleAssert.eventEmitted(tx, 'SolutionAdded', (ev) => {
                return ev.id == 1;
            });                                    
        })

        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('should be able to mint a ERC21 Token', async function () { 
            let index1 = 1;
            let isMinted = await this.contract.getUniqueSolutionByIndex.call(index1);
            assert.equal(isMinted, false, "Before Coin should not be minted");
            let key = await this.contract.getSolutionKey.call(Proof1.proof.a, Proof1.proof.b, Proof1.proof.c, Proof1.inputs);
            await this.contract.add(key, {from: account_one});                          

            isMinted = await this.contract.getUniqueSolutionByIndex.call(index1);
            assert.equal(isMinted, false, "After add should still be false but is true");

            let tx1 = await this.contract.mint(Proof1.proof.a, Proof1.proof.b, Proof1.proof.c, Proof1.inputs, account_one);
            truffleAssert.eventEmitted(tx1, 'Minted', (ev) => {                
                return ev.id == index1;
            });              

            isMinted = await this.contract.getUniqueSolutionByIndex.call(index1);
            assert.equal(isMinted, true, "Coin should be minted");
        })  

        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('should be able to mint a ERC21 Token with index 2', async function () { 
            let isMinted = false;

            let index2 = 2;
            let key1 = await this.contract.getSolutionKey.call(Proof1.proof.a, Proof1.proof.b, Proof1.proof.c, Proof1.inputs);
            await this.contract.add(key1, {from: account_one});    

            let key2 = await this.contract.getSolutionKey.call(Proof2.proof.a, Proof2.proof.b, Proof2.proof.c, Proof2.inputs);
            await this.contract.add(key2, {from: account_two});                
            let tx2 = await this.contract.mint(Proof2.proof.a, Proof2.proof.b, Proof2.proof.c, Proof2.inputs, account_two);
            truffleAssert.eventEmitted(tx2, 'Minted', (ev) => {                
                return ev.id == index2;
            });              

            isMinted = await this.contract.getUniqueSolutionByIndex.call(index2);
            assert.equal(isMinted, true, "Coin should be minted");
        })  
    });
})    