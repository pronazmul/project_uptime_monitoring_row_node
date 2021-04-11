/*
*Title: Server File
*Description: Server Related Works
*Author: Nazmul Huda
*Date: 11/04/21
*
*/

// Dependencies: 
const http = require('http')
const environment = require('../helpers/environments')
const {handleReqRes} = require('../helpers/handleReqRes')


//app object - module scaffolding
const server = {}


// Create server
server.createServer = ()=>{
   const startServer =  http.createServer(server.handleReqRes)
   startServer.listen(environment.port, ()=>{
       console.log(`Listening to port ${environment.port}`)
   })
}

// Handle Request Response 
server.handleReqRes = handleReqRes


// Set start server in a method: 
server.init=()=>{
    server.createServer()
}

// Module exprot 
module.exports = server