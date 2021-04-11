/*
*Title: Worker Library
*Description: Worker Related Works
*Author: Nazmul Huda
*Date: 11/04/21
*
*/

// Dependencies: 
const url = require(URL)
const data = require('./data')
const {parseJSON} = require('../helpers/utilities')
const {sentTwilioSms} = require('../helpers/notification')


//app object - module scaffolding
const worker = {}

// Lookup all the checks form file storage
worker.gatherAllChecks = () =>{
    // Get all the checks
    data.list('checks', (error, checks)=>{
        if(!error && checks && checks.length>0){
            checks.forEach(check=>{
                // read the cehck data
                data.read('checks',check, (error2, originalCheck)=>{
                    if(!error2 && originalCheck){
                        // pass the data to the validator..
                        worker.validateCheckData(parseJSON(originalCheck))
                    }else{console.log("Error: Reading one of the check Data")}
                })
            })
        }else{console.log("Error: Could not find any cecks to process!")}
    })
}

// Validate inidividual Check Data..
worker.validateCheckData = (originalCheck) =>{
    if(originalCheck && originalCheck.id){
        // Check url state && last check time
        originalCheck.state = typeof(originalCheck.state) === 'string' && ['up','down'].indexOf(originalCheck.state) > -1 ? originalCheck.state : 'down'
        originalCheck.lastChecked = typeof(originalCheck.lastChecked)==='number' && originalCheck.lastChecked > 0 ? originalCheck.lastChecked : false
        // Pass to the next process....
        worker.performCheck(originalCheck)
    }else{"Error: Check was invalid or not properly formatted"}

}

// Perform Check 
worker.performCheck = (originalCheck)=> {
    // Prepare the initial check outCome
    let checkOutCome = {
        'error': false,
        'value':false
    }

    // Mark the outcome
    let outComeSent = false

    // parse the host name & full url form the original data
    const parsedUrl = url.parse(`${originalCheck.protocol}://${originalCheck.url}`, true)
    const hostName = parsedUrl.hostName
    const path = parsedUrl.path
    
    // Construct the request
    const requestDetails = {
        'protocol': originalCheck.protocol + ':',
        'hostname': hostName,
        'method': originalCheck.method.toUpperCase(),
        'path': path,
        'timeout':originalCheck.timeOutSecond * 1000
    }

    // Which protocol we are going to use
    const protocolToUse = originalCheck.protocol === 'http'? http: https;

    const req = protocolToUse.request(requestDetails, (res)=>{
        const status = res.statusCode
        // Update the check process
        checkOutCome.responseCode = status;
        if(!outComeSent){
            worker.processCheckOutCome(originalCheck, checkOutCome)
            outComeSent = true
        }
    })

    req.on('error',(e)=>{
        checkOutCome = {
            error: true,
            value: e
        }

        if(!outComeSent){
            worker.processCheckOutCome(originalCheck, checkOutCome)
            outComeSent = true
        }

    })

    req.on('timeout', (e)=>{
        checkOutCome = {
            error: true,
            value: 'timeout'
        }

        if(!outComeSent){
            worker.processCheckOutCome(originalCheck, checkOutCome)
            outComeSent = true
        }
    })
}

// Process checkoutcome: 
worker.processCheckOutCome = (originalCheck, checkOutCome) =>{
    //  check if checkoutcome is up or down
    let state = !checkOutCome.error && checkOutCome.responseCode && originalCheck.successCode.indexOf(checkOutCome.responseCode)> -1 ? 'up' : 'down' 

    // Decide we should alert the user or not...
    let alertWanted = originalCheck.lastChecked && originalCheck.state !=  state ? true : false

    // Update the check Data 
    let newCheckData = originalCheck

    newCheckData.state = state
    newCheckData.lastChecked = Date.now()

    // Update the check to file system
    data.update('checks', newCheckData.id, newCheckData, (error) =>{
        if(!error){
            if(alertWanted){
                //  send the checkData to next process
                worker.alertUserToStatusChange(newCheckData)
            }else{console.log("Error: alert is not needed state not changed")}

        }else{ console.log("Error trying to save check data of one of the checks")}
    })
}

// Sendt notification sms to user if state changes
worker.alertUserToStatusChange = (newCheckData)=>{
    let msg = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${newCheckData.protocol}://${newCheckData.url} is Currently ${newCheckData.state}`
sentTwilioSms(newCheckData.phone, msg, (error)=>{
    if(!err){
        console.log(`User was alerted to a status change via SMS: ${msg}`)
    }else{
        console.log("There was a probelm sending sms to one of the user!")
    }
})
}

// Timer to execute the worker process once per time
worker.loop = () =>{
    setInterval(()=>{
        worker.gatherAllChecks()
    },1000 * 60)
}

// Set start worker in a method: 
worker.init=()=>{
    // Execute all the checks
    worker.gatherAllChecks()

    // Call the loop so the checks executes continue..
    worker.loop()
}

// Module exprot 
module.exports = worker