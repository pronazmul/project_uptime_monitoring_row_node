/*
*Title: Uptime URL Monitoring Application
*Description: A Restfull Api to monitor up or down time of user defined links.
*Author: Nazmul Huda
*Date: 06/04/21
*
*/

// Dependencies: 
const http = require('http')
const environment = require('./helpers/environments')
const {handleReqRes} = require('./helpers/handleReqRes')
const handler = require('./helpers/handleReqRes')


//app object - module scaffolding
const app = {}


// Create server
app.createServer = ()=>{
   const server =  http.createServer(app.handleReqRes)
   server.listen(environment.port, ()=>{
       console.log(`Listening to port ${environment.port}`)
   })
}

// Handle Request Response 
app.handleReqRes = handleReqRes


// Start The Server: 
app.createServer()