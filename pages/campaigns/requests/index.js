import React, {Component} from "react";
import Layout from "../../../components/Layout";
import {Button, Table} from 'semantic-ui-react';
import {Link} from '../../../routes';
import Campaign from "../../../ethereum/campaign";
import RequestRow from "../../../components/RequestRow";

class RequestIndex extends Component {
    static async getInitialProps(props){
        const {address} = props.query;
        const campaign = Campaign(address);
        const requestCount = await campaign.methods.getRequestsCount().call();
        const approversCount = await campaign.methods.approversCount().call();

        //recall that in solidity we cannot return an array of structs so we have to retrieve requests one by one manually
        //instead of doing each request one by one synchronously waiting for one to finish before moving to the next, we will do it asynchronously to save time
        const requests = await Promise.all(
            Array(parseInt(requestCount))
                .fill() //produces all the indices that we need to fill that corresponds to each request
                .map((element, index) => { //index iterates from 0 all the way up to requestCount
                    return campaign.methods.requests(index).call(); //this is what we are filling the array with at some index
                })
        );
        return { address, requests, requestCount, approversCount };
    }

    renderRow(){
        //recall that the key property is a part of react and that it always wants us to pass in a key whenever we are rendering a list of components
        return this.props.requests.map((request, index)=>{
            return (
                <RequestRow 
                    key={index}
                    id={index}
                    request={request}
                    address={this.props.address}
                    approversCount={this.props.approversCount}
                />
            );
        });
    }

    render(){
        const {Header, Row, HeaderCell, Body} = Table; //pull properties off of the Table tag so we dont have to continually call 'Table.something'
        return(
            <Layout>
                <h3>Requests</h3>
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                <a>
                    <Button primary floated="right" style={{marginBottom: 10}}>Add Request</Button>
                </a>
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        {this.renderRow()}
                    </Body>
                </Table>
                <div>Found {this.props.requestCount} requests </div>
            </Layout>

        )
    }
}

export default RequestIndex;