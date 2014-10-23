var color = require('colors');
var mode = null;

/* mode = INFO, DEBUG */
exports.setMode = function(_mode){
    mode = _mode;
};

exports.setDebugMode = function(){ mode = "DEBUG" ;};
exports.setInfoMode = function(){ mode = "INFO"; };
function getMode(){ return mode; }

exports.debug = function(message){
    if(getMode() == "DEBUG")
        console.log("DEBUG : ".green + message.red);
};

exports.info = function(message){
    console.log("INFO : ".green + message.blue);
};