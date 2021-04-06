/**
 * Title: Sample Handler
 * Description: Sample Handler
 * Author: Nazmul Huda
 * Date: 06/04/21
 * 
 */

// Module Scaffolding
const handler = {}

// Handle Sample Handler
handler.sampleHandler = (requestProperties, callBack)=>{
    console.log(requestProperties)
    callBack(200,{
        message: 'This is a symple URL'
    })
}

// Module Export
module.exports = handler