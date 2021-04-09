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
    // Check Request Methods & Sent token to his desired request method...
    const acceptedMethods = ['get', 'post', 'put', 'delete']
    if(acceptedMethods.lastIndexOf(requestProperties.method)> -1){
        handler._token[requestProperties.method](requestProperties,callBack)
    }else{callBack(405)}
}

handler._token ={}
// Token Create using phone number && Password checking by body
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
// Read & sent to client token matching token id by querystring
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
// UPdate Token expiration Time checking token time already expired or not.
handler._token.put = (requestProperties, callBack)=>{
    const id = typeof(requestProperties.body.id) === 'string' ? requestProperties.body.id : false;
    const expiration = typeof(requestProperties.body.expiration) === 'boolean' && requestProperties.body.expiration === true ? requestProperties.body.expiration : false;

    if(id && expiration){
        data.read('tokens',id,(error,tokenData)=>{
            const parsedToken = parseJSON(tokenData)
            if(!error){
                if(parsedToken.expiration > Date.now()){
                    parsedToken.expiration = Date.now()+60*60*1000
                    data.update('tokens',id,parsedToken,(error)=>{
                        if(!error){
                            callBack(200,{Message:"Expiration Time Successfully Updated"})
                        }else{
                            callBack(500,{Error:"There is an error in server side"})
                        }
                    })
                }else{
                    callBack(400,{Error:"Token already expired"})
                }
            }else{
                callBack(400,{Error:"There was a problem in your request"})
            }
        })
    }else{
        callBack(400,{Error:"There was a problem in your request"})
    }
}
// Delete Token
handler._token.delete = (requestProperties, callBack)=>{
    const id = typeof(requestProperties.queryStringObject.id) === 'string' ? requestProperties.queryStringObject.id : false;
    if(id){
        data.delete('tokens',id,(err)=>{
            if(!err){
                callBack(200, {Message: "Token Deleted Succcessfully"})
            }else{
                callBack(400, {Error: "There was a problem in your request"})
            }
        })
    }else{
        callBack(400, {Error:"Invalid Token ID"})
    }
}

// Token varifier Function
handler._token.varify = (id, phone,callBack)=>{
    data.read('tokens',id,(error, data)=>{
        const tokenData = parseJSON(data)
        if(!error && tokenData){
            if(tokenData.phone === phone && tokenData.expiration > Date.now()){
                callBack(true)
            }else{callBack(false)}
        }else{callBack(false)}
    })
}

// Module Export
module.exports = handler