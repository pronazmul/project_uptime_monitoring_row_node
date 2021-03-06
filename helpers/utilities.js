/**
 * Title: Utilities File
 * Description: Important Utility Functions
 * Author: Nazmul Huda
 * Date: 06/04/21
 * 
 */

// Dependencies:
const crypto = require('crypto')
const environment = require('./environments')

// Module Scaffolding: 
const utilities = {}

// Parse Client Requested String to Json Object
utilities.parseJSON = (jsonString)=>{
    let output;
    try{
        output = JSON.parse(jsonString)
    }catch{
        output={}
    }
    return output
}

// Convert String to Hash encription
utilities.hash = (normalString)=>{
    const hashString = crypto.createHmac('sha256', environment.secretKey).update(normalString).digest('hex')
    return(hashString)
}

// Make tokenString for with the length user provided
utilities.createRandomString = (stringLength)=>{
    let length = stringLength
    const possibleChar = 'abcdefghijklmnopqrstuvwxyz0123456789'

    let output = ''
    for(i=0; i<= length; i++){
        const randomChar = possibleChar.charAt(Math.floor(Math.random()*possibleChar.length));
        output += randomChar
    }
    return output
}

// Modulde Export
module.exports = utilities