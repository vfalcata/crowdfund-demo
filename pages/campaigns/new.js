import React, {Component} from "react";
import Layout from '../../components/Layout'
import {Form, Button, Input, Message} from 'semantic-ui-react'
import factory from '../../ethereum/factory'
import web3 from "../../ethereum/web3";
import {Link, Router} from '../../routes'; 
//Link: allows us to render anchor tags into our react components and navigate around the application
//Router: allows us to programmatically redirect people form one page to another page inside our app

class CampaignNew extends Component{
    state = {
        minimumContribution: '',
        errorMessage: '',
        loading: false
    }

    onSubmit = async (event)=>{
        event.preventDefault();
        this.setState({loading: true, errorMessage: ''})
        try{
            const accounts = await web3.eth.getAccounts();
            await factory.methods
                .createCampaign(this.state.minimumContribution)
                .send({
                    from: accounts[0]
                }) //no need to specify gas here because metamask automatically calculates it, we only needed to do this when testing    
            Router.pushRoute('/'); //reroute our user to the index page
        }catch(err){
            this.setState({ errorMessage: err.message })
        }
        this.setState({loading: false})
   }

    render(){ 
        return (
            <Layout>
                <h3>Create a Campaign</h3>
                {/* we need to turn a string to its respective boolean value via '!!' */}
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}> 
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input 
                            label="Wei" 
                            labelPosition="right"
                            value={this.state.minimumContribution}
                            onChange={event=>this.setState({minimumContribution: event.target.value})}
                        />
                    </Form.Field>
                    <Message error header="Oops!" content={this.state.errorMessage} />
                    <Button loading={this.state.loading} primary>Create!</Button>
                </Form>
            </Layout>
            
        );
    }
}

export default CampaignNew;