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

// Module Scaffolding
const handler = {}

// Handle Sample Handler
handler.userHandler = (requestProperties, callBack)=>{

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
    handler._users.get = (requestProperties, callBack)=>{
        
    }
    handler._users.put = (requestProperties, callBack)=>{}
    handler._users.delete = (requestProperties, callBack)=>{}

    // Check Request Methods & Sent user to his desired request method...
    const acceptedMethods = ['get', 'post', 'put', 'delete']
    if(acceptedMethods.lastIndexOf(requestProperties.method)> -1){
        handler._users[requestProperties.method](requestProperties,callBack)
    }else{callBack(405)}
}

// Module Export
module.exports = handler