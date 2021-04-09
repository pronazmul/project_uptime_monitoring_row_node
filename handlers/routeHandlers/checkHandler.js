/**
 * Title: Handle User Defined Check
 * Description:  Monitor User Defined Check in the Background
 * Author: Nazmul Huda
 * Date: 09/04/21
 * 
 */

// Dependencies
const data = require('../../lib/data')
const tokenHandler = require('./tokenHandler')
// const {hash} = require('../../helpers/utilities')
// const {parseJSON} = require('../../helpers/utilities')

// Module Scaffolding
const handler = {}

// Handle Sample Handler
handler.checkHandler = (requestProperties, callBack)=>{
    // Check Request Methods & Sent user to his desired request method...
    const acceptedMethods = ['get', 'post', 'put', 'delete']
    if(acceptedMethods.lastIndexOf(requestProperties.method)> -1){
        handler._check[requestProperties.method](requestProperties,callBack)
    }else{callBack(405)}
}
    // Declare _users to Store All user related things
    handler._check ={}
    handler._check.post=(requestProperties, callBack)=> {
        const protocol = typeof(requestProperties.body.protocol)==='string' && ['http','https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false
        const url = typeof(requestProperties.body.url) ==='string' && requestProperties.body.url.trim().length>0 ? requestProperties.body.url : false
        const method = typeof(requestProperties.body.method)==='string' && ['get', 'post','put','delete'].indexOf(requestProperties.body.method)>-1 ? requestProperties.body.method : false
        const successCode = typeof(requestProperties.body.successCode)==='object' && requestProperties.body.successCode instanceof Array ? requestProperties.body.successCode : false
        const timeOutSecond = typeof(requestProperties.body.timeOutSecond)==='number' && requestProperties.body.timeOutSecond % 1 === 0 && requestProperties.body.timeOutSecond >= 1 && requestProperties.body.timeOutSecond <=5 ? requestProperties.body.timeOutSecond : false

        if(protocol && url && method && successCode && timeOutSecond){
            const token = typeof(requestProperties.headersObject.token) === 'string'? requestProperties.headersObject.token : false
            if(token){
                tokenHandler._token.varify(token, phone, (tokenID)=>{
                   if(tokenID){

                   }else{callBack(403, {Error: "Authentication Failed."})} 
                })
            }else{callBack(400, {Error: "There was a problem in your request"})}
        }else{callBack(400, "There was a problem in your request")}
    }
    handler._check.get = (requestProperties, callBack)=>{callBack(200,{Message: "This is from GEt Request"})}
    handler._check.put = (requestProperties, callBack)=>{callBack(200,{Message: "This is from put request"})}
    handler._check.delete = (requestProperties, callBack)=>{callBack(200,{Message: "This is from Delete request"})}


// Module Export
module.exports = handler