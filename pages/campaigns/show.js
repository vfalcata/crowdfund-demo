//shows user details about some particular campaign

import React, {Component} from 'react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign'; //this is not actually an object, even though we capitalized the import first letter. Only did it to make things easier for the project since we will likely use the lowercase 'campaign' somewhere
import {Card, Grid, Button} from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import {Link} from '../../routes'

class CampaignShow extends Component {
    //load eth data server side vefore rendering
    static async getInitialProps(props){ //this is a separate props object than the one that ends up inside our actual component instance
        //this props object has a property called query that it allows us to pull tokens form the url
        const campaign = Campaign(props.query.address); //this is the token label we specified for the wild card in file routes.js
        const summary = await campaign.methods.getSummary().call(); //this returns an object but the keys are simply the index location

        return {
            address: props.query.address, //we want to pull the address from the url
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4],
        };
    }

    renderCards(){
        const {
            balance,
            manager,
            minimumContribution,
            requestsCount,
            approversCount
        } = this.props;
        const items = [
            {
                header:manager,
                meta:'address of manager',
                description:'The manager created this campaign and can create requests to withdraw money',
                style: {overflowWrap: 'break-word'} //causes really long words to break into and wrap down the line underneath so it doesnt pass the card borders
                
            },
            {
                header:minimumContribution,
                meta:'Minimum Contribution (wei)',
                description:'You must contribute at least this much wei to be an approver'
            },
            {
                header:requestsCount,
                meta:'Number of Requests',
                description:'A request tries to withdraw money from the contract. Requests must be approved by approvers'
            },
            {
                header:approversCount,
                meta:'Number of Approvers',
                description:'Number of people who have already donated'
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance (ether)',
                description: 'The balance is how much money the campaign has left to spend'

            }
        ]
        return <Card.Group items={items}/>;
    }

    render(){
        return (
            <Layout>
                <h3>Campaign Show</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}

                        </Grid.Column>
                        <Grid.Column width={6}>
                            <ContributeForm address={this.props.address}/> 
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.address}/requests`}>
                                        <a>
                                            <Button primary>View Requests</Button>
                                        </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        )         
    }
}

export default CampaignShow;