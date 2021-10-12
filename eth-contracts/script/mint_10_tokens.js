// Connecting web3 to infura

const Provider = require('@truffle/hdwallet-provider');
var Web3 = require('web3');
var url = 'https://rinkeby.infura.io/v3/ea09cb27a7824d06ae896e3b7c27f484'

var MyContract = require('../build/contracts/SolnSquareVerifier.json');

var Proof1 = require('./proof1.json');
var Proof2 = require('./proof2.json');
var Proof3 = require('./proof3.json');
var Proof4 = require('./proof4.json');
var Proof5 = require('./proof5.json');

var Proof6 = require('./proof6.json');

var Proof7 = require('./proof7.json');
var Proof8 = require('./proof8.json');
var Proof9 = require('./proof9.json');
var Proof10 = require('./proof10.json');

var proofs = [Proof7];

//var web3 = new Web3(url)
var contractaddress = '0x0e7Cb0768FAA3BccE606E5D233B51bd38Baa738a'

var ownerAddress = '0x639eB9164E65dE52a958E833f1E9857BC3d85E40'
var privateKey = "943761897911c0b28d0a454858d0d3e6360126d3815a8dda5d0c81a320ac8cc0"


// let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
// web3.eth.defaultAccount = web3.eth.accounts[0];

const init3 = async () => {
  const provider = new Provider(privateKey, url); 
  const web3 = new Web3(provider);
  const networkId = await web3.eth.net.getId();
  const contract = new web3.eth.Contract(
    MyContract.abi,
    MyContract.networks[networkId].address
  );
  


proofs.forEach(proof => {

  // mint coins
  new Promise((resolve, reject) =>{
    contract.methods.getSolutionKey(proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs)
    .call((err, key)=>{
      console.log(key);
      contract.methods.add(key)
        .send({from: ownerAddress}, (error, added)=>{
          console.log(added)
          contract.methods.mint(proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs, ownerAddress)
            .send({from: ownerAddress}, (error, minted)=>{
              console.log(error);
              
          });
      });
    })    
  });
});


// contract.methods.mint(Proof1.proof.a, Proof1.proof.b, Proof1.proof.c, Proof1.inputs, ownerAddress).call((err, result)=>{console.log(err)})
// contract.methods.mint(Proof1.proof.a, Proof1.proof.b, Proof1.proof.c, Proof1.inputs, ownerAddress).call((err, result)=>{console.log(err)})

//this.contract.mint(Proof2.proof.a, Proof2.proof.b, Proof2.proof.c, Proof2.inputs, account_two);
};


init3();