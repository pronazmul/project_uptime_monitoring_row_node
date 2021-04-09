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
const {tokenHandler} = require('./handlers/routeHandlers/tokenHandler')
const {checkHandler} = require('./handlers/routeHandlers/checkHandler')

// Module Scafolding
const routes = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler,
    check: checkHandler,
}

// Module Export
module.exports = routes