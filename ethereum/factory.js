import web3 from './web3';
import CampaignFactory from './build/:CampaignFactory.json'

const instance = new  web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x82E0B83e2F35A2DA571d9d7577Db3AbF67e1e720' //the contract address we manually saved for the factory contract
);

export default instance; //our singleton instance of the campaign factory
