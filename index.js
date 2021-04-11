/*
*Title: Project initial File
*Description: Initial file to start the node server & workers
*Author: Nazmul Huda
*Date: 11/04/21
*
*/

// Dependencies: 
const server = require('./lib/server')
const worker = require('./lib/worker')

//app object - module scaffolding
const app = {}

// Initialize Application
app.init = ()=>{
    // Start the server
    server.init()
    // Start the background worker process
    worker.init()
}

// Start the Appliaction
app.init()

// Module Export 
module.exports = app