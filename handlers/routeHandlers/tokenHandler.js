/**
 * Title: Handle User Token
 * Description:  User Token CRUD for API Authentication.
 * Author: Nazmul Huda
 * Date: 08/04/21
 * 
 */

// Dependencies
const data = require('../../lib/data')
const {hash, parseJSON, createRandomString} = require('../../helpers/utilities')

// Module Scaffolding
const handler = {}

// Handle Sample Handler
handler.tokenHandler = (requestProperties, callBack)=>{

    handler._token ={}
    // CRUD Token
    handler._token.post=(requestProperties, callBack)=> {
        const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
        const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
        if(phone && password){
            data.read('users',phone,(error, user)=>{
                // Make User Password Hashed to verify with the existing with database
                const hashedPass = hash(password)
                // Convert file stystem string to JSON object
                const parsedUser = parseJSON(user)
                if(hashedPass === parsedUser.password){
                    const tokenId = createRandomString(20);
                    const expiration = Date.now() + 60 * 60 * 1000
                    const tokenObject={
                        phone,
                        id:tokenId,
                        expiration
                    }
                    data.create('tokens', tokenId, tokenObject, (error)=>{
                        if(!error){
                            callBack(200, {tokenObject})
                        }else{
                            callBack(500,{Error:"There was a problem in the server side"})
                        }
                    })
                }else{
                    callBack(400,{Error:"Your Password is Invalid"})
                }
            })
        }else{
            callBack(400,{Error:"There was a  problem in your request"})
        }
    }
    
    handler._token.get = (requestProperties, callBack)=>{
        const id = typeof(requestProperties.queryStringObject.id) === 'string' ? requestProperties.queryStringObject.id : false;
        if(id){
            data.read('tokens',id,(err, tokenData)=>{
                const token = {...parseJSON(tokenData)}
                if(!err){
                    callBack(200, {token})
                }else{
                    callBack(404, {Error: "Requested token was not found"})
                }
            })
        }else{
            callBack(400, {Error:"Invalid Token ID"})
        }
    }


    handler._token.put = (requestProperties, callBack)=>{callBack(200,{Message:"WElcome Put Method"})}
    handler._token.delete = (requestProperties, callBack)=>{callBack(200,{Message:"WElcome Delete Method"})}

    // Check Request Methods & Sent token to his desired request method...
    const acceptedMethods = ['get', 'post', 'put', 'delete']
    if(acceptedMethods.lastIndexOf(requestProperties.method)> -1){
        handler._token[requestProperties.method](requestProperties,callBack)
    }else{callBack(405)}
}

// Module Export
module.exports = handler