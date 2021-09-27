var ERC721MintableComplete = artifacts.require('ERC721MintableComplete');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new("Udacity Name", "Udacity Symbol", {from: account_one});

            // TODO: mint multiple tokens
            await this.contract.mint(account_one, 1);
            await this.contract.mint(account_one, 2);            
            await this.contract.mint(account_two, 3);      
        })

        it('should return total supply', async function () { 
            let total = await this.contract.totalSupply.call({from: account_one});            
            assert.equal(total, 3, "Tokens should be equal to 3")
        })

         it('should get token balance', async function () { 
            let total = await this.contract.balanceOf.call(account_one);            
            assert.equal(total, 2, "Tokens should be equal to 2")
         })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let tokenid = 3;
            let baseTokenUri = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";
            let tokenUri = await this.contract.tokenURI.call(tokenid);            
            assert.equal(tokenUri, baseTokenUri+tokenid, "TokenUri is not correct")
        })

        it('should transfer token from one owner to another', async function () {             
            let tokenId = 1;

            await this.contract.transferFrom(account_one, account_two, tokenId);            
            let owner = await this.contract.ownerOf(tokenId);
   
            assert.equal(owner, account_two);
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new("Udacity Name", "Udacity Symbol", {from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let isFail = false;

            try {
                await this.contract.mint.call(account_two, 50, {from: account_two});
                isFail = false;
            } catch {
                isFail = true;
            }
            assert.equal(isFail, true, "Expected Error when minting with address that is not contract owner");
        })

        it('should return contract owner', async function () { 
            let owner = await this.contract.getOwner.call();
            assert.equal(owner, account_one);
        })
    });
})