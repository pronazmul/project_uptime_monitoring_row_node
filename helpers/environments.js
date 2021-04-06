/**
 * Title: Environmemts
 * Description: Handle all environment data related things
 * Author: Nazmul Huda
 * Date: 06/04/2021
 * Commands: yarn start : listening stagging | NODE_ENV=production yarn start : listenting production
 */

// Dependencies: 


// Module Scaffolding: 
const environments = {}

// Stagging Ennvironment Data Declared
environments.staging = {
    port: 3000,
    envName: 'staging'
}

// production Ennvironment Data Declared
environments.production = {
    port: 5000,
    envName: 'production'
}

// Determine which environment was passed
const currentEnvironment = typeof(process.env.NODE_ENV)=== 'string' ? process.env.NODE_ENV : 'staging'

// Export corresponding environment object
const environmentToExport = typeof environments[currentEnvironment] === 'object'? environments[currentEnvironment] : environments.staging

// Export Module 
module.exports = environmentToExport