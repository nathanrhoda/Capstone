var Verifier = artifacts.require('Verifier');
var Proof = require('./proof.json');

contract('Verifier', accounts => {

    const account_one = accounts[0];

    describe('Verifier Tests', function () {
        beforeEach(async function () { 
            this.contract = await Verifier.new();            
        })

        it('should return return true with correct proof', async function () { 
            let flag = await this.contract.verifyTx.call(Proof.proof.a, Proof.proof.b, Proof.proof.c, Proof.inputs);
            assert.equal(flag, true, "Zokrates proof is correct");            
        })

        it('should return return false with incorrect proof', async function () { 
            // In correct values passed in from proof json
            let flag = await this.contract.verifyTx.call(Proof.proof.c, Proof.proof.b, Proof.proof.c, Proof.inputs);            
            assert.equal(flag, false, "Zokrates proof is not correct");
        })  
    });
})    