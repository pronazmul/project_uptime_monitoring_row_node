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
const data = require('./lib/data')

// ----------------Working With File System------------------------ 
// Write File: 
/*data.create('test','newFile',{name:'Nazmul Huda', nationality:'Bangladeshi', age:25}, (err)=>{
    console.log(err)
})*/

// Read File: 
/*data.read('test','newfile',(err, data)=>{
    console.log(data)
})*/

// Update File
/*data.update('test','newFile',{name:'Sania Akter', nationality:'Bangladeshi', age:22}, (err)=>{
    console.log(err)
})*/

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