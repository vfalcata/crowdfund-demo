pragma solidity ^0.4.17; 

contract CampaignFactory {
    address[] public deployedCampaigns;
    function createCampaign(uint minimum) public {
        address newCampaign = new Campaign(minimum, msg.sender); //we have to pass the address of the sender here or else the newly created campaign will use the address of the factory as the manager
        deployedCampaigns.push(newCampaign);
    }
    function getDeployedCampaigns() public view returns(address[]){
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request{
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount; //number of contributors that have approved request
        mapping(address => bool) approvals; //people who have provided approval for a request
     }
    
    address public manager;
    uint public minimumContribution;
    Request[] public requests; //array getter functions from storage variables, that are created for us, are ONLY used to retrieve one element at a time, NOT the entire array
    mapping(address => bool) public approvers; //contributors
    uint public approversCount; //number of people joining the contract

    modifier restricted(){
        require(msg.sender == manager);
        _;
    }

    function Campaign(uint minimum, address creator) public{
        //manager=msg.sender; //if the constructor is called from another contract, this value will be the address of the original contract, not the person who requested the transaction via the factory
        manager = creator; //now that we are using a factory, we need to manually pass in the address of the creator
        minimumContribution=minimum;
    }

    function contribute() public payable{
        require(msg.value > minimumContribution); //msg.value is the amount of Wei sent
        approvers[msg.sender] = true;
        approversCount++; //increment count of number people joining contract
        //IMPORTANT: If an approver contributes multiple times, this could make the request un-finalize-able
        //this is because we increment the approversCount regardless if the contribution was made by the same person
        //an approver can only approve once, but multiple contributions each require their own approval
        // this cannot be done if the multiple contributions are done by the same approver as it would require multiple approval votes, yet a single address can only provide 1

    }

    function createRequest(string description, uint value, address recipient) public restricted{
        //local variables are automatically created in memory
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });
        //we DO NOT need to initialize properties that are reference types

        requests.push(newRequest);
    }

    //called by each contributor to approve a spending request
    function approveRequest(uint index) public{
        //do not allow a single contributor to vote multiple times on a single spending request
        //should be resilient for a large number of contributors
       Request storage request = requests[index];
       
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        request.approvals[msg.sender]=true; //mark person as  true
        request.approvalCount++; //increment for 
    }

    function finalizeRequest(uint index) public restricted{
        Request storage request = requests[index];
        require(request.approvalCount > (approversCount/2));
        require(!request.complete);
        request.recipient.transfer(request.value);
        request.complete = true;
    }

    //newly added function to allow for easy access to view info instead of making multiple calls.
    function getSummary() public view returns (
        uint,
        uint,
        uint,
        uint,
        address
    ){
        return(
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint){
        return requests.length;
    }
}

