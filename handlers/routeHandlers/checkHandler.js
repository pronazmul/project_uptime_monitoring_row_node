/**
 * Title: Handle User Defined Check
 * Description:  Monitor User Defined Check in the Background
 * Author: Nazmul Huda
 * Date: 09/04/21
 * 
 */

// Dependencies
const { parseJSON, createRandomString } = require('../../helpers/utilities')
const data = require('../../lib/data')
const tokenHandler = require('./tokenHandler')
const {maxCheck} = require('../../helpers/environments')

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
        const method = typeof(requestProperties.body.method)==='string' && ['GET', 'POST','PUT','DELETE'].indexOf(requestProperties.body.method)>-1 ? requestProperties.body.method : false
        const successCode = typeof(requestProperties.body.successCode)==='object' && requestProperties.body.successCode instanceof Array ? requestProperties.body.successCode : false
        const timeOutSecond = typeof(requestProperties.body.timeOutSecond)==='number' && requestProperties.body.timeOutSecond % 1 === 0 && requestProperties.body.timeOutSecond >= 1 && requestProperties.body.timeOutSecond <=5 ? requestProperties.body.timeOutSecond : false

        if(protocol && url && method && successCode && timeOutSecond){
            const token = typeof(requestProperties.headersObject.token) === 'string'? requestProperties.headersObject.token : false
            if(token){
                // Lookup the user phone by reading the token
                data.read('tokens',token,(error,tokenData) => {
                    const {phone} = parseJSON(tokenData)
                    if(!error && phone){
                        // Authenticate the user
                        tokenHandler._token.varify(token, phone, (isAuthenticated)=>{
                            if(isAuthenticated){
                                callBack(200, {token, phone, isAuthenticated})
                                    data.read('users',phone, (error, user )=>{
                                        const userData = parseJSON(user)
                                        if(!error){
                                            if(!error && userData){
                                                const userChecks = typeof(userData.checks)=== 'object' && userData.checks instanceof Array ? userData.checks : []
                                                if(userChecks.length < maxCheck){
                                                    const checkID = createRandomString(20)
                                                    const checkObject = {
                                                        id: checkID,
                                                        phone,
                                                        protocol,
                                                        url,
                                                        method,
                                                        successCode,
                                                        timeOutSecond,
                                                    }
                                                    // Create User Checks in checks folder
                                                    data.create('checks',checkID, checkObject,(error)=>{
                                                        if(!error){
                                                            // Updata user with Check Id
                                                            userData.checks = userChecks
                                                            userData.checks.push(checkID)
                                                            // Update user Data with new Check Id
                                                            data.update('users', phone, userData, (error)=>{
                                                                if(!error){
                                                                    callBack(200, {checkObject})
                                                                }else{callBack(500, {Error: "There was a problem in server side"})}
                                                            })
                                                        }else{callBack(500, {Error: "There was a problem in server side"})}
                                                    })
                                                }else{callBack(400,{Error:'Maximum Checks Limit Already Exists!'})}
                                            }else{callBack(400, {Error:"User Not Exists!"})}
                                        }
                                        else{callBack(500,{Error: "Server side Error"})}
                                    })
                            }else{callBack(403, {Error: "Authentication Failed!"})} 
                        })
                    }else{callBack(403, {Error: "Authentication Failed"})}
                })
            }else{callBack(400, {Error: "There was a problem in your request"})}
        }else{callBack(400, {Error: "There was a problem in your request"})}
    }

    handler._check.get = (requestProperties, callBack)=>{callBack(200,{Message: "This is from GEt Request"})}
    handler._check.put = (requestProperties, callBack)=>{callBack(200,{Message: "This is from put request"})}
    handler._check.delete = (requestProperties, callBack)=>{callBack(200,{Message: "This is from Delete request"})}


// Module Export
module.exports = handler
