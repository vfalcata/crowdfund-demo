import React, {Component} from "react";
import factory from '../ethereum/factory';
import {Card, Button} from 'semantic-ui-react';
import {Link} from '../routes';
import Layout from "../components/Layout";
//redefine to a class based component
// export default()=>{
//     return <h1>This is the campaign list page</h1>
// }

class CampaignIndex extends Component{

    //traditional react app, using componentDidMount is 100% appropriate, but in nextJS we have to account for the SSR
    //this function and the lines in it are not executed on the server side
    //we must move the data fetching to a different function getInitialProps which is a lifecycle method that is defined exclusively and used exclusively by nextJS
    // async componentDidMount() {
        //const campaigns = await factory.methods.getDeployedCampaigns().call(); //moved to 'getInitialProps'
  

    // }

    //pre render server side run function made for NextJS
    //previous lines in 'componentDidMount' moved here
    static async getInitialProps(){ //class level function
        //this is static because NextJS wants to retrieve the initial data without attempting to actually render our component since it is computationally expensive
        //skipping initial rendering here allows SSR in nextJS to be more efficient
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        return {campaigns}; //this object is provided to our component as props
    }

    renderCampaigns(){
        //define the properties of cards
        const items = this.props.campaigns.map(address=>{
            return {
                header: address,
                description: (
                    <Link route={`/campaigns/${address}`}>
                        <a>View Campaign</a>
                    </Link>
                ),
                fluid: true //causes cards to stretch entire width of container
            }
        })
        return <Card.Group items={items} />;
    }
    render(){ 
        return (
            <Layout>
                <div>
                    <h3>Open Campaigns</h3>
                    <Link route="/campaigns/new">
                        <a>
                            <Button
                                floated="right"
                                content="Create Campaign"
                                icon="add circle"
                                primary
                            />
                        </a>
                    </Link>                    

                    {this.renderCampaigns()}
                </div>
            </Layout>
        );
    }
}

export default CampaignIndex;