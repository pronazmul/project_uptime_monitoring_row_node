/**
 * Title: Not Found Handler
 * Description: 404 not Found Handler
 * Author: Nazmul Huda
 * Date: 06/04/21
 * 
 */

// Module Scaffolding
const handler = {}

// Handle Sample Handler
handler.notFoundHandler = (requestProperties, callBack)=>{
    console.log(requestProperties)
    callBack(404, {
        message: '404 Page not found'
    })
}

// Module Export
module.exports = handler