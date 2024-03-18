//here we no longer want to recompile each time on start up, we want to compile once to a file and run that file each time
//our sol file has 2 contracts so when we feed it to the compiler we will get outputs for each contract
//we will put these compiled items in to a build folder

const path = require('path');
const solc = require('solc');
const fs = require('fs-extra'); //file system module with a couple of "extras"

const buildPath = path.resolve(__dirname, 'build') //set path of build directory we want to put compiled files
fs.removeSync(buildPath); //removes a folder and everything inside of it, this is only possible with fs-extra, not fs

const campaignPath = path.resolve(__dirname,'contracts','Campaign.sol') //get the path of the source file
const source = fs.readFileSync(campaignPath, 'utf8'); //load .sol source file
const output = solc.compile(source,1).contracts; //compile source file

fs.ensureDirSync(buildPath); //checks if directory exists and if it does not, will create the directory

// this will generate the files, and they will have a ':' prefixed to it, these are the keys from the compiled contract.
for (let contract in output){ //iterate over the keys of an object, in this case each key of the 'output' object is assigned to the 'contract' variable
    fs.outputJSONSync( //write out a json file to some path, for each of the key
        path.resolve(buildPath, contract + '.json'), //use the key name as the file name
        output[contract] //contents we want to write to the json file.
    )
}