/*
*Title: Uptime URL Monitoring Application
*Description: A Restfull Api to monitor up or down time of user defined links.
*Author: Nazmul Huda
*Date: 06/04/21
*
*/

// Dependencies: 
const http = require('http')
const {handleReqRes} = require('./helpers/handleReqRes')
const handler = require('./helpers/handleReqRes')

//app object - module scaffolding
const app = {}

// Configuration
app.config = {
    port:3000,
}

// Create server
app.createServer = ()=>{
   const server =  http.createServer(app.handleReqRes)
   server.listen(app.config.port, ()=>{
       console.log(`Listening to port ${app.config.port}`)
   })
}

// Handle Request Response 
app.handleReqRes = handleReqRes


// Start The Server: 
app.createServer()