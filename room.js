var resolver = require('./resolver');
var jade = require('jade');
var fs = require('fs');
var pasteStoreDir = "./pastes/";
var debug = require('./debug.js');
debug.setDebugMode();
resolver.register('debug', debug);
var app = false;
var http = false;
var io = false;

var room = 0; //Temporary variable used to store the room needed from url to socket.io

var editor = new Object();

exports.index = function(req, res)
{
    room = req.params.room;
    var html = jade.renderFile('views/paste.jade');
    res.send(html)
};

exports.init = function() {
    app = resolver.resolve("app");
    http = resolver.resolve("http");
    io = resolver.resolve("io");

    io.on('connection', function(socket){

        /* On new connection */
        onConnection(socket);

        /* The paste content is modified by one user */
        socket.on('modifiedContent', onModifiedContent(socket));
    });
};

function onConnection(socket){
    socket.join(room);
    socket.room = room;

    if(editor[socket.room] == undefined) {
        editor[socket.room] = new Object();
        if(fs.existsSync(pasteStoreDir + socket.room))
            editor[socket.room]['text'] = fs.readFileSync(pasteStoreDir + socket.room, {encoding:'utf8'});
        else
            editor[socket.room]['text'] = '';
        editor[socket.room]['saved'] = true;
        editor[socket.room]['countdown'] = null;
    }

    socket.emit('newContent', editor[socket.room].text);

    debug.debug('User connected on room ' + socket.room);
}

function onModifiedContent(socket){
    return function(data) {
        editor[socket.room].text = data;
        socket.broadcast.to(socket.room).emit('newContent', data);

        if(editor[socket.room].saved)
        {
            debug.debug('Save tasked');
            editor[socket.room].saved = false;
            setTimeout(savePaste, 15000, socket, data);
        }
    }
}

function savePaste(socket, content){
    fs.writeFile(pasteStoreDir + socket.room, content);
    editor[socket.room].saved = true;
    debug.debug('Saved');
}