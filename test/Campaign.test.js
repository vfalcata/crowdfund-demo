const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/:CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/:Campaign.json');

let accounts; // accounts on the ganache network
let factory; //reference to the deployed instance of the factory we are going to make
let campaignAddress; //address of the deployed instance of the campaign
let campaign; //reference to the deployed instance of the campaign that will be made

beforeEach(async ()=>{
    //get all ganache accounts
    accounts = await web3.eth.getAccounts();

    //deploy campaign factory ( a new instance)
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({data:compiledFactory.bytecode})
        .send({from: accounts[0], gas: '1000000'});

    //make one campaign to be used for all tests using the factory instance we just created
    await factory.methods.createCampaign('100')
        .send({from: accounts[0], gas: '1000000'});

    //get all the addresses of the deployed campaigns
    // const addresses = await factory.methods.getDeployedCampaigns().call()
    // campaignAddress = addresses[0]; old syntax
    //destructuring of an array, we are saying we want to take the first element out of the array, that is returned and assign it to the campaign address variable
    //the square brackets tell JS that the thing returned is going to be an array
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();// new es2016 syntax

    //campaign is now deployed and has an address we now want to instantiate the campaign contract object becuase that is what we will mostly be testing
    // note that this structure is different than the above 'factory' instance as the factory instance is a newly created deployment
    //here campaign already exists, so we need to specify the address of the already existing contract
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress, //address of already deployed contract so we do not need to use the '.deploy' or '.send' methods
    )
})


describe('Campaigns', ()=>{

    it('deploys a factory and a campaign',()=>{
        assert.ok(factory.options.address)
        assert.ok(campaign.options.address)
    });

    it('marks caller as campaign manager', async () =>{
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager)
    });

    it('allows people to contribute money and marks them as approvers', async ()=>{
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1]
        });
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    })

    it('requires a minimum contribution', async ()=>{
        try{
            await campaign.methods.contribute().send({
                value: '5',
                from: accounts[1]
            })
            assert(false)
        }catch(err){
            assert(err);
        }    
    })

    it('allows a manager to make a payment request', async ()=>{
        await campaign.methods
            .createRequest('Buy batteries', '100', accounts[1])
            .send({
                from: accounts[0],
                gas:'1000000'
            });
        const request = await campaign.methods.requests(0).call(); //using the auto genereated getter form the storage variables, recall this item is a struct
        assert.equal('Buy batteries', request.description);
    })

    //end to end test
    // note that we have run many test on the ganache accounts,
    // unfortunately a limitation of ganache is it cannot reset accounts, and thus their balances between tests. so we may not know exactly how much ether is available
    it('processes requests',async () =>{
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        })

        await campaign.methods
            .createRequest('A new request', web3.toWei('5', 'ether'), accounts[1])
            .send({ from: accounts[0], gas: '1000000'});
        
        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        })

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        })

        //number of Wei an account has
        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance,'ether');
        balance = parseFloat(balance);
        assert(balance > 104); //we pick 104 because we know from the code that it will be around this amount this is because we cannot reset accounts in ganache...this is prone to breakage, but at present we dont have a lot of work arounds so we have to make due with this slightly more sloppy approach

    })
    it('',async () =>{})
})