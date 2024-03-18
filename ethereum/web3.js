import Web3 from 'web3';

// const web3 = new Web3(window.web3.currentProvider); 
//window is a global variable that is ONLY available inside the browser
//window is NOT available on NodeJS which is where our server is currently running.
// whenever NextJS loads our code in an attempt to render our React app on the server, that window variable is NOT defined

////cource update

     
let web3;

if(typeof window !== 'undefined' && typeof window.ethereum !== "undefined"){
    //if window is defined and we are running code inside the browser we should see the string return from this of object
    //this implies we are on the browser so then we check if metamask is available and running
    //in the case metamask is available we want to hijack the current metamask provider and use it to create our own web3 instance
      // We are in the browser and metamask is running.
    window.ethereum.request({ method: "eth_requestAccounts" });
    web3 = new Web3(window.ethereum);
}else{
    // We are on the server *OR* the user is not running metamask
    //in this case we will setup our own provider via infura for our web3 instance
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/fc73186e0ebd4489a23b96e445bef904' //it is ok to share this as infura does not store any account info. It is solely used as a portal to access the ethereum network
    );
    web3 = new Web3(provider);
}

// if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
//   // We are in the browser and metamask is running.
//   window.ethereum.request({ method: "eth_requestAccounts" });
//   web3 = new Web3(window.ethereum);
// } else {
//   // We are on the server *OR* the user is not running metamask
//   const provider = new Web3.providers.HttpProvider(
//     "https://rinkeby.infura.io/v3/15c1d32581894b88a92d8d9e519e476c"
//   );
//   web3 = new Web3(provider);
// }
 
// export default web3;
////
export default web3;