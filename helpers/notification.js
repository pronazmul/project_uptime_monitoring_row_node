/*
 * Title: Twilio Notification 
 * Description: Handle Twilio notification Service.
 * Author: Nazmul Huda
 * Date: 09/04/21 
 * 
 */

// Dependencies
const https = require('https')
const querystring = require('querystring') //Node recommended stringfy method
const {twilio} = require('./environments')

// Module Scaffolding
const notification = {}

// Sent Twilio Notification
notnotification.sentTwilioSms = (phone, msg, callback)=>{
    // Input validation
    const userPhone = typeof(phone) === 'string' && phone.trim().length === 11 ? phone.trim() : false
    const userMsg = typeof(msg) === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false

    if(userPhone && userMsg){
        // Configure the request payload for Twilio
        const payload = {
            From:twilio.fromPhone,
            To: `+880${userPhone}`,
            Body: userMsg
        }
        // Stringfy the payload
        const stringfyPayload = querystring.payload(payload)

        // Configure the Request details required by https
        const requestDetails = {
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth: `${twilio.accountSid}:${twilio.authToken}`,
            headers:{
                "Content-Type": 'application/x-www-form-urlencoded'
            }
        }

        // Instantiate the request object
        const req = https.request(requestDetails,(res)=>{
            // Get the status of the sent request
            const status = res.statusCode
            // Callback successfully if the request succeed
            if(status === 200 || status === 201){
                callback(false)
            }else{callback(`Status code returned was ${status}`)}
        })

        req.on('error', (event)=>{
            callback(event)
        })

        req.write(stringfyPayload)
        req.end()

    }else{callback("Givent Parameters are missing or Invalid")}    
}

// Export Module
module.exports = notification


