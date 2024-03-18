const {createServer} = require('http');
const next = require('next');

const app = next({
    dev: process.env.NODE_ENV !== 'production' //check if in dev vs production mode
})

const routes = require('./routes')
const handler = routes.getRequestHandler(app);

//custom next app server startup
app.prepare().then(()=>{
    createServer(handler).listen(3000, (err)=>{
        if(err) throw err;
        console.log('Ready on localhost:3000');
    })
})