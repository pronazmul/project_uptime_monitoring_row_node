/**
 * Title: Handle User Route
 * Description:  CRUD user using a single URL changing methods.
 * Author: Nazmul Huda
 * Date: 06/04/21
 * 
 */

// Module Scaffolding
const handler = {}

// Handle Sample Handler
handler.userHandler = (requestProperties, callBack)=>{
    const acceptedMethods = ['get', 'post', 'put', 'delete']
    if(acceptedMethods.lastIndexOf(requestProperties.method) > -1){
        handler._user[requestProperties.method](requestProperties, callBack)
    }else{callBack(405)}

    handler._user = {}

    handler._user.get = (requestProperties, callBack)=>{}
    handler._user.post = (requestProperties, callBack)=>{
        const firstName = typeof(requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;
        const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;
        const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
        const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
        const tosAgreement = typeof(requestProperties.body.tosAgreement) === 'boolean' ? requestProperties.body.tosAgreement : false;

        if(firstName && lastName && phone && password && tosAgreement){

        }else{
            callBack(400,{error: "You have a problem in your request"})
        }

    }
    handler._user.put = (requestProperties, callBack)=>{}
    handler._user.delete = (requestProperties, callBack)=>{}



}

// Module Export
module.exports = handler