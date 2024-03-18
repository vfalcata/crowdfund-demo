import web3 from './web3'
import Campaign from './build/:Campaign.json'

// to make it easier to load campaigns from their address instead of using the factory first
export default (address) => {
    return new web3.eth.Contract(
        JSON.parse(Campaign.interface),
        address
    );
};