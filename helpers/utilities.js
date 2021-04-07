/**
 * Title: Utilities File
 * Description: Important Utility Functions
 * Author: Nazmul Huda
 * Date: 06/04/21
 * 
 */

// Dependencies:


// Module Scaffolding: 
const utilities = {}

// Parse JSON string To Object
utilities.parseJSON = (jsonString)=>{
    let output;

    try{
        output = JSON.parse(jsonString)
    }catch{
        output={}
    }

    return output
}

// Modulde Export
module.exports = utilities