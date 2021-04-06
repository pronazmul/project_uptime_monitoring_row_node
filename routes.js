/*
 * Title: Routes
 * Description: Application All Routes
 * Author: Nazmul Huda
 * Date: 06/04/21
 * 
 */

// Dependencies 
const {sampleHandler} = require('./handlers/routeHandlers/sampleHandlers')
// Module Scafolding

const routes = {
    sample: sampleHandler,
    
}

module.exports = routes