/*
 * Title: Routes
 * Description: Application All Routes
 * Author: Nazmul Huda
 * Date: 06/04/21
 * 
 */

// Dependencies 
const {sampleHandler} = require('./handlers/routeHandlers/sampleHandlers')
const {userHandler} = require('./handlers/routeHandlers/userHandler')

// Module Scafolding
const routes = {
    sample: sampleHandler,
    user: userHandler,
}

// Module Export
module.exports = routes