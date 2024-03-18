const routes = require('next-routes')(); //second set of parentheses means the require statement returns a function and that function will be invoked immediately after we require it into this file

routes
    .add('/campaigns/new', '/campaigns/new')
    .add('/campaigns/:address','/campaigns/show') //this function is how we define a new route mapping, 
    .add('/campaigns/:address/requests','/campaigns/requests/index')
    .add('/campaigns/:address/requests/new', '/campaigns/requests/new');
    //first arg is the pattern we want to look for
//wildcard prefixes some variable name with a ':' the variable name is passed in to our props so we can use its value
//second argument is which route we want to show whenever somemone navigates to this

module.exports = routes; //this export here will export helpers thats going to eventually allow us to automatically navigate users around our application

