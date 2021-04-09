/**
 * Title: Handle User Route
 * Description:  CRUD user using a single URL changing methods.
 * Author: Nazmul Huda
 * Date: 06/04/21
 * 
 */

// Dependencies
const data = require('../../lib/data')
const {hash} = require('../../helpers/utilities')
const {parseJSON} = require('../../helpers/utilities')
const tokenHandler = require('./tokenHandler')

// Module Scaffolding
const handler = {}

// Handle Sample Handler
handler.userHandler = (requestProperties, callBack)=>{
    // Check Request Methods & Sent user to his desired request method...
    const acceptedMethods = ['get', 'post', 'put', 'delete']
    if(acceptedMethods.lastIndexOf(requestProperties.method)> -1){
        handler._users[requestProperties.method](requestProperties,callBack)
    }else{callBack(405)}
}
    // Declare _users to Store All user related things
    handler._users ={}
    // Create new user
    handler._users.post=(requestProperties, callBack)=> {

        const firstName = typeof(requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;
        const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;
        const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
        const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
        const tosAgreement = typeof(requestProperties.body.tosAgreement) === 'boolean' ? requestProperties.body.tosAgreement : false;

        if(firstName && lastName && phone && password && tosAgreement){
            // Make Sure that current user is't alerady exist: 
            data.read('users',phone, (err)=>{
                if(err){
                    const userObject = {
                        firstName,
                        lastName,
                        phone,
                        password: hash(password),
                        tosAgreement
                    }
                    // Create new user
                    data.create('users',phone,userObject,(err)=>{
                        if(!err){
                            callBack(200,{Message:'New user Created Successfully'})
                        }else{
                            callBack(500,{Error:err})
                        }
                    })
                }else{
                    callBack(500,{Error:"There was an error in server side"})
                }
            })
        }else{
            callBack(400,{Error: "You have a problem in your request"})
        }
    }
    // Read new user by 
    handler._users.get = (requestProperties, callBack)=>{
        const phone = typeof(requestProperties.queryStringObject.phone) === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;
        if(phone){
            const token = typeof(requestProperties.headersObject.token) === 'string'? requestProperties.headersObject.token : false
            if(token){
                tokenHandler._token.varify(token, phone, (tokenID)=>{
                   if(tokenID){
                    data.read('users',phone,(err, user)=>{
                        const {firstName, lastName, phone, tosAgreement} = {...parseJSON(user)}
                        const userToShow = {
                            firstName,
                            lastName,
                            phone,
                            tosAgreement
                        }
                        if(!err && userToShow){
                            callBack(200, {user:userToShow})
                        }else{
                            callBack(404, {Error: "Requested user was not found"})
                        }
                    })
                   }else{
                        callBack(403, {Error: "Authentication Failed."})
                   } 
                })
            }else{
                callBack(400, {Error: "There was a problem in your request"})
            }
        }else{
            callBack(400, {Error:"Phone number is not Valid"})
        }
    }

    handler._users.put = (requestProperties, callBack)=>{
        const firstName = typeof(requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;
        const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;
        const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
        const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
        
        if(phone){
            if(firstName || lastName || password){
                // Authenticate the user
                const token = typeof(requestProperties.headersObject.token) === 'string'? requestProperties.headersObject.token : false
                if(token){
                    tokenHandler._token.varify(token, phone, (tokenID)=>{
                       if(tokenID){
                                // Lookup the user: 
                                data.read('users',phone,(err, user)=>{
                                    const parsedUser = {...parseJSON(user)}
                                    if(!err && parsedUser){
                                        if(firstName){parsedUser.firstName=firstName}
                                        if(lastName){parsedUser.lastName=lastName}
                                        if(password){parsedUser.password= hash(password)}
                                        data.update('users', phone, parsedUser, (err)=>{
                                            if(!err){
                                                callBack(200, {Message: "User Updated Successfully"})
                                            }else{
                                                callBack(400, {Error:"There was a problem in your request"})
                                            }
                                        })
                                    }else{
                                        callBack(400, {Error:"There was a problem in your request"})
                                    }
                                })
                       }else{
                            callBack(403, {Error: "Authentication Failed."})
                       } 
                    })
                }else{
                    callBack(400, {Error: "There was a problem in your request"})
                }
            }else{
                callBack(400, {Error:"There was a problem in your request"})
            }
        }else{
            callBack(400, {Error: "Your phone number is not valid! Please try again."})
        }
    }

    handler._users.delete = (requestProperties, callBack)=>{
        const phone = typeof(requestProperties.queryStringObject.phone) === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;
        if(phone){
            const token = typeof(requestProperties.headersObject.token) === 'string'? requestProperties.headersObject.token : false
            if(token){
                tokenHandler._token.varify(token, phone, (tokenID)=>{
                   if(tokenID){
                        // Lookup the user
                        data.read('users',phone,(err, user)=>{
                            if(!err && user){
                                data.delete('users',phone,(err)=>{
                                    if(!err){
                                            callBack(200, {Message: "User Deleted Successfuly"})
                                    }else{
                                        callBack(500, {Error: "There was an error in server side"})
                                    }
                                })            
                            }else{
                                callBack(500, {Error: "There was an error in server side"})
                            }
                        })
                   }else{
                        callBack(403, {Error: "Authentication Failed."})
                   } 
                })
            }else{
                callBack(400, {Error: "There was a problem in your request"})
            }
        }else{
            callBack(400, {Error:"Phone number is not Valid"})
        }
    }


// Module Export
module.exports = handler