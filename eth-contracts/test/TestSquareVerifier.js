var Verifier = artifacts.require('Verifier');

contract('Verifier', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('Verifier Tests', function () {
        beforeEach(async function () { 
            this.contract = await Verifier.new();            
        })

        it('should return return true with correct proof', async function () { 
        // - use the contents from proof.json generated from zokrates steps   
            let flag = false;
            assert.equal(flag, true, "Zokrates proof is correct");
        })

        it('should return return false with incorrect proof', async function () { 
            let flag = true;
            assert.equal(flag, false, "Zokrates proof is not correct");
        })  
    });
})    