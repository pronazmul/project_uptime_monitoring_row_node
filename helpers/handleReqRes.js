/*
 * Title: Handle Request Response
 * Description: get all request | Parse Request | Response Request
 * Author: Nazmul Huda
 * Date: 06/04/21 
 * 
 */

// Dependencies:  
const url = require('url')
const {StringDecoder} = require('string_decoder')
const routes = require('../routes')
const {notFoundHandler} = require('../handlers/routeHandlers/notFoundHandler')
const { type } = require('os')

//handler Object - Module Scaffolding
const handler = {}

// Handle Request Response
handler.handleReqRes = (req, res) =>{

    //Request Handling:  Get The URL & Parse it 
    const parsedUrl = url.parse(req.url, true)
    const queryStringObject = parsedUrl.query
    const path = parsedUrl.pathname
    const trimedPath  = path.replace(/^\/+|\/+$/g, '')
    const method = req.method.toLowerCase()
    const headersObject = req.headers

    //Rapped All Request Property: 
    const requestProperties = {
        parsedUrl,
        queryStringObject,
        path,
        trimedPath,
        method,
        headersObject
    }

    // Check route form route file if not found call not found handler
    const chosenHandler = routes[trimedPath] ? routes[trimedPath] : notFoundHandler

    //Call Route Handlers: 
    chosenHandler(requestProperties, (statusCode, payload)=>{
        statusCode = typeof(statusCode) === 'number'? statusCode:500;
        payload = typeof(payload) === 'object' ? payload : {}

        const payloadString = JSON.stringify(payload)

        res.writeHead(statusCode)
        res.end(payloadString)
    })


    //Get Body Data & Decode
    const decoder = new StringDecoder('utf-8')
    let realData = ''

    req.on('data', (buffer)=>{
        realData += decoder.write(buffer)
    })

    req.on('end', ()=>{
        realData += decoder.end()
        console.log(realData)
        res.end(realData)
    })

}


// Export handler: 
module.exports = handler

