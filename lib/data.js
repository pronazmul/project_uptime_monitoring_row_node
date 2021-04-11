/**
 * Title: Data Mannage
 * Description: Data CRUD in File Stytem
 * Author: Nazmul Huda
 * Date: 06/04/21
 * 
 */

// Dependencies: 
const fs = require('fs')
const path = require('path')

// Module Scaffolding
const lib ={}

// Base Dicectory of the Data folder
lib.basedir = path.join(__dirname, '../.data/')

// -------------Write Data To File-----------------
lib.create = (dir, file, data, callback)=>{
    // Open File For Writing
    fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (err, fileDescriptor)=>{
        if(!err && fileDescriptor){
            // Convert Data To json String
            const stringData = JSON.stringify(data)

            // Write Data to file then close it
            fs.writeFile(fileDescriptor, stringData,(err2)=>{
                if(!err2){
                    fs.close(fileDescriptor, (err3)=>{
                        if(!err3){
                            callback(false)
                        }else{
                            callback("Error closing new file!")
                        }
                    })
                }else{
                    callback("Error writing new file!")
                }
            })
        }else{
            callback("Could not create new file, it may already exists !")
        }
    })
}
 
// ----------------Read Data From File--------------------
lib.read = (dir, file, callback)=>{
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (err, data)=>{
        callback(err, data)
    })
}

// ---------------Update Existing File---------------------
lib.update = (dir, file, data, callback)=>{

    // File Open for Reading & Updating
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDescriptor)=>{
        if(!err && fileDescriptor){
            // convert Normal json to Json stringify
            const stringData = JSON.stringify(data)

            // Truncate The File
            fs.ftruncate(fileDescriptor, (err1)=>{
                if(!err1){
                    // Write File & Close it
                    fs.writeFile(fileDescriptor, stringData,(err2)=>{
                        if(!err2){
                            fs.close(fileDescriptor,(err3)=>{
                                if(!err3){
                                    callback(false)
                                }else{
                                    callback("Error to Closing File")
                                }
                            })
                        }else{
                            callback("Error to write file")
                        }
                    })
                }else{
                    callback("Error to truncate file")
                }
            })
        }else{
            callback("An Error Occored To Open File")
        }
    })
}

// ----------------Delete Existing File---------------------
lib.delete = (dir, file, callback)=>{
    // Unlink File
    fs.unlink(`${lib.basedir + dir}/${file}.json`,(err)=>{
        const callBackMessage = !err? false:"Error to Delete file"
        callback(callBackMessage)
    })
}

//  List all the items in a directory
lib.list = (dir, callback) => {
    fs.readdir(`${lib.basedir + dir}/`, (error, fileNames)=>{
        if(!error && fileNames.length > 0){
            let trimmedFileNames = [];
            fileNames.forEach(fileName =>{
                trimmedFileNames.push(fileName.replace('.json',''))
            })
            callback(false, trimmedFileNames)
        }else{callback("Error Reading Directory !")}
    })
}

// Export Module 
module.exports = lib

 