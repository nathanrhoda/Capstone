var Verifier = artifacts.require('Verifier');
var Proof1 = require('./proof1.json');
var Proof2 = require('./proof2.json');

contract('Verifier', accounts => {

    const account_one = accounts[0];

    describe('Verifier Tests', function () {
        beforeEach(async function () { 
            this.contract = await Verifier.new();            
        })

        it('Proof generated sperately with proving key and out file', async function () { 
            let flag = await this.contract.verifyTx.call(Proof2.proof.a, Proof2.proof.b, Proof2.proof.c, Proof2.inputs);
            assert.equal(flag, true, "Zokrates proof is correct");            
        })

        it('should return return true with correct proof', async function () { 
            let flag = await this.contract.verifyTx.call(Proof1.proof.a, Proof1.proof.b, Proof1.proof.c, Proof1.inputs);
            assert.equal(flag, true, "Zokrates proof is correct");            
        })

        it('should return return false with incorrect proof', async function () { 
            // In correct values passed in from proof json
            let flag = await this.contract.verifyTx.call(Proof1.proof.c, Proof1.proof.b, Proof1.proof.c, Proof1.inputs);            
            assert.equal(flag, false, "Zokrates proof is not correct");
        })  
    });
})    